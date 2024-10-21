import request from 'supertest';
import app from '../index';
import mongoose from 'mongoose';
import { generateToken } from '../middleware/authMiddleware';
import Exercise from '../models/Exercise';
import { closeServer } from '../config/db';

// Define the shape of the exercise data
interface ExerciseData {
  name: string;
  type: string;
  description: string;
  category: string;
}

let token: string;

beforeAll(async () => {
  const mockUser = {
    _id: '123456',
    username: 'updateduser',
    email: 'test@example.com',
  };
  // Generate the token
  token = 'Bearer ' + generateToken(mockUser);
});

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGO_URI!);
});

afterAll(async () => {
  await mongoose.disconnect();
  closeServer(); // Ensure the server closes
});

describe('Exercise API', () => {
  let exerciseId: string;

  // Test for creating an exercise
  it('POST /api/exercises - should create a new exercise', async () => {
    const newExercise: ExerciseData = {
      name: 'Push Up',
      type: 'Strength',
      description: 'A basic exercise for upper body strength.',
      category: 'Bodyweight',
    };

    const res = await request(app)
      .post('/api/exercises')
      .set('Authorization', token)
      .send(newExercise);

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('_id');
    exerciseId = res.body.data._id; // Save the exercise ID for future tests
  });

  // Test for getting all exercises
  it('GET /api/exercises - should return all exercises', async () => {
    const res = await request(app)
      .get('/api/exercises')
      .set('Authorization', token);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.exercises)).toBe(true);
  });

  // Test for getting a single exercise by ID
  it('GET /api/exercises/:id - should return a single exercise', async () => {
    const res = await request(app)
      .get(`/api/exercises/${exerciseId}`)
      .set('Authorization', token);

    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(exerciseId);
  });

  // Test for updating an exercise
  it('PUT /api/exercises/:id - should update the exercise', async () => {
    const updatedExercise: ExerciseData = {
      name: 'Push Up Modified',
      type: 'Strength',
      description: 'An updated description for the Push Up.',
      category: 'Bodyweight',
    };

    const res = await request(app)
      .put(`/api/exercises/${exerciseId}`)
      .set('Authorization', token)
      .send(updatedExercise);

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Push Up Modified');
  });

  // Test for deleting an exercise
  it('DELETE /api/exercises/:id - should delete the exercise', async () => {
    const res = await request(app)
      .delete(`/api/exercises/${exerciseId}`)
      .set('Authorization', token);

    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(exerciseId);
  });

  // Test for getting a non-existing exercise
  it('GET /api/exercises/:id - should return 404 for non-existing exercise', async () => {
    const res = await request(app)
      .get(`/api/exercises/${exerciseId}`)
      .set('Authorization', token);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Exercise not found');
  });
});
