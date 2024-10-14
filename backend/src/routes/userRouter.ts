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

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/forget-password', forgetPassword);

router.post('/reset-password/:resetToken', resetPassword);

router.put('/edit-profile', editProfile);

router.get('/my-profile', getMyProfile);

router.get('/users', getAllUsers);

export default router;
