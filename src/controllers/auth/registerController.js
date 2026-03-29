const User = require('../../models/User');
const StudentProfile = require('../../models/StudentProfile');
const HODProfile = require('../../models/HODProfile');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');
const tokenService = require('../../services/auth/tokenService');
const emailService = require('../../services/notifications/emailService');

module.exports = catchAsync(async (req, res, next) => {
  const { email, password, firstName, lastName, role, department } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return next(new AppError('Please provide all required fields', 400));
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
    role: role || 'student'
  });

  if (newUser.role === 'student') {
    await StudentProfile.create({ userId: newUser._id });
    const Integration = require('../../models/Integration');
    await Integration.create({ studentId: newUser._id });
  } else if (newUser.role === 'hod') {
    if (!department) return next(new AppError('Department is required for HOD', 400));
    await HODProfile.create({ userId: newUser._id, department });
  }

  const accessToken = tokenService.generateAccessToken(newUser._id, newUser.role);
  const refreshToken = tokenService.generateRefreshToken(newUser._id, newUser.role);

  await emailService.sendWelcomeEmail(newUser.email, newUser.firstName);

  res.status(201).json(new ApiResponse(201, {
    user: {
      id: newUser._id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role
    },
    accessToken,
    refreshToken
  }, 'User registered successfully'));
});
