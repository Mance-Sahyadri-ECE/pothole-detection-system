import { Request, Response } from 'express';
import { checkDatabaseConnection } from '../config/database';

export const getHealth = async (_req: Request, res: Response) => {
  const dbStatus = await checkDatabaseConnection();

  res.status(200).json({
    status: 'ok',
    service: 'Pothole Detection System',
    database: {
      connected: dbStatus.connected,
      message: dbStatus.message,
    },
  });
};
