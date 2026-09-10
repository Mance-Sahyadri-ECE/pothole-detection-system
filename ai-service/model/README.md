# Pothole Detection YOLO Model Directory

Place your trained Ultralytics YOLO pothole detection model weights here.

## Expected File Name:
```
ai-service/model/best.pt
```

## Model Requirements:
- Format: PyTorch checkpoint (`.pt`) trained with Ultralytics YOLO (YOLOv8, YOLOv9, YOLOv10, or YOLOv11)
- Classes: Pothole / Road damage class(es)
- Input: RGB road images
- Configurable Path: Can also be set via `MODEL_PATH` in `.env`

If `best.pt` is missing, the AI service will respond with HTTP 503 and `MODEL_NOT_FOUND` error to prevent any fake or simulated detections.
