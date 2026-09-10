import { query } from '../config/database';
import { DbRobot, DbRobotTelemetryLog } from '../types/database.types';

export async function getRobotStatus(): Promise<DbRobot | null> {
  const res = await query<DbRobot>('SELECT * FROM robots ORDER BY created_at ASC LIMIT 1');
  return res.rows[0] || null;
}

export async function updateRobotStatus(updates: Partial<DbRobot>): Promise<DbRobot> {
  const current = await getRobotStatus();
  if (!current) {
    throw new Error('No robot registered');
  }

  const res = await query<DbRobot>(
    `UPDATE robots
     SET status = COALESCE($1, status),
         battery_level = COALESCE($2, battery_level),
         current_latitude = COALESCE($3, current_latitude),
         current_longitude = COALESCE($4, current_longitude),
         current_speed_kmh = COALESCE($5, current_speed_kmh),
         current_location = COALESCE($6, current_location),
         potholes_detected_today = COALESCE($7, potholes_detected_today),
         km_patrolled_today = COALESCE($8, km_patrolled_today),
         last_data_received = NOW(),
         updated_at = NOW()
     WHERE id = $9
     RETURNING *`,
    [
      updates.status,
      updates.battery_level,
      updates.current_latitude,
      updates.current_longitude,
      updates.current_speed_kmh,
      updates.current_location,
      updates.potholes_detected_today,
      updates.km_patrolled_today,
      current.id
    ]
  );

  return res.rows[0];
}
