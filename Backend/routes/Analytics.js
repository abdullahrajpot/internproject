const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getDashboardAnalytics,
    getTaskTrends,
    getNotifications,
    getInterneeAnalytics,
    getCourseAnalytics,
    getPerformanceTrends,
    getTaskDistribution
} = require('../controllers/analyticsController');

router.route('/dashboard').get(protect, authorize('admin'), getDashboardAnalytics);
router.route('/task-trends').get(protect, authorize('admin'), getTaskTrends);
router.route('/notifications').get(protect, authorize('admin'), getNotifications);
router.route('/internees').get(protect, authorize('admin'), getInterneeAnalytics);
router.route('/courses').get(protect, authorize('admin'), getCourseAnalytics);
router.route('/performance-trends').get(protect, authorize('admin'), getPerformanceTrends);
router.route('/task-distribution').get(protect, authorize('admin'), getTaskDistribution);

module.exports = router;