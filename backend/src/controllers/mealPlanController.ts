import { Request, Response } from 'express';
import MealPlan from '../models/MealPlans';
import { errorResponse, successResponse } from '../config/responseFormat';
import { validationResult } from 'express-validator';

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

        // Query meal plans
        const mealPlans = await MealPlan.find(query)
            .sort({ [sort as string]: sortOrder })
            .skip(skip)
            .limit(Number(limit));

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
            return res.status(404).json(errorResponse('Meal plan not found or unauthorized'));
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
            return res.status(404).json(errorResponse('Meal plan not found or unauthorized'));
        }

        await MealPlan.findByIdAndDelete(id);
        res.status(200).json(successResponse(null, 'Meal plan deleted successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error deleting meal plan', error));
    }
};
