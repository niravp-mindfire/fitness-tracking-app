import { Router } from 'express';
import {
    getAllNutritions,
    createNutrition,
    updateNutrition,
    deleteNutrition
} from '../controllers/nutritionController';
import { authenticateToken } from '../middleware/authMiddleware';
import { nutritionValidation } from '../middleware/nutritionValidation';

const nutritionRouter = Router();

nutritionRouter.get('/', authenticateToken, getAllNutritions); // GET all nutritions (with filtering, pagination, etc.)
nutritionRouter.post('/', authenticateToken, nutritionValidation, createNutrition); // CREATE a nutrition entry
nutritionRouter.put('/:id', authenticateToken, nutritionValidation, updateNutrition); // UPDATE a nutrition entry by ID
nutritionRouter.delete('/:id', authenticateToken, deleteNutrition); // DELETE a nutrition entry by ID

export default nutritionRouter;
