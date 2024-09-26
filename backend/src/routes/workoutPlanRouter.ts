import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateWorkoutPlan } from '../middleware/workoutPlanValidation';
import {
    getAllWorkoutPlans,
    getWorkoutPlanById,
    createWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan
} from '../controllers/workoutPlanController';

const workoutPlanRouter = Router();

// Apply token authentication middleware for all routes
workoutPlanRouter.use(authenticateToken);

// Routes
workoutPlanRouter.get('/', getAllWorkoutPlans);  // Get all workout plans with filters
workoutPlanRouter.get('/:id', getWorkoutPlanById); // Get specific workout plan by ID
workoutPlanRouter.post('/', validateWorkoutPlan, createWorkoutPlan); // Create new workout plan
workoutPlanRouter.put('/:id', validateWorkoutPlan, updateWorkoutPlan); // Update workout plan by ID
workoutPlanRouter.delete('/:id', deleteWorkoutPlan); // Delete workout plan by ID

export default workoutPlanRouter;
