import VendorProfile from '../models/VendorProfile.js';
import User from '../models/user.js';
import Listing from '../models/Listing.js';

const applyForVendor = async (req, res) => {
    try {
        const {
            companyName,
            businessType,
            gstNumber,
            fssaiLicense,
            businessAddress
        } = req.body;

        // Check if user already has a vendor profile
        const existingProfile = await VendorProfile.findOne({ userId: req.user.userId });
        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: "Vendor application already exists"
            });
        }

        // Create vendor profile
        const vendorProfile = new VendorProfile({
            userId: req.user.userId,
            companyName,
            businessType,
            gstNumber,
            fssaiLicense,
            businessAddress
        });

        await vendorProfile.save();

        // Update user role to vendor
        await User.findByIdAndUpdate(req.user.userId, { role: 'vendor' });

        res.status(201).json({
            success: true,
            message: "Vendor application submitted successfully",
            data: { vendorProfile }
        });

    } catch (error) {
        console.error('Vendor application error:', error);
        
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
            message: "Failed to submit vendor application"
        });
    }
};

const getVendorProfile = async (req, res) => {
    try {
        const vendorProfile = await VendorProfile.findOne({ userId: req.user.userId })
            .populate('userId', 'firstName lastName email phone profileImage');

        if (!vendorProfile) {
            return res.status(404).json({
                success: false,
                message: "Vendor profile not found"
            });
        }

        res.status(200).json({
            success: true,
            data: { vendorProfile }
        });

    } catch (error) {
        console.error('Get vendor profile error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch vendor profile"
        });
    }
};

const updateVendorProfile = async (req, res) => {
    try {
        const updates = req.body;
        
        // Remove fields that shouldn't be updated directly
        delete updates.verificationStatus;
        delete updates.physicalVerificationStatus;
        delete updates.verifiedAt;
        delete updates.verifiedBy;

        const vendorProfile = await VendorProfile.findOneAndUpdate(
            { userId: req.user.userId },
            updates,
            { new: true, runValidators: true }
        );

        if (!vendorProfile) {
            return res.status(404).json({
                success: false,
                message: "Vendor profile not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Vendor profile updated successfully",
            data: { vendorProfile }
        });

    } catch (error) {
        console.error('Update vendor profile error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update vendor profile"
        });
    }
};

const getVendorDashboard = async (req, res) => {
    try {
        const vendorProfile = await VendorProfile.findOne({ userId: req.user.userId });
        if (!vendorProfile) {
            return res.status(404).json({
                success: false,
                message: "Vendor profile not found"
            });
        }

        // Get vendor statistics
        const totalListings = await Listing.countDocuments({ vendorId: vendorProfile._id });
        const activeListings = await Listing.countDocuments({ 
            vendorId: vendorProfile._id, 
            status: 'approved' 
        });
        const pendingListings = await Listing.countDocuments({ 
            vendorId: vendorProfile._id, 
            status: 'pending' 
        });

        // Get recent listings
        const recentListings = await Listing.find({ vendorId: vendorProfile._id })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('categoryId', 'name');

        const dashboardData = {
            vendorProfile,
            statistics: {
                totalListings,
                activeListings,
                pendingListings,
                totalSales: vendorProfile.totalSales,
                rating: vendorProfile.rating
            },
            recentListings
        };

        res.status(200).json({
            success: true,
            data: dashboardData
        });

    } catch (error) {
        console.error('Get vendor dashboard error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data"
        });
    }
};

export {
    applyForVendor,
    getVendorProfile,
    updateVendorProfile,
    getVendorDashboard
};