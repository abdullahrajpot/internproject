const Communication = require('../models/Communication');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/communications/send
// @access  Private (Admin or Intern)
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, subject, content, type } = req.body;
        const senderId = req.user._id;

        console.log('Sending message:', { receiverId, subject, contentType: typeof content, type });
        console.log('Files received:', req.files?.length || 0);

        // Fix: If content is empty but files are present, use a placeholder or handle it
        const finalContent = content || (req.files?.length > 0 ? "Sent an attachment" : "");

        if (!finalContent && !req.files?.length) {
            return res.status(400).json({ success: false, message: 'Message content or attachment is required' });
        }

        // Validate receiver exists - handle stringified "null" or "undefined"
        let finalReceiverId = receiverId;
        if (receiverId === 'null' || receiverId === 'undefined' || !receiverId) {
            finalReceiverId = null;
        }

        if (finalReceiverId) {
            const receiver = await User.findById(finalReceiverId);
            if (!receiver) {
                return res.status(404).json({ success: false, message: 'Receiver not found' });
            }
        }

        // Determine receiver role
        let receiverRole = 'all';
        if (finalReceiverId) {
            const receiver = await User.findById(finalReceiverId);
            receiverRole = receiver.role;
        }

        // Handle attachments if any
        const attachments = req.files ? req.files.map(file => ({
            url: `/uploads/${file.filename}`,
            name: file.originalname,
            fileType: file.mimetype,
            size: file.size
        })) : [];

        const messageData = {
            sender: senderId,
            receiver: finalReceiverId,
            receiverRole: type === 'announcement' ? 'all' : receiverRole,
            subject: subject || (type === 'announcement' ? 'Announcement' : 'Direct Message'),
            content: finalContent,
            type: type || 'message',
            attachments
        };

        console.log('Creating message with data:', JSON.stringify(messageData, null, 2));

        const message = await Communication.create(messageData);

        await message.populate('sender', 'name email role');
        if (finalReceiverId) {
            await message.populate('receiver', 'name email role');
        }

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: message
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, message: 'Failed to send message: ' + error.message });
    }
};

// @desc    Get all messages for current user
// @route   GET /api/communications/messages
// @access  Private
exports.getMessages = async (req, res) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role;

        // Get messages where user is sender or receiver
        // Also include announcements (receiverRole: 'all' or matching user's role)
        const messages = await Communication.find({
            $or: [
                { sender: userId },
                { receiver: userId },
                { receiverRole: 'all' },
                { receiverRole: userRole }
            ],
            type: { $ne: 'announcement' } // Exclude announcements from regular messages
        })
            .populate('sender', 'name email role')
            .populate('receiver', 'name email role')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get conversation between two users
// @route   GET /api/communications/conversation/:userId
// @access  Private
exports.getConversation = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const otherUserId = req.params.userId;

        const messages = await Communication.find({
            type: 'message',
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId }
            ]
        })
            .populate('sender', 'name email role')
            .populate('receiver', 'name email role')
            .sort({ createdAt: 1 }); // Oldest first for chat view

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all announcements
// @route   GET /api/communications/announcements
// @access  Private
exports.getAnnouncements = async (req, res) => {
    try {
        const userRole = req.user.role;

        const announcements = await Communication.find({
            type: 'announcement',
            $or: [
                { receiverRole: 'all' },
                { receiverRole: userRole }
            ]
        })
            .populate('sender', 'name email role')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: announcements.length,
            data: announcements
        });
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create announcement
// @route   POST /api/communications/announcements
// @access  Admin only
exports.createAnnouncement = async (req, res) => {
    try {
        const { subject, content, targetRole } = req.body;
        const senderId = req.user._id;

        // Handle attachments if any
        const attachments = req.files ? req.files.map(file => ({
            url: `/uploads/${file.filename}`,
            name: file.originalname,
            fileType: file.mimetype,
            size: file.size
        })) : [];

        const announcement = await Communication.create({
            sender: senderId,
            receiver: null,
            receiverRole: targetRole || 'all',
            subject,
            content,
            type: 'announcement',
            attachments
        });

        await announcement.populate('sender', 'name email role');

        res.status(201).json({
            success: true,
            message: 'Announcement created successfully',
            data: announcement
        });
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Mark message as read
// @route   PUT /api/communications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
    try {
        const messageId = req.params.id;
        const userId = req.user._id;

        const message = await Communication.findById(messageId);

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        // Add user to readBy array if not already there
        if (!message.readBy.includes(userId)) {
            message.readBy.push(userId);
        }

        // If user is the receiver, mark as read
        if (message.receiver && message.receiver.toString() === userId.toString()) {
            message.isRead = true;
        }

        await message.save();

        res.status(200).json({
            success: true,
            message: 'Message marked as read',
            data: message
        });
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get unread message count
// @route   GET /api/communications/unread-count
// @access  Private
exports.getUnreadCount = async (req, res) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role;

        const unreadCount = await Communication.countDocuments({
            $or: [
                { receiver: userId, isRead: false },
                { receiverRole: 'all', readBy: { $ne: userId } },
                { receiverRole: userRole, readBy: { $ne: userId } }
            ]
        });

        res.status(200).json({
            success: true,
            data: { unreadCount }
        });
    } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all conversations (unique users)
// @route   GET /api/communications/conversations
// @access  Private
exports.getConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get all messages where user is involved
        const messages = await Communication.find({
            type: 'message',
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        })
            .populate('sender', 'name email role')
            .populate('receiver', 'name email role')
            .sort({ createdAt: -1 });

        // Group by conversation partner
        const conversationsMap = new Map();

        messages.forEach(msg => {
            const partnerId = msg.sender._id.toString() === userId.toString()
                ? msg.receiver?._id.toString()
                : msg.sender._id.toString();

            if (!partnerId) return;

            if (!conversationsMap.has(partnerId)) {
                const partner = msg.sender._id.toString() === userId.toString()
                    ? msg.receiver
                    : msg.sender;

                conversationsMap.set(partnerId, {
                    user: partner,
                    lastMessage: msg,
                    unreadCount: 0
                });
            }

            // Count unread messages from this partner
            if (msg.receiver && msg.receiver._id.toString() === userId.toString() && !msg.isRead) {
                conversationsMap.get(partnerId).unreadCount++;
            }
        });

        const conversations = Array.from(conversationsMap.values());

        res.status(200).json({
            success: true,
            count: conversations.length,
            data: conversations
        });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete message
// @route   DELETE /api/communications/:id
// @access  Private (sender only or admin)
exports.deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.id;
        const userId = req.user._id;
        const userRole = req.user.role;

        const message = await Communication.findById(messageId);

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        // Only sender or admin can delete
        if (message.sender.toString() !== userId.toString() && userRole !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this message' });
        }

        await message.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
