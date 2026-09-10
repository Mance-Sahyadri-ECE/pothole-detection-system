import { query } from '../config/database';
import { DbGovernmentNotification } from '../types/database.types';

export async function getAllNotifications(): Promise<DbGovernmentNotification[]> {
  const res = await query<DbGovernmentNotification>(
    'SELECT * FROM government_notifications ORDER BY created_at DESC'
  );
  return res.rows;
}

export async function createNotification(data: Partial<DbGovernmentNotification>): Promise<DbGovernmentNotification> {
  const id = data.id || `NOTIF-${Date.now()}`;
  const res = await query<DbGovernmentNotification>(
    `INSERT INTO government_notifications (
      id, pothole_id, title, location, latitude, longitude, severity, priority,
      detected_by, recommended_action, assigned_department, viewed, resolved, status, channel_delivery
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *`,
    [
      id,
      data.pothole_id || null,
      data.title || 'Road Maintenance Notification',
      data.location || 'Mangaluru',
      data.latitude || 12.868,
      data.longitude || 74.872,
      data.severity || 'NORMAL',
      data.priority || 'LOW',
      data.detected_by || 'Control Room',
      data.recommended_action || 'Review and take necessary action.',
      data.assigned_department || 'Dakshina Kannada PWD',
      data.viewed || false,
      data.resolved || false,
      data.status || 'NEW',
      JSON.stringify(data.channel_delivery || { dashboard: true, email: true, sms: false, telegram: false })
    ]
  );
  return res.rows[0];
}

export async function updateNotification(id: string, updates: Partial<DbGovernmentNotification>): Promise<DbGovernmentNotification | null> {
  const existing = await query<DbGovernmentNotification>('SELECT * FROM government_notifications WHERE id = $1', [id]);
  if (existing.rows.length === 0) return null;

  const current = existing.rows[0];
  const viewed = updates.viewed !== undefined ? updates.viewed : current.viewed;
  const resolved = updates.resolved !== undefined ? updates.resolved : current.resolved;
  const status = updates.status || current.status;

  const res = await query<DbGovernmentNotification>(
    `UPDATE government_notifications 
     SET viewed = $1, resolved = $2, status = $3, updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [viewed, resolved, status, id]
  );
  return res.rows[0];
}
