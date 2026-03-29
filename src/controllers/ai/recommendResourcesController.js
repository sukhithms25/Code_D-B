const resourceRecommenderService = require('../../services/ai/resourceRecommenderService');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const { topic, difficulty = 'beginner' } = req.query;
  
  const resources = await resourceRecommenderService.recommendResources(topic, difficulty);
  res.status(200).json(new ApiResponse(200, resources, 'Resources recommended successfully'));
});
