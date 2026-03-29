const Evaluation = require('../../models/Evaluation');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const lowPerformers = await Evaluation.find({ totalScore: { $lt: 50 } })
    .sort({ totalScore: 1 })
    .populate('studentId', 'firstName lastName email');
    
  res.status(200).json(new ApiResponse(200, lowPerformers, 'Low performers retrieved successfully'));
});
