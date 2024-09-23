import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { errorResponse } from '../config/responseFormat';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

interface DecodedToken {
    userId: string;
    iat: number;
    exp: number;
}

export const authenticateToken = (req: any, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json(errorResponse('Access token is missing'));
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        if(decoded) {
            req.user = { userId: decoded?.userId };
            next();
        } else {
            return res.status(403).json(errorResponse('Invalid or expired token'));
        }
    } catch (error) {
        console.error(error);
        return res.status(403).json(errorResponse('Invalid or expired token', error));
    }
};