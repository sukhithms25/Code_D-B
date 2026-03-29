const Progress = require('../../models/Progress');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const progressList = await Progress.find({ studentId: req.user._id }).populate('roadmapId');
  res.status(200).json(new ApiResponse(200, progressList, 'Progress history retrieved successfully'));
});
