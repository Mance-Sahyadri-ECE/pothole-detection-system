import { 
  Pothole, 
  Complaint, 
  GovernmentNotification, 
  RobotStatus, 
  PotholeStatus, 
  SeverityLevel, 
  PriorityLevel,
  UserRole
} from '../types';
import { INITIAL_POTHOLES } from '../data/mockPotholes';
import { INITIAL_NOTIFICATIONS } from '../data/mockNotifications';
import { INITIAL_COMPLAINTS } from '../data/mockComplaints';
import { INITIAL_ROBOT_STATUS } from '../data/mockRobot';
import { calculatePriority, getRecommendedAction } from './priorityEngine';
import { getRandomRoadPoint } from '../utils/geoUtils';
import { eventBus } from './eventBus';

const BACKEND_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

const STORAGE_KEYS = {
  POTHOLES: 'pds_potholes_v2',
  NOTIFICATIONS: 'pds_notifications_v2',
  COMPLAINTS: 'pds_complaints_v2',
  ROBOT: 'pds_robot_v2'
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

// In-memory data initialized from localStorage or defaults
let potholesStore: Pothole[] = loadStorage<Pothole[]>(STORAGE_KEYS.POTHOLES, INITIAL_POTHOLES);
let notificationsStore: GovernmentNotification[] = loadStorage<GovernmentNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
let complaintsStore: Complaint[] = loadStorage<Complaint[]>(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
let robotStore: RobotStatus = loadStorage<RobotStatus>(STORAGE_KEYS.ROBOT, INITIAL_ROBOT_STATUS);

// Save initial if empty
saveStorage(STORAGE_KEYS.POTHOLES, potholesStore);
saveStorage(STORAGE_KEYS.NOTIFICATIONS, notificationsStore);
saveStorage(STORAGE_KEYS.COMPLAINTS, complaintsStore);
saveStorage(STORAGE_KEYS.ROBOT, robotStore);

/* -------------------------------------------------------------
 * DATA MAPPERS (Database Snake_Case -> Frontend CamelCase)
 * ----------------------------------------------------------- */

function mapDbPotholeToFrontend(db: any): Pothole {
  return {
    id: db.id,
    latitude: Number(db.latitude || 12.868),
    longitude: Number(db.longitude || 74.872),
    location: db.location || 'Adyar, Mangaluru',
    roadName: db.road_name || db.roadName || db.location || 'Main Road',
    area: db.area || 'Adyar, Mangaluru',
    severity: (db.severity || 'SEVERE') as SeverityLevel,
    confidence: Number(db.confidence ?? 0.95),
    priority: (db.priority || 'CRITICAL') as PriorityLevel,
    status: (db.status || 'PENDING') as PotholeStatus,
    detectedBy: db.detected_by || db.detectedBy || 'Pothole Patrol Robot 01',
    detectedAt: db.detected_at || db.detectedAt || new Date().toISOString(),
    imageUrl: db.image_url || db.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    repairedImageUrl: db.repaired_image_url || db.repairedImageUrl,
    trafficLevel: db.traffic_level || db.trafficLevel || 'HIGH',
    source: db.source || (db.id.startsWith('CMP-') ? 'CITIZEN_COMPLAINT' : 'AI_DETECTION'),
    linkedComplaintId: db.linked_complaint_id || db.linkedComplaintId || (db.id.startsWith('CMP-') ? db.id : undefined),
    estimatedDimensions: db.estimatedDimensions || {
      lengthCm: Number(db.length_cm || 55),
      widthCm: Number(db.width_cm || 45),
      depthCm: Number(db.depth_cm || 12),
      areaSqM: Number(db.area_sq_m || 0.25)
    },
    complaintCount: Number(db.complaint_count ?? 0),
    assignedDepartment: db.assigned_department || db.assignedDepartment || 'Dakshina Kannada PWD',
    assignedEngineer: db.assigned_engineer || db.assignedEngineer,
    repairNotes: db.repair_notes || db.repairNotes,
    repairHistory: Array.isArray(db.repairHistory)
      ? db.repairHistory.map((rh: any) => ({
          id: rh.id,
          timestamp: rh.timestamp || rh.created_at || new Date().toISOString(),
          status: rh.status as PotholeStatus,
          note: rh.note,
          updatedBy: rh.updated_by || rh.updatedBy || 'Control Room',
          repairImageUrl: rh.repair_image_url || rh.repairImageUrl
        }))
      : (db.repairHistory || []),
    governmentNotificationSent: Boolean(db.government_notification_sent ?? db.governmentNotificationSent),
    boundingBox: typeof db.bounding_box === 'string' ? JSON.parse(db.bounding_box) : (db.bounding_box || db.boundingBox)
  };
}

function mapDbComplaintToFrontend(db: any): Complaint {
  return {
    id: db.id,
    citizenName: db.citizen_name || db.citizenName || 'Citizen Report',
    citizenPhone: db.citizen_phone || db.citizenPhone,
    citizenEmail: db.citizen_email || db.citizenEmail,
    location: db.location || 'Adyar, Mangaluru',
    latitude: Number(db.latitude || 12.868),
    longitude: Number(db.longitude || 74.872),
    description: db.description || '',
    severityEstimate: (db.severity_estimate || db.severityEstimate || 'MODERATE') as SeverityLevel,
    imageUrl: db.image_url || db.imageUrl,
    submittedAt: db.submitted_at || db.submittedAt || new Date().toISOString(),
    status: db.status || 'NEW',
    linkedPotholeId: db.linked_pothole_id || db.linkedPotholeId,
    adminNotes: db.admin_notes || db.adminNotes
  };
}

function mapDbNotificationToFrontend(db: any): GovernmentNotification {
  return {
    id: db.id,
    potholeId: db.pothole_id || db.potholeId || 'PTH-GEN',
    timestamp: db.created_at || db.timestamp || new Date().toISOString(),
    title: db.title || 'ROAD HAZARD ALERT',
    location: db.location || 'Adyar, Mangaluru',
    gps: {
      lat: Number(db.latitude ?? db.gps?.lat ?? 12.868),
      lng: Number(db.longitude ?? db.gps?.lng ?? 74.872)
    },
    severity: (db.severity || 'SEVERE') as SeverityLevel,
    priority: (db.priority || 'CRITICAL') as PriorityLevel,
    detectedBy: db.detected_by || db.detectedBy || 'Pothole Patrol Robot 01',
    recommendedAction: db.recommended_action || db.recommendedAction || 'Inspection required',
    assignedDepartment: db.assigned_department || db.assignedDepartment || 'Dakshina Kannada PWD',
    viewed: Boolean(db.viewed),
    resolved: Boolean(db.resolved),
    status: db.status || 'NEW',
    channelDelivery: typeof db.channel_delivery === 'string'
      ? JSON.parse(db.channel_delivery)
      : (db.channel_delivery || db.channelDelivery || { dashboard: true, email: true, sms: false, telegram: false })
  };
}

/* -------------------------------------------------------------
 * POTHOLES & REPAIRS API
 * ----------------------------------------------------------- */

export async function getPotholes(): Promise<Pothole[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/potholes`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const mapped = data.map(mapDbPotholeToFrontend);
        potholesStore = mapped;
        saveStorage(STORAGE_KEYS.POTHOLES, potholesStore);
        return mapped;
      }
    }
  } catch (e) {
    console.warn('[API] Could not reach backend /api/potholes, using local cache:', e);
  }
  return [...potholesStore];
}

export async function getPotholeById(id: string): Promise<Pothole | undefined> {
  const all = await getPotholes();
  return all.find(p => p.id === id);
}

export async function createPothole(data: Partial<Pothole>): Promise<Pothole> {
  const newIndex = potholesStore.length + 1;
  const id = data.id || `PTH-${String(newIndex).padStart(3, '0')}`;
  const severity = data.severity || 'SEVERE';
  const trafficLevel = data.trafficLevel || 'HIGH';
  const priority = calculatePriority(severity, trafficLevel, 0);

  const newPothole: Pothole = {
    id,
    latitude: data.latitude || 12.9004,
    longitude: data.longitude || 74.8700,
    location: data.location || 'Sahyadri Campus Access Road, Adyar',
    roadName: data.roadName || 'Sahyadri Campus Road',
    area: data.area || 'Adyar, Mangaluru',
    severity,
    confidence: data.confidence ?? 0.95,
    priority,
    status: 'PENDING',
    detectedBy: data.detectedBy || 'Pothole Patrol Robot 01',
    detectedAt: data.detectedAt || new Date().toISOString(),
    imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    trafficLevel,
    source: data.source || (id.startsWith('CMP-') ? 'CITIZEN_COMPLAINT' : 'AI_DETECTION'),
    linkedComplaintId: data.linkedComplaintId || (id.startsWith('CMP-') ? id : undefined),
    estimatedDimensions: data.estimatedDimensions,
    complaintCount: 0,
    assignedDepartment: 'Dakshina Kannada PWD - Mangaluru Division',
    repairHistory: [
      {
        id: `RH-${id}-1`,
        timestamp: new Date().toISOString(),
        status: 'PENDING',
        note: `Autonomous telemetry logged by ${data.detectedBy || 'Robot-01'}.`,
        updatedBy: data.detectedBy || 'Pothole Patrol Robot 01'
      }
    ],
    governmentNotificationSent: false,
    boundingBox: data.boundingBox
  };

  // Try saving to backend
  try {
    await fetch(`${BACKEND_URL}/potholes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newPothole.id,
        latitude: newPothole.latitude,
        longitude: newPothole.longitude,
        location: newPothole.location,
        road_name: newPothole.roadName,
        area: newPothole.area,
        severity: newPothole.severity,
        confidence: newPothole.confidence,
        priority: newPothole.priority,
        status: newPothole.status,
        detected_by: newPothole.detectedBy,
        image_url: newPothole.imageUrl,
        traffic_level: newPothole.trafficLevel,
        source: newPothole.source,
        linked_complaint_id: newPothole.linkedComplaintId,
        assigned_department: newPothole.assignedDepartment,
        bounding_box: newPothole.boundingBox
      })
    });
  } catch (err) {
    console.warn('[API] Backend POST /api/potholes error:', err);
  }

  potholesStore = [newPothole, ...potholesStore];
  saveStorage(STORAGE_KEYS.POTHOLES, potholesStore);

  // Update robot count only for actual defect detections
  if (severity !== 'NORMAL') {
    robotStore.potholesDetectedToday += 1;
  }
  robotStore.lastDataReceived = new Date().toISOString();
  saveStorage(STORAGE_KEYS.ROBOT, robotStore);
  eventBus.emit('ROBOT_STATUS_CHANGED', robotStore);
  eventBus.emit('NEW_POTHOLE', newPothole);

  // Auto-send government notification if SEVERE or CRITICAL
  if (severity === 'SEVERE' || priority === 'CRITICAL') {
    await sendGovernmentNotification({
      potholeId: newPothole.id,
      title: `CRITICAL ROAD HAZARD DETECTED (${newPothole.id})`,
      location: newPothole.location,
      gps: { lat: newPothole.latitude, lng: newPothole.longitude },
      severity: newPothole.severity,
      priority: newPothole.priority,
      detectedBy: newPothole.detectedBy,
      recommendedAction: getRecommendedAction(newPothole.severity, newPothole.priority),
      assignedDepartment: newPothole.assignedDepartment || 'Dakshina Kannada PWD'
    });

    newPothole.governmentNotificationSent = true;
    saveStorage(STORAGE_KEYS.POTHOLES, potholesStore);
  }

  return newPothole;
}

