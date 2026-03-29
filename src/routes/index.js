const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const studentRoutes = require('./student.routes');
const hodRoutes = require('./hod.routes');
const aiRoutes = require('./ai.routes');
const integrationsRoutes = require('./integrations.routes');
const notificationsRoutes = require('./notifications.routes');
const healthRoutes = require('./health.routes');

router.use('/auth', authRoutes);
router.use('/student', studentRoutes);
router.use('/hod', hodRoutes);
router.use('/ai', aiRoutes);
router.use('/integrations', integrationsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/health', healthRoutes);

module.exports = router;
