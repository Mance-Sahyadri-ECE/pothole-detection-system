import React, { useState, useRef, useEffect } from 'react';
import { analyzePotholeImage } from '../services/aiDetection';
import { AiDetectionResult } from '../types';
import { usePotholes } from '../context/PotholeContext';
import { useNotifications } from '../context/NotificationContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { formatConfidence } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, AlertCircle, RefreshCw, Layers } from 'lucide-react';

const SAMPLE_PRESETS = [
  {
    title: 'Severe Crater (NH 73)',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    type: 'SEVERE' as const
  },
  {
    title: 'Moderate Crack (Adyar)',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    type: 'MODERATE' as const
  },
  {
    title: 'Normal Surface',
    url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
    type: 'NORMAL' as const
  }
];

export const AiDetectionPage: React.FC = () => {
  const { registerPothole } = usePotholes();
  const { addToast } = useNotifications();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_PRESETS[0].url);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AiDetectionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const startCamera = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'environment' }
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      setErrorMessage(`Camera access error: ${err.message || 'Permission denied'}`);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const captureFromCamera = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setSelectedImage(dataUrl);
    stopCamera();
    setResult(null);
    setErrorMessage(null);

    // Auto-analyze captured frame
    executeInference(dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setResult(null);
      setErrorMessage(null);
      if (isCameraActive) stopCamera();
    }
  };

  const executeInference = async (imgSource: string) => {
    setAnalyzing(true);
    setResult(null);
    setErrorMessage(null);
    try {
      const res = await analyzePotholeImage(imgSource);
      setResult(res);
    } catch (err: any) {
      setErrorMessage(err.message || 'AI detection failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAnalyze = () => {
    executeInference(selectedImage);
  };

  const handleLogToDatabase = async () => {
    if (!result) return;
    setSaving(true);
    try {
      const newRecord = await registerPothole({
        severity: result.severity,
        confidence: result.confidence,
        priority: result.repairPriority,
        status: 'PENDING',
        detectedBy: 'AI Vision System (Real YOLO)',
        location: 'Sahyadri Campus Road, Adyar',
        roadName: 'Sahyadri Campus Road',
        area: 'Adyar, Mangaluru',
        latitude: 12.8680,
        longitude: 74.8720,
        imageUrl: selectedImage,
        trafficLevel: result.severity === 'SEVERE' ? 'HIGH' : 'NORMAL',
        boundingBox: result.boundingBox,
        source: 'AI_DETECTION'
      });

      addToast({
        type: result.repairPriority === 'CRITICAL' ? 'CRITICAL' : 'SUCCESS',
        title: 'RECORD REGISTERED',
        message: `${newRecord.id} saved to Pothole Database & Map.`
      });
      navigate('/map');
    } catch (err: any) {
      setErrorMessage(`Failed to save record: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            AI Pothole Detection
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Genuine Ultralytics YOLO Computer Vision Inference & Deterministic Damage Engine
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isCameraActive ? (
            <button
              onClick={startCamera}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded shadow-sm transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-slate-600" />
              Live Camera
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded shadow-sm hover:bg-red-100 transition-colors"
            >
              Close Camera
            </button>
          )}
        </div>
      </div>

      {/* Error Alert Box */}
      {errorMessage && (
        <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-md text-amber-900 text-xs flex items-start gap-2.5 shadow-sm">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold">Detection System Notice:</span>
            <p className="text-amber-800">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Preset sample buttons */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 font-medium mr-1">Load sample frame:</span>
        {SAMPLE_PRESETS.map((sample, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (isCameraActive) stopCamera();
              setSelectedImage(sample.url);
              setResult(null);
              setErrorMessage(null);
            }}
            className={`px-2.5 py-1 rounded border font-medium transition-colors ${
              selectedImage === sample.url && !isCameraActive
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {sample.title}
          </button>
        ))}
      </div>

      {/* Main Analysis Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 cols: Upload & Image Preview */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              Input Image Frame
            </h2>
            <button
              onClick={() => {
                if (isCameraActive) stopCamera();
                fileInputRef.current?.click();
              }}
              className="text-xs font-semibold text-blue-700 hover:underline inline-flex items-center gap-1"
            >
              <Upload className="w-3 h-3" />
              Upload custom file
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
            />
          </div>

          <div className="relative border border-slate-300 rounded overflow-hidden aspect-video bg-slate-900 flex items-center justify-center">
            {isCameraActive ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
                  <button
                    onClick={captureFromCamera}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-full shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Capture & Analyze
                  </button>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={selectedImage}
                  alt="Road Frame"
                  className="w-full h-full object-cover"
                />

                {/* YOLO Bounding Box Overlays */}
                {result?.detections && result.detections.length > 0 && result.detections.map((det, idx) => (
                  <div
                    key={idx}
                    className="absolute border-2 border-red-500 bg-red-500/20 pointer-events-none transition-all"
                    style={{
                      left: `${det.bbox.x}%`,
                      top: `${det.bbox.y}%`,
                      width: `${det.bbox.width}%`,
                      height: `${det.bbox.height}%`
                    }}
                  >
                    <div className="bg-red-600 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 tracking-tight inline-block shadow-sm">
                      {det.class.toUpperCase()}: {formatConfidence(det.confidence)}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={handleAnalyze}
              disabled={analyzing || isCameraActive}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Running YOLO Inference...
                </>
              ) : (
                'Analyze Pothole'
              )}
            </button>

            {result && (
              <span className="text-[11px] font-mono text-slate-500">
                Inference Latency: {result.analysisTimeMs}ms
              </span>
            )}
          </div>
        </div>

        {/* Right 6 cols: Detection Result */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Detection Result
            </h2>
            {result && (
              <StatusBadge severity={result.severity} size="md" />
            )}
          </div>

          {result ? (
            <div className="space-y-3 text-xs">
              <table className="w-full border border-slate-200">
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td className="py-2 px-3 bg-slate-50 text-slate-500 font-sans">Pothole Detected</td>
                    <td className="py-2 px-3 font-bold text-slate-900">
                      {result.potholeDetected ? `YES (${result.detections?.length || 1} detected)` : 'NO'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 bg-slate-50 text-slate-500 font-sans">Severity Class</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{result.severity}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 bg-slate-50 text-slate-500 font-sans">YOLO Confidence</td>
                    <td className="py-2 px-3 font-bold text-slate-900">
                      {result.confidence > 0 ? formatConfidence(result.confidence) : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 bg-slate-50 text-slate-500 font-sans">Estimated Damage</td>
                    <td className="py-2 px-3 font-sans text-slate-800">{result.estimatedDamage}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 bg-slate-50 text-slate-500 font-sans">Repair Priority</td>
                    <td className="py-2 px-3"><PriorityBadge priority={result.repairPriority} /></td>
                  </tr>
                  {result.riskScore !== undefined && (
                    <tr>
                      <td className="py-2 px-3 bg-slate-50 text-slate-500 font-sans">Calculated Risk Index</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{result.riskScore} / 100</td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-2 px-3 bg-slate-50 text-slate-500 font-sans">Physical Dimensions</td>
                    <td className="py-2 px-3 text-slate-600 font-sans italic text-[11px]">
                      {result.dimensions
                        ? `Width: ~${result.dimensions.estimatedWidthCm}cm, Depth: ~${result.dimensions.estimatedDepthCm}cm`
                        : 'Not available — camera calibration/depth data required'}
                    </td>
                  </tr>
                </tbody>
              </table>

              {result.severityReason && (
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
                  <span className="font-semibold text-slate-800">Deterministic Engine: </span>
                  {result.severityReason}
                </div>
              )}

              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                <div className="font-semibold text-slate-700 uppercase text-[10px]">
                  Recommended Action
                </div>
                <p className="text-slate-800">{result.recommendedAction}</p>
              </div>

              {result.potholeDetected && (
                <button
                  onClick={handleLogToDatabase}
                  disabled={saving}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors disabled:opacity-50 shadow-sm"
                >
                  {saving ? 'Registering to Database...' : 'Register to Pothole Database & Map'}
                </button>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400 font-sans">
              Click <strong>"Analyze Pothole"</strong> to run computer vision inference on the frame.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
