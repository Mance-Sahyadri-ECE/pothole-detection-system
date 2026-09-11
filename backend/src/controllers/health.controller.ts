import { Request, Response } from 'express';
import { checkDatabaseConnection } from '../config/database';

export const getHealth = async (_req: Request, res: Response) => {
  try {
    const dbStatus = await checkDatabaseConnection();

    res.status(200).json({
      status: 'ok',
      service: 'Pothole Detection System',
      database: {
        connected: dbStatus.connected,
        message: dbStatus.message,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      service: 'Pothole Detection System',
      database: {
        connected: false,
        message: error.message || 'Database connection error',
      },
    });
  }
};
