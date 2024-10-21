import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/responseFormat';
import User from '../models/User'; // Import your User model

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

export const generateToken = (user: any) => {
  return jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const generateRefreshToken = (user: any) => {
  return jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  }); // Refresh token valid for 7 days
};

export const authenticateToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json(errorResponse('Access token is missing'));
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    if (decoded) {
      // Fetch the user from the database using the decoded userId
      const user = await User.findById(decoded.userId);

      // If user is not found, return a 401 Unauthorized error
      if (!user) {
        return res
          .status(401)
          .json(errorResponse('User not found or unauthorized'));
      }

      // Attach the user to the request object for further use
      req.user = { userId: user._id, role: user.role }; // You can attach more user properties if needed
      next(); // Proceed to the next middleware or route handler
    } else {
      return res.status(401).json(errorResponse('Invalid or expired token'));
    }
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json(errorResponse('Invalid or expired token', error));
  }
};
