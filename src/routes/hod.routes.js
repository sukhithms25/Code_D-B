const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const hodControllers = require('../controllers/hod');

const router = express.Router();

router.use(protect);
router.use(restrictTo('hod', 'admin'));

router.get('/students', hodControllers.getStudentsController);
router.get('/students/:id', hodControllers.getStudentDetailController);
router.get('/analytics', hodControllers.getAnalyticsController);
router.get('/top-performers', hodControllers.getTopPerformersController);
router.get('/low-performers', hodControllers.getLowPerformersController);

module.exports = router;
