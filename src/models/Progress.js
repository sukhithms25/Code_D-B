const mongoose = require('mongoose');

/**
 * Progress Collection
 * Tracks individual task completion events.
 */
const progressSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Student ID is required'] 
  },
  roadmapId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Roadmap', 
    required: [true, 'Roadmap ID is required'] 
  },
  taskId: { 
    type: String, // String ID of the task from Roadmap.tasks
    required: [true, 'Task ID is required'] 
  },
  completedAt: { 
    type: Date, 
    default: Date.now 
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, { timestamps: true });

// Index for fast lookup of a student's progress on a specific roadmap
progressSchema.index({ studentId: 1, roadmapId: 1, taskId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
