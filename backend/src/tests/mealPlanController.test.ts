import request from 'supertest';
import app from '../index';
import MealPlan from '../models/MealPlans';
import FoodItem from '../models/FoodItem';
import mongoose from 'mongoose';
import { generateToken } from '../controllers/userController';

let token: string;
const mockUserId = new mongoose.Types.ObjectId();

beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI!);
    const mockUser = {
        _id: mockUserId,
        username: 'updateduser',
        email: 'test@example.com',
    };
    token = 'Bearer ' + generateToken(mockUser);
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('Meal Plan API', () => {
    let validFoodItemId: mongoose.Types.ObjectId;

    beforeEach(async () => {
        // Create a valid FoodItem for the tests
        const foodItem = await FoodItem.create({
            name: 'Chicken Breast',
            macronutrients: {
                proteins: 30,
                carbohydrates: 0,
                fats: 3,
            },
            calories: 165,
        });
        validFoodItemId = foodItem._id as mongoose.Types.ObjectId;
    });

    afterEach(async () => {
        // Clean up after each test
        await MealPlan.deleteMany({});
        await FoodItem.deleteMany({});
    });

    it('GET /api/meal-plans - should retrieve all meal plans', async () => {
        await MealPlan.create({
            userId: mockUserId,
            title: 'Protein Packed Plan',
            duration: 7,
            meals: [
                {
                    mealType: 'Lunch',
                    foodItems: [
                        {
                            foodId: validFoodItemId,
                            quantity: 200,
                        },
                    ],
                },
            ],
        });

        const response = await request(app)
            .get('/api/meal-plans')
            .set('Authorization', token);

        expect(response.status).toBe(200);
        expect(response.body.data.mealPlans.length).toBe(1);
        expect(response.body.data.mealPlans[0].title).toBe('Protein Packed Plan');
    });

    it('GET /api/meal-plans/:id - should retrieve a meal plan by ID', async () => {
        const mealPlan = await MealPlan.create({
            userId: mockUserId,
            title: 'Balanced Diet Plan',
            duration: 14,
            meals: [
                {
                    mealType: 'Dinner',
                    foodItems: [
                        {
                            foodId: validFoodItemId,
                            quantity: 150,
                        },
                    ],
                },
            ],
        });

        const response = await request(app)
            .get(`/api/meal-plans/${mealPlan._id}`)
            .set('Authorization', token);

        expect(response.status).toBe(200);
        expect(response.body.data.title).toBe('Balanced Diet Plan');
    });

    it('POST /api/meal-plans - should create a new meal plan', async () => {
        const mealPlanData = {
            title: 'High Protein Plan',
            duration: 7,
            meals: [
                {
                    mealType: 'Lunch',
                    foodItems: [
                        {
                            foodId: validFoodItemId,
                            quantity: 200,
                        },
                    ],
                },
            ],
        };

        const response = await request(app)
            .post('/api/meal-plans')
            .set('Authorization', token)
            .send(mealPlanData);

        expect(response.status).toBe(201);
        expect(response.body.data.title).toBe('High Protein Plan');
    });

    it('PUT /api/meal-plans/:id - should update an existing meal plan', async () => {
        const mealPlan = await MealPlan.create({
            userId: mockUserId,
            title: 'Carb Control Plan',
            duration: 5,
            meals: [
                {
                    mealType: 'Breakfast',
                    foodItems: [
                        {
                            foodId: validFoodItemId,
                            quantity: 100,
                        },
                    ],
                },
            ],
        });

        const updatedData = {
            title: 'Carb Control Plan Updated',
            duration: 7,
        };

        const response = await request(app)
            .put(`/api/meal-plans/${mealPlan._id}`)
            .set('Authorization', token)
            .send(updatedData);

        expect(response.status).toBe(200);
        expect(response.body.data.title).toBe('Carb Control Plan Updated');
    });

    it('DELETE /api/meal-plans/:id - should delete a meal plan', async () => {
        const mealPlan = await MealPlan.create({
            userId: mockUserId,
            title: 'Quick Diet Plan',
            duration: 3,
            meals: [
                {
                    mealType: 'Snack',
                    foodItems: [
                        {
                            foodId: validFoodItemId,
                            quantity: 50,
                        },
                    ],
                },
            ],
        });

        const response = await request(app)
            .delete(`/api/meal-plans/${mealPlan._id}`)
            .set('Authorization', token);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Meal plan deleted successfully');
    });

    it('GET /api/meal-plans/:id - should return 404 for a non-existent meal plan', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .get(`/api/meal-plans/${nonExistentId}`)
            .set('Authorization', token);
            
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Meal plan not found');
    });
});
