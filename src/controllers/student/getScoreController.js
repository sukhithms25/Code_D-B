const Evaluation = require('../../models/Evaluation');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const evaluation = await Evaluation.findOne({ studentId: req.user._id }).sort('-evaluatedAt');
  res.status(200).json(new ApiResponse(200, evaluation || null, 'Performance score retrieved successfully'));
});
