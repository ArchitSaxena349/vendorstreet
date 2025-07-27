import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VendorProfile',
        required: true
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1']
    },
    message: {
        type: String,
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'responded', 'accepted', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    responseMessage: String,
    quotedPrice: {
        type: Number,
        min: [0, 'Quoted price cannot be negative']
    },
    deliveryDetails: {
        address: String,
        expectedDate: Date,
        charges: Number
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    respondedAt: Date,
    completedAt: Date
}, {
    timestamps: true
});

inquirySchema.index({ buyerId: 1, createdAt: -1 });
inquirySchema.index({ vendorId: 1, status: 1, createdAt: -1 });
inquirySchema.index({ listingId: 1 });

export default mongoose.model('Inquiry', inquirySchema);