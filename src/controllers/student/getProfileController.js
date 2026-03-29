const StudentProfile = require('../../models/StudentProfile');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const profile = await StudentProfile.findOne({ userId: req.user._id }).populate('userId', 'firstName lastName email role');
  
  if (!profile) {
    return next(new AppError('Profile not found', 404));
  }

  res.status(200).json(new ApiResponse(200, profile, 'Profile retrieved successfully'));
});
