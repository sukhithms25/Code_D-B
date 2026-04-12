const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');
const hodControllers = require('../controllers/hod');
const { createAnnouncement, getAnnouncements, deleteAnnouncement } = require('../controllers/hod/announcementController');

const router = express.Router();

router.use(protect);
router.use(authorizeRole('hod', 'admin'));

/**
 * @swagger
 * /api/v1/hod/students:
 *   get:
 *     summary: List all students with live scores
 *     description: Supports pagination (?page=1&limit=20), search (?search=name), branch filter (?branch=CSE)
 *     tags: [HOD]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by name or email
 *       - in: query
 *         name: branch
 *         schema: { type: string }
 *         description: Filter by branch (e.g. CSE)
 *     responses:
 *       200:
 *         description: List of students with scores
 */
router.get('/students', hodControllers.getStudentsController);

/**
 * @swagger
 * /api/v1/hod/students/{id}:
 *   get:
 *     summary: Get full profile + live score for a student
 *     tags: [HOD]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Student profile and score breakdown
 *       404:
 *         description: Student not found
 */
router.get('/students/:id', hodControllers.getStudentDetailController);

/**
 * @swagger
 * /api/v1/hod/rankings:
 *   get:
 *     summary: Student leaderboard sorted by score
 *     tags: [HOD]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Ranked student list
 */
router.get('/rankings', hodControllers.getRankingsController);

/**
 * @swagger
 * /api/v1/hod/alerts:
 *   get:
 *     summary: Students requiring attention (low score, inactive, missing integrations)
 *     tags: [HOD]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema: { type: integer, default: 50 }
 *         description: Score below which students appear as alerts
 *     responses:
 *       200:
 *         description: Alert list with reasons
 */
router.get('/alerts', hodControllers.getAlertsController);

/**
 * @swagger
 * /api/v1/hod/analytics:
 *   get:
 *     summary: Department-wide aggregate analytics
 *     tags: [HOD]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Grade distribution, avg/top score, integration adoption, branch breakdown
 */
router.get('/analytics', hodControllers.getAnalyticsController);

/**
 * @swagger
 * /api/v1/hod/top-performers:
 *   get:
 *     summary: List top-performing students (Grade A)
 *     description: Returns students with high computed platform scores.
 *     tags: [HOD]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of top performers
 */
router.get('/top-performers', hodControllers.getTopPerformersController);

/**
 * @swagger
 * /api/v1/hod/low-performers:
 *   get:
 *     summary: List low-performing students (Grade D/F)
 *     description: Returns students flagged as at-risk based on low scores and slow activity.
 *     tags: [HOD]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of low performers
 */
router.get('/low-performers', hodControllers.getLowPerformersController);

/**
 * @swagger
 * /api/v1/hod/announcements:
 *   post:
 *     summary: Create an announcement
 *     description: HOD creates an announcement. Set notifyByEmail=true to email matching students.
 *     tags: [HOD]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, body]
 *             properties:
 *               title:         { type: string }
 *               body:          { type: string }
 *               priority:      { type: string, enum: [low, medium, high, urgent] }
 *               targetBranch:  { type: string, description: "Leave empty for all branches" }
 *               targetYear:    { type: number, description: "Leave empty for all years" }
 *               notifyByEmail: { type: boolean }
 *     responses:
 *       201:
 *         description: Announcement created
 *       400:
 *         description: Missing title or body
 */
router.post('/announcements', createAnnouncement);

/**
 * @swagger
 * /api/v1/hod/announcements:
 *   get:
 *     summary: List HOD's announcements
 *     tags: [HOD]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: archived
 *         schema: { type: boolean, default: false }
 *     responses:
 *       200:
 *         description: Announcements list
 */
router.get('/announcements', getAnnouncements);

/**
 * @swagger
 * /api/v1/hod/announcements/{id}:
 *   delete:
 *     summary: Archive an announcement
 *     tags: [HOD]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Archived successfully
 *       404:
 *         description: Not found or not authorized
 */
router.delete('/announcements/:id', deleteAnnouncement);

module.exports = router;
