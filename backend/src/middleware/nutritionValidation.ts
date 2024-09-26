import { body } from 'express-validator';

export const nutritionValidation = [
    body('date').notEmpty().withMessage('Date is required').isDate().withMessage('Invalid date format'),
    body('notes').optional().isString().withMessage('Notes must be a string'),
];
