import { body } from 'express-validator';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/responseFormat';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(errorResponse('Validation failed', errors.array()));
  }
  next();
};

// Validation for workout exercises
export const validateWorkoutExercise = [
  body('workoutId').isMongoId().withMessage('Invalid workout ID'),
  body('exerciseId').isMongoId().withMessage('Invalid exercise ID'),
  body('sets').isInt({ min: 1 }).withMessage('Sets must be a positive integer'),
  body('reps').isInt({ min: 1 }).withMessage('Reps must be a positive integer'),
  body('weight')
    .isFloat({ min: 0 })
    .withMessage('Weight must be a positive number'),
  validateRequest,
];
