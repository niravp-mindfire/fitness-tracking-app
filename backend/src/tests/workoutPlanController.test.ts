import request from 'supertest';
import app from '../index'; // Import your Express app
import WorkoutPlan from '../models/WorkoutPlans'; // Adjust the path to your model
import mongoose from 'mongoose';
import { generateToken } from '../middleware/authMiddleware';
import { closeServer } from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

let token: string;
const mockUserId = '123456'; // Generate a valid ObjectId

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
  await WorkoutPlan.deleteMany({});
  await mongoose.disconnect();
  closeServer(); // Ensure the server closes
});

// Mock Workout Plan data with all required fields
const mockWorkoutPlan = {
  userId: mockUserId,
  title: 'Test Workout Plan',
  description: 'A workout plan for testing purposes.',
  exercises: [
    { exerciseId: new mongoose.Types.ObjectId(), reps: 10, sets: 3 },
    { exerciseId: new mongoose.Types.ObjectId(), reps: 15, sets: 4 },
  ],
  duration: 60, // Duration in minutes
};

describe('Workout Plan API', () => {
  // Test GET all workout plans
  it('GET /api/workout-plan - should retrieve all workout plans', async () => {
    const response = await request(app)
      .get('/api/workout-plan')
      .set('Authorization', token);

    expect(response.status).toBe(200);
  });

  // Test GET workout plan by ID
  it('GET /api/workout-plan/:id - should retrieve a workout plan by ID', async () => {
    const workoutPlan: any = await WorkoutPlan.create(mockWorkoutPlan);

    const response = await request(app)
      .get(`/api/workout-plan/${workoutPlan._id}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty(
      '_id',
      workoutPlan._id.toString()
    );
  });

  // Test POST create workout plan
  it('POST /api/workout-plan - should create a new workout plan', async () => {
    const response = await request(app)
      .post('/api/workout-plan')
      .set('Authorization', token)
      .send(mockWorkoutPlan);

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('_id');
  });

  // Test POST create workout plan with invalid data
  it('POST /api/workout-plan - should return 400 for invalid data', async () => {
    const response = await request(app)
      .post('/api/workout-plan')
      .set('Authorization', token)
      .send({
        // Missing required fields for testing invalid data
        title: '', // Invalid title
        exercises: [], // Empty exercises array
        duration: -10, // Invalid duration
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Validation error');
  });

  // Test PUT update workout plan
  it('PUT /api/workout-plan/:id - should update an existing workout plan', async () => {
    const workoutPlan = await WorkoutPlan.create(mockWorkoutPlan);

    const response = await request(app)
      .put(`/api/workout-plan/${workoutPlan._id}`)
      .set('Authorization', token)
      .send({
        title: 'Updated Workout Plan',
        duration: 90, // Updated duration
        exercises: [
          { exerciseId: new mongoose.Types.ObjectId(), reps: 12, sets: 3 },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('title', 'Updated Workout Plan');
  });

  // Test DELETE a workout plan
  it('DELETE /api/workout-plan/:id - should delete a workout plan', async () => {
    const workoutPlan = await WorkoutPlan.create(mockWorkoutPlan);

    const response = await request(app)
      .delete(`/api/workout-plan/${workoutPlan._id}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Workout plan deleted successfully');
  });

  // Test GET a non-existent workout plan by ID
  it('GET /api/workout-plan/:id - should return 404 for non-existent entry', async () => {
    const response = await request(app)
      .get('/api/workout-plan/60c72b2f9b1e8a001c8d4b99') // Non-existent ID
      .set('Authorization', token);

    expect(response.status).toBe(404);
    expect(response.body.message).toContain('Workout plan not found');
  });
});
