const resourceRecommenderService = require('../../services/ai/resourceRecommenderService');
const { detectInterests } = require('../../services/ai/interestDetectorService');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');

/**
 * GET /api/v1/ai/recommend?topic=react&difficulty=beginner
 *
 * If topic is provided directly → use it.
 * If topic is missing but text is provided → run interestDetectorService
 * to extract a topic from free-form text (resume content, profile bio).
 *
 * This keeps the AI route flexible without requiring OpenAI for simple queries.
 */
module.exports = catchAsync(async (req, res, next) => {
  let { topic, difficulty = 'beginner', text } = req.query;

  // If no direct topic, detect from free-form text using keyword detector
  if (!topic && text) {
    const detected = detectInterests(text);
    if (detected.length > 0) {
      topic = detected[0]; // use the first detected interest as the search topic
    }
  }

  if (!topic) {
    return next(
      new AppError('Please provide a topic or text to detect interests from.', 400)
    );
  }

  const resources = await resourceRecommenderService.recommendResources(topic, difficulty);

  res.status(200).json(
    new ApiResponse(200, { topic, difficulty, resources }, 'Resources recommended successfully')
  );
});
