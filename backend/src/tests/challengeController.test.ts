import request from 'supertest';
import app, { closeServer } from '../index';
import mongoose from 'mongoose';
import Challenge from '../models/Challenges';
import { generateToken } from '../controllers/userController';

const testChallenge = {
    title: 'Test Challenge',
    description: 'This is a test challenge',
    startDate: '2024-10-10T00:00:00Z',
    endDate: '2024-10-20T00:00:00Z',
    participants: [],
};

let token: string;

beforeAll(async () => {
    // Create a test token (replace with your user creation logic)
    token = 'Bearer ' + await createTestUserAndGetToken();
});
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
    // No need to listen again here
});

afterAll(async () => {
    await mongoose.disconnect();
    closeServer(); // ensure the server closes
});
const createTestUserAndGetToken = async () => {
    const mockUser = {
        _id: '123456',
        username: 'updateduser',
        email: 'test@example.com',
    };
    return generateToken(mockUser)
};

describe('Challenges API', () => {
    describe('GET /api/challenges', () => {
        it('should retrieve all challenges', async () => {
            await request(app)
                .get('/api/challenges')
                .set('Authorization', token)
                .expect(200)
                .expect(res => {
                    expect(res.body.status).toBe('success');
                });
        });
    });

    describe('POST /api/challenges', () => {
        it('should create a new challenge', async () => {
            const response = await request(app)
                .post('/api/challenges')
                .set('Authorization', token)
                .send(testChallenge)
                .expect(201);

            expect(response.body.status).toBe('success');
            expect(response.body.data.title).toBe(testChallenge.title);
        });

        it('should return validation errors for invalid data', async () => {
            const response = await request(app)
                .post('/api/challenges')
                .set('Authorization', token)
                .send({}) // Send empty data
                .expect(400);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Invalid data');
        });
    });

    describe('GET /api/challenges/:id', () => {
        it('should retrieve a challenge by ID', async () => {
            const createdChallenge = await Challenge.create(testChallenge);
            const response = await request(app)
                .get(`/api/challenges/${createdChallenge._id}`)
                .set('Authorization', token)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.title).toBe(testChallenge.title);
        });

        it('should return 404 if challenge not found', async () => {
            const invalidId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .get(`/api/challenges/${invalidId}`)
                .set('Authorization', token)
                .expect(404);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Challenge not found');
        });
    });

    describe('PUT /api/challenges/:id', () => {
        it('should update an existing challenge', async () => {
            const createdChallenge = await Challenge.create(testChallenge);
            const updatedChallengeData = { ...testChallenge, title: 'Updated Challenge' };

            const response = await request(app)
                .put(`/api/challenges/${createdChallenge._id}`)
                .set('Authorization', token)
                .send(updatedChallengeData)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.title).toBe(updatedChallengeData.title);
        });

        it('should return 404 if challenge not found', async () => {
            const invalidId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .put(`/api/challenges/${invalidId}`)
                .set('Authorization', token)
                .send(testChallenge)
                .expect(404);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Challenge not found');
        });
    });

    describe('DELETE /api/challenges/:id', () => {
        it('should delete a challenge by ID', async () => {
            const createdChallenge = await Challenge.create(testChallenge);
            const response = await request(app)
                .delete(`/api/challenges/${createdChallenge._id}`)
                .set('Authorization', token)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('Challenge deleted successfully');
        });

        it('should return 404 if challenge not found', async () => {
            const invalidId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .delete(`/api/challenges/${invalidId}`)
                .set('Authorization', token)
                .expect(404);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Challenge not found');
        });
    });
});