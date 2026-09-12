import { Router } from 'express';
import {
  getPotholes,
  getPotholeById,
  createPothole,
  updateRepairStatus
} from '../controllers/pothole.controller';
import { requireGovRole } from '../middleware';

const router = Router();

router.get('/', getPotholes);
router.post('/', createPothole);
router.get('/:id', getPotholeById);
router.patch('/:id/repair', requireGovRole, updateRepairStatus);

export default router;
