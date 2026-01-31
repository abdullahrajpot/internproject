const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['General', 'Templates', 'Learning Guides', 'Roadmaps', 'Technical Docs', 'Company Documents'],
  },
  link: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
    enum: ['pdf', 'doc', 'ppt', 'xls', 'zip', 'img', 'other'], // Example file types
  },
  // You can add more fields like uploadedBy, uploadDate, tags, etc.
}, { timestamps: true });

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;