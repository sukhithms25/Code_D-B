const { githubConnect, githubCallback } = require('./githubOAuthController');

module.exports = {
  githubSyncController:           require('./githubSyncController'),
  leetcodeSyncController:         require('./leetcodeSyncController'),
  getIntegrationStatusController: require('./getIntegrationStatusController'),
  githubConnect,
  githubCallback
};
