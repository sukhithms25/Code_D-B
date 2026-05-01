const githubService = require('../../services/integrations/githubService');
const Integration = require('../../models/Integration');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  let integration = await Integration.findOne({ studentId: req.user._id });
  
  if (!integration || !integration.githubToken) {
    return next(new AppError('GitHub is not connected. Please connect GitHub first.', 400));
  }

  const token = integration.githubToken;

  try {
    // Validate token
    const profile = await githubService.fetchUserProfile(token);
    
    if (!profile || !profile.login) {
        return next(new AppError('Invalid GitHub token', 401));
    }

    res.status(200).json(new ApiResponse(200, {
        profile: { login: profile.login, url: profile.html_url },
        syncedAt: integration.githubSyncedAt
    }, 'GitHub account synced successfully'));
  } catch (error) {
     return next(new AppError('Failed to sync with GitHub. Invalid token or service down.', 401));
  }
});
