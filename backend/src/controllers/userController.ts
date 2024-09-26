import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { successResponse, errorResponse } from '../config/responseFormat';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1h';

// Register a new user
export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password, profile } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json(errorResponse('Email already exists'));
        }

        const newUser = new User({ username, email, profile });
        await newUser.setPassword(password);
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(201).json(successResponse({ token }, 'User registered successfully'));
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse('Error registering user', error));
    }
};

// Login user
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json(errorResponse('Invalid email or password'));
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json(errorResponse('Invalid email or password'));
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.json(successResponse({ token }, 'Login successful'));
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse('Error logging in', error));
    }
};

// Forget password - send email with reset link
export const forgetPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json(errorResponse('User with this email does not exist'));
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.setResetPasswordExpires();  // Custom method

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
        res.json(successResponse(null, 'Password reset link sent successfully'));
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse('Error sending reset link', error));
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
            return res.status(400).json(errorResponse('Password reset token is invalid or has expired'));
        }

        await user.setPassword(password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json(successResponse(null, 'Password reset successfully'));
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse('Error resetting password', error));
    }
};

// Edit profile
export const editProfile = async (req: any, res: Response) => {
    const { firstName, lastName, age, gender, height, weight, fitnessGoals, dob } = req.body;
    const userId = req?.user?.userId;

    try {
        // Check if userId is provided
        if (!userId) {
            return res.status(400).json(errorResponse('User ID is required'));
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json(errorResponse('User not found'));
        }

        // Update user profile
        user.profile = { firstName, lastName, age, gender, height, weight, dob };
        user.fitnessGoals = fitnessGoals || user.fitnessGoals;

        await user.save();

        res.json(successResponse(user, 'Profile updated successfully'));
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse('Error updating profile', error));
    }
};

// Get user profile based on token
export const getMyProfile = async (req: any, res: Response) => {
    const userId = req.user?.userId; // Get userId from the request

    try {
        // Check if userId is provided
        if (!userId) {
            return res.status(400).json(errorResponse('User ID is required'));
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json(errorResponse('User not found'));
        }

        res.json(successResponse(user, 'User profile retrieved successfully'));
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse('Error retrieving user profile', error));
    }
};
