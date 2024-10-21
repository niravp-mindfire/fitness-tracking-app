import { Request, Response } from 'express';
import Challenge from '../models/Challenges';
import { errorResponse, successResponse } from '../utils/responseFormat';
import { validationResult } from 'express-validator';
import { Messages } from '../utils/constants';

// GET all challenges
export const getAllChallenges = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'startDate',
      order = 'asc',
      startDate,
      endDate,
      search,
    } = req.query;

    const query: any = {};

    // Search by title or description (case-insensitive)
    if (search) {
      query.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
      ];
    }

    // Date filters
    if (startDate) query.startDate = { $gte: new Date(startDate as string) };
    if (endDate)
      query.endDate = { ...query.startDate, $lte: new Date(endDate as string) };

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    const challenges = await Challenge.find(query)
      .sort({ [sort as string]: sortOrder })
      .skip(skip)
      .limit(Number(limit))
      .populate('participants');

    const total = await Challenge.countDocuments(query);

    res.status(200).json(
      successResponse(
        {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
          challenges,
        },
        Messages.FETCH_SUCCESS
      )
    );
  } catch (error) {
    res.status(500).json(errorResponse(Messages.FETCH_ERROR, error));
  }
};

// GET a challenge by ID
export const getChallengeById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const challenge = await Challenge.findById(id).populate('participants');
    if (!challenge) {
      return res.status(404).json(errorResponse(Messages.NOT_FOUND));
    }
    const challengeResponse = {
      _id: challenge._id,
      title: challenge.title,
      description: challenge.description,
      startDate: challenge.startDate,
      endDate: challenge.endDate,
      participants: challenge.participants.map((p: any) => ({
        _id: p._id,
        fullName: `${p.profile.firstName} ${p.profile.lastName}`,
      })),
    };
    res.json(successResponse(challengeResponse, Messages.RETRIEVE_SUCCESS));
  } catch (error) {
    res.status(500).json(errorResponse(Messages.RETRIEVE_ERROR, error));
  }
};

// POST a new challenge
export const createChallenge = async (req: Request, res: Response) => {
  const { title, description, startDate, endDate, participants } = req.body;

  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(errorResponse(Messages.INVALID_DATA, errors.array()));
  }

  try {
    const newChallenge = new Challenge({
      title,
      description,
      startDate,
      endDate,
      participants,
    });

    const savedChallenge = await newChallenge.save();
    res
      .status(201)
      .json(successResponse(savedChallenge, Messages.CREATE_SUCCESS));
  } catch (error) {
    res.status(500).json(errorResponse(Messages.CREATE_ERROR, error));
  }
};

// PUT (update) an existing challenge by ID
export const updateChallenge = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, startDate, endDate, participants } = req.body;

  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(errorResponse(Messages.INVALID_DATA, errors.array()));
  }

  try {
    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res.status(404).json(errorResponse(Messages.NOT_FOUND));
    }

    // Update fields
    challenge.title = title || challenge.title;
    challenge.description = description || challenge.description;
    challenge.startDate = startDate || challenge.startDate;
    challenge.endDate = endDate || challenge.endDate;
    challenge.participants = participants || challenge.participants;
    challenge.updatedAt = new Date();

    await challenge.save();
    res.status(200).json(successResponse(challenge, Messages.UPDATE_SUCCESS));
  } catch (error) {
    res.status(500).json(errorResponse(Messages.UPDATE_ERROR, error));
  }
};

// DELETE a challenge by ID
export const deleteChallenge = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const challenge = await Challenge.findByIdAndDelete(id);
    if (!challenge) {
      return res.status(404).json(errorResponse(Messages.NOT_FOUND));
    }
    res.status(200).json(successResponse(null, Messages.DELETE_SUCCESS));
  } catch (error) {
    res.status(500).json(errorResponse(Messages.DELETE_ERROR, error));
  }
};
