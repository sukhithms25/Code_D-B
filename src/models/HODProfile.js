const mongoose = require('mongoose');

const hodProfileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User ID is required to create a HOD profile'], 
    unique: true 
  },
  department: { 
    type: String, 
    required: [true, 'Department is required for HOD'],
    trim: true,
    maxlength: [100, 'Department name cannot exceed 100 characters']
  },
  accessibleStudents: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  permissions: [{ 
    type: String,
    trim: true
  }]
}, { timestamps: true });

// Indexes
hodProfileSchema.index({ userId: 1 });
hodProfileSchema.index({ department: 1 });

module.exports = mongoose.model('HODProfile', hodProfileSchema);
