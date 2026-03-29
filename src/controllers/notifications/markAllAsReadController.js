const Notification = require('../../models/Notification');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { $set: { isRead: true } }
  );

  res.status(200).json(new ApiResponse(200, null, 'All notifications marked as read'));
});
