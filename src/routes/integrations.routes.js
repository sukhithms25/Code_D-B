const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');
const validateRequest = require('../validators/validateRequest');
const integrationSchema = require('../validators/schemas/integrationSchema');
const integrationsControllers = require('../controllers/integrations');

const router = express.Router();

// 🔓 Unprotected routes (Callback handling)
/**
 * @swagger
 * /api/v1/integrations/github/callback:
 *   get:
 *     summary: GitHub OAuth callback handler
 *     description: Handles the redirect from GitHub, exchanges code for token, and links user.
 *     tags: [Integrations]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully connected
 */
router.get('/github/callback', integrationsControllers.githubCallback);

// 🔒 Protected routes (Requires Bearer token)
router.use(protect);

/**
 * @swagger
 * /api/v1/integrations/github/connect:
 *   get:
 *     summary: Initiate GitHub OAuth connection
 *     description: Redirects the user to GitHub to authorize the application. Browser-only.
 *     tags: [Integrations]
 *     responses:
 *       302:
 *         description: Redirect to GitHub
 */
router.get('/github/connect', integrationsControllers.githubConnect);

router.use(authorizeRole('student'));

/**
 * @swagger
 * /api/v1/integrations/status:
 *   get:
 *     summary: Get user integration status
 *     description: Returns whether GitHub and LeetCode are connected for the current student.
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Integration status retrieved
 */
router.get('/status', integrationsControllers.getIntegrationStatusController);

/**
 * @swagger
 * /api/v1/integrations/github/sync:
 *   post:
 *     summary: Manually sync GitHub data
 *     description: Fetches latest repo counts and activity from GitHub API.
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sync successful
 */
router.post('/github/sync', validateRequest(integrationSchema.githubSync), integrationsControllers.githubSyncController);

/**
 * @swagger
 * /api/v1/integrations/leetcode/sync:
 *   post:
 *     summary: Manually sync LeetCode data
 *     description: Fetches solved counts from LeetCode.
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sync successful
 */
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