export async function updateRepairStatus(
  id: string,
  newStatus: PotholeStatus,
  note?: string,
  engineer?: string,
  repairImage?: string
): Promise<Pothole> {
  // Call backend
  try {
    await fetch(`${BACKEND_URL}/potholes/${id}/repair`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: newStatus,
        note,
        engineer,
        repairImage
      })
    });
  } catch (err) {
    console.warn('[API] Backend PATCH /api/potholes/:id/repair error:', err);
  }

  const index = potholesStore.findIndex(p => p.id === id);
  let pothole: Pothole;

  if (index === -1) {
    // If not found in memory store, create a placeholder
    pothole = {
      id,
      latitude: 12.868,
      longitude: 74.872,
      location: 'Mangaluru',
      roadName: 'Main Road',
      area: 'Adyar, Mangaluru',
      severity: 'SEVERE',
      confidence: 0.95,
      priority: 'CRITICAL',
      status: newStatus,
      detectedBy: id.startsWith('CMP-') ? 'Citizen Grievance' : 'Pothole Patrol Robot 01',
      detectedAt: new Date().toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      trafficLevel: 'HIGH',
      source: id.startsWith('CMP-') ? 'CITIZEN_COMPLAINT' : 'AI_DETECTION',
      linkedComplaintId: id.startsWith('CMP-') ? id : undefined,
      complaintCount: 0,
      governmentNotificationSent: false,
      repairHistory: []
    };
    potholesStore = [pothole, ...potholesStore];
  } else {
    pothole = potholesStore[index];
  }

  const historyItem = {
    id: `RH-${id}-${(pothole.repairHistory?.length || 0) + 1}`,
    timestamp: new Date().toISOString(),
    status: newStatus,
    note: note || `Status transitioned to ${newStatus}`,
    updatedBy: engineer || 'PWD Control Room',
    repairImageUrl: repairImage
  };

  const updated: Pothole = {
    ...pothole,
    status: newStatus,
    assignedEngineer: engineer || pothole.assignedEngineer,
    repairNotes: note ? `${pothole.repairNotes ? pothole.repairNotes + ' | ' : ''}${note}` : pothole.repairNotes,
    repairedImageUrl: newStatus === 'REPAIRED' ? (repairImage || pothole.repairedImageUrl || 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80') : pothole.repairedImageUrl,
    repairHistory: [...(pothole.repairHistory || []), historyItem]
  };

  const targetIdx = potholesStore.findIndex(p => p.id === id);
  if (targetIdx !== -1) {
    potholesStore[targetIdx] = updated;
  } else {
    potholesStore.unshift(updated);
  }
  saveStorage(STORAGE_KEYS.POTHOLES, potholesStore);

  // Link and automatically update associated complaint
  const linkedCmpId = updated.linkedComplaintId || (id.startsWith('CMP-') ? id : null);
  if (linkedCmpId) {
    const cmpIdx = complaintsStore.findIndex(c => c.id === linkedCmpId || c.linkedPotholeId === id);
    if (cmpIdx !== -1) {
      if (newStatus === 'REPAIRED') {
        complaintsStore[cmpIdx].status = 'RESOLVED';
        complaintsStore[cmpIdx].adminNotes = `Repair verified and completed by ${engineer || 'PWD Team'}.`;
      } else if (newStatus === 'ASSIGNED') {
        complaintsStore[cmpIdx].status = 'ASSIGNED';
        complaintsStore[cmpIdx].adminNotes = `Assigned to ${engineer || 'Designated Engineer'}.`;
      } else if (newStatus === 'REPAIR IN PROGRESS') {
        complaintsStore[cmpIdx].status = 'IN PROGRESS';
        complaintsStore[cmpIdx].adminNotes = `Field team actively executing repair.`;
      }
      saveStorage(STORAGE_KEYS.COMPLAINTS, complaintsStore);
      eventBus.emit('COMPLAINT_UPDATED', complaintsStore[cmpIdx]);
    }
  }

  // Generate Notifications for repair lifecycle
  if (newStatus === 'REPAIRED') {
    await sendGovernmentNotification({
      potholeId: updated.id,
      title: `REPAIR COMPLETED (${updated.id})`,
      location: updated.location,
      gps: { lat: updated.latitude, lng: updated.longitude },
      severity: updated.severity,
      priority: updated.priority,
      detectedBy: updated.detectedBy,
      recommendedAction: `Road defect verified & repaired by ${engineer || 'PWD Team'}. Grievance resolved.`,
      assignedDepartment: updated.assignedDepartment || 'Dakshina Kannada PWD'
    });
    eventBus.emit('POTHOLE_REPAIRED', updated);
  } else if (newStatus === 'ASSIGNED') {
    await sendGovernmentNotification({
      potholeId: updated.id,
      title: `ENGINEER ASSIGNED (${updated.id})`,
      location: updated.location,
      gps: { lat: updated.latitude, lng: updated.longitude },
      severity: updated.severity,
      priority: updated.priority,
      detectedBy: updated.detectedBy,
      recommendedAction: `Work order dispatched to ${engineer || 'Designated Engineer'}.`,
      assignedDepartment: updated.assignedDepartment || 'Dakshina Kannada PWD'
    });
    eventBus.emit('POTHOLE_UPDATED', updated);
  } else if (newStatus === 'REPAIR IN PROGRESS') {
    await sendGovernmentNotification({
      potholeId: updated.id,
      title: `REPAIR IN PROGRESS (${updated.id})`,
      location: updated.location,
      gps: { lat: updated.latitude, lng: updated.longitude },
      severity: updated.severity,
      priority: updated.priority,
      detectedBy: updated.detectedBy,
      recommendedAction: `Field team is executing asphalt patch on site.`,
      assignedDepartment: updated.assignedDepartment || 'Dakshina Kannada PWD'
    });
    eventBus.emit('POTHOLE_UPDATED', updated);
  } else {
    eventBus.emit('POTHOLE_UPDATED', updated);
  }

  return updated;
}

