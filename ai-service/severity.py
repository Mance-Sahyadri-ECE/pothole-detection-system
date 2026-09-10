import os
from typing import List, Dict, Any

# Configurable thresholds via environment variables
SEVERE_AREA_THRESHOLD = float(os.getenv("SEVERE_AREA_THRESHOLD", "0.05"))
MODERATE_AREA_THRESHOLD = float(os.getenv("MODERATE_AREA_THRESHOLD", "0.012"))

def calculate_severity(detections: List[Dict[str, Any]], image_width: int, image_height: int) -> Dict[str, Any]:
    """
    Deterministic severity & risk calculation engine based purely on measurable YOLO detections.
    No randomness or hardcoded simulation.

    :param detections: List of dicts with bbox keys: {'x', 'y', 'width', 'height', 'confidence', 'class'}
    :param image_width: Original image width in pixels
    :param image_height: Original image height in pixels
    :return: Dict containing severity, riskScore, repairPriority, estimatedDamage, recommendedAction, reason
    """
    if not detections or image_width <= 0 or image_height <= 0:
        return {
            "severity": "NORMAL",
            "riskScore": 0,
            "repairPriority": "LOW",
            "estimatedDamage": "NONE",
            "recommendedAction": "No immediate repair required. Road surface is in acceptable condition.",
            "reason": "No potholes detected in image frame."
        }

    total_image_area = float(image_width * image_height)
    total_bbox_area = sum(float(d["bbox"]["width"] * d["bbox"]["height"]) for d in detections)
    max_bbox_area = max(float(d["bbox"]["width"] * d["bbox"]["height"]) for d in detections)
    
    total_area_ratio = total_bbox_area / total_image_area
    max_area_ratio = max_bbox_area / total_image_area
    avg_confidence = sum(d["confidence"] for d in detections) / len(detections)
    count = len(detections)

    # Deterministic severity evaluation
    if total_area_ratio >= SEVERE_AREA_THRESHOLD or max_area_ratio >= (SEVERE_AREA_THRESHOLD * 0.8) or count >= 3:
        severity = "SEVERE"
        base_score = 80
        added_score = min(18, int((total_area_ratio / 0.15) * 10) + int(avg_confidence * 8))
        risk_score = min(98, base_score + added_score)
        repair_priority = "CRITICAL"
        estimated_damage = "CRITICAL" if risk_score >= 90 else "HIGH"
        recommended_action = "Dispatch emergency asphalt patch crew immediately. High vehicular hazard."
        reason = f"Severe road damage detected: {count} pothole(s) covering {(total_area_ratio * 100):.1f}% of visible surface."
    elif total_area_ratio >= MODERATE_AREA_THRESHOLD or max_area_ratio >= (MODERATE_AREA_THRESHOLD * 0.8) or count >= 1:
        severity = "MODERATE"
        base_score = 45
        added_score = min(30, int((total_area_ratio / SEVERE_AREA_THRESHOLD) * 20) + int(avg_confidence * 10))
        risk_score = min(75, base_score + added_score)
        repair_priority = "HIGH"
        estimated_damage = "MODERATE"
        recommended_action = "Schedule routine road resurfacing work order within 48 hours."
        reason = f"Moderate pothole detected covering {(total_area_ratio * 100):.2f}% of visible surface."
    else:
        severity = "NORMAL"
        risk_score = min(35, max(10, int(avg_confidence * 30)))
        repair_priority = "MEDIUM"
        estimated_damage = "LOW"
        recommended_action = "Monitor section during scheduled inspection cycle."
        reason = f"Minor surface anomaly detected covering {(total_area_ratio * 100):.2f}% of image."

    return {
        "severity": severity,
        "riskScore": risk_score,
        "repairPriority": repair_priority,
        "estimatedDamage": estimated_damage,
        "recommendedAction": recommended_action,
        "reason": reason
    }
