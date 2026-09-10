import { GovernmentNotification } from '../types';

export const INITIAL_NOTIFICATIONS: GovernmentNotification[] = [
  {
    id: 'NOTIF-101',
    potholeId: 'PTH-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
    title: 'CRITICAL ROAD HAZARD DETECTED',
    location: 'Near Sahyadri College Gate 1, Adyar',
    gps: { lat: 12.9004, lng: 74.8700 },
    severity: 'SEVERE',
    priority: 'CRITICAL',
    detectedBy: 'Pothole Patrol Robot 01',
    recommendedAction: 'Immediate emergency inspection & road barrier deployment required within 4 hours.',
    assignedDepartment: 'Dakshina Kannada PWD - Mangaluru Division',
    viewed: false,
    resolved: false,
    status: 'NEW',
    channelDelivery: {
      dashboard: true,
      email: true,
      sms: true,
      telegram: true
    }
  },
  {
    id: 'NOTIF-102',
    potholeId: 'PTH-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    title: 'HIGH-PRIORITY HIGHWAY DAMAGE',
    location: 'NH 73 Junction, Opp. Adyar Petrol Pump',
    gps: { lat: 12.8982, lng: 74.8745 },
    severity: 'SEVERE',
    priority: 'CRITICAL',
    detectedBy: 'Pothole Patrol Robot 01',
    recommendedAction: 'Dispatch highway mobile patch unit with asphalt roller.',
    assignedDepartment: 'National Highways Authority of India (NHAI)',
    viewed: true,
    resolved: false,
    status: 'REPAIR_ASSIGNED',
    channelDelivery: {
      dashboard: true,
      email: true,
      sms: true,
      telegram: false
    }
  },
  {
    id: 'NOTIF-103',
    potholeId: 'PTH-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    title: 'MODERATE ROAD DEFORMATION',
    location: 'Valachil Entrance, Near Srinivas University Road',
    gps: { lat: 12.8942, lng: 74.8820 },
    severity: 'MODERATE',
    priority: 'HIGH',
    detectedBy: 'Pothole Patrol Robot 01',
    recommendedAction: 'Schedule cold-mix asphalt patching within 24-48 hours.',
    assignedDepartment: 'Dakshina Kannada PWD',
    viewed: true,
    resolved: false,
    status: 'INSPECTION_SCHEDULED',
    channelDelivery: {
      dashboard: true,
      email: true,
      sms: false,
      telegram: false
    }
  },
  {
    id: 'NOTIF-104',
    potholeId: 'PTH-007',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    title: 'SEVERE INDUSTRIAL CORRIDOR CAVITY',
    location: 'Arkula Link, Near Kethikal',
    gps: { lat: 12.9050, lng: 74.8880 },
    severity: 'SEVERE',
    priority: 'HIGH',
    detectedBy: 'Pothole Patrol Robot 01',
    recommendedAction: 'Urgent asphalt overlay before peak freight traffic hours.',
    assignedDepartment: 'Dakshina Kannada PWD',
    viewed: false,
    resolved: false,
    status: 'NEW',
    channelDelivery: {
      dashboard: true,
      email: true,
      sms: true,
      telegram: true
    }
  }
];
