const Evaluation = require('../../models/Evaluation');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const topPerformers = await Evaluation.find()
    .sort({ totalScore: -1 })
    .limit(10)
    .populate('studentId', 'firstName lastName email');
    
  res.status(200).json(new ApiResponse(200, topPerformers, 'Top performers retrieved successfully'));
});
