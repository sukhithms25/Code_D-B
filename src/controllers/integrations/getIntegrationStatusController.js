const Integration = require('../../models/Integration');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const integration = await Integration.findOne({ studentId: req.user._id });
  
  const status = {
      github: integration && integration.githubToken ? { connected: true, syncedAt: integration.githubSyncedAt } : { connected: false },
      leetcode: integration && integration.leetcodeUsername ? { connected: true, username: integration.leetcodeUsername, syncedAt: integration.lastSyncedAt } : { connected: false }
  };

  res.status(200).json(new ApiResponse(200, status, 'Integration status retrieved successfully'));
});
