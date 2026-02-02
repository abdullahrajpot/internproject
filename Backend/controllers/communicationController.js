const Communication = require('../models/Communication');
const User = require('../models/User');

// @desc    Send a new message or announcement
// @route   POST /api/communications
// @access  Admin
exports.sendMessage = async (req, res) => {
  const { receiverId, receiverRole, subject, content } = req.body;

  try {
    // Admin sending a message
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to send messages.' });
    }

    let receiver = null;
    if (receiverId) {
      receiver = await User.findById(receiverId);
      if (!receiver) {
        return res.status(404).json({ success: false, message: 'Receiver not found.' });
      }
    }

    const newCommunication = await Communication.create({
      sender: req.user.id,
      receiver: receiverId || null, // Can be null for announcements
      receiverRole: receiverRole, // 'admin', 'intern', 'user', 'all'
      subject,
      content,
    });

    res.status(201).json({ success: true, data: newCommunication });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get messages for the authenticated user (inbox/sent)
// @route   GET /api/communications
// @access  Private
exports.getMessages = async (req, res) => {
  const { type } = req.query; // 'inbox' or 'sent'

  try {
    let messages;
    if (req.user.role === 'admin') {
      if (type === 'sent') {
        messages = await Communication.find({ sender: req.user.id })
          .populate('sender', 'name email')
          .populate('receiver', 'name email')
          .sort({ sentAt: -1 });
      } else { // Admin inbox also includes announcements to 'all' or their specific role
        messages = await Communication.find({
          $or: [
            { receiver: req.user.id },
            { receiverRole: 'all' },
            { receiverRole: 'admin' }
          ]
        })
          .populate('sender', 'name email')
          .populate('receiver', 'name email')
          .sort({ sentAt: -1 });
      }
    } else { // Intern or regular user
      if (type === 'sent') {
        messages = await Communication.find({ sender: req.user.id })
          .populate('sender', 'name email')
          .populate('receiver', 'name email')
          .sort({ sentAt: -1 });
      } else { // User inbox includes direct messages and announcements to their role or 'all'
        messages = await Communication.find({
          $or: [
            { receiver: req.user.id },
            { receiverRole: 'all' },
            { receiverRole: req.user.role }
          ]
        })
          .populate('sender', 'name email')
          .populate('receiver', 'name email')
          .sort({ sentAt: -1 });
      }
    }

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark a message as read
// @route   PUT /api/communications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const message = await Communication.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    // Only the receiver or an admin can mark a message as read
    const isReceiver = message.receiver && message.receiver.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    const isForUserRole = message.receiverRole === 'all' || message.receiverRole === req.user.role;

    if (!(isReceiver || isAdmin || isForUserRole)) {
      return res.status(403).json({ success: false, message: 'Not authorized to mark this message as read.' });
    }

    if (!message.readBy.includes(req.user.id)) {
        message.readBy.push(req.user.id);
    }
    message.isRead = true; // For backward compatibility and single receiver

    await message.save();

    res.status(200).json({ success: true, data: message });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a message
// @route   DELETE /api/communications/:id
// @access  Private
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Communication.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    // Only sender or admin can delete a message
    const isSender = message.sender.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!(isSender || isAdmin)) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this message.' });
    }

    await message.deleteOne();

    res.status(200).json({ success: true, message: 'Message deleted successfully.' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};