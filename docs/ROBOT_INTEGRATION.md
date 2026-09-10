# Physical Robot Hardware Integration Guide

**Platform**: Pothole Patrol Autonomous Inspection Robot (`ROBOT-01`)  
**Base Station**: Sahyadri College of Engineering & Management, Adyar, Mangaluru, Dakshina Kannada, Karnataka, India (`12.8650354° N, 74.9257386° E`)

---

## 1. System Integration Architecture

```
 PHYSICAL ROBOT (ROBOT-01)
 [GPS RTK + Sony Camera + Jetson Orin Edge AI]
         │
         │ Cellular 5G / MQTT / HTTP POST
         ▼
 BACKEND API (POST /api/robot/telemetry & POST /api/potholes)
         │
         ├──► PostgreSQL Database
         ├──► Government Alert Engine
         └──► Socket.IO WebSockets Broadcast
                 │
                 ▼
 FRONTEND DASHBOARD & LIVE MAP
```

---

## 2. Telemetry Payload Specification

The physical robot must send heartbeats every 5 seconds to `POST /api/robot/telemetry`:

```json
{
  "robotId": "ROBOT-01",
  "timestamp": "2026-09-11T01:29:00.000Z",
  "latitude": 12.8650354,
  "longitude": 74.9257386,
  "gpsAccuracyMeters": 0.05,
  "battery": 87.8,
  "speedKmh": 12.0,
  "headingDegrees": 184.2,
  "cameraStatus": "ACTIVE",
  "aiStatus": "RUNNING",
  "networkSignalDbm": -68
}
```

---

## 3. Pothole Detection Detection Payload

When the on-board YOLOv8 edge inference model detects a road surface defect, post to `POST /api/potholes`:

```json
{
  "robotId": "ROBOT-01",
  "latitude": 12.8650354,
  "longitude": 74.9257386,
  "roadName": "Sahyadri Campus Access Road",
  "area": "Adyar, Mangaluru",
  "severity": "SEVERE",
  "confidence": 0.964,
  "trafficLevel": "HIGH",
  "imageUrl": "https://storage.potholesystem.in/frames/2026/pth_984.jpg",
  "timestamp": "2026-09-11T01:29:00.000Z",
  "boundingBox": {
    "x": 250,
    "y": 180,
    "width": 500,
    "height": 240
  },
  "estimatedDimensions": {
    "lengthCm": 65,
    "widthCm": 48,
    "depthCm": 14
  }
}
```

---

## 4. Hardware Specs & Prerequisites

- **Microcontroller**: NVIDIA Jetson Orin Nano / Xavier NX Edge Computer
- **Optical Sensor**: Sony IMX390 HDR CMOS Camera (1080p 60fps)
- **GNSS Module**: u-blox ZED-F9P RTK GPS (Centimeter-level accuracy)
- **Connectivity**: Quectel RM500Q-GL 5G NR Module
