import { Router } from 'express';
import multer from 'multer';
import { config } from '../config/env';
import { detectPotholes, getAiHealth } from '../controllers/ai.controller';

const router = Router();

// Store uploaded files in memory for fast proxy streaming to Python AI service
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.maxUploadSizeMb * 1024 * 1024 // e.g. 10MB
  }
});

// POST /api/ai/detect - accepts multipart/form-data with 'image' file
router.post('/detect', upload.single('image'), detectPotholes);

// GET /api/ai/health - checks status of Python AI inference service
router.get('/health', getAiHealth);

export default router;
