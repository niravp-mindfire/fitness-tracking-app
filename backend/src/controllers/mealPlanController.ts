import { Request, Response } from 'express';
import MealPlan from '../models/MealPlans';
import { errorResponse, successResponse } from '../config/responseFormat';
import { validationResult } from 'express-validator';
import FoodItem from '../models/FoodItem';

// GET all meal plans with optional search, pagination, and sorting
export const getAllMealPlans = async (req: any, res: Response) => {
    try {
        const userId = req?.user?.userId;
        const {
            search,
            sort = 'createdAt', // Default sort by 'createdAt'
            order = 'desc',      // Default sort order is descending
            page = 1,
            limit = 10
        } = req.query;

        const query: any = { userId };

        // Search by title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Pagination and Sorting
        const skip = (Number(page) - 1) * Number(limit);
        const sortOrder = order === 'asc' ? 1 : -1;

        // Query meal plans and populate meals with food data
        const mealPlans = await MealPlan.find(query)
            .sort({ [sort as string]: sortOrder })
            .skip(skip)
            .limit(Number(limit))
            .populate({
                path: 'meals.foodItems.foodId', // This is the nested population
                model: FoodItem,   // Assuming you have a Food model
                select: 'name' // Specify the fields you want to retrieve from the Food model
            });

        const total = await MealPlan.countDocuments(query);

        res.status(200).json(successResponse({
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
            mealPlans
        }, 'Meal plans retrieved successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error fetching meal plans', error));
    }
};

export const getMealPlanById = async (req: Request, res: Response) => {
    try {
        const mealPlanId = req.params.id;
        const mealPlan = await MealPlan.findById(mealPlanId).populate('meals.foodItems.foodId');
        
        if (!mealPlan) {
            return res.status(404).json({ message: 'Meal plan not found' });
        }

        res.status(200).json({
            success: true,
            data: mealPlan,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// POST a new meal plan
export const createMealPlan = async (req: any, res: Response) => {
    const userId = req?.user?.userId;

    // Validate incoming request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errorResponse('Invalid data', errors.array()));
    }

    const { title, description, meals, duration } = req.body;

    try {
        const newMealPlan = new MealPlan({
            userId,
            title,
            description,
            meals,
            duration
        });

        const savedMealPlan = await newMealPlan.save();
        res.status(201).json(successResponse(savedMealPlan, 'Meal plan created successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error creating meal plan', error));
    }
};

// PUT (update) an existing meal plan by ID
export const updateMealPlan = async (req: any, res: Response) => {
    const { id } = req.params;
    const userId = req?.user?.userId;

    try {
        const mealPlan = await MealPlan.findById(id);

        if (!mealPlan || String(mealPlan.userId) !== userId) {
            return res.status(404).json(errorResponse('Meal plan not found'));
        }

        const updatedData = req.body;
        const updatedMealPlan = await MealPlan.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

        res.status(200).json(successResponse(updatedMealPlan, 'Meal plan updated successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error updating meal plan', error));
    }
};

// DELETE a meal plan by ID
export const deleteMealPlan = async (req: any, res: Response) => {
    const { id } = req.params;
    const userId = req?.user?.userId;

    try {
        const mealPlan = await MealPlan.findById(id);

        if (!mealPlan || String(mealPlan.userId) !== userId) {
            return res.status(404).json(errorResponse('Meal plan not found'));
        }

        await MealPlan.findByIdAndDelete(id);
        res.status(200).json(successResponse(null, 'Meal plan deleted successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error deleting meal plan', error));
    }
};
