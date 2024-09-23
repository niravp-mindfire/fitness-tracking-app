import { Router } from 'express';
import { registerUser, loginUser, forgetPassword, resetPassword, editProfile } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/forget-password', forgetPassword);
userRouter.post('/reset-password/:resetToken', authenticateToken, resetPassword);
userRouter.put('/edit-profile', authenticateToken, editProfile);

export default userRouter;
