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
  const payload = {
    _id: user?._id,
    username: user?.username,
    email: user?.email,
    role: user?.role,
  };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const generateRefreshToken = (user: any) => {
  const payload = {
    _id: user?._id,
    username: user?.username,
    email: user?.email,
    role: user?.role,
  };
  return jwt.sign(payload, JWT_SECRET, {
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
    const decoded: any = jwt.verify(token, JWT_SECRET) as DecodedToken;

    if (decoded) {
      const test = decoded.test || false;
      // Fetch the user from the database using the decoded userId
      if (!test) {
        const user = await User.findById(decoded._id);

        // If user is not found, return a 401 Unauthorized error
        if (!user) {
          return res
            .status(401)
            .json(errorResponse('User not found or unauthorized'));
        }

        // Attach the user to the request object for further use
        req.user = { userId: user._id, role: user.role }; // You can attach more user properties if needed
      } else {
        req.user = { userId: decoded._id, role: decoded.role };
      }
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
