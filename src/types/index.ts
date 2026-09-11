export type SeverityLevel = 'NORMAL' | 'MODERATE' | 'HIGH' | 'SEVERE';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

export type PotholeStatus = 
  | 'PENDING' 
  | 'INSPECTION' 
  | 'ASSIGNED' 
  | 'REPAIR IN PROGRESS' 
  | 'REPAIRED'
  | 'REJECTED'
  | 'REOPENED';

export type UserRole = 
  | 'PUBLIC'
  | 'FIELD_ENGINEER' 
  | 'SUB_ENGINEER' 
  | 'EXECUTIVE_ENGINEER' 
  | 'GOVT_ADMIN';

export type TrafficLevel = 'HIGH' | 'MEDIUM' | 'NORMAL' | 'LOW';

export interface RepairHistoryItem {
  id: string;
  timestamp: string;
  status: PotholeStatus;
  note: string;
  updatedBy: string;
  repairImageUrl?: string;
}

export type DetectionSource = 'AI_DETECTION' | 'CITIZEN_COMPLAINT';

export interface Pothole {
  id: string;
  latitude: number;
  longitude: number;
  location: string;
  roadName: string;
  area: string; // e.g. "Adyar, Mangaluru"
  severity: SeverityLevel;
  confidence: number; // 0.0 to 1.0 (e.g., 0.96)
  priority: PriorityLevel;
  status: PotholeStatus;
  detectedBy: string; // e.g. "Pothole Patrol Robot 01"
  detectedAt: string; // ISO string
  imageUrl: string;
  repairedImageUrl?: string;
  trafficLevel: TrafficLevel;
  source?: DetectionSource;
  linkedComplaintId?: string;
  estimatedDimensions?: {
    lengthCm: number;
    widthCm: number;
    depthCm: number;
    areaSqM: number;
  };
  complaintCount: number;
  assignedDepartment?: string;
  assignedEngineer?: string;
  contractorCrew?: string;
  repairNotes?: string;
  repairHistory: RepairHistoryItem[];
  governmentNotificationSent: boolean;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface RobotStatus {
  id: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE' | 'CHARGING' | 'PATROLLING' | 'MAINTENANCE';
  batteryLevel: number; // 0 - 100
  gpsStatus: 'LOCKED' | 'SEARCHING' | 'DISCONNECTED';
  cameraStatus: 'ACTIVE' | 'STANDBY' | 'ERROR';
  aiModelStatus: 'RUNNING' | 'INITIALIZING' | 'ERROR';
  internetConnection: '5G CONNECTED' | '4G CONNECTED' | 'OFFLINE';
  lastDataReceived: string;
  currentLatitude: number;
  currentLongitude: number;
  currentSpeedKmh: number;
  currentLocation: string;
  potholesDetectedToday: number;
  kmPatrolledToday: number;
  modelLatencyMs: number;
  hardwareTempC: number;
}

export interface GovernmentNotification {
  id: string;
  potholeId: string;
  timestamp: string;
  title: string;
  location: string;
  gps: {
    lat: number;
    lng: number;
  };
  severity: SeverityLevel;
  priority: PriorityLevel;
  detectedBy: string;
  recommendedAction: string;
  assignedDepartment: string;
  viewed: boolean;
  resolved: boolean;
  status: 'NEW' | 'INSPECTION_SCHEDULED' | 'REPAIR_ASSIGNED' | 'RESOLVED';
  channelDelivery?: {
    dashboard: boolean;
    email: boolean;
    sms: boolean;
    telegram: boolean;
  };
}

export interface Complaint {
  id: string;
  citizenName: string;
  citizenPhone?: string;
  citizenEmail?: string;
  location: string;
  latitude: number;
  longitude: number;
  description: string;
  severityEstimate: SeverityLevel;
  imageUrl?: string;
  submittedAt: string;
  status: 'NEW' | 'UNDER REVIEW' | 'ASSIGNED' | 'IN PROGRESS' | 'RESOLVED' | 'REJECTED';
  linkedPotholeId?: string;
  adminNotes?: string;
}

export interface AiDetectionResult {
  potholeDetected: boolean;
  severity: SeverityLevel;
  confidence: number;
  estimatedDamage: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'NONE';
  repairPriority: PriorityLevel;
  recommendedAction: string;
  severityReason?: string;
  riskScore?: number;
  dimensionStatus?: 'NOT_CALIBRATED' | 'CALIBRATED';
  dimensions?: {
    estimatedWidthCm?: number;
    estimatedDepthCm?: number;
    riskScore?: number;
  } | null;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  detections?: Array<{
    class: string;
    confidence: number;
    bbox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
  imageWidth?: number;
  imageHeight?: number;
  analysisTimeMs: number;
  error?: string;
  message?: string;
}


export type EventType = 
  | 'NEW_POTHOLE' 
  | 'POTHOLE_UPDATED' 
  | 'POTHOLE_REPAIRED' 
  | 'NEW_COMPLAINT' 
  | 'COMPLAINT_UPDATED' 
  | 'GOVERNMENT_NOTIFICATION' 
  | 'ROBOT_STATUS_CHANGED' 
  | 'DEMO_RESET';

export interface AppEvent {
  type: EventType;
  payload: any;
  timestamp: string;
}
