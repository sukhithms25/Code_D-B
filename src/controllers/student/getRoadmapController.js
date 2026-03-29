const Roadmap = require('../../models/Roadmap');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const roadmaps = await Roadmap.find({ studentId: req.user._id })
                                .sort({ weekNumber: 1 })
                                .populate('resources');

  res.status(200).json(new ApiResponse(200, roadmaps, 'Roadmaps retrieved successfully'));
});
