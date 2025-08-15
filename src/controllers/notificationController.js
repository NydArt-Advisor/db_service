const Notification = require('../models/Notification');
const User = require('../models/User');

// Get user notifications
exports.getUserNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20, status, category, type } = req.query;
        
        const query = { userId };
        
        if (status) query.status = status;
        if (category) query.category = category;
        if (type) query.type = type;
        
        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
            
        const total = await Notification.countDocuments(query);
        
        res.json({
            notifications,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Error getting user notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.id;
        
        const notification = await Notification.findOne({ _id: notificationId, userId });
        
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        
        await notification.markAsRead();
        
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Error updating notification' });
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        
        await Notification.updateMany(
            { userId, status: { $ne: 'read' } },
            { status: 'read', readAt: new Date() }
        );
        
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ message: 'Error updating notifications' });
    }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.id;
        
        const notification = await Notification.findOneAndDelete({ _id: notificationId, userId });
        
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ message: 'Error deleting notification' });
    }
};

// Get notification count
exports.getNotificationCount = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const unreadCount = await Notification.countDocuments({ 
            userId, 
            status: { $ne: 'read' } 
        });
        
        const totalCount = await Notification.countDocuments({ userId });
        
        res.json({
            unread: unreadCount,
            total: totalCount
        });
    } catch (error) {
        console.error('Error getting notification count:', error);
        res.status(500).json({ message: 'Error fetching notification count' });
    }
};

// Update notification preferences
exports.updateNotificationPreferences = async (req, res) => {
    try {
        const userId = req.user.id;
        const { notificationPreferences } = req.body;
        
        const user = await User.findByIdAndUpdate(
            userId,
            { notificationPreferences },
            { new: true }
        );
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({
            message: 'Notification preferences updated',
            notificationPreferences: user.notificationPreferences
        });
    } catch (error) {
        console.error('Error updating notification preferences:', error);
        res.status(500).json({ message: 'Error updating notification preferences' });
    }
};

// Get notification preferences
exports.getNotificationPreferences = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await User.findById(userId).select('notificationPreferences');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({
            notificationPreferences: user.notificationPreferences
        });
    } catch (error) {
        console.error('Error getting notification preferences:', error);
        res.status(500).json({ message: 'Error fetching notification preferences' });
    }
}; 