import { body, param } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/responseFormat';

export const validateProgressTrackingRequest = (
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

export const validateAddProgressTracking = [
  body('date').isISO8601().withMessage('Date must be in ISO8601 format'),
  body('weight')
    .isFloat({ min: 0 })
    .withMessage('Weight must be a positive number'),
  validateProgressTrackingRequest,
];

export const validateUpdateProgressTracking = [
  param('id').isMongoId().withMessage('Invalid progress tracking ID'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in ISO8601 format'),
  body('weight')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Weight must be a positive number'),
  validateProgressTrackingRequest,
];
