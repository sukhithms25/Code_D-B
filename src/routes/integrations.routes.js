const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');
const validateRequest = require('../validators/validateRequest');
const integrationSchema = require('../validators/schemas/integrationSchema');
const integrationsControllers = require('../controllers/integrations');

const router = express.Router();

// 🔓 Unprotected routes (Browser redirection & Callback handling)
router.get('/github/connect', integrationsControllers.githubConnect);
router.get('/github/callback', integrationsControllers.githubCallback);

// 🔒 Protected routes (Requires Bearer token)
router.use(protect);
router.use(authorizeRole('student'));

router.get('/status', integrationsControllers.getIntegrationStatusController);
router.post('/github/sync', validateRequest(integrationSchema.githubSync), integrationsControllers.githubSyncController);
router.post('/leetcode/sync', validateRequest(integrationSchema.leetcodeSync), integrationsControllers.leetcodeSyncController);
const { getResources } = require('../controllers/integrations/resourceController');

/**
 * @swagger
 * /api/v1/integrations/resources:
 *   get:
 *     summary: Get static learning resources
 *     description: Returns curated fallback resources for a specific topic (requires student role).
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: topic
 *         required: true
 *         schema:
 *           type: string
 *         description: The learning topic (e.g., react, nodejs, dsa)
 *     responses:
 *       200:
 *         description: Successfully fetched resources
 *       400:
 *         description: Topic is required
 *       401:
 *         description: Not logged in / Invalid Token
 *       403:
 *         description: Forbidden / Not a student
 */
router.get('/resources', getResources);

module.exports = router;
