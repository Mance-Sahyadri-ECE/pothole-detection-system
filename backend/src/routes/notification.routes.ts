import { Router } from 'express';
import {
  getNotifications,
  createNotification,
  updateNotification
} from '../controllers/notification.controller';

const router = Router();

router.get('/', getNotifications);
router.post('/', createNotification);
router.patch('/:id', updateNotification);

export default router;
