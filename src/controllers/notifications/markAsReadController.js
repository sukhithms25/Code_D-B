const notificationService = require('../../services/notifications/notificationService');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const notificationId = req.params.id;
  
  const notification = await notificationService.markAsRead(notificationId);
  if (!notification) {
      return next(new AppError('Notification not found', 404));
  }

  res.status(200).json(new ApiResponse(200, notification, 'Notification marked as read'));
});
