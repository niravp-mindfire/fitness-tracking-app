import { Request, Response } from 'express';
import Nutrition from '../models/Nutrition';
import { errorResponse, successResponse } from '../utils/responseFormat';
import { validationResult } from 'express-validator';
import { Messages } from '../utils/constants';

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
      limit = 10,
      search, // Optional search parameter
    } = req.query;

    const query: any = { userId };

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    // Search functionality (if applicable)
    if (search) {
      query.title = { $regex: search, $options: 'i' }; // Assuming 'title' is a field in your Nutrition model
    }

    // Sorting
    const sortOrder = order === 'asc' ? 1 : -1;

    // Handle -1 for page and limit to return all data
    let nutritions;
    const total = await Nutrition.countDocuments(query);

    if (Number(page) === -1 && Number(limit) === -1) {
      // If page and limit are -1, retrieve all nutritions
      nutritions = await Nutrition.find(query).sort({
        [sort as string]: sortOrder,
      });
    } else {
      // Pagination
      const skip = (Number(page) - 1) * Number(limit);
      nutritions = await Nutrition.find(query)
        .sort({ [sort as string]: sortOrder })
        .skip(skip)
        .limit(Number(limit));
    }

    res.status(200).json(
      successResponse(
        {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
          nutritions,
        },
        Messages.NUTRITION_RETRIEVED
      )
    );
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_FETCHING_NUTRITIONS, error));
  }
};

// GET a nutrition entry by ID
export const getNutritionById = async (req: any, res: Response) => {
  const { id } = req.params;
  const userId = req?.user?.userId;

  try {
    // Find the nutrition entry by ID
    const nutrition = await Nutrition.findById(id);

    // Check if the nutrition entry exists and if the user is authorized
    if (!nutrition || String(nutrition.userId) !== userId) {
      return res.status(404).json(errorResponse(Messages.NUTRITION_NOT_FOUND));
    }

    // Return the nutrition entry
    res
      .status(200)
      .json(successResponse(nutrition, Messages.NUTRITION_RETRIEVED));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_FETCHING_NUTRITIONS, error));
  }
};

// POST a new nutrition entry
export const createNutrition = async (req: any, res: Response) => {
  const userId = req?.user?.userId;

  // Validate incoming request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(errorResponse(Messages.INVALID_DATA, errors.array()));
  }

  const { date, notes } = req.body;

  try {
    const newNutrition = new Nutrition({
      userId,
      date,
      notes,
    });

    const savedNutrition = await newNutrition.save();
    res
      .status(201)
      .json(successResponse(savedNutrition, Messages.NUTRITION_CREATED));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_CREATING_NUTRITION, error));
  }
};

// PUT (update) an existing nutrition entry by ID
export const updateNutrition = async (req: any, res: Response) => {
  const { id } = req.params;
  const userId = req?.user?.userId;

  try {
    const nutrition = await Nutrition.findById(id);

    if (!nutrition || String(nutrition.userId) !== userId) {
      return res.status(404).json(errorResponse(Messages.NUTRITION_NOT_FOUND));
    }

    const updatedData = req.body;

    // Update the fields
    nutrition.date = updatedData.date || nutrition.date;
    nutrition.notes = updatedData.notes || nutrition.notes;
    nutrition.updatedAt = new Date();

    await nutrition.save();
    res
      .status(200)
      .json(successResponse(nutrition, Messages.NUTRITION_UPDATED));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_UPDATING_NUTRITION, error));
  }
};

// DELETE a nutrition entry by ID
export const deleteNutrition = async (req: any, res: Response) => {
  const { id } = req.params;
  const userId = req?.user?.userId;

  try {
    const nutrition = await Nutrition.findById(id);

    if (!nutrition || String(nutrition.userId) !== userId) {
      return res.status(404).json(errorResponse(Messages.NUTRITION_NOT_FOUND));
    }

    await Nutrition.findByIdAndDelete(id);
    res.status(200).json(successResponse(null, Messages.NUTRITION_DELETED));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_DELETING_NUTRITION, error));
  }
};
