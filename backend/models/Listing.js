import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VendorProfile',
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Listing title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    unit: {
        type: String,
        required: [true, 'Unit is required'],
        enum: ['kg', 'gram', 'ton', 'quintal', 'liter', 'piece', 'dozen', 'box']
    },
    minimumOrderQuantity: {
        type: Number,
        default: 1,
        min: [1, 'Minimum order quantity must be at least 1']
    },
    stockQuantity: {
        type: Number,
        default: 0,
        min: [0, 'Stock quantity cannot be negative']
    },
    isInStock: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'approved', 'rejected', 'inactive'],
        default: 'pending'
    },
    adminNotes: String,
    rejectionReason: String,
    featured: {
        type: Boolean,
        default: false
    },
    images: [{
        url: String,
        alt: String,
        isPrimary: { type: Boolean, default: false }
    }],
    specifications: {
        type: Map,
        of: String
    },
    tags: [String],
    approvedAt: Date,
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    views: {
        type: Number,
        default: 0
    },
    inquiries: {
        type: Number,
        default: 0
    },
    lastStockUpdate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Text index for search
listingSchema.index({ 
    title: 'text', 
    description: 'text', 
    tags: 'text' 
});

listingSchema.index({ vendorId: 1, status: 1 });
listingSchema.index({ categoryId: 1, status: 1, isInStock: 1 });
listingSchema.index({ price: 1 });
listingSchema.index({ createdAt: -1 });

export default mongoose.model('Listing', listingSchema);