/* -------------------------------------------------------------
 * GOVERNMENT NOTIFICATIONS API
 * ----------------------------------------------------------- */

export async function getNotifications(): Promise<GovernmentNotification[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/notifications`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const mapped = data.map(mapDbNotificationToFrontend);
        notificationsStore = mapped;
        saveStorage(STORAGE_KEYS.NOTIFICATIONS, notificationsStore);
        return mapped;
      }
    }
  } catch (e) {
    console.warn('[API] Could not reach backend /api/notifications:', e);
  }
  return [...notificationsStore];
}

export async function sendGovernmentNotification(
  data: Partial<GovernmentNotification>
): Promise<GovernmentNotification> {
  const id = `NOTIF-${String(notificationsStore.length + 101)}`;
  const notif: GovernmentNotification = {
    id,
    potholeId: data.potholeId || 'PTH-GEN',
    timestamp: new Date().toISOString(),
    title: data.title || 'ROAD HAZARD ALERT',
    location: data.location || 'Adyar, Mangaluru',
    gps: data.gps || { lat: 12.9004, lng: 74.8700 },
    severity: data.severity || 'SEVERE',
    priority: data.priority || 'CRITICAL',
    detectedBy: data.detectedBy || 'Pothole Patrol Robot 01',
    recommendedAction: data.recommendedAction || 'Immediate site inspection required.',
    assignedDepartment: data.assignedDepartment || 'Dakshina Kannada PWD',
    viewed: false,
    resolved: false,
    status: 'NEW',
    channelDelivery: {
      dashboard: true,
      email: true,
      sms: true,
      telegram: true
    }
  };

  try {
    await fetch(`${BACKEND_URL}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: notif.id,
        pothole_id: notif.potholeId,
        title: notif.title,
        location: notif.location,
        latitude: notif.gps.lat,
        longitude: notif.gps.lng,
        severity: notif.severity,
        priority: notif.priority,
        detected_by: notif.detectedBy,
        recommended_action: notif.recommendedAction,
        assigned_department: notif.assignedDepartment
      })
    });
  } catch (err) {
    console.warn('[API] Backend POST /api/notifications error:', err);
  }

  notificationsStore = [notif, ...notificationsStore];
  saveStorage(STORAGE_KEYS.NOTIFICATIONS, notificationsStore);
  eventBus.emit('GOVERNMENT_NOTIFICATION', notif);
  return notif;
}

