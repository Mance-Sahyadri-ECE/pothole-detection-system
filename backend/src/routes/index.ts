import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import potholeRoutes from './pothole.routes';
import complaintRoutes from './complaint.routes';
import notificationRoutes from './notification.routes';
import robotRoutes from './robot.routes';
import aiRoutes from './ai.routes';

const router = Router();

// Health check endpoint
router.use('/', healthRoutes);

// Feature REST endpoints
router.use('/auth', authRoutes);
router.use('/ai', aiRoutes);
router.use('/potholes', potholeRoutes);
router.use('/complaints', complaintRoutes);
router.use('/notifications', notificationRoutes);
router.use('/robot', robotRoutes);

export default router;

