import { Request, Response } from 'express';
import Workout from '../models/Workout';

export const getAllWorkouts = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      search,
      sort = 'date',
      order = 'desc',
      page = 1,
      limit = 10,
      startDate,
      endDate,
    } = req.query;

    const query: any = { userId };

    if (search) {
      query.$or = [
        { notes: { $regex: search, $options: 'i' } },
        { duration: { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const sortOrder = order === 'asc' ? 1 : -1;

    const workouts = await Workout.find(query)
      .sort({ [sort as string]: sortOrder })
      .skip(skip)
      .limit(Number(limit));

    const total = await Workout.countDocuments(query);

    res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
      workouts,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
