const notificationService = require('../../services/notifications/notificationService');
const Notification = require('../../models/Notification');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const { unreadOnly } = req.query;
  
  let notifications;
  if (unreadOnly === 'true') {
     notifications = await notificationService.getUnreadNotifications(req.user._id);
  } else {
     notifications = await Notification.find({ userId: req.user._id }).sort('-createdAt');
  }

  res.status(200).json(new ApiResponse(200, notifications, 'Notifications retrieved successfully'));
});
