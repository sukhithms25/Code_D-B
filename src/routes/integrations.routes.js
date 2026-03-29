const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const validateRequest = require('../validators/validateRequest');
const integrationSchema = require('../validators/schemas/integrationSchema');
const integrationsControllers = require('../controllers/integrations');

const router = express.Router();

router.use(protect);
router.use(restrictTo('student'));

router.get('/status', integrationsControllers.getIntegrationStatusController);
router.post('/github/sync', validateRequest(integrationSchema.githubSync), integrationsControllers.githubSyncController);
router.post('/leetcode/sync', validateRequest(integrationSchema.leetcodeSync), integrationsControllers.leetcodeSyncController);

module.exports = router;
