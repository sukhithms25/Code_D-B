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

/**
 * @swagger
 * /api/v1/student/profile:
 *   get:
 *     summary: Get logged-in student's profile
 *     description: Returns the user's profile including GitHub OAuth connection data.
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       404:
 *         description: User not found
 */
router.get('/profile', studentControllers.getProfileController);
/**
 * @swagger
 * /api/v1/student/profile:
 *   put:
 *     summary: Update logged-in student's profile
 *     description: Updates the user's profile metadata like cgpa, branch, etc.
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cgpa:
 *                 type: number
 *               branch:
 *                 type: string
 *               year:
 *                 type: number
 *               bio:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 */
router.put('/profile', validateRequest(studentSchema.updateProfile), studentControllers.updateProfileController);
/**
 * @swagger
 * /api/v1/student/resume:
 *   post:
 *     summary: Upload student resume
 *     description: Uploads a PDF resume (multipart/form-data)
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resume uploaded successfully
 */
router.post('/resume', uploadResume.single('resume'), studentControllers.uploadResumeController);

/**
 * @swagger
 * /api/v1/student/resume/analyze:
 *   get:
 *     summary: Analyze resume with static heuristic rules
 *     description: Parses the uploaded PDF and scores it against local keywords
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resume analyzed successfully
 *       400:
 *         description: No resume uploaded yet
 */
router.get('/resume/analyze', studentControllers.analyzeResumeController);

/**
 * @swagger
 * /api/v1/student/roadmap:
 *   get:
 *     summary: Get current active roadmap
 *     description: Returns the student's current in-progress or pending roadmap.
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Roadmap retrieved
 */
router.get('/roadmap', studentControllers.getRoadmapController);


/**
 * @swagger
 * /api/v1/student/roadmap/generate:
 *   post:
 *     summary: Generate a personalized learning roadmap
 *     description: Returns a 4-week structured plan based on career goal
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - goal
 *             properties:
 *               goal:
 *                 type: string
 *                 example: "Full Stack Developer"
 *     responses:
 *       200:
 *         description: Roadmap generated successfully
 *       400:
 *         description: Goal requires
 */
router.post('/roadmap/generate', validateRequest(roadmapSchema.generateRoadmap), studentControllers.generateRoadmapController);

/**
 * @swagger
 * /api/v1/student/progress:
 *   get:
 *     summary: Get student progress history
 *     description: Returns all individual task completion events for the student.
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progress records fetched
 */
router.get('/progress', studentControllers.getProgressController);

/**
 * @swagger
 * /api/v1/student/progress:
 *   put:
 *     summary: Update task completion status
 *     description: Toggles a task as completed/incomplete and calculates new roadmap percentage.
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roadmapId, taskId, isCompleted]
 *             properties:
 *               roadmapId: { type: string }
 *               taskId: { type: string }
 *               isCompleted: { type: boolean }
 *               notes: { type: string }
 *     responses:
 *       200:
 *         description: Progress updated
 */
router.put('/progress', validateRequest(roadmapSchema.updateProgress), studentControllers.updateProgressController);

/**
 * @swagger
 * /api/v1/student/score:
 *   get:
 *     summary: Get current performance score and grade
 *     description: Computes a live score (0-100) and grade (A-F) based on GitHub, LeetCode, and Roadmaps.
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Score calculated
 */
router.get('/score', studentControllers.getScoreController);

/**
 * @swagger
 * /api/v1/student/recommendations:
 *   get:
 *     summary: Get tailored learning recommendations
 *     description: Suggests skills or resources based on the current roadmap status and profile.
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recommendations fetched
 */
router.get('/recommendations', studentControllers.getRecommendationsController);

// ── Announcements ──────────────────────────────────────────────────────────────
const { getStudentAnnouncements, respondToAnnouncement } = require('../controllers/student/announcementController');

/**
 * @swagger
 * /api/v1/student/announcements:
 *   get:
 *     summary: Get announcements targeted to this student
 *     description: Returns active, non-expired announcements matching the student's branch/year, with acknowledged flag.
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of announcements
 */
router.get('/announcements', getStudentAnnouncements);

/**
 * @swagger
 * /api/v1/student/announcements/{id}/respond:
 *   post:
 *     summary: Acknowledge an announcement
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               response:
 *                 type: string
 *                 description: Optional student comment
 *     responses:
 *       200:
 *         description: Acknowledged
 */
router.post('/announcements/:id/respond', respondToAnnouncement);

module.exports = router;
