const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const notificationsControllers = require('../controllers/notifications');

const router = express.Router();

router.use(protect);

router.get('/', notificationsControllers.getNotificationsController);
router.put('/mark-all', notificationsControllers.markAllAsReadController);
router.put('/:id', notificationsControllers.markAsReadController);

module.exports = router;
