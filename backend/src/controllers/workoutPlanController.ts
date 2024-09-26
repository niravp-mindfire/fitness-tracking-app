import { Request, Response } from 'express';
import WorkoutPlan from '../models/WorkoutPlans';
import { errorResponse, successResponse } from '../config/responseFormat';

// GET all workout plans with pagination, search, sorting, and date filtering
export const getAllWorkoutPlans = async (req: any, res: Response) => {
    try {
        const {
            search = '',
            sort = 'createdAt',
            order = 'desc',
            page = 1,
            limit = 10,
            startDate,
            endDate,
        } = req.query;

        const userId = req.user.userId;

        // Create query object
        const query: any = { userId };

        // Search by title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        // Filter by date range
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const skip = (Number(page) - 1) * Number(limit);
        const sortOrder = order === 'asc' ? 1 : -1;

        const workoutPlans = await WorkoutPlan.find(query)
            .sort({ [sort as string]: sortOrder })
            .skip(skip)
            .limit(Number(limit));

        const total = await WorkoutPlan.countDocuments(query);

        res.status(200).json(successResponse({
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
            workoutPlans,
        }, 'Workout plans retrieved successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error fetching workout plans', error));
    }
};

// GET workout plan by ID
export const getWorkoutPlanById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const workoutPlan = await WorkoutPlan.findById(id).populate('exercises.exerciseId');
        if (!workoutPlan) {
            return res.status(404).json(errorResponse('Workout plan not found'));
        }
        res.status(200).json(successResponse(workoutPlan, 'Workout plan retrieved successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error fetching workout plan', error));
    }
};

// POST a new workout plan
export const createWorkoutPlan = async (req: any, res: Response) => {
    const { title, description, exercises, duration } = req.body;
    const userId = req.user.userId;

    try {
        const newWorkoutPlan = new WorkoutPlan({
            userId,
            title,
            description,
            exercises,
            duration,
        });

        const savedWorkoutPlan = await newWorkoutPlan.save();
        res.status(201).json(successResponse(savedWorkoutPlan, 'Workout plan created successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error creating workout plan', error));
    }
};

// PUT (update) an existing workout plan by ID
export const updateWorkoutPlan = async (req: any, res: Response) => {
    const { id } = req.params;
    const { title, description, exercises, duration } = req.body;
    const userId = req.user.userId;

    try {
        const workoutPlan = await WorkoutPlan.findOneAndUpdate(
            { _id: id, userId },
            { title, description, exercises, duration, updatedAt: new Date() },
            { new: true }
        );
        if (!workoutPlan) {
            return res.status(404).json(errorResponse('Workout plan not found'));
        }
        res.status(200).json(successResponse(workoutPlan, 'Workout plan updated successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error updating workout plan', error));
    }
};

// DELETE workout plan by ID
export const deleteWorkoutPlan = async (req: any, res: Response) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        const workoutPlan = await WorkoutPlan.findOneAndDelete({ _id: id, userId });
        if (!workoutPlan) {
            return res.status(404).json(errorResponse('Workout plan not found'));
        }
        res.status(200).json(successResponse(workoutPlan, 'Workout plan deleted successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error deleting workout plan', error));
    }
};
