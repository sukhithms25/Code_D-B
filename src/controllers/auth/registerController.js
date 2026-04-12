const User = require('../../models/User');
const Integration = require('../../models/Integration');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');
const tokenService = require('../../services/auth/tokenService');
const emailService = require('../../services/notifications/emailService');

/**
 * POST /api/v1/auth/register
 * Handles user registration for students and HODs.
 * Unified User model approach (no separate Profile collections).
 */
module.exports = catchAsync(async (req, res, next) => {
  const { email, password, firstName, lastName, role, department, branch, year } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return next(new AppError('Please provide all required fields (email, password, firstName, lastName)', 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already in use', 400));
  }

  const newUser = await User.create({
    email,
    password,
    firstName,
    lastName,
    role: role || 'student',
    department: role === 'hod' ? department : undefined,
    branch: role === 'student' ? branch : undefined,
    year: role === 'student' ? year : undefined
  });

  // Only Students need Integration & separate lifecycle management
  if (newUser.role === 'student') {
    await Integration.create({ studentId: newUser._id });
  }

  const accessToken = tokenService.generateAccessToken(newUser._id, newUser.role);
  const refreshToken = tokenService.generateRefreshToken(newUser._id, newUser.role);

  // Send onboarding email (non-blocking)
  emailService.sendWelcomeEmail(newUser.email, newUser.firstName).catch(err => {
    console.error('Failed to send welcome email:', err.message);
  });

  res.status(201).json(new ApiResponse(201, {
    user: {
      id: newUser._id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      branch: newUser.branch,
      department: newUser.department
    },
    accessToken,
    refreshToken
  }, 'User registered successfully'));
});
