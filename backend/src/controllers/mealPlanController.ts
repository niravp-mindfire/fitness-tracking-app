import { Request, Response } from 'express';
import MealPlan from '../models/MealPlans';
import { errorResponse, successResponse } from '../utils/responseFormat';
import { validationResult } from 'express-validator';
import FoodItem from '../models/FoodItem';
import { Messages } from '../utils/constants';

// GET all meal plans with optional search, pagination, and sorting
export const getAllMealPlans = async (req: any, res: Response) => {
  try {
    const userId = req?.user?.userId;
    const {
      search,
      sort = 'createdAt', // Default sort by 'createdAt'
      order = 'desc', // Default sort order is descending
      page = 1,
      limit = 10,
    } = req.query;

    const query: any = { userId };

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
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
        model: FoodItem, // Assuming you have a Food model
        select: 'name', // Specify the fields you want to retrieve from the Food model
      });

    const total = await MealPlan.countDocuments(query);

    res.status(200).json(
      successResponse(
        {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
          mealPlans,
        },
        Messages.MEAL_PLAN_RETRIEVED
      )
    ); // Use constant
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_FETCHING_MEAL_PLANS, error)); // Use constant
  }
};

export const getMealPlanById = async (req: Request, res: Response) => {
  try {
    const mealPlanId = req.params.id;
    const mealPlan = await MealPlan.findById(mealPlanId).populate(
      'meals.foodItems.foodId'
    );

    if (!mealPlan) {
      return res.status(404).json(errorResponse(Messages.MEAL_PLAN_NOT_FOUND)); // Use constant
    }

    res
      .status(200)
      .json(successResponse(mealPlan, Messages.MEAL_PLAN_RETRIEVED)); // Use constant
  } catch (error) {
    res.status(500).json(errorResponse(Messages.SERVER_ERROR)); // Use constant
  }
};

// POST a new meal plan
export const createMealPlan = async (req: any, res: Response) => {
  const userId = req?.user?.userId;

  // Validate incoming request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(errorResponse(Messages.INVALID_DATA, errors.array())); // Use constant
  }

  const { title, description, meals, duration } = req.body;

  try {
    const newMealPlan = new MealPlan({
      userId,
      title,
      description,
      meals,
      duration,
    });

    const savedMealPlan = await newMealPlan.save();
    res
      .status(201)
      .json(successResponse(savedMealPlan, Messages.MEAL_PLAN_CREATED)); // Use constant
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_CREATING_MEAL_PLAN, error)); // Use constant
  }
};

// PUT (update) an existing meal plan by ID
export const updateMealPlan = async (req: any, res: Response) => {
  const { id } = req.params;
  const userId = req?.user?.userId;

  try {
    const mealPlan = await MealPlan.findById(id);

    if (!mealPlan || String(mealPlan.userId) !== userId) {
      return res.status(404).json(errorResponse(Messages.MEAL_PLAN_NOT_FOUND)); // Use constant
    }

    const updatedData = req.body;
    const updatedMealPlan = await MealPlan.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json(successResponse(updatedMealPlan, Messages.MEAL_PLAN_UPDATED)); // Use constant
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_UPDATING_MEAL_PLAN, error)); // Use constant
  }
};

// DELETE a meal plan by ID
export const deleteMealPlan = async (req: any, res: Response) => {
  const { id } = req.params;
  const userId = req?.user?.userId;

  try {
    const mealPlan = await MealPlan.findById(id);

    if (!mealPlan || String(mealPlan.userId) !== userId) {
      return res.status(404).json(errorResponse(Messages.MEAL_PLAN_NOT_FOUND)); // Use constant
    }

    await MealPlan.findByIdAndDelete(id);
    res.status(200).json(successResponse(null, Messages.MEAL_PLAN_DELETED)); // Use constant
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_DELETING_MEAL_PLAN, error)); // Use constant
  }
};
