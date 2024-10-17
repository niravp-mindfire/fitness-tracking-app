// nutritionMealController.test.ts
import request from 'supertest';
import app, { closeServer } from '../index'; // Import your Express app
import NutritionMeal from '../models/NutritionMeals';
import mongoose from 'mongoose';
import { generateToken } from '../controllers/userController';

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
    username: 'updateduser',
    email: 'test@example.com',
    role: 'user',
  };
  token = 'Bearer ' + generateToken(mockUser); // Generate token for authenticated requests
});

afterAll(async () => {
  // Clean up your test database if necessary
  await NutritionMeal.deleteMany({});
  await mongoose.disconnect();
  closeServer(); // Ensure the server closes
});

// Mock FoodItem data
const mockFoodItem = {
  foodId: '60c72b2f9b1e8a001c8d4b8e', // Replace with a valid food ID from your database
  quantity: 100,
};

// Mock NutritionMeal data
const mockNutritionMeal = {
  nutritionId: '60c72b2f9b1e8a001c8d4b8d', // Replace with a valid nutrition ID
  mealType: 'Breakfast',
  foodItems: [mockFoodItem],
  totalCalories: 500, // Ensure this field is included
};

describe('Nutrition Meals API', () => {
  // Test GET all nutrition meals
  it('GET /api/nutrition-meals - should retrieve all nutrition meals', async () => {
    const response = await request(app)
      .get('/api/nutrition-meals')
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
  });

  // Test GET nutrition meal by ID
  it('GET /api/nutrition-meals/:id - should retrieve a nutrition meal by ID', async () => {
    const nutritionMeal: any = await NutritionMeal.create(mockNutritionMeal);

    const response = await request(app)
      .get(`/api/nutrition-meals/${nutritionMeal._id}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty(
      '_id',
      nutritionMeal._id.toString()
    );
  });

  // Test POST create nutrition meal
  it('POST /api/nutrition-meals - should create a new nutrition meal', async () => {
    const response = await request(app)
      .post('/api/nutrition-meals')
      .set('Authorization', token)
      .send(mockNutritionMeal);

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('_id');
  });

  // Test POST create nutrition meal with invalid data
  it('POST /api/nutrition-meals - should return 400 for invalid data', async () => {
    const response = await request(app)
      .post('/api/nutrition-meals')
      .set('Authorization', token)
      .send({
        mealType: 'Breakfast',
        foodItems: [], // Invalid because it requires at least one food item
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      'At least one food item is required'
    );
  });

  // Test PUT update nutrition meal
  it('PUT /api/nutrition-meals/:id - should update an existing nutrition meal', async () => {
    const nutritionMeal = await NutritionMeal.create(mockNutritionMeal);
    const response = await request(app)
      .put(`/api/nutrition-meals/${nutritionMeal._id}`)
      .set('Authorization', token)
      .send({
        mealType: 'Lunch',
        foodItems: [mockFoodItem],
        totalCalories: 600, // Ensure this field is included for the update
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('mealType', 'Lunch');
  });

  // Test DELETE a nutrition meal
  it('DELETE /api/nutrition-meals/:id - should delete a nutrition meal', async () => {
    const nutritionMeal = await NutritionMeal.create(mockNutritionMeal);

    const response = await request(app)
      .delete(`/api/nutrition-meals/${nutritionMeal._id}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Nutrition meal deleted successfully');
  });

  // Test GET a non-existent nutrition meal by ID
  it('GET /api/nutrition-meals/:id - should return 404 for non-existent meal', async () => {
    const response = await request(app)
      .get('/api/nutrition-meals/60c72b2f9b1e8a001c8d4b99') // Non-existent ID
      .set('Authorization', token);

    expect(response.status).toBe(404);
    expect(response.body.message).toContain('Nutrition meal not found');
  });
});
