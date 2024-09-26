import { body } from 'express-validator';

export const nutritionMealValidation = [
    body('nutritionId').notEmpty().withMessage('Nutrition ID is required').isMongoId().withMessage('Invalid Nutrition ID'),
    body('mealType').notEmpty().withMessage('Meal type is required').isString().withMessage('Meal type must be a string'),
    body('foodItems').isArray({ min: 1 }).withMessage('At least one food item is required'),
    body('foodItems.*.foodId').notEmpty().withMessage('Food ID is required').isMongoId().withMessage('Invalid Food ID'),
    body('foodItems.*.quantity').notEmpty().withMessage('Quantity is required').isInt({ min: 1 }).withMessage('Quantity must be at least 1 gram'),
];
