const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');
const aiControllers = require('../controllers/ai');

const router = express.Router();

router.use(protect);
router.use(authorizeRole('student'));

/**
 * @swagger
 * /api/v1/ai/chat:
 *   post:
 *     summary: Chat with AI mentor
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message: { type: string }
 *     responses:
 *       200:
 *         description: AI response
 */
router.post('/chat', aiControllers.chatController);

/**
 * @swagger
 * /api/v1/ai/generate-roadmap:
 *   post:
 *     summary: AI-powered roadmap generation (Detailed)
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Detailed AI roadmap generated
 */
router.post('/generate-roadmap', aiControllers.generateRoadmapController);

/**
 * @swagger
 * /api/v1/ai/analyze-resume:
 *   post:
 *     summary: Deep AI resume analysis
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Deep insights generated
 */
router.post('/analyze-resume', aiControllers.analyzeResumeController);

/**
 * @swagger
 * /api/v1/ai/recommend:
 *   get:
 *     summary: AI-powered resource recommendations
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI-selected resources
 */
router.get('/recommend', aiControllers.recommendResourcesController);

module.exports = router;
