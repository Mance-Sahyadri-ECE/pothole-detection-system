import { Request, Response } from 'express';
import * as robotService from '../services/robot.service';

export const getRobotStatus = async (_req: Request, res: Response) => {
  try {
    const status = await robotService.getRobotStatus();
    if (!status) {
      return res.status(404).json({ error: 'Robot not found' });
    }
    res.status(200).json(status);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRobotStatus = async (req: Request, res: Response) => {
  try {
    const updated = await robotService.updateRobotStatus(req.body);
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
