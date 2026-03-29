const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User ID is required to create a student profile'], 
    unique: true 
  },
  CGPA: { 
    type: Number, 
    min: [0, 'CGPA cannot be less than 0'], 
    max: [10, 'CGPA cannot be more than 10'] 
  },
  resumeUrl: { 
    type: String,
    match: [/^https?:\/\/.*/, 'Please enter a valid URL for the resume']
  },
  interests: [{ 
    type: String,
    trim: true,
    maxlength: [50, 'Interest cannot exceed 50 characters']
  }],
  skills: [{ 
    type: String,
    trim: true,
    maxlength: [50, 'Skill cannot exceed 50 characters']
  }],
  githubUrl: { 
    type: String,
    match: [/^https?:\/\/(www\.)?github\.com\/.*/, 'Please enter a valid GitHub URL']
  },
  linkedinUrl: { 
    type: String,
    match: [/^https?:\/\/(www\.)?linkedin\.com\/.*/, 'Please enter a valid LinkedIn URL']
  }
}, { timestamps: true });

// Indexes
studentProfileSchema.index({ userId: 1 });
studentProfileSchema.index({ skills: 1 });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
