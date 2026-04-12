const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    lowercase: true, 
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
    password: { 
    type: String, 
    required: [true, 'Password is required'], 
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false 
  },
  role: { 
    type: String, 
    enum: {
      values: ['student', 'hod', 'admin'],
      message: 'Role must be either: student, hod, or admin'
    }, 
    default: 'student' 
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  githubConnected: { type: Boolean, default: false },
  githubUsername: String,
  githubProfileUrl: String,
  githubAvatar: String,
  followers: Number,
  following: Number,
  publicRepos: Number,
  repoCount: Number,
  lastGithubSync: Date,
  cgpa: Number,
  branch: String,
  year: Number,
  bio: String,
  skills: [String],
  linkedinUrl: String,
  resumeUrl: String,
  resumeUploadedAt: Date,
  resumeAnalysis: Object,
  careerGoal: String,
  currentLevel: String,
  roadmap: Array,
  leetcodeUsername: String,
  leetcodeSolved:   Number,
  leetcodeEasy:     Number,
  leetcodeMedium:   Number,
  leetcodeHard:     Number,
  lastLeetcodeSync: Date,
  department: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true } 
});

// Indexes
userSchema.index({ role: 1 });

// Virtuals
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to verify password match
userSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);
