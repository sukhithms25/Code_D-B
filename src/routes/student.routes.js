const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');
const { uploadResume } = require('../middleware/fileUploadMiddleware');
const validateRequest = require('../validators/validateRequest');
const studentSchema = require('../validators/schemas/studentSchema');
const roadmapSchema = require('../validators/schemas/roadmapSchema');
const studentControllers = require('../controllers/student');

const router = express.Router();

router.use(protect);
router.use(authorizeRole('student'));

router.get('/profile', studentControllers.getProfileController);
router.put('/profile', validateRequest(studentSchema.updateProfile), studentControllers.updateProfileController);
router.post('/resume', uploadResume.single('resume'), studentControllers.uploadResumeController);

router.get('/roadmap', studentControllers.getRoadmapController);
router.post('/roadmap/generate', validateRequest(roadmapSchema.generateRoadmap), studentControllers.generateRoadmapController);

router.get('/progress', studentControllers.getProgressController);
router.put('/progress', validateRequest(roadmapSchema.updateProgress), studentControllers.updateProgressController);

router.get('/score', studentControllers.getScoreController);
router.get('/recommendations', studentControllers.getRecommendationsController);

module.exports = router;
