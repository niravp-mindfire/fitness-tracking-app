import { check, validationResult } from 'express-validator';

// Validation for user registration
export const validateRegisterUser = [
  check('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for user login
export const validateLoginUser = [
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),
  check('password').notEmpty().withMessage('Password is required'),
  (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for forgot password
export const validateForgetPassword = [
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),
  (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for resetting password
export const validateResetPassword = [
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateEditProfile = [
  check('firstName')
    .optional()
    .isString()
    .withMessage('First name must be a string'),
  check('lastName')
    .optional()
    .isString()
    .withMessage('Last name must be a string'),
  check('age')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Age must be a positive integer'),
  check('gender')
    .optional()
    .isIn(['Male', 'Female'])
    .withMessage('Invalid gender value'),
  check('dob')
    .optional()
    .isDate()
    .withMessage('Date of birth must be a valid date'),
  check('height')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Height must be a positive number'),
  check('weight')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Weight must be a positive number'),
  check('fitnessGoals')
    .optional()
    .isArray()
    .withMessage('Fitness goals must be an array')
    .custom((value) => {
      for (const goal of value) {
        if (typeof goal !== 'object' || goal === null) {
          throw new Error('Each fitness goal must be an object');
        }
        if (!goal.goalType || typeof goal.goalType !== 'string') {
          throw new Error('Goal type must be a non-empty string');
        }
        if (typeof goal.targetValue !== 'number' || goal.targetValue < 0) {
          throw new Error('Target value must be a positive number');
        }
        if (typeof goal.currentValue !== 'number' || goal.currentValue < 0) {
          throw new Error('Current value must be a positive number');
        }
        if (goal.targetDate && isNaN(Date.parse(goal.targetDate))) {
          throw new Error('Target date must be a valid date');
        }
      }
      return true; // All checks passed
    }),
  (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
