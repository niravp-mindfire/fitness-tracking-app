import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { successResponse, errorResponse } from '../utils/responseFormat';
import {
  generateToken,
  generateRefreshToken,
} from '../middleware/authMiddleware';
import { Messages, StatusCodes } from '../utils/constants';

// Register a new user
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, profile } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse(Messages.EMAIL_ALREADY_EXISTS));
    }

    const newUser = new User({ username, email, profile, role: 'user' });
    await newUser.setPassword(password);
    const refreshToken = generateRefreshToken(newUser);
    newUser.refreshToken = refreshToken;
    await newUser.save();

    const token = generateToken(newUser);
    res
      .status(StatusCodes.CREATED)
      .json(successResponse({ token }, Messages.USER_REGISTER_SUCCESS));
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(Messages.USER_REGISTER_ERROR, error));
  }
};

// Login user
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse(Messages.INVALID_EMAIL_PASSWORD));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse(Messages.INVALID_EMAIL_PASSWORD));
    }

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;

    res.json(
      successResponse(
        { token: accessToken, refreshToken, role: user?.role },
        Messages.LOGIN_SUCCESS
      )
    );
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(Messages.LOGIN_ERROR, error));
  }
};

// Forget password - send email with reset link
export const forgetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse(Messages.EMAIL_NOT_EXIST));
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.setResetPasswordExpires(); // Custom method

    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      text: `Please click the link to reset your password: ${req.headers.origin}/reset-password/${resetToken}`,
    };

    await transporter.sendMail(mailOptions);
    res.json(successResponse(null, Messages.RESET_LINK_SENT));
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse('Error sending reset link', error));
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  try {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse(Messages.PASSWORD_RESET_TOKEN_INVALID));
    }

    await user.setPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json(successResponse(null, Messages.PASSWORD_RESET_SUCCESS));
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(Messages.PASSWORD_RESET_ERROR, error));
  }
};

// Edit profile
export const editProfile = async (req: any, res: Response) => {
  const {
    firstName,
    lastName,
    age,
    gender,
    height,
    weight,
    fitnessGoals,
    dob,
  } = req.body;
  const userId = req?.user?.userId;

  try {
    // Check if userId is provided
    if (!userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse(Messages.USER_ID_REQUIRED));
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(errorResponse(Messages.USER_NOT_FOUND));
    }

    // Update user profile
    user.profile = { firstName, lastName, age, gender, height, weight, dob };
    user.fitnessGoals = fitnessGoals || user.fitnessGoals;

    await user.save();

    res.json(successResponse(user, Messages.PROFILE_UPDATED_SUCCESS));
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(Messages.PROFILE_UPDATE_ERROR, error));
  }
};

// Get user profile based on token
export const getMyProfile = async (req: any, res: Response) => {
  const userId = req.user?.userId; // Get userId from the request

  try {
    // Check if userId is provided
    if (!userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse(Messages.USER_ID_REQUIRED));
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(errorResponse(Messages.USER_NOT_FOUND));
    }

    res.json(successResponse(user, 'User profile retrieved successfully'));
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse('Error retrieving user profile', error));
  }
};

// Get all users
export const getAllUsers = async (req: any, res: Response) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    if (!users) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(errorResponse(Messages.USER_NOT_FOUND));
    }

    res.json(successResponse(users, 'Users retrieved successfully'));
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse('Error retrieving users', error));
  }
};

// Refresh access token
export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(errorResponse(Messages.REFRESH_TOKEN_MISSING));
  }

  try {
    // Verify the refresh token
    const decoded: any = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET || 'your_jwt_secret'
    );

    if (!decoded || !decoded.userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(errorResponse(Messages.TOKEN_INVALID));
    }

    // Find the user by the decoded userId
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(errorResponse(Messages.USER_NOT_FOUND));
    }

    // Verify if the refresh token matches the one stored in the user model
    if (user.refreshToken !== refreshToken) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json(errorResponse(Messages.REFRESH_TOKEN_INVALID));
    }

    // Generate a new access token
    const newAccessToken = generateToken(user);

    return res.json(
      successResponse(
        { token: newAccessToken },
        Messages.ACCESS_TOKEN_REFRESHED
      )
    );
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(errorResponse(Messages.TOKEN_INVALID, error));
  }
};
