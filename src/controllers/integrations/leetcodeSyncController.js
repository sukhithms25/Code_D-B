const leetcodeService = require('../../services/integrations/leetcodeService');
const Integration = require('../../models/Integration');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const { username } = req.body;
  if (!username) {
    return next(new AppError('LeetCode username is required for sync', 400));
  }

  const profile = await leetcodeService.fetchUserProfile(username);
  
  if (!profile || profile.status !== 'success') {
      return next(new AppError('Invalid LeetCode username or account is private', 400));
  }

  const integration = await Integration.findOneAndUpdate(
    { studentId: req.user._id },
    { leetcodeUsername: username, lastSyncedAt: Date.now() },
    { new: true, upsert: true }
  );

  res.status(200).json(new ApiResponse(200, {
      username,
      totalSolved: profile.totalSolved,
      syncedAt: integration.lastSyncedAt
  }, 'LeetCode account synced successfully'));
});
