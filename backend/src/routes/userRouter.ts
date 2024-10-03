import { Router } from 'express';
import {
    registerUser,
    loginUser,
    forgetPassword,
    resetPassword,
    editProfile,
    getMyProfile,
    getAllUsers
} from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';
import {
    validateRegisterUser,
    validateLoginUser,
    validateForgetPassword,
    validateResetPassword,
    validateEditProfile
} from '../middleware/userValidation';

const userRouter = Router();

// User registration
userRouter.post('/register', validateRegisterUser, registerUser);

// User login
userRouter.post('/login', validateLoginUser, loginUser);

// Forget password
userRouter.post('/forget-password', validateForgetPassword, forgetPassword);

// Reset password
userRouter.post('/reset-password/:resetToken', validateResetPassword, resetPassword);

// Edit profile
userRouter.put('/edit-profile', authenticateToken, validateEditProfile, editProfile);

// Get My Profile
userRouter.get('/my-profile', authenticateToken, getMyProfile); 

userRouter.get('/users', authenticateToken, getAllUsers)

export default userRouter;
