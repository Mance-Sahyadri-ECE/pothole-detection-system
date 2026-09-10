# Pothole Detection System - Backend

Backend service for the Pothole Detection System built with Node.js, Express, and TypeScript.

## Architecture

```
backend/
  src/
    config/         # App configuration & environment variables
    controllers/    # HTTP route controllers (request/response handling)
    middleware/     # Express custom middleware (auth, error handling, validation)
    routes/         # API route definitions
    services/       # Business logic and database/external service integrations
    socket/         # WebSocket / Socket.IO event handlers
    types/          # TypeScript type definitions and interfaces
    utils/          # Reusable helper functions
    app.ts          # Express application initialization & middleware setup
    server.ts       # HTTP Server entrypoint & lifecycle management
  package.json
  tsconfig.json
  .env.example
  .gitignore
  README.md
```

## Upcoming Endpoints

The backend will provide REST APIs and WebSocket connections for:
- **Potholes**: Detection records, severity, status, location markers.
- **Robots**: Robot fleet status, battery, telemetry.
- **Robot GPS Locations**: Real-time live tracking stream.
- **Government Notifications**: Automated dispatch alerts and reports.
- **Complaints**: Citizen reports and tracking.
- **Repairs**: Work orders, maintenance schedules, and verification.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```
The server will run on `http://localhost:5000`.

### 4. Health Check Endpoint
```bash
GET http://localhost:5000/api/health
```
Response:
```json
{
  "status": "ok",
  "service": "Pothole Detection System"
}
```

### 5. Build for Production
```bash
npm run build
npm start
```
