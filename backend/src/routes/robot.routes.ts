import { Router } from 'express';
import { getRobotStatus, updateRobotStatus } from '../controllers/robot.controller';

const router = Router();

router.get('/status', getRobotStatus);
router.patch('/status', updateRobotStatus);

export default router;
