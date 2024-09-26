import { Router } from 'express';
import {
    getAllMealPlans,
    createMealPlan,
    updateMealPlan,
    deleteMealPlan
} from '../controllers/mealPlanController';
import { authenticateToken } from '../middleware/authMiddleware';
import { mealPlanValidation } from '../middleware/mealPlanValidation';

const mealPlanRouter = Router();

mealPlanRouter.get('/', authenticateToken, getAllMealPlans); // GET all meal plans with filtering, pagination, etc.
mealPlanRouter.post('/', authenticateToken, mealPlanValidation, createMealPlan); // CREATE a meal plan
mealPlanRouter.put('/:id', authenticateToken, mealPlanValidation, updateMealPlan); // UPDATE a meal plan by ID
mealPlanRouter.delete('/:id', authenticateToken, deleteMealPlan); // DELETE a meal plan by ID

export default mealPlanRouter;