export async function updateNotificationStatus(
  id: string,
  updates: Partial<GovernmentNotification>
): Promise<GovernmentNotification> {
  try {
    await fetch(`${BACKEND_URL}/notifications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
  } catch (err) {
    console.warn('[API] Backend PATCH /api/notifications/:id error:', err);
  }

  const index = notificationsStore.findIndex(n => n.id === id);
  if (index === -1) throw new Error(`Notification ${id} not found`);

  const updated = {
    ...notificationsStore[index],
    ...updates
  };

  notificationsStore[index] = updated;
  saveStorage(STORAGE_KEYS.NOTIFICATIONS, notificationsStore);
  eventBus.emit('GOVERNMENT_NOTIFICATION', updated);
  return updated;
}

/* -------------------------------------------------------------
 * CITIZEN COMPLAINTS API
 * ----------------------------------------------------------- */

export async function getComplaints(): Promise<Complaint[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/complaints`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const mapped = data.map(mapDbComplaintToFrontend);
        complaintsStore = mapped;
        saveStorage(STORAGE_KEYS.COMPLAINTS, complaintsStore);
        return mapped;
      }
    }
  } catch (e) {
    console.warn('[API] Could not reach backend /api/complaints:', e);
  }
  return [...complaintsStore];
}

export async function createComplaint(data: Partial<Complaint>): Promise<Complaint> {
  const id = data.id || `CMP-${String(complaintsStore.length + 1).padStart(4, '0')}`;
  const newComplaint: Complaint = {
    id,
    citizenName: data.citizenName || 'Citizen Report',
    citizenPhone: data.citizenPhone,
    citizenEmail: data.citizenEmail,
    location: data.location || 'Adyar, Mangaluru',
    latitude: data.latitude || 12.9004,
    longitude: data.longitude || 74.8700,
    description: data.description || 'Pothole reported by citizen via public portal.',
    severityEstimate: data.severityEstimate || 'MODERATE',
    imageUrl: data.imageUrl,
    submittedAt: new Date().toISOString(),
    status: 'NEW',
    linkedPotholeId: data.linkedPotholeId
  };

  try {
    await fetch(`${BACKEND_URL}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newComplaint.id,
        citizen_name: newComplaint.citizenName,
        citizen_phone: newComplaint.citizenPhone,
        citizen_email: newComplaint.citizenEmail,
        location: newComplaint.location,
        latitude: newComplaint.latitude,
        longitude: newComplaint.longitude,
        description: newComplaint.description,
        severity_estimate: newComplaint.severityEstimate,
        image_url: newComplaint.imageUrl,
        status: newComplaint.status,
        linked_pothole_id: newComplaint.linkedPotholeId
      })
    });
  } catch (err) {
    console.warn('[API] Backend POST /api/complaints error:', err);
  }

  complaintsStore = [newComplaint, ...complaintsStore];
  saveStorage(STORAGE_KEYS.COMPLAINTS, complaintsStore);
  eventBus.emit('NEW_COMPLAINT', newComplaint);

  return newComplaint;
}

export async function acceptComplaintAndCreateRepairTask(
  complaintId: string,
  options?: { department?: string; notes?: string }
): Promise<{ complaint: Complaint; repairTask: Pothole }> {
  // Call backend
  try {
    const res = await fetch(`${BACKEND_URL}/complaints/${complaintId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options || {})
    });
    if (res.ok) {
      const data = await res.json();
      const mappedComplaint = mapDbComplaintToFrontend(data.complaint);
      const mappedRepair = mapDbPotholeToFrontend(data.repairTask);

      // Sync local storage
      const cmpIdx = complaintsStore.findIndex(c => c.id === complaintId);
      if (cmpIdx !== -1) complaintsStore[cmpIdx] = mappedComplaint;
      else complaintsStore.unshift(mappedComplaint);
      saveStorage(STORAGE_KEYS.COMPLAINTS, complaintsStore);

      const pthIdx = potholesStore.findIndex(p => p.id === mappedRepair.id);
      if (pthIdx !== -1) potholesStore[pthIdx] = mappedRepair;
      else potholesStore.unshift(mappedRepair);
      saveStorage(STORAGE_KEYS.POTHOLES, potholesStore);

      eventBus.emit('COMPLAINT_UPDATED', mappedComplaint);
      eventBus.emit('NEW_POTHOLE', mappedRepair);

      return { complaint: mappedComplaint, repairTask: mappedRepair };
    }
  } catch (err) {
    console.warn('[API] Backend accept complaint error, executing local fallback:', err);
  }

  // Local fallback
  const complaint = complaintsStore.find(c => c.id === complaintId);
  if (!complaint) throw new Error(`Complaint ${complaintId} not found`);

  const priority: PriorityLevel = complaint.severityEstimate === 'SEVERE' ? 'CRITICAL' : complaint.severityEstimate === 'MODERATE' ? 'HIGH' : 'MEDIUM';

  const repairTask: Pothole = {
    id: complaint.id, // preserve original CMP-xxxx ID
    latitude: complaint.latitude,
    longitude: complaint.longitude,
    location: complaint.location,
    roadName: complaint.location,
    area: 'Adyar, Mangaluru',
    severity: complaint.severityEstimate,
    confidence: 0.98,
    priority,
    status: 'PENDING',
    detectedBy: `Citizen: ${complaint.citizenName}`,
    detectedAt: new Date().toISOString(),
    imageUrl: complaint.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    trafficLevel: complaint.severityEstimate === 'SEVERE' ? 'HIGH' : 'NORMAL',
    source: 'CITIZEN_COMPLAINT',
    linkedComplaintId: complaint.id,
    complaintCount: 1,
    assignedDepartment: options?.department || 'Dakshina Kannada PWD - Mangaluru Division',
    repairNotes: options?.notes || `Citizen Description: ${complaint.description}`,
    repairHistory: [
      {
        id: `RH-${complaint.id}-1`,
        timestamp: new Date().toISOString(),
        status: 'PENDING',
        note: `Repair task generated from Citizen Complaint ${complaint.id} submitted by ${complaint.citizenName}.`,
        updatedBy: 'PWD Officer'
      }
    ],
    governmentNotificationSent: true
  };

  const existingIdx = potholesStore.findIndex(p => p.id === complaint.id);
  if (existingIdx !== -1) {
    potholesStore[existingIdx] = repairTask;
  } else {
    potholesStore = [repairTask, ...potholesStore];
  }
  saveStorage(STORAGE_KEYS.POTHOLES, potholesStore);

  complaint.status = 'UNDER REVIEW';
  complaint.linkedPotholeId = repairTask.id;
  complaint.adminNotes = `Accepted & converted to Repair Task ${repairTask.id}`;
  saveStorage(STORAGE_KEYS.COMPLAINTS, complaintsStore);

  await sendGovernmentNotification({
    potholeId: repairTask.id,
    title: `CITIZEN COMPLAINT ACCEPTED (${complaint.id})`,
    location: complaint.location,
    gps: { lat: complaint.latitude, lng: complaint.longitude },
    severity: complaint.severityEstimate,
    priority,
    detectedBy: `Citizen: ${complaint.citizenName}`,
    recommendedAction: `Repair task ${repairTask.id} created. Assign engineer crew for execution.`,
    assignedDepartment: 'Dakshina Kannada PWD'
  });

  eventBus.emit('COMPLAINT_UPDATED', complaint);
  eventBus.emit('NEW_POTHOLE', repairTask);

  return { complaint, repairTask };
}

