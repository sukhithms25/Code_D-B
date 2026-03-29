const StudentProfile = require('../../models/StudentProfile');
const Evaluation = require('../../models/Evaluation');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const student = await StudentProfile.findOne({ userId: req.params.id }).populate('userId', 'firstName lastName email');
  if (!student) {
    return next(new AppError('Student not found', 404));
  }
  
  const evaluation = await Evaluation.findOne({ studentId: req.params.id }).sort('-evaluatedAt');
  
  res.status(200).json(new ApiResponse(200, { student, evaluation }, 'Student details retrieved successfully'));
});
