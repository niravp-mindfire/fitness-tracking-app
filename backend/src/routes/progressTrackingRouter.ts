import { Router } from 'express';
import {
  addProgressTracking,
  updateProgressTracking,
  deleteProgressTracking,
  getUserProgressTracking,
} from '../controllers/progressTrackingController';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  validateAddProgressTracking,
  validateUpdateProgressTracking,
} from '../middleware/progressValidation';

const router = Router();

// Add progress tracking
router.post('', authenticateToken, validateAddProgressTracking, addProgressTracking);

// Update progress tracking
router.put('/:id', authenticateToken, validateUpdateProgressTracking, updateProgressTracking);

// Delete progress tracking
router.delete('/:id', authenticateToken, deleteProgressTracking);

// Get user progress tracking
router.get('/:userId', authenticateToken, getUserProgressTracking);

export default router;
