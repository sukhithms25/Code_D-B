const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Student ID is required for an evaluation'] 
  },
  codingScore: { 
    type: Number, 
    min: [0, 'Coding score must be at least 0'], 
    max: [100, 'Coding score cannot exceed 100'], 
    default: 0 
  },
  projectScore: { 
    type: Number, 
    min: [0, 'Project score must be at least 0'], 
    max: [100, 'Project score cannot exceed 100'], 
    default: 0 
  },
  problemSolvingScore: { 
    type: Number, 
    min: [0, 'Problem solving score must be at least 0'], 
    max: [100, 'Problem solving score cannot exceed 100'], 
    default: 0 
  },
  consistencyScore: { 
    type: Number, 
    min: [0, 'Consistency score must be at least 0'], 
    max: [100, 'Consistency score cannot exceed 100'], 
    default: 0 
  },
  totalScore: { 
    type: Number, 
    min: [0, 'Total score must be at least 0'], 
    max: [100, 'Total score cannot exceed 100'], 
    default: 0 
  },
  grade: { 
    type: String, 
    enum: {
      values: ['A+', 'A', 'B', 'C', 'D', 'F'],
      message: 'Grade must be A+, A, B, C, D, or F'
    } 
  },
  evaluatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// Indexes
evaluationSchema.index({ totalScore: -1 }); // Useful for top performers leaderboard

module.exports = mongoose.model('Evaluation', evaluationSchema);
