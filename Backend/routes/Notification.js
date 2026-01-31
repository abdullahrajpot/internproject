const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

// Send notification
router.post('/send', protect, notificationController.sendNotification);

// Send message (simplified for admin)
router.post('/message', protect, notificationController.sendMessage);

// Get notifications for current user
router.get('/', protect, notificationController.getNotifications);

// Get unread count
router.get('/unread-count', protect, notificationController.getUnreadCount);

// Mark notification as read
router.patch('/:notificationId/read', protect, notificationController.markAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', protect, notificationController.markAllAsRead);

// Delete notification
router.delete('/:notificationId', protect, notificationController.deleteNotification);

module.exports = router;