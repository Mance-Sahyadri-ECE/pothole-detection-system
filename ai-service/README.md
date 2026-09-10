# Pothole AI Inference Service

A high-performance Python FastAPI service for real-time pothole detection using Ultralytics YOLO and a deterministic severity & risk analysis engine.

## Features
- **Real YOLO Inference**: Runs Ultralytics YOLO on input road frames with zero simulation or random number generation.
- **Deterministic Severity Engine**: Computes severity, risk score, and repair priority based strictly on measurable bounding box surface area ratios and model confidences.
- **Non-Calibrated Dimension Handling**: Explicitly reports `dimensions: null` and `dimensionStatus: "NOT_CALIBRATED"` for monocular RGB images.
- **Strict Error Handling**: Returns `MODEL_NOT_FOUND` if `model/best.pt` is missing, preventing false claims of detection.

## Setup & Running

### 1. Create Virtual Environment & Install Dependencies
```bash
cd ai-service
python -m venv .venv

# On Windows PowerShell:
.venv\Scripts\Activate.ps1

# On Windows CMD:
.venv\Scripts\activate.bat

# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
```

### 2. Place Trained Model
Place your trained pothole model weights at:
```
ai-service/model/best.pt
```

### 3. Run the Service
```bash
uvicorn app:app --reload --port 8000
```
Or:
```bash
python app.py
```

### 4. API Endpoints

- **Health Check**:
  `GET http://localhost:8000/health`

- **Predict**:
  `POST http://localhost:8000/predict`
  - Body: `multipart/form-data` with `image` file field.
