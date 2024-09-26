import { Router } from 'express';
import {
    getAllNutritionMeals,
    createNutritionMeal,
    updateNutritionMeal,
    deleteNutritionMeal
} from '../controllers/nutritionMealController';
import { authenticateToken } from '../middleware/authMiddleware';
import { nutritionMealValidation } from '../middleware/nutritionMealValidation';

const nutritionMealsRouter = Router();

nutritionMealsRouter.get('/', authenticateToken, getAllNutritionMeals); // GET all nutrition meals (with filtering, pagination, etc.)
nutritionMealsRouter.post('/', authenticateToken, nutritionMealValidation, createNutritionMeal); // CREATE a nutrition meal
nutritionMealsRouter.put('/:id', authenticateToken, nutritionMealValidation, updateNutritionMeal); // UPDATE a nutrition meal by ID
nutritionMealsRouter.delete('/:id', authenticateToken, deleteNutritionMeal); // DELETE a nutrition meal by ID

export default nutritionMealsRouter;
