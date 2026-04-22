const express = require('express');
const authSchema = require('../validators/schemas/authSchema');
const validateRequest = require('../validators/validateRequest');
const authControllers = require('../controllers/auth');

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account (student, hod, admin)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *               role:
 *                 type: string
 *                 enum: [student, hod, admin]
 *                 default: student
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Validation error or Email already exists
 */
router.post('/register', validateRequest(authSchema.register), authControllers.registerController);
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in to the application
 *     description: Authenticates a user and returns a JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                   description: JWT Bearer Token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateRequest(authSchema.login), authControllers.loginController);
/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh authentication token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New tokens generated
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh', validateRequest(authSchema.refreshToken), authControllers.refreshTokenController);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.post('/logout', authControllers.logoutController);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request password reset email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset email sent
 */
router.post('/forgot-password', authControllers.forgotPasswordController);

/**
 * @swagger
 * /api/v1/auth/reset-password/{token}:
 *   post:
 *     summary: Reset password using token
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password successfully reset
 *       400:
 *         description: Invalid or expired token
 */
router.post('/reset-password/:token', authControllers.resetPasswordController);

module.exports = router;