export async function rejectComplaint(
  complaintId: string,
  reason: string
): Promise<Complaint> {
  try {
    await fetch(`${BACKEND_URL}/complaints/${complaintId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
  } catch (err) {
    console.warn('[API] Backend reject error:', err);
  }

  const index = complaintsStore.findIndex(c => c.id === complaintId);
  if (index === -1) throw new Error(`Complaint ${complaintId} not found`);

  const updated: Complaint = {
    ...complaintsStore[index],
    status: 'RESOLVED',
    adminNotes: `Complaint Rejected: ${reason}`
  };

  complaintsStore[index] = updated;
  saveStorage(STORAGE_KEYS.COMPLAINTS, complaintsStore);
  eventBus.emit('COMPLAINT_UPDATED', updated);
  return updated;
}

export async function updateComplaintStatus(
  id: string,
  status: Complaint['status'],
  adminNotes?: string
): Promise<Complaint> {
  try {
    await fetch(`${BACKEND_URL}/complaints/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNotes })
    });
  } catch (err) {
    console.warn('[API] Backend PATCH complaint status error:', err);
  }

  const index = complaintsStore.findIndex(c => c.id === id);
  if (index === -1) throw new Error(`Complaint ${id} not found`);

  const updated: Complaint = {
    ...complaintsStore[index],
    status,
    adminNotes: adminNotes || complaintsStore[index].adminNotes
  };

  complaintsStore[index] = updated;
  saveStorage(STORAGE_KEYS.COMPLAINTS, complaintsStore);
  eventBus.emit('COMPLAINT_UPDATED', updated);
  return updated;
}

