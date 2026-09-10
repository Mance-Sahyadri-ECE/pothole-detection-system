import { getDbPool } from '../config/database';
import { config } from '../config/env';

async function seedDatabase() {
  console.log('--- Seeding Pothole Detection System Database ---');
  if (!config.databaseUrl) {
    console.error('Error: DATABASE_URL is not set. Please configure DATABASE_URL in .env before seeding.');
    process.exit(1);
  }

  const pool = getDbPool();

  try {
    const client = await pool.connect();

    console.log('1. Seeding Robots...');
    await client.query(`
      INSERT INTO robots (
        id, name, status, battery_level, gps_status, camera_status, ai_model_status, 
        internet_connection, last_data_received, current_latitude, current_longitude, 
        current_speed_kmh, current_location, potholes_detected_today, km_patrolled_today, 
        model_latency_ms, hardware_temp_c
      ) VALUES 
      (
        'ROBOT-01', 'Pothole Patrol Robot 01', 'PATROLLING', 84, 'LOCKED', 'ACTIVE', 'RUNNING',
        '5G CONNECTED', NOW(), 12.8680, 74.8720, 14.5, 'NH-66 Near Adyar Junction',
        14, 18.6, 38, 41.2
      ),
      (
        'ROBOT-02', 'Pothole Patrol Robot 02', 'CHARGING', 98, 'LOCKED', 'STANDBY', 'RUNNING',
        '5G CONNECTED', NOW(), 12.8732, 74.8845, 0.0, 'Central Municipal Charging Bay',
        6, 12.3, 44, 36.8
      )
      ON CONFLICT (id) DO UPDATE SET
        battery_level = EXCLUDED.battery_level,
        status = EXCLUDED.status,
        last_data_received = EXCLUDED.last_data_received;
    `);

    console.log('2. Seeding Potholes...');
    await client.query(`
      INSERT INTO potholes (
        id, latitude, longitude, location, road_name, area, severity, confidence, 
        priority, status, detected_by, detected_at, image_url, traffic_level, 
        length_cm, width_cm, depth_cm, area_sq_m, complaint_count, 
        assigned_department, assigned_engineer, bounding_box, government_notification_sent
      ) VALUES 
      (
        'POT-2026-001', 12.8682, 74.8725, 'Near Adyar Flyover Pillar 14', 'NH-66 Highway', 'Adyar, Mangaluru',
        'SEVERE', 0.965, 'CRITICAL', 'ASSIGNED', 'Pothole Patrol Robot 01', NOW() - INTERVAL '2 hours',
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        'HIGH', 85.0, 60.0, 12.5, 0.51, 4, 'National Highway Authority (NHAI)', 'Eng. Rajesh Kumar',
        '{"x": 120, "y": 85, "width": 240, "height": 180}'::jsonb, TRUE
      ),
      (
        'POT-2026-002', 12.8745, 74.8812, 'Opposite City Bus Stand', 'MG Road', 'Hampankatta, Mangaluru',
        'MODERATE', 0.912, 'HIGH', 'INSPECTION', 'Pothole Patrol Robot 01', NOW() - INTERVAL '4 hours',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
        'HIGH', 45.0, 40.0, 7.0, 0.18, 2, 'City Municipal Corporation (MCC)', 'Eng. Priya Sharma',
        '{"x": 160, "y": 110, "width": 180, "height": 140}'::jsonb, TRUE
      ),
      (
        'POT-2026-003', 12.8610, 74.8654, 'Near Pumpwell Circle East Ramp', 'Pumpwell Main Road', 'Pumpwell, Mangaluru',
        'NORMAL', 0.884, 'MEDIUM', 'PENDING', 'Pothole Patrol Robot 02', NOW() - INTERVAL '6 hours',
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        'MEDIUM', 30.0, 25.0, 4.0, 0.075, 1, 'Public Works Department (PWD)', NULL,
        '{"x": 90, "y": 70, "width": 130, "height": 110}'::jsonb, FALSE
      ),
      (
        'POT-2026-004', 12.8820, 74.8430, 'Near Ladyhill Circle', 'Urwa Market Road', 'Ladyhill, Mangaluru',
        'NORMAL', 0.940, 'LOW', 'REPAIRED', 'Pothole Patrol Robot 01', NOW() - INTERVAL '1 day',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
        'NORMAL', 50.0, 45.0, 6.0, 0.225, 3, 'City Municipal Corporation (MCC)', 'Eng. Suresh Hegde',
        '{"x": 100, "y": 90, "width": 150, "height": 130}'::jsonb, TRUE
      ),
      (
        'PTH-001', 12.9006, 74.8702, 'Sahyadri College Main Gate Road', 'Sahyadri Campus Access Road', 'Adyar, Mangaluru',
        'SEVERE', 0.965, 'CRITICAL', 'ASSIGNED', 'Pothole Patrol Robot 01', NOW() - INTERVAL '2 hours',
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        'HIGH', 85.0, 60.0, 12.5, 0.51, 1, 'Dakshina Kannada PWD', 'Er. Rajesh Bhat (PWD)',
        '{"x": 120, "y": 85, "width": 240, "height": 180}'::jsonb, TRUE
      ),
      (
        'PTH-002', 12.8979, 74.8742, 'NH 73 Adyar Bridge Approach', 'NH-73 Highway', 'Adyar, Mangaluru',
        'SEVERE', 0.942, 'CRITICAL', 'REPAIR IN PROGRESS', 'Pothole Patrol Robot 01', NOW() - INTERVAL '4 hours',
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
        'HIGH', 70.0, 50.0, 10.0, 0.35, 1, 'National Highway Authority (NHAI)', 'Er. Suresh Kumar (NHAI)',
        '{"x": 140, "y": 95, "width": 200, "height": 160}'::jsonb, TRUE
      ),
      (
        'PTH-003', 12.8945, 74.8825, 'Valachil Bus Stop Road', 'Valachil Road', 'Valachil, Mangaluru',
        'MODERATE', 0.880, 'MEDIUM', 'INSPECTION', 'Pothole Patrol Robot 02', NOW() - INTERVAL '6 hours',
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        'NORMAL', 40.0, 35.0, 5.0, 0.14, 1, 'City Municipal Corporation (MCC)', 'Er. Anitha Shetty (MCC)',
        '{"x": 80, "y": 60, "width": 120, "height": 100}'::jsonb, FALSE
      ),
      (
        'PTH-004', 12.8820, 74.8430, 'Near Ladyhill Circle', 'Urwa Market Road', 'Ladyhill, Mangaluru',
        'NORMAL', 0.920, 'LOW', 'REPAIRED', 'Pothole Patrol Robot 01', NOW() - INTERVAL '1 day',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
        'LOW', 30.0, 25.0, 3.5, 0.075, 0, 'City Municipal Corporation (MCC)', 'Er. Sandeep Rai (PWD Zone 3)',
        '{"x": 90, "y": 70, "width": 100, "height": 80}'::jsonb, TRUE
      )
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log('3. Seeding Government Notifications...');
    await client.query(`
      INSERT INTO government_notifications (
        id, pothole_id, title, location, latitude, longitude, severity, priority, 
        detected_by, recommended_action, assigned_department, viewed, resolved, status, channel_delivery
      ) VALUES 
      (
        'NOTIF-2026-001', 'POT-2026-001', 'Critical Pothole Alert: NH-66 Adyar Flyover', 'Near Adyar Flyover Pillar 14',
        12.8682, 74.8725, 'SEVERE', 'CRITICAL', 'Pothole Patrol Robot 01',
        'Immediate asphalt patching required due to heavy highway vehicular traffic and high depth (>12cm).',
        'National Highway Authority (NHAI)', FALSE, FALSE, 'REPAIR_ASSIGNED',
        '{"dashboard": true, "email": true, "sms": true, "telegram": true}'::jsonb
      ),
      (
        'NOTIF-2026-002', 'POT-2026-002', 'High Severity Pothole: MG Road Bus Stand', 'Opposite City Bus Stand',
        12.8745, 74.8812, 'MODERATE', 'HIGH', 'Pothole Patrol Robot 01',
        'Schedule repair crew within 24 hours to prevent traffic disruption.',
        'City Municipal Corporation (MCC)', TRUE, FALSE, 'INSPECTION_SCHEDULED',
        '{"dashboard": true, "email": true, "sms": false, "telegram": false}'::jsonb
      )
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log('4. Seeding Complaints...');
    await client.query(`
      INSERT INTO complaints (
        id, citizen_name, citizen_phone, citizen_email, location, latitude, longitude, 
        description, severity_estimate, submitted_at, status, linked_pothole_id
      ) VALUES 
      (
        'CMP-2026-101', 'Kavitha Shenoy', '+91 98450 12345', 'kavitha.shenoy@example.com',
        'NH-66 Near Adyar Junction', 12.8682, 74.8725,
        'Massive crater-like pothole causing vehicle swerving and close accidents during evening rush hour.',
        'SEVERE', NOW() - INTERVAL '3 hours', 'ASSIGNED', 'POT-2026-001'
      ),
      (
        'CMP-2026-102', 'Anil D Souza', '+91 97410 67890', 'anil.dsouza@example.com',
        'MG Road Near City Bus Stand', 12.8745, 74.8812,
        'Deep pothole right near the bus stop where pedestrians cross.',
        'MODERATE', NOW() - INTERVAL '5 hours', 'UNDER REVIEW', 'POT-2026-002'
      ),
      (
        'CMP-0001', 'Karthik Shenoy', '+91 98450 12345', 'karthik.s@gmail.com',
        'Sahyadri College Main Gate Road', 12.9006, 74.8702,
        'Two-wheeler riders are skidding due to a deep pothole near the campus turn. Please repair immediately before rains.',
        'SEVERE', NOW() - INTERVAL '2 hours', 'ASSIGNED', 'PTH-001'
      ),
      (
        'CMP-0002', 'Pooja Rai', '+91 97400 98765', NULL,
        'NH 73 Adyar Bridge Approach', 12.8979, 74.8742,
        'Heavy crater forming on the left lane towards Bantwal. Causing traffic jams.',
        'SEVERE', NOW() - INTERVAL '6 hours', 'IN PROGRESS', 'PTH-002'
      ),
      (
        'CMP-0003', 'Mohammed Ashfaq', '+91 94481 44332', 'ashfaq.m@outlook.com',
        'Valachil Bus Stop Road', 12.8945, 74.8825,
        'Multiple surface cracks developing after yesterday evening heavy downpour.',
        'MODERATE', NOW() - INTERVAL '12 hours', 'UNDER REVIEW', 'PTH-003'
      ),
      (
        'CMP-0004', 'Deepak Rao', '+91 98801 23456', 'deepak.rao@gmail.com',
        'Pumpwell Junction Flyover Ramp', 12.8688, 74.8695,
        'Large pothole in the middle lane causing dangerous slowdowns and risk of accidents.',
        'SEVERE', NOW() - INTERVAL '45 minutes', 'NEW', NULL
      )
      ON CONFLICT (id) DO NOTHING;
    `);

    client.release();
    console.log('✓ Seeding completed successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
