import { Request, Response } from 'express';
import * as notificationService from '../services/notification.service';

export const getNotifications = async (_req: Request, res: Response) => {
  try {
    const notifications = await notificationService.getAllNotifications();
    res.status(200).json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createNotification = async (req: Request, res: Response) => {
  try {
    const created = await notificationService.createNotification(req.body);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateNotification = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await notificationService.updateNotification(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
