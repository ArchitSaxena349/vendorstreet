import mongoose from 'mongoose';

const vendorProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    businessType: {
        type: String,
        enum: ['Trader', 'Manufacturer', 'Supplier', 'Distributor', 'Wholesaler']
    },
    gstNumber: {
        type: String,
        sparse: true,
        validate: {
            validator: function(v) {
                return !v || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
            },
            message: 'Please provide a valid GST number'
        }
    },
    fssaiLicense: {
        type: String,
        required: [true, 'FSSAI license is required'],
        validate: {
            validator: function(v) {
                return /^[0-9]{14}$/.test(v);
            },
            message: 'FSSAI license must be 14 digits'
        }
    },
    fssaiDocumentUrl: {
        type: String
    },
    businessAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { 
            type: String, 
            required: true,
            validate: {
                validator: function(v) {
                    return /^[0-9]{6}$/.test(v);
                },
                message: 'Pincode must be 6 digits'
            }
        },
        landmark: String
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'under_review', 'verified', 'rejected'],
        default: 'pending'
    },
    physicalVerificationStatus: {
        type: String,
        enum: ['pending', 'scheduled', 'verified', 'rejected'],
        default: 'pending'
    },
    verificationNotes: String,
    verifiedAt: Date,
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    premiumExpiresAt: Date,
    businessHours: {
        monday: { open: String, close: String, closed: { type: Boolean, default: false } },
        tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
        wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
        thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
        friday: { open: String, close: String, closed: { type: Boolean, default: false } },
        saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
        sunday: { open: String, close: String, closed: { type: Boolean, default: true } }
    },
    rating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    totalSales: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

vendorProfileSchema.index({ location: '2dsphere' });
vendorProfileSchema.index({ 'businessAddress.city': 1 });
vendorProfileSchema.index({ verificationStatus: 1 });

export default mongoose.model('VendorProfile', vendorProfileSchema);