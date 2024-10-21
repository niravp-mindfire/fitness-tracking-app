import { check, validationResult } from 'express-validator';

// Validation for creating a new workout (POST)
export const validateCreateWorkout = [
  check('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  check('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer'),
  check('notes').optional().isString().withMessage('Notes must be a string'),
  (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for updating a workout (PUT)
export const validateUpdateWorkout = [
  check('date').optional().isISO8601().withMessage('Invalid date format'),
  check('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer'),
  check('notes').optional().isString().withMessage('Notes must be a string'),
  (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for getting workouts with query params (GET)
export const validateGetAllWorkouts = [
  check('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  check('limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Limit must be a positive integer'),
  check('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid startDate format'),
  check('endDate').optional().isISO8601().withMessage('Invalid endDate format'),
  check('sort')
    .optional()
    .isIn(['date', 'duration'])
    .withMessage('Sort must be either "date" or "duration"'),
  check('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be either "asc" or "desc"'),
  (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for deleting a workout (DELETE)
// No request body validation is needed for delete, as it only relies on the param (id) but we can validate the id param if necessary
export const validateDeleteWorkout = [
  check('id').isMongoId().withMessage('Invalid workout ID format'),
  (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
