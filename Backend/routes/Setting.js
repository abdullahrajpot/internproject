const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getSettings, updateSettings } = require('../controllers/settingController');

router.route('/')
  .get(protect, authorize('admin'), getSettings)
  .put(protect, authorize('admin'), updateSettings);

module.exports = router;