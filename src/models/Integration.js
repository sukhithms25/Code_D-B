const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Student ID is required for integrations'], 
    unique: true 
  },
  githubToken: { 
    type: String,
    trim: true
  },
  githubSyncedAt: { 
    type: Date 
  },
  leetcodeUsername: { 
    type: String,
    trim: true,
    maxlength: [50, 'LeetCode username cannot exceed 50 characters']
  },
  lastSyncedAt: { 
    type: Date 
  }
}, { timestamps: true });

// Indexes
integrationSchema.index({ leetcodeUsername: 1 });

module.exports = mongoose.model('Integration', integrationSchema);
