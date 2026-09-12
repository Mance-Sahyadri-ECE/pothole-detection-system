import React, { useState } from 'react';
import { useRobot } from '../context/RobotContext';
import { usePotholes } from '../context/PotholeContext';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { autoPatrol, setAutoPatrol, patrolInterval, setPatrolInterval } = useRobot();
  const { resetAllData } = usePotholes();
  const { addToast } = useNotifications();
  const { isGovernmentUser } = useAuth();

  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
  const [wsUrl, setWsUrl] = useState(import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const handleSave = () => {
    addToast({
      type: 'SUCCESS',
      title: 'CONFIGURATION SAVED',
      message: 'Parameters updated.'
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            System Settings
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            API endpoints, simulation parameters, and alert configurations
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={!isGovernmentUser}
          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={isGovernmentUser ? "Save Configuration" : "Government authorization required"}
        >
          Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Backend Endpoints */}
        <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Backend API Integration
          </h2>

          <div className="space-y-2.5">
            <div>
              <label className="block text-slate-600 font-medium mb-1">REST API URL:</label>
              <input
                type="text"
                value={apiUrl}
                onChange={e => setApiUrl(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono text-slate-900 focus:outline-none focus:border-slate-900"
              />
              <span className="text-[10px] text-slate-400 font-mono">Mapped via VITE_API_URL</span>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">WebSocket Stream URL:</label>
              <input
                type="text"
                value={wsUrl}
                onChange={e => setWsUrl(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono text-slate-900 focus:outline-none focus:border-slate-900"
              />
              <span className="text-[10px] text-slate-400 font-mono">Mapped via VITE_WS_URL</span>
            </div>
          </div>
        </div>

        {/* Simulation Parameters */}
        <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Simulation Stream Parameters
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">Auto Patrol Loop</span>
                <span className="text-[11px] text-slate-500">Autonomous mock stream</span>
              </div>
              <button
                onClick={() => setAutoPatrol(!autoPatrol)}
                className={`px-2.5 py-1 rounded text-xs font-medium border ${
                  autoPatrol
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                {autoPatrol ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Interval:</span>
                <span className="font-mono font-bold text-slate-900">{patrolInterval}s</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={patrolInterval}
                onChange={e => setPatrolInterval(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Notification Channels */}
        <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Notification Dispatch Channels
          </h2>

          <div className="space-y-2">
            <label className="flex items-center justify-between p-2 border border-slate-200 rounded">
              <span className="text-slate-800 font-medium">Email Alerts (Executive Engineer)</span>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                className="w-3.5 h-3.5 accent-slate-900"
              />
            </label>

            <label className="flex items-center justify-between p-2 border border-slate-200 rounded">
              <span className="text-slate-800 font-medium">SMS Gateway (Field Crew Dispatch)</span>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={e => setSmsAlerts(e.target.checked)}
                className="w-3.5 h-3.5 accent-slate-900"
              />
            </label>
          </div>
        </div>

        {/* Factory Reset */}
        <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Simulation Data Reset
          </h2>
          <p className="text-slate-500 text-[11px]">
            Restores all pothole telemetry and notifications to the initial seed dataset for Sahyadri College, Adyar.
          </p>
          <button
            onClick={() => {
              if (window.confirm('Reset simulated dataset?')) {
                resetAllData();
                addToast({
                  type: 'SUCCESS',
                  title: 'DATASET RESET',
                  message: 'Default records restored.'
                });
              }
            }}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-xs font-medium transition-colors"
          >
            Reset to Factory Defaults
          </button>
        </div>
      </div>

      {/* Ingestion API Schema Box */}
      <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-2 text-xs font-mono">
        <div className="flex items-center justify-between text-slate-700">
          <span className="font-bold uppercase text-[10px]">Robot Ingestion Specification: POST /api/potholes</span>
        </div>
        <pre className="p-3 bg-white border border-slate-200 rounded text-[11px] text-slate-800 overflow-x-auto">
{`{
  "robotId": "ROBOT-01",
  "latitude": 12.9004,
  "longitude": 74.8700,
  "roadName": "Sahyadri Campus Access Road",
  "area": "Adyar, Mangaluru",
  "severity": "SEVERE",
  "confidence": 0.96,
  "trafficLevel": "HIGH",
  "timestamp": "2026-08-11T16:00:00Z"
}`}
        </pre>
      </div>
    </div>
  );
};
