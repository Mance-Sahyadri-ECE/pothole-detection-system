import { Request, Response } from 'express';
import * as complaintService from '../services/complaint.service';

export const getComplaints = async (_req: Request, res: Response) => {
  try {
    const complaints = await complaintService.getAllComplaints();
    res.status(200).json(complaints);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getComplaintById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const complaint = await complaintService.getComplaintById(id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.status(200).json(complaint);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createComplaint = async (req: Request, res: Response) => {
  try {
    const created = await complaintService.createComplaint(req.body);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const acceptComplaint = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await complaintService.acceptComplaintAndCreateRepairTask(
      id,
      req.body
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const rejectComplaint = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { reason } = req.body;
    const rejected = await complaintService.rejectComplaint(id, reason || 'No reason specified');
    res.status(200).json(rejected);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateComplaintStatus = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status, adminNotes } = req.body;
    const updated = await complaintService.updateComplaintStatus(id, status, adminNotes);
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
