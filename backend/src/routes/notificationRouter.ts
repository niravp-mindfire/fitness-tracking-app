import { Router } from 'express';
import {
  addNotification,
  updateNotification,
  getUserNotifications,
} from '../controllers/notificationController';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  validateAddNotification,
  validateUpdateNotification,
} from '../middleware/notificationValidation';

const notificationsRouter = Router();

// Add a new notification
notificationsRouter.post('/', authenticateToken, validateAddNotification, addNotification);

// Update notification status (isRead)
notificationsRouter.put('/:notificationId', authenticateToken, validateUpdateNotification, updateNotification);

// Get notifications for a user
notificationsRouter.get('/:userId', authenticateToken, getUserNotifications);

export default notificationsRouter;
