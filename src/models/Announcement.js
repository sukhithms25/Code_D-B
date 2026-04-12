const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Announcement title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  body: {
    type: String,
    required: [true, 'Announcement body is required'],
    maxlength: [5000, 'Body cannot exceed 5000 characters']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  targetBranch: {
    type: String,
    default: null  // null = all branches
  },
  targetYear: {
    type: Number,
    default: null  // null = all years
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Track which students have acknowledged/read this announcement
  acknowledgements: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    response:  { type: String, maxlength: 500, default: '' },
    readAt:    { type: Date, default: Date.now }
  }],
  isArchived: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for fast queries by branch/year targeting
announcementSchema.index({ targetBranch: 1, targetYear: 1, isArchived: 1, createdAt: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);
