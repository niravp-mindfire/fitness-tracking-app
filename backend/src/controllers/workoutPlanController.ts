import { Request, Response } from 'express';
import WorkoutPlan from '../models/WorkoutPlans';
import { errorResponse, successResponse } from '../utils/responseFormat';
import { Messages } from '../utils/constants';

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
    const userId = req.user._id;

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

    res.status(200).json(
      successResponse(
        {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
          workoutPlans,
        },
        Messages.WORKOUT_PLANS_RETRIEVED
      )
    );
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_FETCHING_WORKOUT_PLANS, error));
  }
};

// GET workout plan by ID
export const getWorkoutPlanById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const workoutPlan = await WorkoutPlan.findById(id).populate(
      'exercises.exerciseId'
    );
    if (!workoutPlan) {
      return res
        .status(404)
        .json(errorResponse(Messages.WORKOUT_PLAN_NOT_FOUND));
    }
    res
      .status(200)
      .json(successResponse(workoutPlan, Messages.WORKOUT_PLAN_RETRIEVED));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_FETCHING_WORKOUT_PLAN, error));
  }
};

// POST a new workout plan
export const createWorkoutPlan = async (req: any, res: Response) => {
  const { title, description, exercises, duration } = req.body;
  const userId = req.user._id;

  try {
    const newWorkoutPlan = new WorkoutPlan({
      userId,
      title,
      description,
      exercises,
      duration,
    });

    const savedWorkoutPlan = await newWorkoutPlan.save();
    res
      .status(201)
      .json(successResponse(savedWorkoutPlan, Messages.WORKOUT_PLAN_CREATED));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_CREATING_WORKOUT_PLAN, error));
  }
};

// PUT (update) an existing workout plan by ID
export const updateWorkoutPlan = async (req: any, res: Response) => {
  const { id } = req.params;
  const { title, description, exercises, duration } = req.body;
  const userId = req.user._id;

  try {
    const workoutPlan = await WorkoutPlan.findOneAndUpdate(
      { _id: id, userId },
      { title, description, exercises, duration, updatedAt: new Date() },
      { new: true }
    );
    if (!workoutPlan) {
      return res
        .status(404)
        .json(errorResponse(Messages.WORKOUT_PLAN_NOT_FOUND));
    }
    res
      .status(200)
      .json(successResponse(workoutPlan, Messages.WORKOUT_PLAN_UPDATED));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_UPDATING_WORKOUT_PLAN, error));
  }
};

// DELETE workout plan by ID
export const deleteWorkoutPlan = async (req: any, res: Response) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const workoutPlan = await WorkoutPlan.findOneAndDelete({ _id: id, userId });
    if (!workoutPlan) {
      return res
        .status(404)
        .json(errorResponse(Messages.WORKOUT_PLAN_NOT_FOUND));
    }
    res
      .status(200)
      .json(successResponse(workoutPlan, Messages.WORKOUT_PLAN_DELETED));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_DELETING_WORKOUT_PLAN, error));
  }
};