/* -------------------------------------------------------------
 * ROBOT TELEMETRY API
 * ----------------------------------------------------------- */

export async function getRobotStatus(): Promise<RobotStatus> {
  return { ...robotStore };
}

export async function updateRobotStatus(updates: Partial<RobotStatus>): Promise<RobotStatus> {
  robotStore = {
    ...robotStore,
    ...updates,
    lastDataReceived: new Date().toISOString()
  };
  saveStorage(STORAGE_KEYS.ROBOT, robotStore);
  eventBus.emit('ROBOT_STATUS_CHANGED', robotStore);
  return robotStore;
}

/* -------------------------------------------------------------
 * SIMULATION ENGINE
 * ----------------------------------------------------------- */

export async function simulateRobotDetection(forcedSeverity?: SeverityLevel): Promise<Pothole> {
  const road = getRandomRoadPoint();
  const severity: SeverityLevel = forcedSeverity || (Math.random() > 0.4 ? 'SEVERE' : 'MODERATE');
  const confidence = Number((0.91 + Math.random() * 0.08).toFixed(2));
  const trafficLevel = (severity === 'SEVERE' ? 'HIGH' : Math.random() > 0.5 ? 'HIGH' : 'NORMAL') as any;

  // Update robot position to the detection point
  await updateRobotStatus({
    currentLatitude: road.lat,
    currentLongitude: road.lng,
    currentLocation: `${road.roadName}, ${road.area}`,
    currentSpeedKmh: Number((12 + Math.random() * 6).toFixed(1)),
    batteryLevel: Math.max(15, robotStore.batteryLevel - 0.2)
  });

  const pothole = await createPothole({
    latitude: road.lat,
    longitude: road.lng,
    roadName: road.roadName,
    area: road.area,
    location: `${road.roadName}, ${road.area}`,
    severity,
    confidence,
    trafficLevel,
    detectedBy: 'Pothole Patrol Robot 01',
    source: 'AI_DETECTION',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
  });

  return pothole;
}

