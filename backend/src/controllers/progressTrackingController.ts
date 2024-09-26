import { Request, Response } from 'express';
import ProgressTracking from '../models/ProgressTracking';
import { errorResponse, successResponse } from '../config/responseFormat';

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

    return res.status(201).json(successResponse(progressTracking, 'Progress tracking added successfully'));
  } catch (error) {
    return res.status(500).json(errorResponse('Error adding progress tracking', error));
  }
};

export const updateProgressTracking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, weight, bodyFatPercentage, muscleMass, notes } = req.body;

    const progressTracking = await ProgressTracking.findByIdAndUpdate(
      id,
      { date, weight, bodyFatPercentage, muscleMass, notes, updatedAt: Date.now() },
      { new: true }
    );

    if (!progressTracking) {
      return res.status(404).json(errorResponse('Progress tracking not found'));
    }

    return res.status(200).json(successResponse(progressTracking, 'Progress tracking updated successfully'));
  } catch (error) {
    return res.status(500).json(errorResponse('Error updating progress tracking', error));
  }
};

export const deleteProgressTracking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const progressTracking = await ProgressTracking.findByIdAndDelete(id);

    if (!progressTracking) {
      return res.status(404).json(errorResponse('Progress tracking not found'));
    }

    return res.status(200).json(successResponse({}, 'Progress tracking deleted successfully'));
  } catch (error) {
    return res.status(500).json(errorResponse('Error deleting progress tracking', error));
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
    const progressTracking = await ProgressTracking.find(query).skip(skip).limit(Number(limit));

    const total = await ProgressTracking.countDocuments(query);

    return res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
      progressTracking,
    });
  } catch (error) {
    return res.status(500).json(errorResponse('Error fetching progress tracking', error));
  }
};
