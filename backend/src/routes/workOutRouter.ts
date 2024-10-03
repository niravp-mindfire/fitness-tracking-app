import { Router } from 'express';
import { getAllWorkouts, createWorkout, updateWorkout, deleteWorkout, getWorkoutById } from '../controllers/workOutController';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  validateCreateWorkout,
  validateUpdateWorkout,
  validateGetAllWorkouts,
  validateDeleteWorkout
} from '../middleware/workOutValidation';

const workOutRouter = Router();

// Apply authentication middleware to all routes
workOutRouter.use(authenticateToken);

// Route to get all workouts with query param validation
workOutRouter.get('/', authenticateToken, getAllWorkouts);

// Route to get workout by id
workOutRouter.get('/:id', authenticateToken, getWorkoutById)

// Route to create a workout with body validation
workOutRouter.post('/', validateCreateWorkout, authenticateToken,createWorkout);

// Route to update a workout with body validation
workOutRouter.put('/:id', validateUpdateWorkout, authenticateToken,updateWorkout);

// Route to delete a workout with ID param validation
workOutRouter.delete('/:id', validateDeleteWorkout, authenticateToken,deleteWorkout);

export default workOutRouter;
