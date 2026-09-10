import { Request, Response } from 'express';
import * as aiService from '../services/ai.service';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/jpg'];

export async function detectPotholes(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'NO_FILE_UPLOADED',
        message: 'Please upload an image file using the field name "image".'
      });
      return;
    }

    if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype.toLowerCase())) {
      res.status(400).json({
        success: false,
        error: 'INVALID_FILE_TYPE',
        message: `Unsupported file type "${req.file.mimetype}". Please upload a valid JPG, JPEG, PNG, or WEBP image.`
      });
      return;
    }

    const result = await aiService.detectPotholesInImage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    res.status(200).json(result);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: error.code || 'DETECTION_FAILED',
      message: error.message || 'Detection failed. Please try again.',
      details: error.details || null
    });
  }
}

export async function getAiHealth(_req: Request, res: Response): Promise<void> {
  try {
    const health = await aiService.checkAiServiceHealth();
    res.status(200).json(health);
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      modelLoaded: false,
      message: error.message
    });
  }
}
