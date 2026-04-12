const chatbotService = require('../../services/ai/chatbotService');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const { history } = req.body;
  if (!history || !Array.isArray(history)) {
    return next(new AppError('Please provide conversation history array', 400));
  }

  try {
    const interests = await chatbotService.detectInterests(history);
    res.status(200).json(new ApiResponse(200, { interests }, 'Interests detected'));
  } catch (error) {
    // Graceful failure if AI service is not configured
    return next(new AppError('AI Mentor service is temporarily unavailable. Check configuration.', 503));
  }
});
