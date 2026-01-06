import Order from '../models/Order.js';
import Listing from '../models/Listing.js';
import User from '../models/User.js';
import VendorProfile from '../models/VendorProfile.js';
import Notification from '../models/Notification.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Buyer)
export const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No items in order' });
        }

        // 1. Fetch all listings to validate prices and stock
        // items = [{ listingId, quantity }]
        const listingIds = items.map(item => item.listingId);
        const listings = await Listing.find({ _id: { $in: listingIds } }).populate('vendorId');

        if (listings.length !== items.length) {
            return res.status(404).json({ success: false, message: 'One or more products not found' });
        }

        // 2. Group items by Vendor to create split orders
        const ordersByVendor = {};

        for (const item of items) {
            const product = listings.find(l => l._id.toString() === item.listingId);

            if (!product) continue;

            // Check stock
            if (product.stockQuantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.title}`
                });
            }

            const vendorId = product.vendorId._id.toString();

            if (!ordersByVendor[vendorId]) {
                ordersByVendor[vendorId] = {
                    vendor: product.vendorId, // Store full vendor object for reference if needed
                    products: [],
                    totalAmount: 0
                };
            }

            ordersByVendor[vendorId].products.push({
                listing: product._id,
                vendor: product.vendorId._id,
                quantity: item.quantity,
                priceAtPurchase: product.price
            });

            ordersByVendor[vendorId].totalAmount += product.price * item.quantity;
        }

        // 3. Create Order documents
        const createdOrders = [];

        for (const vendorId in ordersByVendor) {
            const vendorOrder = ordersByVendor[vendorId];

            const order = await Order.create({
                buyer: req.user.userId,
                products: vendorOrder.products,
                totalAmount: vendorOrder.totalAmount,
                finalAmount: vendorOrder.totalAmount, // Add tax/shipping logic here if needed
                shippingAddress,
                paymentMethod,
                status: 'pending'
            });

            createdOrders.push(order);

            // Update Stock
            for (const prod of vendorOrder.products) {
                await Listing.findByIdAndUpdate(prod.listing, {
                    $inc: { stockQuantity: -prod.quantity }
                });
            }
        }

        res.status(201).json({
            success: true,
            data: createdOrders,
            message: `Successfully placed ${createdOrders.length} order(s)`
        });

    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ success: false, message: 'Server error while creating order' });
    }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user.userId })
            .populate('products.listing', 'title imageUrl unit')
            .populate('products.vendor', 'companyName') // Populate vendor details from the vendor profile
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Get My Orders Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get orders for a vendor
// @route   GET /api/orders/vendor-orders
// @access  Private (Vendor)
export const getVendorOrders = async (req, res) => {
    try {
        // specific to the logged-in vendor
        // Identify vendor profile first
        const vendorProfile = await VendorProfile.findOne({ userId: req.user.userId });

        if (!vendorProfile) {
            return res.status(404).json({ success: false, message: 'Vendor profile not found' });
        }

        // Find orders where *any* product belongs to this vendor
        // (Due to split logic, essentially find orders where products[0].vendor == vendorID)
        const orders = await Order.find({ 'products.vendor': vendorProfile._id })
            .populate('buyer', 'firstName lastName email phone')
            .populate('products.listing', 'title imageUrl')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Get Vendor Orders Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Vendor/Admin)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Verify ownership
        // Allow if Admin OR if the Order belongs to this vendor
        // Since we split orders, we can check the vendor of the first product
        const vendorProfile = await VendorProfile.findOne({ userId: req.user.userId });

        const isVendor = vendorProfile && order.products[0].vendor.toString() === vendorProfile._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isVendor && !isAdmin) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
        }

        order.status = status;
        await order.save();

        // New Socket.io & Notification Logic
        if (req.io) {
            // Notify Buyer
            req.io.to(order.buyer.toString()).emit('order_update', {
                orderId: order._id,
                status: status,
                message: `Your order #${order._id} status has been updated to ${status}`
            });

            // Notify Vendor? (Already viewing it likely, but good for multi-device sync)
            // If admin updated it, vendor should know.
            if (isAdmin && vendorProfile) {
                // Might need to look up vendor user ID if not in hand, 
                // but `vendorProfile` variable might be null if admin is acting.
                // order.products[0].vendor is the profile ID. need to find user ID.
                // Skipping distinct vendor notification for now to keep it simple, 
                // or we can emit to the vendor profile ID if we joined room with that ID (we joined with userID).
            }
        }

        // Create Notification in DB
        try {
            await Notification.create({
                recipient: order.buyer,
                type: 'order_status',
                title: 'Order Updated',
                message: `Order #${order._id} is now ${status}`,
                relatedId: order._id,
                onModel: 'Order'
            });
        } catch (notifError) {
            console.error('Notification creation failed:', notifError);
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Update Order Status Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
