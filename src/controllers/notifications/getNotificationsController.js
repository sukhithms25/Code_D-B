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

  // Map to frontend expected keys (id, read)
  const mapped = notifications.map(n => ({
    id: n._id,
    title: n.title,
    message: n.message,
    type: n.type,
    read: n.isRead,
    createdAt: n.createdAt
  }));

  res.status(200).json(new ApiResponse(200, { notifications: mapped }, 'Notifications retrieved successfully'));
});
