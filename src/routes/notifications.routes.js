const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');
const notificationsControllers = require('../controllers/notifications');

const router = express.Router();

router.use(protect);
router.use(authorizeRole('student', 'hod'));

/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     summary: Get all notifications for the current user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications fetched
 */
router.get('/', notificationsControllers.getNotificationsController);

/**
 * @swagger
 * /api/v1/notifications/mark-all:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.put('/mark-all', notificationsControllers.markAllAsReadController);

/**
 * @swagger
 * /api/v1/notifications/{id}:
 *   put:
 *     summary: Mark a single notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Notification updated
 */
router.put('/:id', notificationsControllers.markAsReadController);

module.exports = router;
