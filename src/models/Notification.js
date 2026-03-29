const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User ID is required for a notification'] 
  },
  title: { 
    type: String, 
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [100, 'Notification title cannot exceed 100 characters']
  },
  message: { 
    type: String, 
    required: [true, 'Notification message is required'],
    trim: true,
    maxlength: [500, 'Notification message cannot exceed 500 characters']
  },
  type: { 
    type: String, 
    enum: {
      values: ['alert', 'reminder', 'system', 'message'],
      message: 'Invalid notification type'
    }, 
    default: 'system' 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

// Indexes
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
