import React from 'react';
import { useRobot } from '../context/RobotContext';
import { CheckCircle2, Server, Database, Radio, Cpu } from 'lucide-react';

export const PublicStatusPage: React.FC = () => {
  const { robotStatus } = useRobot();

  const services = [
    { name: 'REST API Service', status: 'OPERATIONAL', latency: '24 ms', icon: Server },
    { name: 'PostgreSQL Database', status: 'OPERATIONAL', latency: '4 ms', icon: Database },
    { name: 'WebSocket Real-Time Broadcast', status: 'OPERATIONAL', latency: '12 ms', icon: Radio },
    { name: 'YOLOv8 Edge AI Model Service', status: 'OPERATIONAL', latency: '42 ms', icon: Cpu }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            System Infrastructure Status
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Live health telemetry & service status • Dakshina Kannada Network
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          All Systems Operational
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {services.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.name} className="bg-white border border-slate-200 rounded p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-blue-700 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900">{s.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Latency: {s.latency}</div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900">
                {s.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Robot Base Station Telemetry */}
      {robotStatus && (
        <div className="bg-white border border-slate-200 rounded p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              ROBOT-01 Telemetry Stream Status
            </span>
            <span className="font-mono text-emerald-700 font-semibold">{robotStatus.status}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] pt-1">
            <div><span className="text-slate-400 block text-[10px]">Uplink:</span> {robotStatus.internetConnection}</div>
            <div><span className="text-slate-400 block text-[10px]">GPS Fix:</span> {robotStatus.gpsStatus}</div>
            <div><span className="text-slate-400 block text-[10px]">Battery:</span> {robotStatus.batteryLevel}%</div>
            <div><span className="text-slate-400 block text-[10px]">Station Base:</span> Sahyadri College</div>
          </div>
        </div>
      )}
    </div>
  );
};
