import { RobotStatus } from '../types';

export const INITIAL_ROBOT_STATUS: RobotStatus = {
  id: 'ROBOT-01',
  name: 'Pothole Patrol Robot 01',
  status: 'ONLINE',
  batteryLevel: 88,
  gpsStatus: 'LOCKED',
  cameraStatus: 'ACTIVE',
  aiModelStatus: 'RUNNING',
  internetConnection: '5G CONNECTED',
  lastDataReceived: new Date().toISOString(),
  currentLatitude: 12.9004,
  currentLongitude: 74.8700,
  currentSpeedKmh: 14.5,
  currentLocation: 'Sahyadri Campus Access Road, Adyar',
  potholesDetectedToday: 7,
  kmPatrolledToday: 24.8,
  modelLatencyMs: 42,
  hardwareTempC: 38.5
};
