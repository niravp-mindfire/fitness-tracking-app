import { Request, Response } from 'express';
import Notification from '../models/Notifications';
import { errorResponse, successResponse } from '../utils/responseFormat';

export const addNotification = async (req: any, res: Response) => {
  try {
    const { message } = req.body;
    const userId = req.user?.userId;

    const notification = new Notification({
      userId,
      message,
      isRead: false, // New notifications are unread by default
    });

    await notification.save();

    return res.status(201).json(successResponse(notification, 'Notification added successfully'));
  } catch (error) {
    return res.status(500).json(errorResponse('Error adding notification', error));
  }
};

export const updateNotification = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const { isRead } = req.body;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead, updatedAt: Date.now() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json(errorResponse('Notification not found'));
    }

    return res.status(200).json(successResponse(notification, 'Notification updated successfully'));
  } catch (error) {
    return res.status(500).json(errorResponse('Error updating notification', error));
  }
};

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { page = 1, limit = 10, search, sort = 'createdAt', order = 'desc' } = req.query;

    const query: any = { userId };

    if (search) {
      query.message = { $regex: search, $options: 'i' };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    const notifications = await Notification.find(query)
      .sort({ [sort as string]: sortOrder })
      .skip(skip)
      .limit(Number(limit));

    const total = await Notification.countDocuments(query);

    return res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
      notifications,
    });
  } catch (error) {
    return res.status(500).json(errorResponse('Error fetching notifications', error));
  }
};
