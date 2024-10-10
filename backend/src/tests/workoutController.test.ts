import request from 'supertest';
import app, { PORT, closeServer } from '../index';
import mongoose from 'mongoose';
import { generateToken } from '../controllers/userController';

let token: string;
const mockUserId = new mongoose.Types.ObjectId(); // Generate a valid ObjectId
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
    // No need to listen again here
});

afterAll(async () => {
    await mongoose.disconnect();
    closeServer(); // ensure the server closes
});

beforeAll(async () => {
    const mockUser = {
        _id: mockUserId, // Use valid ObjectId
        username: 'updateduser',
        email: 'test@example.com',
    };
    // Generate the token and return it
    token = 'Bearer ' + generateToken(mockUser);
});

describe('Workout API', () => {
    let workoutId: string;

    // Test for creating a workout
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

    // Test for getting all workouts
    it('GET /api/workouts - should return all workouts', async () => {
        const res = await request(app)
            .get('/api/workouts')
            .set('Authorization', token);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data.workouts)).toBe(true);
    });

    // Test for getting a single workout by ID
    it('GET /api/workouts/:id - should return a single workout', async () => {
        const res = await request(app)
            .get(`/api/workouts/${workoutId}`)
            .set('Authorization', token);

        expect(res.status).toBe(200);
    });

    // Test for updating a workout
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

    // Test for deleting a workout
    it('DELETE /api/workouts/:id - should delete the workout', async () => {
        const res = await request(app)
            .delete(`/api/workouts/${workoutId}`)
            .set('Authorization', token);

        expect(res.status).toBe(200);
    });

    // Test for getting a non-existing workout
    it('GET /api/workouts/:id - should return 404 for non-existing workout', async () => {
        const res = await request(app)
            .get(`/api/workouts/${workoutId}`)
            .set('Authorization', token);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Workout not found');
    });
});