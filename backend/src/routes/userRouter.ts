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
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/forget-password', forgetPassword);

router.post('/reset-password/:resetToken', resetPassword);

router.put('/edit-profile', authenticateToken, editProfile);

router.get('/my-profile', authenticateToken, getMyProfile);

router.get('/users', authenticateToken, getAllUsers);

export default router;
