const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Can be null for announcements to all
  },
  receiverRole: {
    type: String,
    enum: ['admin', 'intern', 'user', 'all'],
    required: true, // Define who the message is intended for (specific role or all)
  },
  type: {
    type: String,
    enum: ['message', 'announcement'],
    default: 'message'
  },
  subject: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  attachments: [{
    url: String,
    name: String,
    fileType: String,
    size: Number
  }],
  isRead: {
    type: Boolean,
    default: false,
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  isArchived: {
    type: Boolean,
    default: false,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Communication', communicationSchema);