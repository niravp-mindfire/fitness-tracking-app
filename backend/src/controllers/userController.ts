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

        const token = jwt.sign({ userId: user }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
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
        const resetPasswordExpires = new Date(Date.now() + 3600000);

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetPasswordExpires;

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
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                `${req.headers.origin}/reset-password/${resetToken}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
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
    const { resetToken } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json(errorResponse('Invalid or expired token'));
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

// Edit user profile including fitness goals
export const editProfile = async (req: any, res: Response) => {
    const {
        firstName,
        lastName,
        age,
        gender,
        height,
        weight,
        fitnessGoals
    } = req.body;

    const userId = req?.user?.userId;

    try {
        // Create an update object and only include fields that are present in the request
        const updateFields: any = {};

        if (firstName !== undefined) updateFields['profile.firstName'] = firstName;
        if (lastName !== undefined) updateFields['profile.lastName'] = lastName;
        if (age !== undefined) updateFields['profile.age'] = age;
        if (gender !== undefined) updateFields['profile.gender'] = gender;
        if (height !== undefined) updateFields['profile.height'] = height;
        if (weight !== undefined) updateFields['profile.weight'] = weight;
        if (fitnessGoals !== undefined) updateFields['fitnessGoals'] = fitnessGoals;

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                ...updateFields,
                updatedAt: Date.now() // Update timestamp
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json(errorResponse('User not found'));
        }

        res.json(successResponse(updatedUser, 'Profile updated successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error updating profile', error));
    }
};

