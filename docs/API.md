# Pothole Detection System - REST API Specification

**Base URL**: `https://api.potholesystem.in/api` (or `http://localhost:5000/api` during development)

All API responses are formatted in standard JSON.

---

## 1. Authentication Endpoints

### `POST /api/auth/login`
Authenticates a field engineer, government engineer, or administrator.

**Public Access**: Yes

**Request Body**:
```json
{
  "email": "engineer@dkpwd.gov.in",
  "password": "SecurePassword123"
}
```

**Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr-101",
    "name": "Er. Rajesh Bhat",
    "email": "engineer@dkpwd.gov.in",
    "role": "GOVERNMENT_ENGINEER",
    "department": "Dakshina Kannada PWD - Mangaluru Division"
  }
}
```

---

## 2. Pothole Telemetry & Detection Endpoints

### `GET /api/potholes`
Retrieves all logged road pothole detections across Dakshina Kannada.

**Public Access**: Yes

**Query Parameters**:
- `severity`: `SEVERE` | `MODERATE` | `NORMAL`
- `status`: `PENDING` | `INSPECTION` | `ASSIGNED` | `IN_PROGRESS` | `REPAIRED`
- `search`: Search query string

**Response (200 OK)**:
```json
[
  {
    "id": "PTH-001",
    "latitude": 12.8650354,
    "longitude": 74.9257386,
    "location": "Near Sahyadri College Gate 1, Adyar",
    "roadName": "Sahyadri Campus Access Road",
    "area": "Adyar, Mangaluru",
    "severity": "SEVERE",
    "confidence": 0.96,
    "priority": "CRITICAL",
    "status": "PENDING",
    "detectedBy": "Pothole Patrol Robot 01",
    "detectedAt": "2026-09-11T01:29:00Z",
    "imageUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7",
    "trafficLevel": "HIGH",
    "complaintCount": 4
  }
]
```

### `POST /api/potholes`
Robot ingestion endpoint. Accepts new autonomous pothole detections.

**Authorization**: Robot API Key or Authenticated User

**Request Body**:
```json
{
  "robotId": "ROBOT-01",
  "latitude": 12.8650354,
  "longitude": 74.9257386,
  "roadName": "Sahyadri Campus Road",
  "area": "Adyar, Mangaluru",
  "severity": "SEVERE",
  "confidence": 0.96,
  "trafficLevel": "HIGH",
  "imageUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7",
  "timestamp": "2026-09-11T01:29:00Z"
}
```

---

## 3. Citizen Complaint Endpoints

### `POST /api/complaints`
Allows citizens to submit road defect reports.

**Public Access**: Yes

**Request Body**:
```json
{
  "citizenName": "Karthik Shenoy",
  "citizenPhone": "+91 98450 12345",
  "location": "Adyar Junction, Near Petrol Pump",
  "latitude": 12.8982,
  "longitude": 74.8745,
  "description": "Large dangerous crater causing traffic slowdown.",
  "severityEstimate": "SEVERE"
}
```

**Response (201 Created)**:
```json
{
  "id": "CMP-0001",
  "status": "NEW",
  "message": "Complaint registered successfully."
}
```

### `GET /api/complaints/:id`
Check citizen complaint status by ID.

**Public Access**: Yes

---

## 4. Government Alert & Repair Management Endpoints

### `GET /api/notifications`
Lists automated government notifications for PWD / NHAI.

**Authorization**: `FIELD_ENGINEER`, `GOVERNMENT_ENGINEER`, `ADMIN`

### `PATCH /api/potholes/:id/repair`
Transitions repair lifecycle status.

**Authorization**: `FIELD_ENGINEER`, `GOVERNMENT_ENGINEER`, `ADMIN`

**Request Body**:
```json
{
  "status": "REPAIRED",
  "engineer": "Er. Rajesh Bhat",
  "note": "Bituminous cold-mix asphalt overlay applied and verified."
}
```

---

## 5. Robot Telemetry Endpoints

### `POST /api/robot/telemetry`
Receives live telemetry streams from `ROBOT-01` based at Sahyadri College.

**Request Body**:
```json
{
  "robotId": "ROBOT-01",
  "latitude": 12.8650354,
  "longitude": 74.9257386,
  "battery": 87.8,
  "speed": 12.0,
  "gpsStatus": "LOCKED",
  "cameraStatus": "ACTIVE",
  "aiStatus": "RUNNING",
  "timestamp": "2026-09-11T01:29:00Z"
}
```
