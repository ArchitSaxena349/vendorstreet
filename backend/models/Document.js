import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['fssai', 'business', 'gst', 'address', 'identity', 'bank']
    },
    name: {
        type: String,
        required: true
    },
    documentNumber: {
        type: String,
        default: ''
    },
    filePath: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['under_review', 'verified', 'rejected', 'scheduled'],
        default: 'under_review'
    },
    expiryDate: {
        type: Date,
        default: null
    },
    scheduledDate: {
        type: Date,
        default: null
    },
    rejectionReason: {
        type: String,
        default: ''
    },
    verifiedAt: {
        type: Date,
        default: null
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
});

// Index for efficient queries
documentSchema.index({ userId: 1, type: 1 });
documentSchema.index({ status: 1 });

const Document = mongoose.model('Document', documentSchema);

export default Document;