import request from 'supertest';
import app from '../index'; // Assuming your Express app is exported from index.ts
import mongoose from 'mongoose';
import FoodItem from '../models/FoodItem';
import { closeServer } from '../config/db';
import { generateToken } from '../middleware/authMiddleware';

interface Macronutrients {
  proteins: number;
  carbohydrates: number;
  fats: number;
}

interface FoodItemData {
  name: string;
  calories: number;
  macronutrients: Macronutrients;
}

// Sample food item data
const mockFoodItem: FoodItemData = {
  name: 'Test Food',
  calories: 250,
  macronutrients: {
    proteins: 10,
    carbohydrates: 30,
    fats: 5,
  },
};

let foodItemId: string;
let token: string; // Mock token for authentication

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.TEST_MONGO_URI!, {});
  }

  // Create a mock food item to use in tests
  const foodItem: any = await FoodItem.create(mockFoodItem);
  foodItemId = foodItem._id.toString();

  // Mock user token (implement your token generation logic)
  token = 'Bearer ' + generateToken({ id: '123456' });
});

afterAll(async () => {
  // Cleanup: Delete the mock food item and disconnect from DB
  await FoodItem.deleteMany({});
  await mongoose.disconnect();
  closeServer(); // Close the server after tests
});

describe('Food Item API', () => {
  it('GET /api/food-items - should retrieve all food items', async () => {
    const response = await request(app)
      .get('/api/food-items')
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.data.foodItems).toHaveLength(1); // Should contain one item
    expect(response.body.data.foodItems[0]).toHaveProperty(
      'name',
      mockFoodItem.name
    );
  });

  it('GET /api/food-items/:id - should retrieve a food item by ID', async () => {
    const response = await request(app)
      .get(`/api/food-items/${foodItemId}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('name', mockFoodItem.name);
  });

  it('POST /api/food-items - should create a new food item', async () => {
    const newFoodItem: FoodItemData = {
      name: 'New Food',
      calories: 200,
      macronutrients: {
        proteins: 5,
        carbohydrates: 40,
        fats: 3,
      },
    };

    const response = await request(app)
      .post('/api/food-items')
      .set('Authorization', token)
      .send(newFoodItem);

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('name', newFoodItem.name);
  });

  it('PUT /api/food-items/:id - should update an existing food item', async () => {
    const updatedFoodItem: FoodItemData = {
      name: 'Updated Food',
      calories: 300,
      macronutrients: {
        proteins: 15,
        carbohydrates: 35,
        fats: 10,
      },
    };

    const response = await request(app)
      .put(`/api/food-items/${foodItemId}`)
      .set('Authorization', token)
      .send(updatedFoodItem);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('name', updatedFoodItem.name);
  });

  it('DELETE /api/food-items/:id - should delete a food item', async () => {
    const response = await request(app)
      .delete(`/api/food-items/${foodItemId}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Food item deleted successfully');
  });

  it('GET /api/food-items/:id - should return 404 for a non-existent food item', async () => {
    const response = await request(app)
      .get('/api/food-items/60d0fe4f5311236168a109ca') // Assuming this ID does not exist
      .set('Authorization', token);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Food item not found');
  });
});
