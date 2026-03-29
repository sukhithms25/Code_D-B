const express = require('express');
const multer = require('multer');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const validateRequest = require('../validators/validateRequest');
const studentSchema = require('../validators/schemas/studentSchema');
const roadmapSchema = require('../validators/schemas/roadmapSchema');
const studentControllers = require('../controllers/student');

const upload = multer({ dest: 'uploads/temp/' });
const router = express.Router();

router.use(protect);
router.use(restrictTo('student'));

router.get('/profile', studentControllers.getProfileController);
router.put('/profile', validateRequest(studentSchema.updateProfile), studentControllers.updateProfileController);
router.post('/resume', upload.single('resume'), studentControllers.uploadResumeController);

router.get('/roadmap', studentControllers.getRoadmapController);
router.post('/roadmap/generate', validateRequest(roadmapSchema.generateRoadmap), studentControllers.generateRoadmapController);

router.get('/progress', studentControllers.getProgressController);
router.put('/progress', validateRequest(roadmapSchema.updateProgress), studentControllers.updateProgressController);

router.get('/score', studentControllers.getScoreController);
router.get('/recommendations', studentControllers.getRecommendationsController);

module.exports = router;
