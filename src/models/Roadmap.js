const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Student ID is required for a roadmap'] 
  },
  weekNumber: { 
    type: Number, 
    required: [true, 'Week number is required'],
    min: [1, 'Week number must be at least 1']
  },
  tasks: [{ 
    title: { 
      type: String, 
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [150, 'Task title cannot exceed 150 characters']
    },
    description: { 
      type: String,
      trim: true
    },
    isCompleted: { 
      type: Boolean, 
      default: false 
    }
  }],
  resources: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Resource' 
  }],
  status: { 
    type: String, 
    enum: {
      values: ['pending', 'in-progress', 'completed'],
      message: 'Status must be pending, in-progress, or completed'
    }, 
    default: 'pending' 
  },
  completionDate: { 
    type: Date 
  }
}, { timestamps: true });

// Indexes
roadmapSchema.index({ studentId: 1, status: 1 });
roadmapSchema.index({ studentId: 1, weekNumber: 1 });

module.exports = mongoose.model('Roadmap', roadmapSchema);
