import { config } from '../config/env';

export interface AiServicePredictionResult {
  success: boolean;
  potholeDetected: boolean;
  detectionsCount: number;
  detections: Array<{
    class: string;
    confidence: number;
    bbox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
  severity: 'NORMAL' | 'MODERATE' | 'SEVERE';
  riskScore: number;
  repairPriority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedDamage: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'NONE';
  recommendedAction: string;
  severityReason: string;
  confidence: number;
  dimensions: null;
  dimensionStatus: 'NOT_CALIBRATED';
  imageWidth: number;
  imageHeight: number;
  processingTimeMs: number;
}

export async function checkAiServiceHealth(): Promise<{ status: string; modelLoaded: boolean; [key: string]: any }> {
  try {
    const res = await fetch(`${config.aiServiceUrl}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) {
      return { status: 'error', modelLoaded: false, statusCode: res.status };
    }
    return await res.json();
  } catch (err: any) {
    return {
      status: 'error',
      modelLoaded: false,
      error: 'AI_SERVICE_UNAVAILABLE',
      message: `Cannot connect to Python AI service at ${config.aiServiceUrl}: ${err.message}`
    };
  }
}

export async function detectPotholesInImage(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<AiServicePredictionResult> {
  const formData = new FormData();
  const uint8Array = new Uint8Array(fileBuffer);
  const blob = new Blob([uint8Array], { type: mimeType });
  formData.append('image', blob, fileName);

  try {
    const res = await fetch(`${config.aiServiceUrl}/predict`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(30000) // 30s timeout
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorObj: any = new Error(data?.message || `AI service returned HTTP ${res.status}`);
      errorObj.statusCode = res.status;
      errorObj.code = data?.error || 'AI_SERVICE_ERROR';
      errorObj.details = data;
      throw errorObj;
    }

    return data as AiServicePredictionResult;
  } catch (err: any) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      const timeoutErr: any = new Error('AI detection request timed out after 30 seconds.');
      timeoutErr.statusCode = 504;
      timeoutErr.code = 'AI_SERVICE_TIMEOUT';
      throw timeoutErr;
    }

    if (err.code === 'ECONNREFUSED' || err.cause?.code === 'ECONNREFUSED' || !err.statusCode) {
      const connErr: any = new Error(`AI detection service is unavailable at ${config.aiServiceUrl}. Please ensure the Python FastAPI service is running.`);
      connErr.statusCode = 503;
      connErr.code = 'AI_SERVICE_UNAVAILABLE';
      throw connErr;
    }

    throw err;
  }
}
