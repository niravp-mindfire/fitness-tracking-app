import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import FoodItem from '../models/FoodItem';
import { errorResponse, successResponse } from '../utils/responseFormat';
import { Messages } from '../utils/constants';

// GET all food items with optional search, sort, pagination
export const getAllFoodItems = async (req: Request, res: Response) => {
  try {
    const {
      search,
      sort = 'name',
      order = 'asc',
      page = 1,
      limit = 10,
    } = req.query;

    const query: any = {};

    // Search functionality
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Sorting
    const sortOrder = order === 'asc' ? 1 : -1;

    // Handle -1 for page and limit to return all data
    let foodItems;
    let total = await FoodItem.countDocuments(query);

    if (Number(page) === -1 && Number(limit) === -1) {
      // If page and limit are -1, retrieve all food items
      foodItems = await FoodItem.find(query).sort({
        [sort as string]: sortOrder,
      });
    } else {
      // Pagination
      const skip = (Number(page) - 1) * Number(limit);

      foodItems = await FoodItem.find(query)
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
          foodItems,
        },
        Messages.FOOD_ITEMS_RETRIEVED_SUCCESS
      )
    );
  } catch (err) {
    res.status(500).json(errorResponse(Messages.SERVER_ERROR, err));
  }
};

export const getFoodItemById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const foodItem = await FoodItem.findById(id);

    if (!foodItem) {
      return res.status(404).json(errorResponse(Messages.FOOD_ITEM_NOT_FOUND));
    }

    res
      .status(200)
      .json(successResponse(foodItem, Messages.FOOD_ITEM_RETRIEVED_SUCCESS));
  } catch (err) {
    res.status(500).json(errorResponse('Error fetching food item', err));
  }
};

// CREATE a new food item
export const createFoodItem = async (req: Request, res: Response) => {
  // Handle validation result
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(errorResponse(Messages.VALIDATION_ERROR, errors.array()));
  }

  try {
    const { name, calories, macronutrients } = req.body;

    const newFoodItem = new FoodItem({
      name,
      calories,
      macronutrients,
    });

    const savedFoodItem = await newFoodItem.save();
    res
      .status(201)
      .json(successResponse(savedFoodItem, Messages.FOOD_ITEM_CREATED_SUCCESS));
  } catch (err) {
    res.status(500).json(errorResponse('Error creating food item', err));
  }
};

// UPDATE an existing food item
export const updateFoodItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Handle validation result
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(errorResponse(Messages.VALIDATION_ERROR, errors.array()));
  }

  try {
    const { name, calories, macronutrients } = req.body;

    const updatedFoodItem = await FoodItem.findByIdAndUpdate(
      id,
      { name, calories, macronutrients },
      { new: true, runValidators: true }
    );

    if (!updatedFoodItem) {
      return res.status(404).json(errorResponse(Messages.FOOD_ITEM_NOT_FOUND));
    }

    res
      .status(200)
      .json(
        successResponse(updatedFoodItem, Messages.FOOD_ITEM_UPDATED_SUCCESS)
      );
  } catch (err) {
    res.status(500).json(errorResponse('Error updating food item', err));
  }
};

// DELETE a food item
export const deleteFoodItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedFoodItem = await FoodItem.findByIdAndDelete(id);

    if (!deletedFoodItem) {
      return res.status(404).json(errorResponse(Messages.FOOD_ITEM_NOT_FOUND));
    }

    res
      .status(200)
      .json(successResponse(null, Messages.FOOD_ITEM_DELETED_SUCCESS));
  } catch (err) {
    res.status(500).json(errorResponse('Error deleting food item', err));
  }
};
