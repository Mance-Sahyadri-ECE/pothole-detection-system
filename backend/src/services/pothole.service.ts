import { query } from '../config/database';
import { DbPothole, DbRepairHistoryItem, PotholeStatus } from '../types/database.types';
import { createNotification, updateNotification } from './notification.service';

export interface PotholeWithHistory extends DbPothole {
  repairHistory: DbRepairHistoryItem[];
}

export async function getAllPotholes(): Promise<PotholeWithHistory[]> {
  const potholesRes = await query<DbPothole>('SELECT * FROM potholes ORDER BY created_at DESC');
  const historyRes = await query<DbRepairHistoryItem>('SELECT * FROM repair_history ORDER BY created_at ASC');

  const historyMap = new Map<string, DbRepairHistoryItem[]>();
  for (const item of historyRes.rows) {
    if (!historyMap.has(item.pothole_id)) {
      historyMap.set(item.pothole_id, []);
    }
    historyMap.get(item.pothole_id)!.push(item);
  }

  return potholesRes.rows.map(p => ({
    ...p,
    repairHistory: historyMap.get(p.id) || []
  }));
}

export async function getPotholeById(id: string): Promise<PotholeWithHistory | null> {
  const potholeRes = await query<DbPothole>('SELECT * FROM potholes WHERE id = $1', [id]);
  if (potholeRes.rows.length === 0) return null;

  const historyRes = await query<DbRepairHistoryItem>(
    'SELECT * FROM repair_history WHERE pothole_id = $1 ORDER BY created_at ASC',
    [id]
  );

  return {
    ...potholeRes.rows[0],
    repairHistory: historyRes.rows
  };
}

