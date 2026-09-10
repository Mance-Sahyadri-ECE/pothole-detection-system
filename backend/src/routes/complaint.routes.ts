import { Router } from 'express';
import {
  getComplaints,
  getComplaintById,
  createComplaint,
  acceptComplaint,
  rejectComplaint,
  updateComplaintStatus
} from '../controllers/complaint.controller';

const router = Router();

router.get('/', getComplaints);
router.post('/', createComplaint);
router.get('/:id', getComplaintById);
router.post('/:id/accept', acceptComplaint);
router.post('/:id/reject', rejectComplaint);
router.patch('/:id', updateComplaintStatus);

export default router;
