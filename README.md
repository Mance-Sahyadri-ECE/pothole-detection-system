# Pothole Detection System
> **Autonomous Road-Patrol Robot & AI Pavement Inspection Dashboard**

A complete, production-grade, responsive web application for managing autonomous road-patrol robots equipped with optical cameras, real YOLO edge AI pothole detection models, and high-precision RTK GPS navigation.

The system is configured around **Sahyadri College of Engineering & Management, Adyar, Mangaluru, Dakshina Kannada, Karnataka, India**.

---

## 🚀 Genuine AI Detection Architecture

The system uses an end-to-end computer vision and infrastructure management pipeline:

```
Camera / Upload / Rover
       │
       ▼ (multipart/form-data)
React Frontend (Vite + TS)
       │
       ▼ POST /api/ai/detect
Node.js / Express Backend (Port 5000)
       │
       ▼ POST /predict
Python FastAPI AI Inference Service (Port 8000)
       │
       ├─► Ultralytics YOLO (`ai-service/model/best.pt`)
       ├─► Deterministic Severity Engine (`ai-service/severity.py`)
       └─► Returns genuine detections, confidence, bboxes & risk index
       │
       ▼
PostgreSQL / Supabase Database
       │
       ▼
Live Pothole Map, Dashboard & Repair Workflow
```

---

## 🚀 Key Features

- **🏠 Executive Operations Dashboard**:
  - Real-time statistics (Total Potholes, Critical Severity, Pending Repairs, Repaired & Safe, Active Robots, Government Alerts).
  - Live Detection Feed with instant telemetry and status badges.
  - End-to-end 6-stage lifecycle visualizer.

- **🗺 Interactive Live Pothole GIS Map**:
  - Powered by Leaflet & OpenStreetMap (zero paid API dependencies).
  - Custom color-coded pin markers (`Red = Critical/Severe`, `Orange = High`, `Yellow = Moderate`, `Green = Repaired`, `Blue = Robot Rover`).
  - Search location filter, road lookup, and instant pan-to-focus controls for Sahyadri College & Robot-01.
  - Rich popup cards with inspection photos and telemetry.

- **🤖 Autonomous Robot Monitoring Hub**:
  - Live rover telemetry: 5G connectivity, GPS RTK lock, battery meter, speed, and processor temperature.
  - Optical camera HUD overlay with real-time AI bounding boxes.
  - Configurable auto-patrol stream simulation cadence (5s - 60s).

- **🧠 Real AI Pothole Detection & Computer Vision Lab**:
  - Genuine Ultralytics YOLO inference powered by Python FastAPI service.
  - Live webcam capture and image upload support.
  - Deterministic severity engine based on measurable bounding box area ratios and model confidence.
  - Real percentage-normalized bounding box overlays.
  - Transparent physical dimensions reporting (calibrated notice).
  - Direct database registration of real detections to PostgreSQL / Supabase and live map.

- **📋 Pothole Inspection Reports & Registry**:
  - Filterable engineering data table with search, severity/priority/status filters, and sorting.
  - Instant one-click **CSV** and **JSON** export.

- **📢 Government Notifications & Hazard Alert Center**:
  - Automated dispatch queue for Public Works Department (PWD) and National Highways Authority of India (NHAI).
  - Multi-channel delivery simulation (Dashboard, Email, SMS, Telegram).
  - Triage workflows: Schedule site inspection, assign repair crew, or mark resolved.

- **📝 Citizen Complaint Box & Geolocation Grievance Portal**:
  - Public reporting form with GPS coordinate auto-fill (`Use My Current Location`).
  - Automatic complaint ID generation (`CMP-0001`) and cross-referencing with autonomous robot patrol discoveries.

- **🚧 Repair & Maintenance Lifecycle Management**:
  - Interactive **Kanban Board** & **Table View** for tracking repair states:
    `PENDING` → `INSPECTION` → `ASSIGNED` → `REPAIR IN PROGRESS` → `REPAIRED`.
  - Engineer work-order assignment (PWD, NHAI, MCC) with dispatch notes and photo auditing.

