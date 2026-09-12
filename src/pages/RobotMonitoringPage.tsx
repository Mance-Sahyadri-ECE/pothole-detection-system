import React, { useState } from 'react';
import { useRobot } from '../context/RobotContext';
import { usePotholes } from '../context/PotholeContext';
import { useAuth } from '../context/AuthContext';
import { formatDateTime } from '../utils/formatters';

export const RobotMonitoringPage: React.FC = () => {
  const { robotStatus, autoPatrol, setAutoPatrol, patrolInterval, setPatrolInterval } = useRobot();
  const { simulateDetection, simulateCriticalEmergency } = usePotholes();
  const { isGovernmentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!robotStatus) {
    return <div className="p-8 text-center text-slate-500 font-mono text-xs">Connecting to telemetry stream...</div>;
  }

  const handleSimulate = async () => {
    setLoading(true);
    try {
      await simulateDetection();
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateSevere = async () => {
    setLoading(true);
    try {
      await simulateCriticalEmergency();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Robot Monitoring
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            ID: {robotStatus.id} • {robotStatus.name}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
            Status: {robotStatus.status}
          </span>
          <span className="text-slate-500">
            Batt: {robotStatus.batteryLevel}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 cols: Telemetry Table */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded p-4 space-y-3">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Rover Telemetry Parameters
          </h2>

          <table className="w-full text-xs border border-slate-200">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-left">
                <th className="py-2 px-3">Parameter</th>
                <th className="py-2 px-3">Value</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              <tr>
                <td className="py-2 px-3 text-slate-600 font-sans">Network Uplink</td>
                <td className="py-2 px-3 font-semibold text-slate-900">{robotStatus.internetConnection}</td>
                <td className="py-2 px-3 text-emerald-700">Connected</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-600 font-sans">GPS Fix</td>
                <td className="py-2 px-3">{robotStatus.gpsStatus}</td>
                <td className="py-2 px-3 text-emerald-700">RTK Lock</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-600 font-sans">Latitude</td>
                <td className="py-2 px-3 font-semibold">{robotStatus.currentLatitude.toFixed(6)}° N</td>
                <td className="py-2 px-3 text-slate-500 font-sans">Active</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-600 font-sans">Longitude</td>
                <td className="py-2 px-3 font-semibold">{robotStatus.currentLongitude.toFixed(6)}° E</td>
                <td className="py-2 px-3 text-slate-500 font-sans">Active</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-600 font-sans">Current Road</td>
                <td colSpan={2} className="py-2 px-3 font-sans text-slate-800">{robotStatus.currentLocation}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-600 font-sans">Optical Sensor</td>
                <td className="py-2 px-3">{robotStatus.cameraStatus}</td>
                <td className="py-2 px-3 text-emerald-700">1080p 60fps</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-600 font-sans">AI Inference Model</td>
                <td className="py-2 px-3">{robotStatus.aiModelStatus}</td>
                <td className="py-2 px-3 text-slate-700">{robotStatus.modelLatencyMs} ms</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-600 font-sans">Battery Capacity</td>
                <td className="py-2 px-3 font-semibold text-slate-900">{robotStatus.batteryLevel}%</td>
                <td className="py-2 px-3 text-slate-500 font-sans">Nominal</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-600 font-sans">Cruising Speed</td>
                <td className="py-2 px-3">{robotStatus.currentSpeedKmh} km/h</td>
                <td className="py-2 px-3 text-slate-500 font-sans">Patrolling</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-600 font-sans">Detections Today</td>
                <td className="py-2 px-3 font-bold text-red-700">{robotStatus.potholesDetectedToday}</td>
                <td className="py-2 px-3 text-slate-500 font-sans">Logged</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-600 font-sans">Last Telemetry</td>
                <td colSpan={2} className="py-2 px-3 text-[11px] text-slate-500">
                  {formatDateTime(robotStatus.lastDataReceived)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right 6 cols: Camera Preview Frame */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              On-Board Optical Camera Stream
            </h2>
            <span className="font-mono text-[10px] text-red-700 font-semibold">
              LIVE • 1080P
            </span>
          </div>

          <div className="relative border border-slate-300 rounded overflow-hidden aspect-video bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80"
              alt="Optical stream"
              className="w-full h-full object-cover opacity-90"
            />
            {/* Technical HUD Overlay */}
            <div className="absolute top-2 left-2 right-2 flex justify-between font-mono text-[10px] text-white/90 bg-black/60 px-2 py-1 rounded">
              <span>ROBOT-01 // FRAME-FEED</span>
              <span>GPS: {robotStatus.currentLatitude.toFixed(4)}, {robotStatus.currentLongitude.toFixed(4)}</span>
            </div>

            <div className="absolute top-1/3 left-1/4 w-1/2 h-2/5 border border-red-500 bg-red-500/15 flex items-start p-1">
              <span className="bg-red-600 text-white font-mono text-[9px] px-1">
                POTHOLE: 96.4%
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Sensor: Sony IMX390 HDR CMOS • Model: YOLOv8-Pothole-Edge
          </div>
        </div>
      </div>

      {/* Technical Simulation Controls at the bottom */}
      <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Simulation Stream Controls
          </h3>
          {!isGovernmentUser && (
            <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-mono">
              Government Auth Required
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <button
            onClick={handleSimulate}
            disabled={!isGovernmentUser || loading}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={isGovernmentUser ? "Trigger Random Detection" : "Government authorization required"}
          >
            Trigger Random Detection
          </button>

          <button
            onClick={handleSimulateSevere}
            disabled={!isGovernmentUser || loading}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={isGovernmentUser ? "Trigger Severe Hazard" : "Government authorization required"}
          >
            Trigger Severe Critical Hazard
          </button>

          <button
            onClick={() => setAutoPatrol(!autoPatrol)}
            disabled={!isGovernmentUser}
            className={`px-3 py-1.5 rounded border font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              autoPatrol
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            title={isGovernmentUser ? "Toggle Automatic Loop" : "Government authorization required"}
          >
            {autoPatrol ? 'Automatic Loop: Active' : 'Automatic Loop: Disabled'}
          </button>

          <div className="flex items-center gap-2 ml-auto font-mono text-slate-600">
            <span>Interval:</span>
            <input
              type="number"
              min="5"
              max="60"
              disabled={!isGovernmentUser}
              value={patrolInterval}
              onChange={e => setPatrolInterval(Number(e.target.value))}
              className="w-14 px-1.5 py-1 border border-slate-300 rounded bg-white text-center font-bold disabled:bg-slate-100 disabled:text-slate-400"
            />
            <span>sec</span>
          </div>
        </div>
      </div>
    </div>
  );
};
