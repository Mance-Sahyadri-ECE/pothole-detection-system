import { query } from '../config/database';
import { DbComplaint, DbPothole, PriorityLevel, SeverityLevel } from '../types/database.types';
import { createNotification } from './notification.service';

export function calculatePriorityFromSeverity(severity: SeverityLevel): PriorityLevel {
  switch (severity) {
    case 'SEVERE':
      return 'CRITICAL';
    case 'MODERATE':
      return 'HIGH';
    case 'NORMAL':
    default:
      return 'MEDIUM';
  }
}

export async function getAllComplaints(): Promise<DbComplaint[]> {
  const res = await query<DbComplaint>('SELECT * FROM complaints ORDER BY submitted_at DESC');
  return res.rows;
}

export async function getComplaintById(id: string): Promise<DbComplaint | null> {
  const res = await query<DbComplaint>('SELECT * FROM complaints WHERE id = $1', [id]);
  return res.rows[0] || null;
}

export async function createComplaint(data: Partial<DbComplaint>): Promise<DbComplaint> {
  const countRes = await query<{ count: string }>('SELECT COUNT(*) as count FROM complaints');
  const count = parseInt(countRes.rows[0].count || '0', 10) + 1;
  const id = data.id || `CMP-${String(count).padStart(4, '0')}`;

  const res = await query<DbComplaint>(
    `INSERT INTO complaints (
      id, citizen_name, citizen_phone, citizen_email, location, latitude, longitude,
      description, severity_estimate, image_url, submitted_at, status, linked_pothole_id, admin_notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), $11, $12, $13)
    RETURNING *`,
    [
      id,
      data.citizen_name || 'Citizen Report',
      data.citizen_phone || null,
      data.citizen_email || null,
      data.location || 'Adyar, Mangaluru',
      data.latitude || 12.868,
      data.longitude || 74.872,
      data.description || 'Pothole reported via citizen grievance portal.',
      data.severity_estimate || 'MODERATE',
      data.image_url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      data.status || 'NEW',
      data.linked_pothole_id || null,
      data.admin_notes || null
    ]
  );
  return res.rows[0];
}

export async function acceptComplaintAndCreateRepairTask(
  complaintId: string,
  options?: { department?: string; notes?: string }
): Promise<{ complaint: DbComplaint; repairTask: DbPothole }> {
  const complaint = await getComplaintById(complaintId);
  if (!complaint) {
    throw new Error(`Complaint ${complaintId} not found`);
  }

  // Check if repair task already exists
  const existingRepair = await query<DbPothole>(
    'SELECT * FROM potholes WHERE id = $1 OR linked_complaint_id = $1',
    [complaintId]
  );

  let repairTask: DbPothole;

  if (existingRepair.rows.length > 0) {
    repairTask = existingRepair.rows[0];
  } else {
    const priority = calculatePriorityFromSeverity(complaint.severity_estimate);
    const department = options?.department || 'Dakshina Kannada PWD - Mangaluru Division';

    const insertRes = await query<DbPothole>(
      `INSERT INTO potholes (
        id, latitude, longitude, location, road_name, area, severity, confidence,
        priority, status, detected_by, detected_at, image_url, traffic_level,
        complaint_count, assigned_department, repair_notes, source, linked_complaint_id,
        government_notification_sent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *`,
      [
        complaint.id,
        complaint.latitude,
        complaint.longitude,
        complaint.location,
        complaint.location,
        'Mangaluru Jurisdiction',
        complaint.severity_estimate,
        0.98, // High verified confidence
        priority,
        'PENDING',
        `Citizen: ${complaint.citizen_name}`,
        complaint.image_url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        complaint.severity_estimate === 'SEVERE' ? 'HIGH' : 'NORMAL',
        1,
        department,
        options?.notes || `Citizen Grievance: ${complaint.description}`,
        'CITIZEN_COMPLAINT',
        complaint.id,
        true
      ]
    );
    repairTask = insertRes.rows[0];

    // Create initial repair history entry
    await query(
      `INSERT INTO repair_history (pothole_id, status, note, updated_by)
       VALUES ($1, $2, $3, $4)`,
      [
        repairTask.id,
        'PENDING',
        `Repair task generated from Citizen Complaint ${complaint.id} submitted by ${complaint.citizen_name}.`,
        'PWD Officer'
      ]
    );
  }

  // Update complaint status to UNDER REVIEW / linked
  const updatedComplaintRes = await query<DbComplaint>(
    `UPDATE complaints 
     SET status = 'UNDER REVIEW', linked_pothole_id = $1, admin_notes = COALESCE($2, admin_notes), updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [repairTask.id, `Accepted and converted to repair task ${repairTask.id}`, complaintId]
  );

  // Generate Notification
  await createNotification({
    pothole_id: repairTask.id,
    title: `CITIZEN COMPLAINT ACCEPTED (${complaint.id})`,
    location: complaint.location,
    latitude: complaint.latitude,
    longitude: complaint.longitude,
    severity: complaint.severity_estimate,
    priority: calculatePriorityFromSeverity(complaint.severity_estimate),
    detected_by: `Citizen: ${complaint.citizen_name}`,
    recommended_action: `Repair task ${repairTask.id} generated. Schedule crew assignment.`,
    assigned_department: 'Dakshina Kannada PWD',
    status: 'NEW'
  });

  return {
    complaint: updatedComplaintRes.rows[0],
    repairTask
  };
}

export async function rejectComplaint(
  complaintId: string,
  reason: string
): Promise<DbComplaint> {
  const res = await query<DbComplaint>(
    `UPDATE complaints 
     SET status = 'RESOLVED', admin_notes = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [`Complaint rejected: ${reason}`, complaintId]
  );
  if (res.rows.length === 0) {
    throw new Error(`Complaint ${complaintId} not found`);
  }
  return res.rows[0];
}

export async function updateComplaintStatus(
  complaintId: string,
  status: DbComplaint['status'],
  adminNotes?: string
): Promise<DbComplaint> {
  const res = await query<DbComplaint>(
    `UPDATE complaints 
     SET status = $1, admin_notes = COALESCE($2, admin_notes), updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [status, adminNotes || null, complaintId]
  );
  if (res.rows.length === 0) {
    throw new Error(`Complaint ${complaintId} not found`);
  }
  return res.rows[0];
}
