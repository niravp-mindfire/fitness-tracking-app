// src/routes/foodItemRoutes.ts
import { Router } from 'express';
import {
    getAllFoodItems,
    createFoodItem,
    updateFoodItem,
    deleteFoodItem,
    getFoodItemById,
} from '../controllers/foodItemController';
import { authenticateToken } from '../middleware/authMiddleware';

const foodItemRoutes = Router();

// Routes for food items
foodItemRoutes.get('/', authenticateToken, getAllFoodItems);
foodItemRoutes.get('/:id', authenticateToken, getFoodItemById);
foodItemRoutes.post('/', authenticateToken, createFoodItem);
foodItemRoutes.put('/:id', authenticateToken, updateFoodItem);
foodItemRoutes.delete('/:id', authenticateToken, deleteFoodItem);

export default foodItemRoutes;
