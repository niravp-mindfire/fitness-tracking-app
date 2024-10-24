import { Request, Response } from 'express';
import ProgressTracking from '../models/ProgressTracking';
import { errorResponse, successResponse } from '../utils/responseFormat';
import mongoose from 'mongoose';
import { Messages } from '../utils/constants';

export const getProgressTrackingById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  try {
    const progressTracking = await ProgressTracking.findById(id);

    if (!progressTracking) {
      return res
        .status(404)
        .json(errorResponse(Messages.PROGRESS_TRACKING_NOT_FOUND));
    }

    return res
      .status(200)
      .json(
        successResponse(progressTracking, Messages.PROGRESS_TRACKING_RETRIEVED)
      );
  } catch (error) {
    console.error('Error fetching progress tracking:', error);
    return res
      .status(500)
      .json(errorResponse(Messages.ERROR_FETCHING_PROGRESS_TRACKING, error));
  }
};

export const addProgressTracking = async (req: any, res: Response) => {
  try {
    const { date, weight, bodyFatPercentage, muscleMass, notes } = req.body;
    const userId = req?.user?.userId;

    const progressTracking = new ProgressTracking({
      userId,
      date,
      weight,
      bodyFatPercentage,
      muscleMass,
      notes,
    });

    await progressTracking.save();

    return res
      .status(201)
      .json(
        successResponse(progressTracking, Messages.PROGRESS_TRACKING_ADDED)
      );
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse(Messages.ERROR_ADDING_PROGRESS_TRACKING, error));
  }
};

export const updateProgressTracking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, weight, bodyFatPercentage, muscleMass, notes } = req.body;

    const progressTracking = await ProgressTracking.findByIdAndUpdate(
      id,
      {
        date,
        weight,
        bodyFatPercentage,
        muscleMass,
        notes,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!progressTracking) {
      return res
        .status(404)
        .json(errorResponse(Messages.PROGRESS_TRACKING_NOT_FOUND));
    }

    return res
      .status(200)
      .json(
        successResponse(progressTracking, Messages.PROGRESS_TRACKING_UPDATED)
      );
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse(Messages.ERROR_UPDATING_PROGRESS_TRACKING, error));
  }
};

export const deleteProgressTracking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const progressTracking = await ProgressTracking.findByIdAndDelete(id);

    if (!progressTracking) {
      return res
        .status(404)
        .json(errorResponse(Messages.PROGRESS_TRACKING_NOT_FOUND));
    }

    return res
      .status(200)
      .json(successResponse({}, Messages.PROGRESS_TRACKING_DELETED));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse(Messages.ERROR_DELETING_PROGRESS_TRACKING, error));
  }
};

export const getUserProgressTracking = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { search, startDate, endDate, page = 1, limit = 10 } = req.query;

    const query: any = { userId };

    if (search) {
      query.notes = { $regex: search, $options: 'i' };
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const progressTracking = await ProgressTracking.find(query)
      .skip(skip)
      .limit(Number(limit));

    const total = await ProgressTracking.countDocuments(query);

    return res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
      progressTracking,
    });
  } catch (error) {
    return res
      .status(500)
      .json(
        errorResponse(Messages.ERROR_FETCHING_USER_PROGRESS_TRACKINGS, error)
      );
  }
};

export const getAllProgressTracking = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    console.log(userId);

    const { search, startDate, endDate, page = 1, limit = 10 } = req.query;

    const query: any = { userId };

    if (search) {
      query.notes = { $regex: search, $options: 'i' };
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const progressTracking = await ProgressTracking.find(query)
      .skip(skip)
      .limit(Number(limit));

    const total = await ProgressTracking.countDocuments(query);

    return res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
      progressTracking,
    });
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse(Messages.ERROR_FETCHING_PROGRESS_TRACKINGS, error));
  }
};

export const trackProgress = async (req: any, res: Response) => {
  const userId = req.user.userId;

  // Validate ObjectId
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json(errorResponse(Messages.INVALID_USER_ID_FORMAT));
  }
  const userIdObjectId = new mongoose.Types.ObjectId(userId);

  try {
    const progressData = await ProgressTracking.aggregate([
      { $match: { userId: userIdObjectId } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, // Group by date
          avgWeight: { $avg: '$weight' }, // Average weight
          avgBodyFatPercentage: { $avg: '$bodyFatPercentage' }, // Average body fat percentage
        },
      },
      {
        $project: {
          date: '$_id', // Set the date field
          weight: '$avgWeight', // Use avgWeight in the response
          bodyFatPercentage: '$avgBodyFatPercentage', // Use avgBodyFatPercentage in the response
          _id: 0, // Exclude the default _id field
        },
      },
      { $sort: { date: 1 } }, // Sort by date
    ]);

    if (progressData.length === 0) {
      return res
        .status(404)
        .json(errorResponse(Messages.NO_PROGRESS_DATA_FOUND));
    }

    // Format the response to match your sample data structure
    const formattedData = progressData.map((entry) => ({
      date: entry.date,
      weight: entry.weight, // Average weight
      bodyFatPercentage: entry.bodyFatPercentage, // Average body fat percentage
    }));

    return res
      .status(200)
      .json(
        successResponse(formattedData, 'Progress data fetched successfully')
      );
  } catch (error) {
    console.error('Error fetching progress data:', error);
    return res
      .status(500)
      .json(errorResponse(Messages.ERROR_FETCHING_PROGRESS_DATA, error));
  }
};
