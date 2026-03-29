const User = require('../../models/User');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const students = await User.find({ role: 'student' }).select('firstName lastName email');
  res.status(200).json(new ApiResponse(200, students, 'Students retrieved successfully'));
});
