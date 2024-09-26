import { Request, Response } from 'express';
import Nutrition from '../models/Nutrition';
import { errorResponse, successResponse } from '../config/responseFormat';
import { validationResult } from 'express-validator';

// GET all nutrition entries (with optional filtering by date, pagination, sorting)
export const getAllNutritions = async (req: any, res: Response) => {
    try {
        const userId = req?.user?.userId;
        const {
            startDate,
            endDate,
            sort = 'date', // Default sorting by 'date'
            order = 'desc', // Default sort order descending
            page = 1,
            limit = 10
        } = req.query;

        const query: any = { userId };

        // Filter by date range
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate as string);
            if (endDate) query.date.$lte = new Date(endDate as string);
        }

        // Pagination and Sorting
        const skip = (Number(page) - 1) * Number(limit);
        const sortOrder = order === 'asc' ? 1 : -1;

        // Fetch nutritions
        const nutritions = await Nutrition.find(query)
            .sort({ [sort as string]: sortOrder })
            .skip(skip)
            .limit(Number(limit));

        const total = await Nutrition.countDocuments(query);

        res.status(200).json(successResponse({
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
            nutritions
        }, 'Nutritions retrieved successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error fetching nutritions', error));
    }
};

// POST a new nutrition entry
export const createNutrition = async (req: any, res: Response) => {
    const userId = req?.user?.userId;

    // Validate incoming request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errorResponse('Invalid data', errors.array()));
    }

    const { date, notes } = req.body;

    try {
        const newNutrition = new Nutrition({
            userId,
            date,
            notes,
        });

        const savedNutrition = await newNutrition.save();
        res.status(201).json(successResponse(savedNutrition, 'Nutrition entry created successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error creating nutrition entry', error));
    }
};

// PUT (update) an existing nutrition entry by ID
export const updateNutrition = async (req: any, res: Response) => {
    const { id } = req.params;
    const userId = req?.user?.userId;

    try {
        const nutrition = await Nutrition.findById(id);

        if (!nutrition || String(nutrition.userId) !== userId) {
            return res.status(404).json(errorResponse('Nutrition entry not found or unauthorized'));
        }

        const updatedData = req.body;

        // Update the fields
        nutrition.date = updatedData.date || nutrition.date;
        nutrition.notes = updatedData.notes || nutrition.notes;
        nutrition.updatedAt = new Date();

        await nutrition.save();
        res.status(200).json(successResponse(nutrition, 'Nutrition entry updated successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error updating nutrition entry', error));
    }
};

// DELETE a nutrition entry by ID
export const deleteNutrition = async (req: any, res: Response) => {
    const { id } = req.params;
    const userId = req?.user?.userId;

    try {
        const nutrition = await Nutrition.findById(id);

        if (!nutrition || String(nutrition.userId) !== userId) {
            return res.status(404).json(errorResponse('Nutrition entry not found or unauthorized'));
        }

        await Nutrition.findByIdAndDelete(id);
        res.status(200).json(successResponse(null, 'Nutrition entry deleted successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error deleting nutrition entry', error));
    }
};
