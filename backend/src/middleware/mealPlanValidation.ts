import { body } from 'express-validator';

export const mealPlanValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('meals').isArray({ min: 1 }).withMessage('Meals are required'),
    body('meals.*.mealType').notEmpty().withMessage('Meal type is required for each meal'),
    body('meals.*.foodItems').isArray({ min: 1 }).withMessage('Food items are required for each meal'),
    body('meals.*.foodItems.*.foodId').notEmpty().withMessage('Food ID is required for each food item'),
    body('meals.*.foodItems.*.quantity').isNumeric().withMessage('Quantity must be a number'),
    body('duration').isNumeric().withMessage('Duration must be a number'),
];
