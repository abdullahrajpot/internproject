const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage,
} = require('../controllers/communicationController');

router.route('/')
  .post(protect, authorize('admin'), sendMessage)
  .get(protect, getMessages);

router.route('/:id/read').put(protect, markAsRead);
router.route('/:id').delete(protect, deleteMessage);

module.exports = router;