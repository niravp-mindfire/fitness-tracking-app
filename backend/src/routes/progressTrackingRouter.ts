import { Router } from 'express';
import {
  addProgressTracking,
  updateProgressTracking,
  deleteProgressTracking,
  getUserProgressTracking,
  getAllProgressTracking,
  getProgressTrackingById,
  trackProgress,
} from '../controllers/progressTrackingController';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  validateAddProgressTracking,
  validateUpdateProgressTracking,
} from '../middleware/progressValidation';

const progressTrackingRouter = Router();

progressTrackingRouter.get('/', authenticateToken, getAllProgressTracking);
progressTrackingRouter.get('/:id', authenticateToken, getProgressTrackingById);
progressTrackingRouter.get('/track/progress', authenticateToken, trackProgress)
// Add progress tracking
progressTrackingRouter.post('/', authenticateToken, validateAddProgressTracking, addProgressTracking);

// Update progress tracking
progressTrackingRouter.put('/:id', authenticateToken, validateUpdateProgressTracking, updateProgressTracking);

// Delete progress tracking
progressTrackingRouter.delete('/:id', authenticateToken, deleteProgressTracking);

// Get user progress tracking
progressTrackingRouter.get('/user/:userId', authenticateToken, getUserProgressTracking);

export default progressTrackingRouter;
