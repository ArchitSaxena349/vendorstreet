import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    lastMessage: {
        type: String,
        default: ''
    },
    lastMessageTimestamp: {
        type: Date,
        default: Date.now
    },
    unreadCounts: {
        type: Map,
        of: Number,
        default: {}
    },
    messages: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        read: {
            type: Boolean,
            default: false
        }
    }]
}, {
    timestamps: true
});

export default mongoose.model('Message', messageSchema);
