import { Request, Response } from 'express';
import Exercise from '../models/Exercise';
import { errorResponse, successResponse } from '../utils/responseFormat';
import { Messages } from '../utils/constants';

// GET all exercises with search, sort, pagination, and date filtering
export const getAllExercises = async (req: Request, res: Response) => {
  try {
    const {
      search,
      sort = 'name', // Default sort by 'name'
      order = 'asc', // Default order is ascending
      page = 1,
      limit = 10,
      startDate,
      endDate,
    } = req.query;

    const query: any = {};

    // Search functionality
    if (search) {
      query.name = { $regex: search, $options: 'i' }; // Case-insensitive search on exercise name
    }

    // Date filtering
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate as string);
      if (endDate) query.createdAt.$lte = new Date(endDate as string);
    }

    // Pagination logic
    let exercises;
    const total = await Exercise.countDocuments(query); // Total number of documents

    if (Number(page) === -1 && Number(limit) === -1) {
      // If both page and limit are -1, fetch all exercises
      exercises = await Exercise.find(query).sort({
        [sort as string]: order === 'asc' ? 1 : -1,
      });
    } else {
      // Calculate skip and apply limit
      const skip = (Number(page) - 1) * Number(limit);
      const sortOrder = order === 'asc' ? 1 : -1;

      // Find exercises with the query, sorted and paginated
      exercises = await Exercise.find(query)
        .sort({ [sort as string]: sortOrder })
        .skip(skip)
        .limit(Number(limit));
    }

    // Return the response
    res.status(200).json(
      successResponse(
        {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
          exercises,
        },
        Messages.EXERCISES_RETRIEVED
      )
    ); // Using constant message
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_FETCHING_EXERCISES, error));
  }
};

export const getExerciseById = async (req: any, res: Response) => {
  const { id } = req.params; // Extract exercise ID from request parameters

  try {
    const exercise = await Exercise.findOne({ _id: id });

    if (!exercise) {
      return res.status(404).json(errorResponse(Messages.EXERCISE_NOT_FOUND));
    }

    res
      .status(200)
      .json(successResponse(exercise, Messages.EXERCISE_RETRIEVED)); // Using constant message
  } catch (err) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_RETRIEVING_EXERCISE, err));
  }
};

// POST a new exercise
export const createExercise = async (req: Request, res: Response) => {
  const { name, type, description, category } = req.body;

  try {
    const newExercise = new Exercise({
      name,
      type,
      description,
      category,
    });

    await newExercise.save();
    res
      .status(201)
      .json(successResponse(newExercise, Messages.EXERCISE_CREATED)); // Using constant message
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_CREATING_EXERCISE, error));
  }
};

// PUT (update) an existing exercise by ID
export const updateExercise = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, type, description, category } = req.body;

  try {
    const exercise = await Exercise.findById(id);
    if (!exercise) {
      return res.status(404).json(errorResponse(Messages.EXERCISE_NOT_FOUND));
    }

    // Update the fields
    exercise.name = name || exercise.name;
    exercise.type = type || exercise.type;
    exercise.description = description || exercise.description;
    exercise.category = category || exercise.category;
    exercise.updatedAt = new Date();

    await exercise.save();
    res.json(successResponse(exercise, Messages.EXERCISE_UPDATED)); // Using constant message
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_UPDATING_EXERCISE, error));
  }
};

// DELETE an exercise by ID
export const deleteExercise = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const exercise = await Exercise.findByIdAndDelete(id);
    if (!exercise) {
      return res.status(404).json(errorResponse(Messages.EXERCISE_NOT_FOUND));
    }
    res.json(successResponse(exercise, Messages.EXERCISE_DELETED)); // Using constant message
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(Messages.ERROR_DELETING_EXERCISE, error));
  }
};
