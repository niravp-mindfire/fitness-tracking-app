import { body, param } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/responseFormat';

export const validateNotificationRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errorResponse('Validation failed', errors.array()));
    }
    next();
};

export const validateAddNotification = [
    body('message').isString().notEmpty().withMessage('Message is required'),
    validateNotificationRequest,
];

export const validateUpdateNotification = [
    param('notificationId').isMongoId().withMessage('Invalid notification ID'),
    body('isRead').isBoolean().withMessage('isRead must be a boolean value'),
    validateNotificationRequest,
];