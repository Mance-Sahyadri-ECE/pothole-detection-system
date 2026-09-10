-- ==============================================================================
-- Pothole Detection System - PostgreSQL / Supabase Schema
-- ==============================================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==============================================================================
-- 1. ROBOTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS robots (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'OFFLINE' CHECK (status IN ('ONLINE', 'OFFLINE', 'CHARGING', 'PATROLLING', 'MAINTENANCE')),
    battery_level INTEGER NOT NULL DEFAULT 100 CHECK (battery_level >= 0 AND battery_level <= 100),
    gps_status VARCHAR(50) NOT NULL DEFAULT 'DISCONNECTED' CHECK (gps_status IN ('LOCKED', 'SEARCHING', 'DISCONNECTED')),
    camera_status VARCHAR(50) NOT NULL DEFAULT 'STANDBY' CHECK (camera_status IN ('ACTIVE', 'STANDBY', 'ERROR')),
    ai_model_status VARCHAR(50) NOT NULL DEFAULT 'INITIALIZING' CHECK (ai_model_status IN ('RUNNING', 'INITIALIZING', 'ERROR')),
    internet_connection VARCHAR(50) NOT NULL DEFAULT '4G CONNECTED' CHECK (internet_connection IN ('5G CONNECTED', '4G CONNECTED', 'OFFLINE')),
    last_data_received TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_latitude NUMERIC(10, 7) NOT NULL DEFAULT 12.8680,
    current_longitude NUMERIC(10, 7) NOT NULL DEFAULT 74.8720,
    current_speed_kmh NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    current_location VARCHAR(255) NOT NULL DEFAULT 'Base Station',
    potholes_detected_today INTEGER NOT NULL DEFAULT 0,
    km_patrolled_today NUMERIC(6, 2) NOT NULL DEFAULT 0.0,
    model_latency_ms INTEGER NOT NULL DEFAULT 42,
    hardware_temp_c NUMERIC(5, 1) NOT NULL DEFAULT 38.5,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_robots_modtime ON robots;
CREATE TRIGGER update_robots_modtime
BEFORE UPDATE ON robots
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ==============================================================================
-- 2. ROBOT TELEMETRY & GPS HISTORY TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS robot_telemetry_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    robot_id VARCHAR(100) NOT NULL REFERENCES robots(id) ON DELETE CASCADE,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    speed_kmh NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    battery_level INTEGER NOT NULL DEFAULT 100,
    heading_deg NUMERIC(5, 2) DEFAULT 0.0,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_telemetry_robot_time ON robot_telemetry_logs(robot_id, recorded_at DESC);

-- ==============================================================================
-- 3. POTHOLES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS potholes (
    id VARCHAR(100) PRIMARY KEY,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    location VARCHAR(255) NOT NULL,
    road_name VARCHAR(255) NOT NULL,
    area VARCHAR(255) NOT NULL,
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('NORMAL', 'MODERATE', 'SEVERE')),
    confidence NUMERIC(4, 3) NOT NULL DEFAULT 0.900,
    priority VARCHAR(50) NOT NULL CHECK (priority IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'INSPECTION', 'ASSIGNED', 'REPAIR IN PROGRESS', 'REPAIRED')),
    detected_by VARCHAR(255) NOT NULL,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    image_url TEXT NOT NULL,
    repaired_image_url TEXT,
    traffic_level VARCHAR(50) NOT NULL DEFAULT 'NORMAL' CHECK (traffic_level IN ('HIGH', 'MEDIUM', 'NORMAL', 'LOW')),
    length_cm NUMERIC(6, 2),
    width_cm NUMERIC(6, 2),
    depth_cm NUMERIC(6, 2),
    area_sq_m NUMERIC(6, 3),
    complaint_count INTEGER NOT NULL DEFAULT 0,
    assigned_department VARCHAR(255),
    assigned_engineer VARCHAR(255),
    repair_notes TEXT,
    bounding_box JSONB,
    source VARCHAR(50) NOT NULL DEFAULT 'AI_DETECTION',
    linked_complaint_id VARCHAR(100),
    government_notification_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_potholes_status ON potholes(status);
CREATE INDEX IF NOT EXISTS idx_potholes_severity ON potholes(severity);
CREATE INDEX IF NOT EXISTS idx_potholes_priority ON potholes(priority);
CREATE INDEX IF NOT EXISTS idx_potholes_coords ON potholes(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_potholes_detected_at ON potholes(detected_at DESC);

DROP TRIGGER IF EXISTS update_potholes_modtime ON potholes;
CREATE TRIGGER update_potholes_modtime
BEFORE UPDATE ON potholes
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ==============================================================================
-- 4. REPAIR HISTORY TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS repair_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pothole_id VARCHAR(100) NOT NULL REFERENCES potholes(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    note TEXT NOT NULL,
    updated_by VARCHAR(255) NOT NULL,
    repair_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_repair_history_pothole ON repair_history(pothole_id, created_at DESC);

-- ==============================================================================
-- 5. GOVERNMENT NOTIFICATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS government_notifications (
    id VARCHAR(100) PRIMARY KEY,
    pothole_id VARCHAR(100) REFERENCES potholes(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('NORMAL', 'MODERATE', 'SEVERE')),
    priority VARCHAR(50) NOT NULL CHECK (priority IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    detected_by VARCHAR(255) NOT NULL,
    recommended_action TEXT NOT NULL,
    assigned_department VARCHAR(255) NOT NULL,
    viewed BOOLEAN NOT NULL DEFAULT FALSE,
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'INSPECTION_SCHEDULED', 'REPAIR_ASSIGNED', 'RESOLVED')),
    channel_delivery JSONB DEFAULT '{"dashboard": true, "email": true, "sms": false, "telegram": false}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gov_notif_status ON government_notifications(status);
CREATE INDEX IF NOT EXISTS idx_gov_notif_created ON government_notifications(created_at DESC);

DROP TRIGGER IF EXISTS update_gov_notifications_modtime ON government_notifications;
CREATE TRIGGER update_gov_notifications_modtime
BEFORE UPDATE ON government_notifications
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ==============================================================================
-- 6. CITIZEN COMPLAINTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS complaints (
    id VARCHAR(100) PRIMARY KEY,
    citizen_name VARCHAR(255) NOT NULL,
    citizen_phone VARCHAR(50),
    citizen_email VARCHAR(255),
    location VARCHAR(255) NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    description TEXT NOT NULL,
    severity_estimate VARCHAR(50) NOT NULL CHECK (severity_estimate IN ('NORMAL', 'MODERATE', 'SEVERE')),
    image_url TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status VARCHAR(50) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'UNDER REVIEW', 'ASSIGNED', 'IN PROGRESS', 'RESOLVED')),
    linked_pothole_id VARCHAR(100) REFERENCES potholes(id) ON DELETE SET NULL,
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_submitted_at ON complaints(submitted_at DESC);

DROP TRIGGER IF EXISTS update_complaints_modtime ON complaints;
CREATE TRIGGER update_complaints_modtime
BEFORE UPDATE ON complaints
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Migration patch for existing tables
ALTER TABLE potholes ADD COLUMN IF NOT EXISTS source VARCHAR(50) NOT NULL DEFAULT 'AI_DETECTION';
ALTER TABLE potholes ADD COLUMN IF NOT EXISTS linked_complaint_id VARCHAR(100);


