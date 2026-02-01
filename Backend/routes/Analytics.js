const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

// Get dashboard analytics
router.get('/dashboard', protect, analyticsController.getDashboardAnalytics);

// Get task trends
router.get('/task-trends', protect, analyticsController.getTaskTrends);

// Get user growth
router.get('/user-growth', protect, analyticsController.getUserGrowth);

// Get notifications
router.get('/notifications', protect, analyticsController.getSystemNotifications);

module.exports = router;