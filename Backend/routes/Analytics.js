const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getDashboardAnalytics, getTaskTrends, getNotifications } = require('../controllers/analyticsController');

router.route('/dashboard').get(protect, authorize('admin'), getDashboardAnalytics);
router.route('/task-trends').get(protect, authorize('admin'), getTaskTrends);
router.route('/notifications').get(protect, authorize('admin'), getNotifications);

module.exports = router;