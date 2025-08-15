const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Get user notifications
router.get('/', auth, notificationController.getUserNotifications);

// Get notification count
router.get('/count', auth, notificationController.getNotificationCount);

// Get notification preferences
router.get('/preferences', auth, notificationController.getNotificationPreferences);

// Update notification preferences
router.put('/preferences', auth, notificationController.updateNotificationPreferences);

// Mark notification as read
router.patch('/:notificationId/read', auth, notificationController.markAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', auth, notificationController.markAllAsRead);

// Delete notification
router.delete('/:notificationId', auth, notificationController.deleteNotification);

module.exports = router; 