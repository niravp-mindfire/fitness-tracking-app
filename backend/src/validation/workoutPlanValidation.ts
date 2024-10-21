import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { errorResponse } from '../utils/responseFormat';

export const validateWorkoutPlan = [
  body('title').isString().withMessage('Title is required').notEmpty(),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('exercises')
    .isArray()
    .withMessage('Exercises must be an array')
    .notEmpty(),
  body('duration')
    .isInt({ gt: 0 })
    .withMessage('Duration must be a positive integer'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(errorResponse('Validation error', errors.array()));
    }
    next();
  },
];