- **📊 Dakshina Kannada Operational Analytics**:
  - Dynamic charts powered by Recharts (Severity Donut, Weekly Detections vs Repairs, Area Breakdown for Mangaluru corridors).
  - Key Performance Indicators (Average Repair Turnaround Time, Government Response Rate, AI Accuracy).

---

## 🛠 Technology Stack

- **AI Inference Engine**: Python 3.10+, FastAPI, Ultralytics YOLO, Pillow, Pydantic
- **Backend API Gateway**: Node.js, Express, TypeScript, Multer, PostgreSQL/Supabase client
- **Frontend SPA**: React 18, TypeScript, Vite, Tailwind CSS, React-Leaflet, Lucide React, Recharts
- **Database**: PostgreSQL / Supabase with spatial schemas and repair audit triggers

---

## ⚡ How to Run the Complete System

### 1. Python AI Inference Service (FastAPI + YOLO)
```bash
cd ai-service

# Create and activate virtual environment:
python -m venv .venv
# On Windows PowerShell:
.venv\Scripts\Activate.ps1
# On Linux/macOS:
# source .venv/bin/activate

# Install dependencies:
pip install -r requirements.txt

# Place your trained YOLO weights at:
# ai-service/model/best.pt

# Run the inference service (Port 8000):
uvicorn app:app --reload --port 8000
```

### 2. Node.js Express Backend
```bash
cd backend

# Install dependencies:
npm install

# Start development server (Port 5000):
npm run dev
```

### 3. React Frontend
```bash
# In the root directory:
npm install

# Start Vite frontend (Port 3000):
npm run dev
```

---

## 🧠 AI Model Placement & Notice

- Model weights file: `ai-service/model/best.pt`
- If `best.pt` is not present, the service returns `MODEL_NOT_FOUND` (HTTP 503) and displays an alert indicating model weights must be placed in the directory.
- No `Math.random()` or hardcoded simulated values are used in the detection pathway.

---

## 🔒 Security & Environment Variables

---

## 🌐 System URLs & Deployment Environments Architecture

| Component | Local Development URL | Production Deployment Target | Environment Variable |
|---|---|---|---|
| **Frontend Application** | `http://localhost:3000` / `http://localhost:5173` | **Vercel** / Render Static Site | `VITE_API_URL`, `VITE_WS_URL` |
| **Backend REST API** | `http://localhost:5000` | **Render Web Service** / Railway | `PORT`, `DATABASE_URL`, `CORS_ORIGIN`, `JWT_SECRET`, `AI_SERVICE_URL` |
| **PostgreSQL Database** | `postgresql://localhost:5432/pothole_db` | **Supabase** / **Neon** / Render Postgres | `DATABASE_URL` |
| **AI Inference Service** | `http://127.0.0.1:8000` | **Render Web Service** / Docker / FastAPI | `PORT`, `BACKEND_API_URL`, `MODEL_PATH` |

---

## 🚀 DEPLOYMENT

This production deployment guide details how to publish the **Pothole Detection System** to public internet cloud services (Vercel, Render, and Managed PostgreSQL).

### Step-by-Step Production Deployment

#### Step 1: Create Managed PostgreSQL Database
1. Provision a PostgreSQL instance on **Supabase**, **Neon.tech**, or **Render PostgreSQL**.
2. Retrieve your connection string with SSL enabled:
   `postgresql://postgres:<password>@<db-host>:5432/<dbname>?sslmode=require`

