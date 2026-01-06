import Message from '../models/Message.js';
import User from '../models/User.js';

// Get all conversations for the current user
export const getConversations = async (req, res) => {
    try {
        const userId = req.user.userId;

        const conversations = await Message.find({
            participants: userId
        })
            .populate('participants', 'firstName lastName businessName profileImage')
            .sort({ lastMessageTimestamp: -1 });

        // Format for frontend
        const formattedConversations = conversations.map(conv => {
            // Identify the "other" participant
            const otherParticipant = conv.participants.find(p => p._id.toString() !== userId);

            // Safety check if other participant is deleted
            if (!otherParticipant) {
                return null;
            }

            // Determine the type for the frontend (vendor/buyer based on role if available, or just use logic)
            // Since our User model might not have 'role' populated in this specific sub-select effectively without more logic, 
            // we'll rely on what we have. If businessName exists, likely a vendor.
            const type = otherParticipant.businessName ? 'vendor' : 'buyer';
            const name = otherParticipant.businessName || `${otherParticipant.firstName} ${otherParticipant.lastName}`;

            return {
                id: conv._id,
                otherUserId: otherParticipant._id,
                name: name,
                type: type, // logic to determine type
                lastMessage: conv.lastMessage,
                timestamp: conv.lastMessageTimestamp,
                unread: conv.unreadCounts ? conv.unreadCounts.get(userId.toString()) || 0 : 0,
                avatar: otherParticipant.profileImage || '/api/placeholder/40/40',
                online: false // basic implementation doesn't track online status yet
            };
        }).filter(c => c !== null);

        res.json({ success: true, data: formattedConversations });
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get messages for a specific conversation
export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.userId;

        const conversation = await Message.findOne({
            _id: conversationId,
            participants: userId
        });

        if (!conversation) {
            return res.status(404).json({ success: false, message: 'Conversation not found' });
        }

        // Mark messages as read for this user
        // We reset the unread count for this user in the map
        if (conversation.unreadCounts) {
            conversation.unreadCounts.set(userId.toString(), 0);
            await conversation.save();
        }

        const messages = conversation.messages.map(msg => ({
            id: msg._id,
            senderId: msg.sender,
            message: msg.content,
            timestamp: msg.timestamp,
            isOwn: msg.sender.toString() === userId.toString()
        }));

        res.json({ success: true, data: messages });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Send a new message
export const sendMessage = async (req, res) => {
    try {
        const { recipientId, content } = req.body;
        const senderId = req.user.userId;

        if (!recipientId || !content) {
            return res.status(400).json({ success: false, message: 'Recipient and content are required' });
        }

        // Check if conversation exists
        let conversation = await Message.findOne({
            participants: { $all: [senderId, recipientId] }
        });

        if (!conversation) {
            // Create new conversation
            conversation = new Message({
                participants: [senderId, recipientId],
                messages: [],
                unreadCounts: {}
            });
        }

        // Add message
        const newMessage = {
            sender: senderId,
            content: content,
            timestamp: new Date(),
            read: false
        };

        conversation.messages.push(newMessage);
        conversation.lastMessage = content;
        conversation.lastMessageTimestamp = new Date();

        // Update unread count for recipient
        const currentUnread = conversation.unreadCounts.get(recipientId.toString()) || 0;
        conversation.unreadCounts.set(recipientId.toString(), currentUnread + 1);

        await conversation.save();

        const messageData = {
            id: conversation.messages[conversation.messages.length - 1]._id,
            conversationId: conversation._id,
            senderId: senderId,
            message: content,
            timestamp: newMessage.timestamp,
            isOwn: false // For the recipient
        };

        // Emit socket event to recipient
        if (req.io) {
            req.io.to(recipientId).emit('new_message', messageData);

            // Also emit 'conversation_updated' to update the conversation list sidebar
            req.io.to(recipientId).emit('conversation_updated', {
                id: conversation._id,
                lastMessage: content,
                timestamp: newMessage.timestamp,
                unread: currentUnread + 1,
                otherUserId: senderId
            });
        }

        res.json({
            success: true,
            data: {
                ...messageData,
                isOwn: true // For the sender response
            }
        });

    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
