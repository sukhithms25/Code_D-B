const githubService = require('../../services/integrations/githubService');
const Integration = require('../../models/Integration');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return next(new AppError('GitHub token is required for sync', 400));
  }

  // Validate token
  const profile = await githubService.fetchUserProfile(token);
  
  if (!profile || !profile.login) {
      return next(new AppError('Invalid GitHub token', 401));
  }

  const integration = await Integration.findOneAndUpdate(
    { studentId: req.user._id },
    { githubToken: token, githubSyncedAt: Date.now(), lastSyncedAt: Date.now() },
    { new: true, upsert: true }
  );

  res.status(200).json(new ApiResponse(200, {
      profile: { login: profile.login, url: profile.html_url },
      syncedAt: integration.githubSyncedAt
  }, 'GitHub account synced successfully'));
});
