import { body } from 'express-validator';

export const challengeValidation = [
    body('title').notEmpty().withMessage('Title is required').isString().withMessage('Title must be a string'),
    body('description').notEmpty().withMessage('Description is required').isString().withMessage('Description must be a string'),
    body('startDate').notEmpty().withMessage('Start date is required').isISO8601().withMessage('Start date must be a valid date'),
    body('endDate').notEmpty().withMessage('End date is required').isISO8601().withMessage('End date must be a valid date'),
    body('participants').isArray().withMessage('Participants must be an array of user IDs'),
    body('participants.*').isMongoId().withMessage('Invalid user ID for participant'),
];
