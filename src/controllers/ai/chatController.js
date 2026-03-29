const chatbotService = require('../../services/ai/chatbotService');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const { history } = req.body;
  if (!history || !Array.isArray(history)) {
    return next(new AppError('Please provide conversation history array', 400));
  }

  const interests = await chatbotService.detectInterests(history);
  res.status(200).json(new ApiResponse(200, { interests }, 'Interests detected'));
});
