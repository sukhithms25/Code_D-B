const express = require('express');
const authSchema = require('../../validators/schemas/authSchema');
const validateRequest = require('../../validators/validateRequest');
const authControllers = require('../controllers/auth');

const router = express.Router();

router.post('/register', validateRequest(authSchema.register), authControllers.registerController);
router.post('/login', validateRequest(authSchema.login), authControllers.loginController);
router.post('/refresh', validateRequest(authSchema.refreshToken), authControllers.refreshTokenController);
router.post('/logout', authControllers.logoutController);

module.exports = router;
