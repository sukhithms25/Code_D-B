const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');
const notificationsControllers = require('../controllers/notifications');

const router = express.Router();

router.use(protect);
router.use(authorizeRole('student', 'hod'));

router.get('/', notificationsControllers.getNotificationsController);
router.put('/mark-all', notificationsControllers.markAllAsReadController);
router.put('/:id', notificationsControllers.markAsReadController);

module.exports = router;
