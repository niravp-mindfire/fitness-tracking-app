import request from 'supertest';
import app from '../index'; // Import your Express app
import ProgressTracking from '../models/ProgressTracking'; // Adjust the path to your model
import mongoose from 'mongoose';
import { generateToken } from '../middleware/authMiddleware';
import { closeServer } from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

let token: string;
const mockUserId = new mongoose.Types.ObjectId(); // Generate a valid ObjectId

beforeAll(async () => {
  // Use a testing database URI
  const testDbUri = process.env.TEST_MONGO_URI; // Ensure to set this in your test environment
  await mongoose.connect(testDbUri!);

  // Generate a JWT token for authentication
  const mockUser = {
    _id: mockUserId,
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
  };
  token = 'Bearer ' + generateToken(mockUser); // Generate token for authenticated requests
});

afterAll(async () => {
  // Clean up your test database if necessary
  await ProgressTracking.deleteMany({});
  await mongoose.disconnect();
  closeServer(); // Ensure the server closes
});

// Mock Progress Tracking data with all required fields
const mockProgressTracking = {
  userId: mockUserId,
  date: new Date(),
  duration: 30, // Example duration in minutes
  notes: 'Felt great after the workout!',
  weight: 75, // Ensure required field is included
};

describe('Progress Tracking API', () => {
  // Test GET all progress tracking entries
  it('GET /api/progress-tracking - should retrieve all progress tracking entries', async () => {
    const response = await request(app)
      .get('/api/progress-tracking')
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('progressTracking'); // Adjusted to match response structure
  });

  // Test GET progress tracking by ID
  it('GET /api/progress-tracking/:id - should retrieve a progress tracking entry by ID', async () => {
    const progressTracking: any =
      await ProgressTracking.create(mockProgressTracking);

    const response = await request(app)
      .get(`/api/progress-tracking/${progressTracking._id}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty(
      '_id',
      progressTracking._id.toString()
    );
  });

  // Test POST create progress tracking entry
  it('POST /api/progress-tracking - should create a new progress tracking entry', async () => {
    const response = await request(app)
      .post('/api/progress-tracking')
      .set('Authorization', token)
      .send(mockProgressTracking);

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('_id');
  });

  // Test POST create progress tracking entry with invalid data
  it('POST /api/progress-tracking - should return 400 for invalid data', async () => {
    const response = await request(app)
      .post('/api/progress-tracking')
      .set('Authorization', token)
      .send({
        // Missing required fields for testing invalid data
        userId: mockUserId,
        duration: -10, // Invalid duration
        weight: 75, // Include weight field to avoid validation error
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Validation failed');
  });

  // Test PUT update progress tracking entry
  it('PUT /api/progress-tracking/:id - should update an existing progress tracking entry', async () => {
    const progressTracking =
      await ProgressTracking.create(mockProgressTracking);

    const response = await request(app)
      .put(`/api/progress-tracking/${progressTracking._id}`)
      .set('Authorization', token)
      .send({
        duration: 45, // Updated duration
        notes: 'Updated note after workout.',
        weight: 80, // Include weight to avoid validation error
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty(
      'notes',
      'Updated note after workout.'
    ); // Optional: also check the notes
  });

  // Test DELETE a progress tracking entry
  it('DELETE /api/progress-tracking/:id - should delete a progress tracking entry', async () => {
    const progressTracking =
      await ProgressTracking.create(mockProgressTracking);

    const response = await request(app)
      .delete(`/api/progress-tracking/${progressTracking._id}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      'Progress tracking deleted successfully'
    );
  });

  // Test GET a non-existent progress tracking entry by ID
  it('GET /api/progress-tracking/:id - should return 404 for non-existent entry', async () => {
    const response = await request(app)
      .get('/api/progress-tracking/60c72b2f9b1e8a001c8d4b99') // Non-existent ID
      .set('Authorization', token);

    expect(response.status).toBe(404);
    expect(response.body.message).toContain('Progress tracking not found');
  });
});
