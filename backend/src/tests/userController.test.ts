import request from 'supertest';
import app from '../index';
import User from '../models/User';
import { successResponse, errorResponse } from '../utils/responseFormat';
import { generateToken } from '../middleware/authMiddleware';
import mongoose from 'mongoose';
import { closeServer } from '../config/db';

// Jest Mocks
jest.mock('../models/User');
jest.mock('nodemailer');

beforeAll(async () => {
  // Use a testing database URI
  const testDbUri = '123456'; // Ensure to set this in your test environment
  await mongoose.connect(testDbUri!);
});

afterAll(async () => {
  await mongoose.disconnect();
  closeServer(); // Ensure the server closes
});

// Optional: Reset the database state before each test
beforeEach(async () => {
  await User.deleteMany({}); // Clear users collection for isolation
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
        save: jest.fn().mockResolvedValue(true), // Ensure save resolves successfully
      };

      (User.findOne as jest.Mock).mockResolvedValue(null); // No existing user
      (User.prototype.setPassword as jest.Mock).mockResolvedValue(undefined); // Mock setPassword
      (User.prototype.save as jest.Mock).mockResolvedValue(mockUser); // Mock save

      const response = await request(app).post('/api/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        profile: {},
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        successResponse(expect.any(Object), 'User registered successfully')
      );
    });

    it('should return 400 if email already exists', async () => {
      (User.findOne as jest.Mock).mockResolvedValueOnce({}); // Existing user

      const response = await request(app).post('/api/register').send({
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

      const response = await request(app).post('/api/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        successResponse(expect.any(Object), 'Login successful')
      );
    });

    it('should return 400 for invalid email/password', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null); // No user found

      const response = await request(app).post('/api/login').send({
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
        profile: {},
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
      expect(response.body).toEqual(
        successResponse(
          {
            _id: '123456',
            username: 'updateduser',
            email: 'test@example.com',
            profile: {},
          },
          'Profile updated successfully'
        )
      );
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
      expect(response.body).toEqual(errorResponse('User ID is required')); // Adjusted message
    });
  });

  describe('POST /api/forget-password', () => {
    it('should return 400 if user does not exist', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null); // No user found

      const response = await request(app).post('/api/forget-password').send({
        email: 'notfound@example.com',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(
        errorResponse('User with this email does not exist')
      );
    });
  });

  describe('POST /api/reset-password/:resetToken', () => {
    it('should return 400 for invalid or expired token', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null); // Token not valid

      const response = await request(app)
        .post('/api/reset-password/invalidToken')
        .send({ password: 'newpassword123' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(
        errorResponse('Password reset token is invalid or has expired')
      );
    });
  });
});