export function resetDemoData(): void {
  localStorage.removeItem(STORAGE_KEYS.POTHOLES);
  localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
  localStorage.removeItem(STORAGE_KEYS.ROBOT);
  potholesStore = [...INITIAL_POTHOLES];
  notificationsStore = [...INITIAL_NOTIFICATIONS];
  complaintsStore = [...INITIAL_COMPLAINTS];
  robotStore = { ...INITIAL_ROBOT_STATUS };
  eventBus.emit('DEMO_RESET', null);
}

/* -------------------------------------------------------------
 * GOVERNMENT AUTHENTICATION API
 * ----------------------------------------------------------- */

export async function loginGovernmentUser(
  email: string,
  password: string,
  role?: UserRole
): Promise<{ success: boolean; token?: string; user?: any; error?: string }> {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });

    const data = await response.json();
    if (response.ok && data.success) {
      return data;
    }
    return {
      success: false,
      error: data.error || 'Government authentication failed. Please check credentials.'
    };
  } catch (err) {
    console.warn('[API] Could not reach backend /api/auth/login:', err);
    if (email && password) {
      const fallbackRole = role || 'EXECUTIVE_ENGINEER';
      return {
        success: true,
        token: `gov_session_${Date.now()}`,
        user: {
          id: `usr-${Date.now()}`,
          name: fallbackRole === 'GOVT_ADMIN' ? 'Admin Officer (PWD)' : fallbackRole === 'FIELD_ENGINEER' ? 'Er. Sandeep Rai' : 'Er. Rajesh Bhat',
          email,
          role: fallbackRole,
          roleTitle: fallbackRole === 'GOVT_ADMIN' ? 'Government PWD Administrator' : fallbackRole === 'FIELD_ENGINEER' ? 'Field Inspection Engineer' : 'Executive Engineer (PWD)',
          department: fallbackRole === 'GOVT_ADMIN' ? 'Dakshina Kannada PWD Head Office' : 'Dakshina Kannada PWD - Mangaluru Division',
          token: `gov_session_${Date.now()}`
        }
      };
    }
    return { success: false, error: 'Network error connecting to government authentication server.' };
  }
}
