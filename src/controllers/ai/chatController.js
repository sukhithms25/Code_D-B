const chatbotService = require('../../services/ai/chatbotService');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const { message } = req.body;
  if (!message) {
    return next(new AppError('Please provide a message', 400));
  }

  try {
    const reply = await chatbotService.chat(message);
    res.status(200).json(new ApiResponse(200, { reply }, 'AI response generated'));
  } catch (error) {
    console.error(error);
    return next(new AppError('AI Mentor service is temporarily unavailable. Check configuration.', 503));
  }
});
