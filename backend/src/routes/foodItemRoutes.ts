// src/routes/foodItemRoutes.ts
import { Router } from 'express';
import {
    getAllFoodItems,
    createFoodItem,
    updateFoodItem,
    deleteFoodItem,
} from '../controllers/foodItemController';
import { foodItemValidationRules } from '../middleware/foodItemValidation';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Routes for food items
router.get('/', authenticateToken, getAllFoodItems); // GET all food items
router.post('/', authenticateToken, foodItemValidationRules, createFoodItem); // CREATE a food item
router.put('/:id', authenticateToken, foodItemValidationRules, updateFoodItem); // UPDATE a food item
router.delete('/:id', authenticateToken, deleteFoodItem); // DELETE a food item

export default router;
