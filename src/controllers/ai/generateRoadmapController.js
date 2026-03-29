const roadmapGeneratorService = require('../../services/ai/roadmapGeneratorService');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const { interests, skillLevel, weeks } = req.body;
  
  if (!interests || !Array.isArray(interests)) {
    return next(new AppError('Please provide interests array', 400));
  }

  const roadmap = await roadmapGeneratorService.generateRoadmap(interests, skillLevel || 'beginner', weeks || 4);
  res.status(200).json(new ApiResponse(200, roadmap, 'Roadmap generated successfully'));
});
