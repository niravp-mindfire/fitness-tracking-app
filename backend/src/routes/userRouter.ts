import express from 'express';
import {
  registerUser,
  loginUser,
  forgetPassword,
  resetPassword,
  editProfile,
  getAllUsers,
  getMyProfile,
} from '../controllers/userController'; // Adjust the import based on your directory structure

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management operations
 */

/**
 * @swagger
 * /register:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Error registering user
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Users]
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Error logging in
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /forget-password:
 *   post:
 *     tags: [Users]
 *     summary: Send password reset email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *       400:
 *         description: User with this email does not exist
 *       500:
 *         description: Error sending reset link
 */
router.post('/forget-password', forgetPassword);

/**
 * @swagger
 * /reset-password/{resetToken}:
 *   post:
 *     tags: [Users]
 *     summary: Reset user password
 *     parameters:
 *       - in: path
 *         name: resetToken
 *         required: true
 *         description: The token for password reset
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Password reset token is invalid or has expired
 *       500:
 *         description: Error resetting password
 */
router.post('/reset-password/:resetToken', resetPassword);

/**
 * @swagger
 * /edit-profile:
 *   put:
 *     tags: [Users]
 *     summary: Edit user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *                 enum: [Male, Female]
 *               height:
 *                 type: number
 *               weight:
 *                 type: number
 *               dob:
 *                 type: string
 *                 format: date
 *             required: []
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: User ID is required
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating profile
 */
router.put('/edit-profile', editProfile);

/**
 * @swagger
 * /my-profile:
 *   get:
 *     tags: [Users]
 *     summary: Get user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       400:
 *         description: User ID is required
 *       404:
 *         description: User not found
 *       500:
 *         description: Error retrieving user profile
 */
router.get('/my-profile', getMyProfile);

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       404:
 *         description: Users not found
 *       500:
 *         description: Error retrieving users
 */
router.get('/users', getAllUsers);

export default router;
