import { Complaint } from '../types';

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-0001',
    citizenName: 'Karthik Shenoy',
    citizenPhone: '+91 98450 12345',
    citizenEmail: 'karthik.s@gmail.com',
    location: 'Sahyadri College Main Gate Road',
    latitude: 12.9006,
    longitude: 74.8702,
    description: 'Two-wheeler riders are skidding due to a deep pothole near the campus turn. Please repair immediately before rains.',
    severityEstimate: 'SEVERE',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    submittedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    status: 'ASSIGNED',
    linkedPotholeId: 'PTH-001',
    adminNotes: 'Auto-linked with Robot Detection PTH-001.'
  },
  {
    id: 'CMP-0002',
    citizenName: 'Pooja Rai',
    citizenPhone: '+91 97400 98765',
    location: 'NH 73 Adyar Bridge Approach',
    latitude: 12.8979,
    longitude: 74.8742,
    description: 'Heavy crater forming on the left lane towards Bantwal. Causing traffic jams.',
    severityEstimate: 'SEVERE',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    submittedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    status: 'IN PROGRESS',
    linkedPotholeId: 'PTH-002',
    adminNotes: 'NHAI repair team dispatched.'
  },
  {
    id: 'CMP-0003',
    citizenName: 'Mohammed Ashfaq',
    citizenPhone: '+91 94481 44332',
    citizenEmail: 'ashfaq.m@outlook.com',
    location: 'Valachil Bus Stop Road',
    latitude: 12.8945,
    longitude: 74.8825,
    description: 'Multiple surface cracks developing after yesterday evening heavy downpour.',
    severityEstimate: 'MODERATE',
    submittedAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    status: 'UNDER REVIEW',
    linkedPotholeId: 'PTH-003',
    adminNotes: 'Inspection team scheduled.'
  },
  {
    id: 'CMP-0004',
    citizenName: 'Deepak Rao',
    citizenPhone: '+91 98801 23456',
    citizenEmail: 'deepak.rao@gmail.com',
    location: 'Pumpwell Junction Flyover Ramp',
    latitude: 12.8688,
    longitude: 74.8695,
    description: 'Large pothole in the middle lane causing dangerous slowdowns and risk of accidents.',
    severityEstimate: 'SEVERE',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    submittedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'NEW',
    adminNotes: 'Awaiting officer review.'
  }
];
