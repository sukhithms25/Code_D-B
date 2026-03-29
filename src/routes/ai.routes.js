const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const aiControllers = require('../controllers/ai');

const router = express.Router();

router.use(protect);

router.post('/chat', aiControllers.chatController);
router.post('/generate-roadmap', aiControllers.generateRoadmapController);
router.post('/analyze-resume', aiControllers.analyzeResumeController);
router.get('/recommend', aiControllers.recommendResourcesController);

module.exports = router;
