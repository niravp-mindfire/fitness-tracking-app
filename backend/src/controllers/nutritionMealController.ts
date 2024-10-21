import { Request, Response } from 'express';
import NutritionMeal from '../models/NutritionMeals';
import FoodItem from '../models/FoodItem';
import { errorResponse, successResponse } from '../utils/responseFormat';
import { validationResult } from 'express-validator';
import { Messages } from '../utils/constants';

// Helper function to calculate total calories based on food items and their quantities
const calculateTotalCalories = async (foodItems: any[]) => {
  let totalCalories = 0;
  for (const item of foodItems) {
    const food = await FoodItem.findById(item.foodId);
    if (food) {
      totalCalories += food.calories * item.quantity; // Convert grams to calories
    }
  }
  return totalCalories;
};

// GET a nutrition meal by ID
export const getNutritionMealById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const nutritionMeal =
      await NutritionMeal.findById(id).populate('foodItems.foodId');
    if (!nutritionMeal) {
      return res
        .status(404)
        .json(errorResponse(Messages.NUTRITION_MEAL_NOT_FOUND));
    }

    res
      .status(200)
      .json(successResponse(nutritionMeal, Messages.NUTRITION_MEAL_RETRIEVED));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_FETCHING_NUTRITION_MEAL, error));
  }
};

// GET all nutrition meals for a specific nutritionId (with optional pagination and sorting)
export const getAllNutritionMeals = async (req: Request, res: Response) => {
  try {
    const { nutritionId } = req.query;
    const {
      page = 1,
      limit = 10,
      sort = 'mealType',
      order = 'asc',
    } = req.query;

    const query: any = {};
    if (nutritionId) {
      query.nutritionId = nutritionId;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    const nutritionMeals = await NutritionMeal.find(query)
      .sort({ [sort as string]: sortOrder })
      .skip(skip)
      .limit(Number(limit))
      .populate('foodItems.foodId');

    const total = await NutritionMeal.countDocuments(query);

    res.status(200).json(
      successResponse(
        {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
          nutritionMeals,
        },
        Messages.NUTRITION_MEALS_RETRIEVED
      )
    );
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_FETCHING_NUTRITION_MEALS, error));
  }
};

// POST a new nutrition meal
export const createNutritionMeal = async (req: Request, res: Response) => {
  const { nutritionId, mealType, foodItems } = req.body;

  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(errorResponse(Messages.INVALID_DATA, errors.array()));
  }

  try {
    // Calculate total calories for the meal
    const totalCalories = await calculateTotalCalories(foodItems);

    const newNutritionMeal = new NutritionMeal({
      nutritionId,
      mealType,
      foodItems,
      totalCalories,
    });

    const savedNutritionMeal = await newNutritionMeal.save();
    res
      .status(201)
      .json(
        successResponse(savedNutritionMeal, Messages.NUTRITION_MEAL_CREATED)
      );
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_CREATING_NUTRITION_MEAL, error));
  }
};

// PUT (update) an existing nutrition meal by ID
export const updateNutritionMeal = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { mealType, foodItems } = req.body;

  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(errorResponse(Messages.INVALID_DATA, errors.array()));
  }

  try {
    const nutritionMeal = await NutritionMeal.findById(id);
    if (!nutritionMeal) {
      return res
        .status(404)
        .json(errorResponse(Messages.NUTRITION_MEAL_NOT_FOUND));
    }

    // Update the fields
    nutritionMeal.mealType = mealType || nutritionMeal.mealType;
    nutritionMeal.foodItems = foodItems || nutritionMeal.foodItems;

    // Recalculate total calories
    nutritionMeal.totalCalories = await calculateTotalCalories(foodItems);

    await nutritionMeal.save();
    res
      .status(200)
      .json(successResponse(nutritionMeal, Messages.NUTRITION_MEAL_UPDATED));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_UPDATING_NUTRITION_MEAL, error));
  }
};

// DELETE a nutrition meal by ID
export const deleteNutritionMeal = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const nutritionMeal = await NutritionMeal.findByIdAndDelete(id);
    if (!nutritionMeal) {
      return res
        .status(404)
        .json(errorResponse(Messages.NUTRITION_MEAL_NOT_FOUND));
    }
    res
      .status(200)
      .json(successResponse(null, Messages.NUTRITION_MEAL_DELETED));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_DELETING_NUTRITION_MEAL, error));
  }
};
