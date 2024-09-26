import { body } from 'express-validator';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../config/responseFormat';

// Middleware to handle validation errors
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errorResponse('Validation failed', errors.array()));
    }
    next();
};

// Validation for creating a new exercise
export const validateCreateExercise = [
    body('name').isString().withMessage('Name is required'),
    body('type').isString().withMessage('Type is required'),
    body('description').isString().withMessage('Description is required'),
    body('category').isString().withMessage('Category is required'),
    validateRequest,
];

// Validation for updating an existing exercise
export const validateUpdateExercise = [
    body('name').optional().isString().withMessage('Name must be a string'),
    body('type').optional().isString().withMessage('Type must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('category').optional().isString().withMessage('Category must be a string'),
    validateRequest,
];
