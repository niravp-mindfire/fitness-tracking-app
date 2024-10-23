import request from 'supertest';
import app from '../index';
import mongoose from 'mongoose';
import { generateToken } from '../middleware/authMiddleware';
import { closeServer, connectDB } from '../config/db';

let token: string;
const mockUserId = new mongoose.Types.ObjectId();

beforeAll(async () => {
  connectDB(process.env.TEST_MONGO_URI!, process.env.TEST_PORT, app);

  // Prepare a mock user to generate a token
  const mockUser = {
    _id: mockUserId,
    username: 'updateduser',
    email: 'test@example.com',
    role: 'user',
    test: true,
  };
  token = 'Bearer ' + generateToken(mockUser); // Generate token for authenticated requests
});

afterAll(async () => {
  await closeServer(); // Ensure the server closes
});

describe('Workout API', () => {
  let workoutId: string;

  it('POST /api/workouts - should create a new workout', async () => {
    const res = await request(app)
      .post('/api/workouts')
      .set('Authorization', token)
      .send({
        userId: mockUserId, // Use valid ObjectId for userId
        date: new Date(),
        duration: 30,
        notes: 'Test workout',
      });
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('_id');
    workoutId = res.body.data._id; // Save the workout ID for future tests
  });

  it('GET /api/workouts - should return all workouts', async () => {
    const res = await request(app)
      .get('/api/workouts')
      .set('Authorization', token);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.workouts)).toBe(true);
  });

  it('GET /api/workouts/:id - should return a single workout', async () => {
    const res = await request(app)
      .get(`/api/workouts/${workoutId}`)
      .set('Authorization', token);

    expect(res.status).toBe(200);
  });

  it('PUT /api/workouts/:id - should update the workout', async () => {
    const res = await request(app)
      .put(`/api/workouts/${workoutId}`)
      .set('Authorization', token)
      .send({
        userId: mockUserId, // Ensure to include userId again for update
        date: new Date(),
        duration: 45,
        notes: 'Updated workout notes',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.notes).toBe('Updated workout notes');
  });

  it('DELETE /api/workouts/:id - should delete the workout', async () => {
    const res = await request(app)
      .delete(`/api/workouts/${workoutId}`)
      .set('Authorization', token);

    expect(res.status).toBe(200);
  });

  it('GET /api/workouts/:id - should return 404 for non-existing workout', async () => {
    const res = await request(app)
      .get(`/api/workouts/${workoutId}`)
      .set('Authorization', token);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Workout not found');
  });
});