#### Step 2: Configure Backend Environment Variables
Create environment variables on your Render Web Service dashboard:
- `PORT=5000` (or leave default, Render sets `PORT` automatically)
- `NODE_ENV=production`
- `DATABASE_URL=postgresql://postgres:<password>@<db-host>:5432/<dbname>?sslmode=require`
- `CORS_ORIGIN=https://<your-frontend-subdomain>.vercel.app`
- `FRONTEND_URL=https://<your-frontend-subdomain>.vercel.app`
- `JWT_SECRET=<secure-random-64-char-string>`
- `AI_SERVICE_URL=https://<your-ai-service-subdomain>.onrender.com`
- `ROBOT_API_KEY=<secure-robot-telemetry-key>`

#### Step 3: Run Prisma Database Migrations
Deploy the production schema to your remote database:
```bash
cd backend
npx prisma migrate deploy
# Or initialize schema directly:
npx prisma db push
```

#### Step 4: Deploy Node.js/Express Backend to Render
1. Connect your GitHub repository to [Render.com](https://render.com).
2. Create a **Web Service** with the following configuration:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start` (Executes `node dist/server.js`)
3. Render automatically assigns a public HTTPS URL (e.g. `https://pothole-backend.onrender.com`).

#### Step 5: Deploy Python AI Service (FastAPI + YOLO)
1. In Render, create a separate **Web Service** for `ai-service`:
   - **Root Directory**: `ai-service`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
2. Ensure your trained weights file `best.pt` is located in `ai-service/model/best.pt` or fetched via cloud storage during build.
3. Note the generated AI URL (e.g. `https://pothole-ai-service.onrender.com`).

#### Step 6: Deploy Frontend to Vercel or Render Static Site
1. Connect your repo to [Vercel](https://vercel.com).
2. Set Build Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variable in Vercel settings:
   - `VITE_API_URL=https://pothole-backend.onrender.com`
   - `VITE_WS_URL=wss://pothole-backend.onrender.com`
4. Deploy the application.

#### Step 7: Verify Production Deployment
After deployment completes, run through this verification checklist:
1. **Public Home Page**: Open `https://<your-app>.vercel.app` in browser and confirm header, landing components, and statistics load.
2. **Public Map Inspection**: Open Public Live Map. Verify Leaflet tiles render smoothly and confirm the permanent **Sahyadri College Robot Base Station** marker appears at `12.8650354, 74.9257386` with label *"Sahyadri College of Engineering & Management — Robot Base Station"*.
3. **Public Complaint Submission**: Navigate to Public Grievance Portal (`/report`), submit a sample complaint with image upload, and verify receipt code generated (`CMP-xxxx`).
4. **Backend Health Check**: Send GET request to `https://<your-backend-url>/api/health` and ensure status returns `200 OK`.
5. **Government Portal Authentication**: Access `/login`, authenticate with government credentials, and verify access to restricted operational pages (`/dashboard`, `/analytics`, `/audits`, `/settings`).
6. **Robot Telemetry**: Open `/robot` and confirm real-time telemetry stream from base station coordinates.
7. **AI Detection Pipeline**: Open `/ai-detect`, upload a road image, and verify YOLO bounding box overlays and severity calculation.
8. **Repair Workflow**: Transition a pothole status in `/repairs` and confirm repair log updates in real-time.

---

## 🔒 Environment Variable Files Reference

### `.env.example` (Root / Frontend)
```env
VITE_API_URL=https://pothole-backend.onrender.com
VITE_WS_URL=wss://pothole-backend.onrender.com
```

### `backend/.env.example`
```env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
CORS_ORIGIN=https://pothole-detection-system.vercel.app
FRONTEND_URL=https://pothole-detection-system.vercel.app
JWT_SECRET=super-secret-jwt-key
AI_SERVICE_URL=https://pothole-ai-service.onrender.com
ROBOT_API_KEY=robot-sec-key-7781-x9
```

### `ai-service/.env.example`
```env
PORT=8000
BACKEND_API_URL=https://pothole-backend.onrender.com
MODEL_PATH=model/best.pt
YOLO_CONFIDENCE=0.40
MAX_IMAGE_SIZE_MB=10
```

---

## 📄 License
Developed for Autonomous Road Infrastructure Maintenance & Smart City Deployment.

