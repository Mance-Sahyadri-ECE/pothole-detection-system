export type SeverityLevel = 'NORMAL' | 'MODERATE' | 'SEVERE';
export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type PotholeStatus = 'PENDING' | 'INSPECTION' | 'ASSIGNED' | 'REPAIR IN PROGRESS' | 'REPAIRED';
export type TrafficLevel = 'HIGH' | 'MEDIUM' | 'NORMAL' | 'LOW';

export type RobotState = 'ONLINE' | 'OFFLINE' | 'CHARGING' | 'PATROLLING' | 'MAINTENANCE';
export type GPSStatus = 'LOCKED' | 'SEARCHING' | 'DISCONNECTED';
export type DeviceSensorStatus = 'ACTIVE' | 'STANDBY' | 'ERROR';
export type AIModelStatus = 'RUNNING' | 'INITIALIZING' | 'ERROR';
export type InternetStatus = '5G CONNECTED' | '4G CONNECTED' | 'OFFLINE';

export type NotificationStatus = 'NEW' | 'INSPECTION_SCHEDULED' | 'REPAIR_ASSIGNED' | 'RESOLVED';
export type ComplaintStatus = 'NEW' | 'UNDER REVIEW' | 'ASSIGNED' | 'IN PROGRESS' | 'RESOLVED';

// Database Entities
export interface DbRobot {
  id: string;
  name: string;
  status: RobotState;
  battery_level: number;
  gps_status: GPSStatus;
  camera_status: DeviceSensorStatus;
  ai_model_status: AIModelStatus;
  internet_connection: InternetStatus;
  last_data_received: string;
  current_latitude: number;
  current_longitude: number;
  current_speed_kmh: number;
  current_location: string;
  potholes_detected_today: number;
  km_patrolled_today: number;
  model_latency_ms: number;
  hardware_temp_c: number;
  created_at: string;
  updated_at: string;
}

export interface DbRobotTelemetryLog {
  id: string;
  robot_id: string;
  latitude: number;
  longitude: number;
  speed_kmh: number;
  battery_level: number;
  heading_deg?: number;
  recorded_at: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DbPothole {
  id: string;
  latitude: number;
  longitude: number;
  location: string;
  road_name: string;
  area: string;
  severity: SeverityLevel;
  confidence: number;
  priority: PriorityLevel;
  status: PotholeStatus;
  detected_by: string;
  detected_at: string;
  image_url: string;
  repaired_image_url?: string | null;
  traffic_level: TrafficLevel;
  length_cm?: number | null;
  width_cm?: number | null;
  depth_cm?: number | null;
  area_sq_m?: number | null;
  complaint_count: number;
  assigned_department?: string | null;
  assigned_engineer?: string | null;
  repair_notes?: string | null;
  bounding_box?: BoundingBox | null;
  source?: 'AI_DETECTION' | 'CITIZEN_COMPLAINT';
  linked_complaint_id?: string | null;
  government_notification_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbRepairHistoryItem {
  id: string;
  pothole_id: string;
  status: PotholeStatus;
  note: string;
  updated_by: string;
  repair_image_url?: string | null;
  created_at: string;
}

export interface ChannelDelivery {
  dashboard: boolean;
  email: boolean;
  sms: boolean;
  telegram: boolean;
}

export interface DbGovernmentNotification {
  id: string;
  pothole_id: string;
  title: string;
  location: string;
  latitude: number;
  longitude: number;
  severity: SeverityLevel;
  priority: PriorityLevel;
  detected_by: string;
  recommended_action: string;
  assigned_department: string;
  viewed: boolean;
  resolved: boolean;
  status: NotificationStatus;
  channel_delivery?: ChannelDelivery | null;
  created_at: string;
  updated_at: string;
}

export interface DbComplaint {
  id: string;
  citizen_name: string;
  citizen_phone?: string | null;
  citizen_email?: string | null;
  location: string;
  latitude: number;
  longitude: number;
  description: string;
  severity_estimate: SeverityLevel;
  image_url?: string | null;
  submitted_at: string;
  status: ComplaintStatus;
  linked_pothole_id?: string | null;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
}
