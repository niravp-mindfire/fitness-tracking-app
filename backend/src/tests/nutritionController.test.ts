import request from 'supertest';
import app, { closeServer } from '../index';
import Nutrition from '../models/Nutrition';
import mongoose from 'mongoose';
import { generateToken } from '../controllers/userController';

let token: string;
const mockUserId = new mongoose.Types.ObjectId();

beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(process.env.TEST_MONGO_URI!);
  const mockUser = {
    _id: mockUserId,
    username: 'testuser',
    email: 'test@example.com',
  };
  token = 'Bearer ' + generateToken(mockUser);
});

afterAll(async () => {
  await mongoose.disconnect();
  closeServer(); // Ensure the server closes
});

describe('Nutrition API', () => {
  beforeEach(async () => {
    // Clean up before each test
    await Nutrition.deleteMany({});
  });

  it('GET /api/nutritious - should retrieve all nutrition entries', async () => {
    await Nutrition.create({
      userId: mockUserId,
      date: '2024/11/10',
      notes: 'Test nutrition entry',
    });

    const response = await request(app)
      .get('/api/nutritious')
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.data.nutritions.length).toBe(1);
    expect(response.body.data.nutritions[0].notes).toBe('Test nutrition entry');
  });

  it('GET /api/nutritious/:id - should retrieve a nutrition entry by ID', async () => {
    const nutrition = await Nutrition.create({
      userId: mockUserId,
      date: '2024/11/10',
      notes: 'Another test entry',
    });

    const response = await request(app)
      .get(`/api/nutritious/${nutrition._id}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.data.notes).toBe('Another test entry');
  });

  it('POST /api/nutritious - should create a new nutrition entry', async () => {
    const nutritionData = {
      userId: mockUserId, // Ensure this field is included
      date: '2024/11/10', // Make sure the date is valid
      notes: 'New nutrition entry',
    };

    const response = await request(app)
      .post('/api/nutritious')
      .set('Authorization', token)
      .send(nutritionData);

    expect(response.status).toBe(201);
    expect(response.body.data.notes).toBe('New nutrition entry');
  });

  it('PUT /api/nutritious/:id - should update an existing nutrition entry', async () => {
    const nutrition = await Nutrition.create({
      userId: mockUserId,
      date: '2024/11/10',
      notes: 'Update me',
    });

    const updatedData = {
      notes: 'Updated nutrition entry',
    };

    const response = await request(app)
      .put(`/api/nutritious/${nutrition._id}`)
      .set('Authorization', token)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.data.notes).toBe('Updated nutrition entry');
  });

  it('DELETE /api/nutritious/:id - should delete a nutrition entry', async () => {
    const nutrition = await Nutrition.create({
      userId: mockUserId,
      date: '2024/11/10',
      notes: 'Delete me',
    });

    const response = await request(app)
      .delete(`/api/nutritious/${nutrition._id}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Nutrition entry deleted successfully');
  });

  it('GET /api/nutritious/:id - should return 404 for a non-existent nutrition entry', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/api/nutritious/${nonExistentId}`)
      .set('Authorization', token);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      'Nutrition entry not found or unauthorized'
    );
  });
});