export async function createPothole(data: Partial<DbPothole>): Promise<PotholeWithHistory> {
  const countRes = await query<{ count: string }>('SELECT COUNT(*) as count FROM potholes');
  const count = parseInt(countRes.rows[0].count || '0', 10) + 1;
  const id = data.id || `PTH-${String(count).padStart(3, '0')}`;

  const res = await query<DbPothole>(
    `INSERT INTO potholes (
      id, latitude, longitude, location, road_name, area, severity, confidence,
      priority, status, detected_by, detected_at, image_url, traffic_level,
      length_cm, width_cm, depth_cm, area_sq_m, complaint_count, assigned_department,
      assigned_engineer, repair_notes, bounding_box, source, linked_complaint_id,
      government_notification_sent
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
    RETURNING *`,
    [
      id,
      data.latitude || 12.868,
      data.longitude || 74.872,
      data.location || 'NH-66 Highway, Mangaluru',
      data.road_name || 'NH-66',
      data.area || 'Adyar, Mangaluru',
      data.severity || 'SEVERE',
      data.confidence || 0.95,
      data.priority || 'CRITICAL',
      data.status || 'PENDING',
      data.detected_by || 'Pothole Patrol Robot 01',
      data.image_url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      data.traffic_level || 'HIGH',
      data.length_cm !== undefined ? data.length_cm : null,
      data.width_cm !== undefined ? data.width_cm : null,
      data.depth_cm !== undefined ? data.depth_cm : null,
      data.area_sq_m !== undefined ? data.area_sq_m : null,
      data.complaint_count || 0,
      data.assigned_department || 'Dakshina Kannada PWD',
      data.assigned_engineer || null,
      data.repair_notes || null,
      data.bounding_box ? JSON.stringify(data.bounding_box) : null,
      data.source || 'AI_DETECTION',
      data.linked_complaint_id || null,
      false
    ]
  );

  const pothole = res.rows[0];

  // Initial history
  const historyItem = await query<DbRepairHistoryItem>(
    `INSERT INTO repair_history (pothole_id, status, note, updated_by)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [pothole.id, 'PENDING', `Logged by ${pothole.detected_by}`, pothole.detected_by]
  );

  return {
    ...pothole,
    repairHistory: [historyItem.rows[0]]
  };
}

export async function updateRepairStatus(
  id: string,
  newStatus: PotholeStatus,
  note?: string,
  engineer?: string,
  repairImage?: string
): Promise<PotholeWithHistory> {
  const current = await getPotholeById(id);
  if (!current) {
    throw new Error(`Pothole / Repair record ${id} not found`);
  }

  const assignedEngineer = engineer || current.assigned_engineer;
  const repairedImageUrl = newStatus === 'REPAIRED' 
    ? (repairImage || current.repaired_image_url || 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80')
    : current.repaired_image_url;

  const updateRes = await query<DbPothole>(
    `UPDATE potholes
     SET status = $1, assigned_engineer = $2, repaired_image_url = $3,
         repair_notes = COALESCE($4, repair_notes), updated_at = NOW()
     WHERE id = $5
     RETURNING *`,
    [newStatus, assignedEngineer, repairedImageUrl, note || null, id]
  );

  const updatedPothole = updateRes.rows[0];

  // Insert into repair history
  const historyRes = await query<DbRepairHistoryItem>(
    `INSERT INTO repair_history (pothole_id, status, note, updated_by, repair_image_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      id,
      newStatus,
      note || `Status transitioned to ${newStatus}`,
      assignedEngineer || 'PWD Control Room',
      repairedImageUrl
    ]
  );

  // Check if linked to a citizen complaint (e.g. CMP-xxxx or linked_complaint_id)
  const complaintId = updatedPothole.linked_complaint_id || (id.startsWith('CMP-') ? id : null);

  if (complaintId) {
    if (newStatus === 'REPAIRED') {
      // Auto-resolve linked citizen complaint
      await query(
        `UPDATE complaints
         SET status = 'RESOLVED', admin_notes = COALESCE(admin_notes || ' | ', '') || 'Repair completed by ' || $1, updated_at = NOW()
         WHERE id = $2 OR linked_pothole_id = $3`,
        [assignedEngineer || 'PWD Crew', complaintId, id]
      );

      // Generate Repair Completed Notification
      await createNotification({
        pothole_id: id,
        title: `REPAIR COMPLETED (${id})`,
        location: updatedPothole.location,
        latitude: updatedPothole.latitude,
        longitude: updatedPothole.longitude,
        severity: updatedPothole.severity,
        priority: updatedPothole.priority,
        detected_by: updatedPothole.detected_by,
        recommended_action: `Repair verified and marked complete by ${assignedEngineer || 'PWD Team'}. Grievance resolved.`,
        assigned_department: updatedPothole.assigned_department || 'Dakshina Kannada PWD',
        status: 'RESOLVED',
        resolved: true
      });
    } else if (newStatus === 'ASSIGNED') {
      await query(
        `UPDATE complaints
         SET status = 'ASSIGNED', admin_notes = COALESCE(admin_notes || ' | ', '') || 'Assigned to ' || $1, updated_at = NOW()
         WHERE id = $2 OR linked_pothole_id = $3`,
        [assignedEngineer || 'PWD Engineer', complaintId, id]
      );

      // Generate Notification
      await createNotification({
        pothole_id: id,
        title: `ENGINEER ASSIGNED (${id})`,
        location: updatedPothole.location,
        latitude: updatedPothole.latitude,
        longitude: updatedPothole.longitude,
        severity: updatedPothole.severity,
        priority: updatedPothole.priority,
        detected_by: updatedPothole.detected_by,
        recommended_action: `Work order dispatched to ${assignedEngineer}.`,
        assigned_department: updatedPothole.assigned_department || 'Dakshina Kannada PWD',
        status: 'REPAIR_ASSIGNED'
      });
    } else if (newStatus === 'REPAIR IN PROGRESS') {
      await query(
        `UPDATE complaints
         SET status = 'IN PROGRESS', admin_notes = COALESCE(admin_notes || ' | ', '') || 'Repair in progress', updated_at = NOW()
         WHERE id = $1 OR linked_pothole_id = $2`,
        [complaintId, id]
      );

      // Generate Notification
      await createNotification({
        pothole_id: id,
        title: `REPAIR IN PROGRESS (${id})`,
        location: updatedPothole.location,
        latitude: updatedPothole.latitude,
        longitude: updatedPothole.longitude,
        severity: updatedPothole.severity,
        priority: updatedPothole.priority,
        detected_by: updatedPothole.detected_by,
        recommended_action: `Repair crew is actively working on site.`,
        assigned_department: updatedPothole.assigned_department || 'Dakshina Kannada PWD',
        status: 'INSPECTION_SCHEDULED'
      });
    }
  } else {
    // For PTH AI detected potholes:
    if (newStatus === 'REPAIRED') {
      await createNotification({
        pothole_id: id,
        title: `REPAIR COMPLETED (${id})`,
        location: updatedPothole.location,
        latitude: updatedPothole.latitude,
        longitude: updatedPothole.longitude,
        severity: updatedPothole.severity,
        priority: updatedPothole.priority,
        detected_by: updatedPothole.detected_by,
        recommended_action: `Road hazard successfully repaired by ${assignedEngineer || 'PWD Crew'}.`,
        assigned_department: updatedPothole.assigned_department || 'Dakshina Kannada PWD',
        status: 'RESOLVED',
        resolved: true
      });
    } else if (newStatus === 'ASSIGNED') {
      await createNotification({
        pothole_id: id,
        title: `ENGINEER ASSIGNED (${id})`,
        location: updatedPothole.location,
        latitude: updatedPothole.latitude,
        longitude: updatedPothole.longitude,
        severity: updatedPothole.severity,
        priority: updatedPothole.priority,
        detected_by: updatedPothole.detected_by,
        recommended_action: `Assigned to ${assignedEngineer}.`,
        assigned_department: updatedPothole.assigned_department || 'Dakshina Kannada PWD',
        status: 'REPAIR_ASSIGNED'
      });
    }
  }

  const allHistory = await query<DbRepairHistoryItem>(
    'SELECT * FROM repair_history WHERE pothole_id = $1 ORDER BY created_at ASC',
    [id]
  );

  return {
    ...updatedPothole,
    repairHistory: allHistory.rows
  };
}
