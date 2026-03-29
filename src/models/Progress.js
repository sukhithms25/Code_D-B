const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Student ID is required to track progress'] 
  },
  roadmapId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Roadmap', 
    required: [true, 'Roadmap ID is required to track progress'] 
  },
  completedTasks: [{ 
    type: String,
    trim: true,
    maxlength: [150, 'Task ID/Title cannot exceed 150 characters']
  }],
  completionPercentage: { 
    type: Number, 
    min: [0, 'Completion percentage cannot be less than 0'], 
    max: [100, 'Completion percentage cannot exceed 100'], 
    default: 0 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// Indexes
progressSchema.index({ studentId: 1, roadmapId: 1 }, { unique: true });
progressSchema.index({ completionPercentage: -1 });

module.exports = mongoose.model('Progress', progressSchema);
