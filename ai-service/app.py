import os
import time
import io
from contextlib import asynccontextmanager
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image

from severity import calculate_severity

load_dotenv()

MODEL_PATH = os.getenv("MODEL_PATH", os.path.join(os.path.dirname(__file__), "model", "best.pt"))
YOLO_CONFIDENCE = float(os.getenv("YOLO_CONFIDENCE", "0.40"))
MAX_IMAGE_SIZE_MB = int(os.getenv("MAX_IMAGE_SIZE_MB", "10"))
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/bmp", "image/jpg"}

# Global model holder
yolo_model = None

def load_yolo_model():
    global yolo_model
    if os.path.exists(MODEL_PATH):
        try:
            from ultralytics import YOLO
            print(f"[AI Service] Loading YOLO model from {MODEL_PATH}...")
            yolo_model = YOLO(MODEL_PATH)
            print(f"[AI Service] Model loaded successfully.")
            return True
        except Exception as e:
            print(f"[AI Service] Error loading YOLO model from {MODEL_PATH}: {e}")
            yolo_model = None
            return False
    else:
        print(f"[AI Service] Model file not found at {MODEL_PATH}. Prediction requests will return MODEL_NOT_FOUND.")
        yolo_model = None
        return False

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: attempt to load model
    load_yolo_model()
    yield
    # Shutdown

app = FastAPI(
    title="Pothole Detection AI Inference Service",
    description="Real YOLO Pothole Detection and Deterministic Severity Assessment Service",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    model_exists = os.path.exists(MODEL_PATH)
    return {
        "status": "ok" if model_exists and yolo_model is not None else "degraded",
        "modelLoaded": yolo_model is not None,
        "modelPath": MODEL_PATH,
        "modelExists": model_exists,
        "yoloConfidence": YOLO_CONFIDENCE,
        "maxImageSizeMb": MAX_IMAGE_SIZE_MB
    }

@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    start_time = time.time()

    # 1. Validate content type
    if image.content_type and image.content_type.lower() not in ALLOWED_MIME_TYPES:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "error": "INVALID_IMAGE_FORMAT",
                "message": f"Unsupported MIME type: {image.content_type}. Allowed types: {', '.join(ALLOWED_MIME_TYPES)}"
            }
        )

    # 2. Read image buffer & validate size
    try:
        contents = await image.read()
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "error": "FILE_READ_ERROR",
                "message": f"Could not read uploaded image: {str(e)}"
            }
        )

    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_IMAGE_SIZE_MB:
        return JSONResponse(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            content={
                "success": False,
                "error": "FILE_TOO_LARGE",
                "message": f"Image size ({size_mb:.2f} MB) exceeds maximum allowed size ({MAX_IMAGE_SIZE_MB} MB)"
            }
        )

    # 3. Verify image integrity with PIL
    try:
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
        img_width, img_height = pil_image.size
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "error": "INVALID_IMAGE_DATA",
                "message": "Uploaded file is corrupted or not a valid image."
            }
        )

    # 4. Check if model is present and loaded
    global yolo_model
    if yolo_model is None:
        # Retry loading once in case model was dropped into model/ directory
        if os.path.exists(MODEL_PATH):
            load_yolo_model()

    if yolo_model is None or not os.path.exists(MODEL_PATH):
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "success": False,
                "error": "MODEL_NOT_FOUND",
                "message": f"Pothole detection model is not installed at {MODEL_PATH}. Place your trained best.pt file in ai-service/model/best.pt to enable genuine detection.",
                "modelPath": MODEL_PATH
            }
        )

    # 5. Run genuine YOLO inference
    try:
        results = yolo_model.predict(
            source=pil_image,
            conf=YOLO_CONFIDENCE,
            verbose=False
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "error": "INFERENCE_ERROR",
                "message": f"Inference execution failed: {str(e)}"
            }
        )

    # 6. Parse detection results
    detections: List[Dict[str, Any]] = []
    if results and len(results) > 0:
        boxes = results[0].boxes
        names = results[0].names or {}

        if boxes is not None and len(boxes) > 0:
            for box in boxes:
                xyxy = box.xyxy[0].tolist()  # [x1, y1, x2, y2]
                conf = float(box.conf[0].item())
                cls_id = int(box.cls[0].item())
                cls_name = names.get(cls_id, "pothole")

                x1, y1, x2, y2 = xyxy
                width = max(0.0, x2 - x1)
                height = max(0.0, y2 - y1)

                detections.append({
                    "class": cls_name,
                    "confidence": round(conf, 4),
                    "bbox": {
                        "x": round(x1, 1),
                        "y": round(y1, 1),
                        "width": round(width, 1),
                        "height": round(height, 1)
                    }
                })

    # 7. Compute deterministic severity & risk
    severity_info = calculate_severity(detections, img_width, img_height)

    # 8. Highest confidence or 0
    primary_confidence = max((d["confidence"] for d in detections), default=0.0)
    pothole_detected = len(detections) > 0

    elapsed_ms = int((time.time() - start_time) * 1000)

    # 9. Return honest detection output
    return {
        "success": True,
        "potholeDetected": pothole_detected,
        "detectionsCount": len(detections),
        "detections": detections,
        "severity": severity_info["severity"],
        "riskScore": severity_info["riskScore"],
        "repairPriority": severity_info["repairPriority"],
        "estimatedDamage": severity_info["estimatedDamage"],
        "recommendedAction": severity_info["recommendedAction"],
        "severityReason": severity_info["reason"],
        "confidence": primary_confidence,
        "dimensions": None,
        "dimensionStatus": "NOT_CALIBRATED",
        "imageWidth": img_width,
        "imageHeight": img_height,
        "processingTimeMs": elapsed_ms
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
