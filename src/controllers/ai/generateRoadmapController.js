const roadmapGeneratorService = require('../../services/ai/roadmapGeneratorService');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const { goal } = req.body;
  
  if (!goal) {
    return next(new AppError('Please provide a goal', 400));
  }

  try {
    const roadmap = await roadmapGeneratorService.generateRoadmap(goal);
    res.status(200).json(new ApiResponse(200, { roadmap }, 'Roadmap generated successfully'));
  } catch (error) {
    console.error(error);
    return next(new AppError('AI Roadmap Designer is temporarily unavailable.', 503));
  }
});
