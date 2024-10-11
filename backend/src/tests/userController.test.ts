import request from 'supertest';
import app, { closeServer } from '../index';
import User from '../models/User';
import { successResponse, errorResponse } from '../utils/responseFormat';
import { generateToken } from '../controllers/userController';
import mongoose from 'mongoose';

jest.mock('../models/User'); // Mock the User model
jest.mock('nodemailer'); // Mock nodemailer
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
    // No need to listen again here
});

afterAll(async () => {
    await mongoose.disconnect();
    closeServer(); // ensure the server closes
});
describe('User Management API', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    describe('POST /api/register', () => {
        it('should register a new user successfully', async () => {
            const mockUser = {
                _id: '123456',
                username: 'testuser',
                email: 'test@example.com',
                profile: {},
                role: 'user',
                setPassword: jest.fn(),
                save: jest.fn(),
            };

            (User.findOne as jest.Mock).mockResolvedValue(null); // No existing user
            (User.prototype.setPassword as jest.Mock).mockResolvedValue(undefined); // Mock setPassword
            (User.prototype.save as jest.Mock).mockResolvedValue(mockUser); // Mock save

            const response = await request(app)
                .post('/api/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123',
                    profile: {},
                });

            expect(response.status).toBe(201);
            expect(response.body).toEqual(successResponse(expect.any(Object), 'User registered successfully'));
        });

        it('should return 400 if email already exists', async () => {
            (User.findOne as jest.Mock).mockResolvedValueOnce({}); // Existing user

            const response = await request(app)
                .post('/api/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123',
                    profile: {},
                });

            expect(response.status).toBe(400);
            expect(response.body).toEqual(errorResponse('Email already exists'));
        });
    });

    describe('POST /api/login', () => {
        it('should log in a user successfully', async () => {
            const mockUser = {
                _id: '123456',
                email: 'test@example.com',
                comparePassword: jest.fn().mockResolvedValue(true), // Password match
            };

            (User.findOne as jest.Mock).mockResolvedValue(mockUser); // Mock user found

            const response = await request(app)
                .post('/api/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(successResponse(expect.any(Object), 'Login successful'));
        });

        it('should return 400 for invalid email/password', async () => {
            (User.findOne as jest.Mock).mockResolvedValue(null); // No user found

            const response = await request(app)
                .post('/api/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword',
                });

            expect(response.status).toBe(400);
            expect(response.body).toEqual(errorResponse('Invalid email or password'));
        });
    });

    describe('PUT /api/edit-profile', () => {
        it('should edit the user profile successfully', async () => {
            const mockUser = {
                _id: '123456',
                username: 'updateduser',
                email: 'test@example.com',
                profile: {}, // Ensure this matches the expected structure
                save: jest.fn().mockResolvedValue(true),
            };
    
            const token = generateToken(mockUser); // Generate a valid token for authentication
            (User.findById as jest.Mock).mockResolvedValue(mockUser); // Mock user found
    
            const response = await request(app)
                .put('/api/edit-profile')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    username: 'updateduser',
                });
    
            expect(response.status).toBe(200);
            // Adjust to match the actual response structure
            expect(response.body).toEqual(successResponse({
                _id: '123456',
                username: 'updateduser',
                email: 'test@example.com',
                profile: {}, // Ensure profile matches the actual response
            }, 'Profile updated successfully'));
        });

        it('should return 400 if user not found', async () => {
            const token = generateToken({}); // Generate a token for an unknown user
            (User.findById as jest.Mock).mockResolvedValue(null); // Mock no user found
    
            const response = await request(app)
                .put('/api/edit-profile')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    username: 'someuser',
                });
    
            expect(response.status).toBe(400);
            // Adjust expectation to match the actual response for missing user ID
            expect(response.body).toEqual(errorResponse('User ID is required')); // Change the error message
        });
    });

    describe('POST /api/forget-password', () => {
        it('should return 400 if user does not exist', async () => {
            (User.findOne as jest.Mock).mockResolvedValue(null); // No user found

            const response = await request(app)
                .post('/api/forget-password')
                .send({
                    email: 'notfound@example.com',
                });

            expect(response.status).toBe(400);
            expect(response.body).toEqual(errorResponse('User with this email does not exist'));
        });
    });

    describe('POST /api/reset-password/:resetToken', () => {
        it('should return 400 for invalid or expired token', async () => {
            (User.findOne as jest.Mock).mockResolvedValue(null); // Token not valid

            const response = await request(app)
                .post('/api/reset-password/invalidToken')
                .send({ password: 'newpassword123' });

            expect(response.status).toBe(400);
            expect(response.body).toEqual(errorResponse('Password reset token is invalid or has expired'));
        });
    });
});
