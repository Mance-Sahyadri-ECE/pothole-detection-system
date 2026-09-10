import { Request, Response } from 'express';
import * as potholeService from '../services/pothole.service';

export const getPotholes = async (_req: Request, res: Response) => {
  try {
    const potholes = await potholeService.getAllPotholes();
    res.status(200).json(potholes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPotholeById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const pothole = await potholeService.getPotholeById(id);
    if (!pothole) {
      return res.status(404).json({ error: 'Pothole not found' });
    }
    res.status(200).json(pothole);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createPothole = async (req: Request, res: Response) => {
  try {
    const created = await potholeService.createPothole(req.body);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRepairStatus = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status, note, engineer, repairImage } = req.body;
    const updated = await potholeService.updateRepairStatus(
      id,
      status,
      note,
      engineer,
      repairImage
    );
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
