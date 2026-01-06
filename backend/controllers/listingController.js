import Listing from '../models/Listing.js';
import VendorProfile from '../models/VendorProfile.js';
import Category from '../models/Category.js';

const createListing = async (req, res) => {
    try {
        // Get vendor profile
        const vendorProfile = await VendorProfile.findOne({ userId: req.user.userId });
        if (!vendorProfile) {
            return res.status(404).json({
                success: false,
                message: "Vendor profile not found"
            });
        }

        if (vendorProfile.verificationStatus !== 'verified') {
            return res.status(403).json({
                success: false,
                message: "Vendor must be verified to create listings"
            });
        }

        const listingData = {
            ...req.body,
            vendorId: vendorProfile._id
        };

        const listing = new Listing(listingData);
        await listing.save();

        await listing.populate('categoryId', 'name');

        res.status(201).json({
            success: true,
            message: "Listing created successfully",
            data: { listing }
        });

    } catch (error) {
        console.error('Create listing error:', error);

        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create listing"
        });
    }
};

const getListings = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            search,
            minPrice,
            maxPrice,
            city,
            inStock,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build query
        const query = { status: 'approved' };

        if (category) {
            query.categoryId = category;
        }

        if (search) {
            query.$text = { $search: search };
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (inStock === 'true') {
            query.isInStock = true;
        }

        // City filter (requires vendor profile lookup)
        let vendorFilter = {};
        if (city) {
            vendorFilter['businessAddress.city'] = new RegExp(city, 'i');
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);
        const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        // Get listings with vendor and category info
        const listings = await Listing.find(query)
            .populate('vendorId', 'companyName businessAddress rating isPremium', null, vendorFilter)
            .populate('categoryId', 'name')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        // Filter out listings where vendor doesn't match city filter
        const filteredListings = city ?
            listings.filter(listing => listing.vendorId) :
            listings;

        const total = await Listing.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                listings: filteredListings,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(total / Number(limit)),
                    totalItems: total,
                    itemsPerPage: Number(limit)
                }
            }
        });

    } catch (error) {
        console.error('Get listings error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch listings"
        });
    }
};

const getListingById = async (req, res) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id)
            .populate('vendorId', 'companyName businessAddress rating isPremium businessHours')
            .populate('categoryId', 'name');

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found"
            });
        }

        // Increment view count if listing is approved
        if (listing.status === 'approved') {
            listing.views += 1;
            await listing.save();
        }

        res.status(200).json({
            success: true,
            data: { listing }
        });

    } catch (error) {
        console.error('Get listing by ID error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch listing"
        });
    }
};

const updateListing = async (req, res) => {
    try {
        const { id } = req.params;

        // Get vendor profile
        const vendorProfile = await VendorProfile.findOne({ userId: req.user.userId });
        if (!vendorProfile) {
            return res.status(404).json({
                success: false,
                message: "Vendor profile not found"
            });
        }

        // Find listing and verify ownership
        const listing = await Listing.findOne({
            _id: id,
            vendorId: vendorProfile._id
        });

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found or access denied"
            });
        }

        // Update listing
        const updates = req.body;

        // Reset approval status if content changes
        if (updates.title || updates.description || updates.price) {
            updates.status = 'pending';
            updates.approvedAt = null;
            updates.approvedBy = null;
        }

        Object.assign(listing, updates);
        await listing.save();

        res.status(200).json({
            success: true,
            message: "Listing updated successfully",
            data: { listing }
        });

    } catch (error) {
        console.error('Update listing error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update listing"
        });
    }
};

const deleteListing = async (req, res) => {
    try {
        const { id } = req.params;

        // Get vendor profile
        const vendorProfile = await VendorProfile.findOne({ userId: req.user.userId });
        if (!vendorProfile) {
            return res.status(404).json({
                success: false,
                message: "Vendor profile not found"
            });
        }

        // Find and delete listing
        const listing = await Listing.findOneAndDelete({
            _id: id,
            vendorId: vendorProfile._id
        });

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found or access denied"
            });
        }

        res.status(200).json({
            success: true,
            message: "Listing deleted successfully"
        });

    } catch (error) {
        console.error('Delete listing error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to delete listing"
        });
    }
};

const getVendorListings = async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;

        // Get vendor profile
        const vendorProfile = await VendorProfile.findOne({ userId: req.user.userId });
        if (!vendorProfile) {
            return res.status(404).json({
                success: false,
                message: "Vendor profile not found"
            });
        }

        // Build query
        const query = { vendorId: vendorProfile._id };
        if (status) {
            query.status = status;
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);

        const listings = await Listing.find(query)
            .populate('categoryId', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Listing.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                listings,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(total / Number(limit)),
                    totalItems: total,
                    itemsPerPage: Number(limit)
                }
            }
        });

    } catch (error) {
        console.error('Get vendor listings error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch vendor listings"
        });
    }
};

// Admin: Get pending listings
const getPendingListings = async (req, res) => {
    try {
        const listings = await Listing.find({ status: 'pending' })
            .populate('vendorId', 'companyName businessAddress rating')
            .populate('categoryId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: listings
        });
    } catch (error) {
        console.error('Get pending listings error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch pending listings"
        });
    }
};

// Admin: Verify listing
const verifyListing = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'approved' or 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const listing = await Listing.findByIdAndUpdate(
            id,
            {
                status,
                approvedAt: status === 'approved' ? new Date() : null,
                approvedBy: req.user.userId
            },
            { new: true }
        );

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found"
            });
        }

        res.status(200).json({
            success: true,
            message: `Listing ${status} successfully`,
            data: listing
        });

    } catch (error) {
        console.error('Verify listing error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to verify listing"
        });
    }
};

export {
    createListing,
    getListings,
    getListingById,
    updateListing,
    deleteListing,
    getVendorListings,
    getPendingListings,
    verifyListing
};