import Notification from '../models/Notification.js';

// Get user notifications
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.userId;

        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 });

        const formattedNotifications = notifications.map(notif => ({
            id: notif._id,
            type: notif.type,
            title: notif.title,
            message: notif.message,
            timestamp: notif.createdAt, // Just send date, frontend formats it
            date: notif.createdAt,
            read: notif.read,
            link: notif.link,
            priority: notif.priority
            // Icons and colors handled on frontend based on type/priority
        }));

        res.json({ success: true, data: formattedNotifications });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Mark notification as read
export const markRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, recipient: userId }, // Ensure ownership
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.json({ success: true, data: notification });
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Mark ALL as read
export const markAllRead = async (req, res) => {
    try {
        const userId = req.user.userId;

        await Notification.updateMany(
            { recipient: userId, read: false },
            { read: true }
        );

        res.json({ success: true, message: 'All marked as read' });
    } catch (error) {
        console.error('Mark all read error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete notification
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const notification = await Notification.findOneAndDelete({ _id: id, recipient: userId });

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Clear all notifications
export const clearAll = async (req, res) => {
    try {
        const userId = req.user.userId;

        await Notification.deleteMany({ recipient: userId });

        res.json({ success: true, message: 'All notifications cleared' });
    } catch (error) {
        console.error('Clear all error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
