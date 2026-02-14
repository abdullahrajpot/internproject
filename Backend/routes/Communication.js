const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    sendMessage,
    getMessages,
    getConversation,
    getAnnouncements,
    createAnnouncement,
    markAsRead,
    getUnreadCount,
    getConversations,
    deleteMessage
} = require('../controllers/communicationController');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Debug middleware
router.use((req, res, next) => {
    if (req.path === '/send' && req.method === 'POST') {
        console.log('--- Incoming Communication Request ---');
        console.log('Headers:', req.headers['content-type']);
    }
    next();
});

// Message routes
router.route('/send').post(protect, upload.array('files', 5), sendMessage);
router.route('/messages').get(protect, getMessages);
router.route('/conversation/:userId').get(protect, getConversation);
router.route('/conversations').get(protect, getConversations);
router.route('/unread-count').get(protect, getUnreadCount);
router.route('/:id/read').put(protect, markAsRead);
router.route('/:id').delete(protect, deleteMessage);

// Announcement routes
router.route('/announcements').get(protect, getAnnouncements);
router.route('/announcements').post(protect, authorize('admin'), upload.array('files', 5), createAnnouncement);

module.exports = router;
