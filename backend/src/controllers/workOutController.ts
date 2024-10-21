import { Request, Response } from 'express';
import Workout from '../models/Workout';
import WorkoutExercise from '../models/WorkoutExercises';
import { errorResponse, successResponse } from '../utils/responseFormat';
import { Messages } from '../utils/constants';

export const getAllWorkouts = async (req: any, res: Response) => {
  try {
    const {
      search,
      sort = 'date',
      order = 'desc',
      page = 1,
      limit = 10,
      startDate,
      endDate,
    } = req.query;

    const userId = req?.user?.userId;

    const query: any = { userId };

    // Apply search only for notes
    if (search) {
      query.notes = { $regex: search, $options: 'i' }; // Case-insensitive search for notes
    }

    // Date filters
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    // Pagination logic
    let workouts;
    const total = await Workout.countDocuments(query);

    if (Number(page) === -1 && Number(limit) === -1) {
      // If both page and limit are -1, fetch all workouts
      workouts = await Workout.find(query).sort({
        [sort as string]: order === 'asc' ? 1 : -1,
      });
    } else {
      // Calculate skip and apply limit
      const skip = (Number(page) - 1) * Number(limit);
      const sortOrder = order === 'asc' ? 1 : -1;

      // Fetch workouts with pagination and sorting
      workouts = await Workout.find(query)
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
          workouts,
        },
        Messages.WORKOUTS_RETRIEVED_SUCCESS
      )
    );
  } catch (err) {
    res.status(500).json(errorResponse(Messages.SERVER_ERROR, err));
  }
};

export const getWorkoutById = async (req: any, res: Response) => {
  const { id } = req.params; // Extract workout ID from request parameters
  const userId = req?.user?.userId; // Get the user ID from the request (if using authentication)

  try {
    // Find the workout by its ID and ensure it belongs to the logged-in user
    const workout = await Workout.findOne({ _id: id, userId });

    if (!workout) {
      return res.status(404).json(errorResponse(Messages.WORKOUT_NOT_FOUND));
    }

    // Return the workout data in the response
    res
      .status(200)
      .json(successResponse(workout, Messages.WORKOUT_RETRIEVED_SUCCESS));
  } catch (err) {
    res.status(500).json(errorResponse(Messages.WORKOUT_RETRIVE_ERROR, err));
  }
};

export const createWorkout = async (req: any, res: Response) => {
  try {
    const { date, duration, notes } = req.body;

    const userId = req?.user?.userId;

    const newWorkout = new Workout({
      userId,
      date,
      duration,
      notes,
    });

    const savedWorkout = await newWorkout.save();
    res
      .status(201)
      .json(successResponse(savedWorkout, Messages.WORKOUT_CREATED_SUCCESS));
  } catch (err) {
    res.status(500).json(errorResponse(Messages.WORKOUT_CREATE_ERROR, err));
  }
};

export const updateWorkout = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { date, duration, notes } = req.body;

    const userId = req?.user?.userId;

    const updatedWorkout = await Workout.findOneAndUpdate(
      { _id: id, userId },
      { date, duration, notes },
      { new: true }
    );

    if (!updatedWorkout) {
      return res.status(404).json({ message: Messages.WORKOUT_NOT_FOUND });
    }

    res
      .status(200)
      .json(successResponse(updatedWorkout, Messages.WORKOUT_UPDATED_SUCCESS));
  } catch (err) {
    res.status(500).json(errorResponse(Messages.WORKOUT_UPDATE_ERROR, err));
  }
};

export const deleteWorkout = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const userId = req?.user?.userId;

    const deletedWorkout = await Workout.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedWorkout) {
      return res.status(404).json({ message: Messages.WORKOUT_NOT_FOUND });
    }

    res
      .status(200)
      .json(successResponse(null, Messages.WORKOUT_DELETED_SUCCESS));
  } catch (err) {
    res.status(500).json(errorResponse('Error deleting workout', err));
  }
};

export const getWorkoutExercises = async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    search = '',
  } = req.query;

  const searchQuery = search
    ? {
        $or: [
          { sets: { $regex: search, $options: 'i' } },
          { reps: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  try {
    const skip = (Number(page) - 1) * Number(limit);
    const workoutExercises = await WorkoutExercise.find(searchQuery)
      .populate('workoutId')
      .populate('exerciseId')
      .sort({ [String(sortBy)]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalCount = await WorkoutExercise.countDocuments(searchQuery);

    res.json(
      successResponse(
        { workoutExercises, totalCount },
        Messages.WORKOUT_EXERCISES_FETCHED_SUCCESS
      )
    );
  } catch (err) {
    res
      .status(500)
      .json(errorResponse(Messages.WORKOUT_EXERCISES_FETCHED_ERROR, err));
  }
};

// Add exercise to a workout
export const addExerciseToWorkout = async (req: any, res: Response) => {
  const { workoutId, exerciseId, sets, reps, weight } = req.body;
  const userId = req?.user?.userId;

  try {
    const workoutExercise = new WorkoutExercise({
      workoutId,
      exerciseId,
      sets,
      reps,
      weight,
    });

    await workoutExercise.save();

    res
      .status(201)
      .json(
        successResponse(
          workoutExercise,
          Messages.WORKOUT_EXERCISE_ADDED_SUCCESS
        )
      );
  } catch (err) {
    res
      .status(500)
      .json(errorResponse(Messages.WORKOUT_EXERCISE_ADD_ERROR, err));
  }
};

// Update an exercise within a workout
export const updateWorkoutExercise = async (req: Request, res: Response) => {
  const { id } = req.params; // workout exercise ID
  const { sets, reps, weight } = req.body;

  try {
    const workoutExercise = await WorkoutExercise.findById(id);
    if (!workoutExercise) {
      return res
        .status(404)
        .json(errorResponse(Messages.WORKOUT_EXERCISE_NOT_FOUND));
    }

    workoutExercise.sets = sets || workoutExercise.sets;
    workoutExercise.reps = reps || workoutExercise.reps;
    workoutExercise.weight = weight || workoutExercise.weight;

    await workoutExercise.save();
    res.json(
      successResponse(
        workoutExercise,
        Messages.WORKOUT_EXERCISE_UPDATED_SUCCESS
      )
    );
  } catch (err) {
    res
      .status(500)
      .json(errorResponse(Messages.WORKOUT_EXERCISE_UPDATE_ERROR, err));
  }
};

// Remove an exercise from a workout
export const removeExerciseFromWorkout = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params; // workout exercise ID

  try {
    const workoutExercise = await WorkoutExercise.findByIdAndDelete(id);
    if (!workoutExercise) {
      return res
        .status(404)
        .json(errorResponse(Messages.WORKOUT_EXERCISE_NOT_FOUND));
    }

    res.json(
      successResponse(
        workoutExercise,
        Messages.WORKOUT_EXERCISE_REMOVED_SUCCESS
      )
    );
  } catch (err) {
    res
      .status(500)
      .json(errorResponse(Messages.WORKOUT_EXERCISE_REMOVE_ERROR, err));
  }
};

export const getWorkoutExerciseById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const workoutExercise = await WorkoutExercise.findById(id)
      .populate('workoutId') // Populate workout details if needed
      .populate('exerciseId'); // Populate exercise details if needed

    if (!workoutExercise) {
      return res
        .status(404)
        .json({ message: Messages.WORKOUT_EXERCISE_NOT_FOUND });
    }

    return res.status(200).json(workoutExercise);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: Messages.SERVER_ERROR });
  }
};
