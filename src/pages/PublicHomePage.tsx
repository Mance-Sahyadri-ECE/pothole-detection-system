import React from 'react';
import { Link } from 'react-router-dom';
import { PotholeMap } from '../components/map/PotholeMap';
import { Map, AlertCircle, Lock, Cpu, Eye, ShieldCheck, ArrowRight } from 'lucide-react';
import { SAHYADRI_COORDINATES } from '../utils/geoUtils';

export const PublicHomePage: React.FC = () => {
  const steps = [
    { step: '01', name: 'DETECT', desc: 'Rover camera captures road surface frame telemetry' },
    { step: '02', name: 'ANALYZE', desc: 'YOLOv8 edge model classifies cavity severity & confidence' },
    { step: '03', name: 'LOCATE', desc: 'RTK GPS records exact latitude & longitude coordinates' },
    { step: '04', name: 'NOTIFY', desc: 'Automated alert dispatched to PWD / NHAI engineers' },
    { step: '05', name: 'REPAIR', desc: 'Maintenance crew dispatches hot-mix asphalt patching team' },
    { step: '06', name: 'VERIFY', desc: 'Quality inspection verified & map marker transitions to safe' }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Hero Section */}
      <div className="bg-white border border-slate-200 rounded p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-[11px] font-mono font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>DAKSHINA KANNADA MUNICIPAL INFRASTRUCTURE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              POTHOLE DETECTION SYSTEM
            </h1>

            <p className="text-sm font-semibold text-blue-700 font-mono">
              AI-Based Road Condition Monitoring
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans pt-1">
              Detect road damage, locate it using precision GPS, notify responsible government authorities, and track asphalt repair progress across municipal transit corridors.
            </p>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0 text-xs">
            <Link
              to="/map"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Map className="w-4 h-4 text-blue-400" />
              VIEW LIVE MAP
            </Link>

            <Link
              to="/report"
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <AlertCircle className="w-4 h-4 text-slate-950" />
              REPORT A POTHOLE
            </Link>

            <Link
              to="/login"
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              GOVERNMENT LOGIN
            </Link>
          </div>
        </div>

        {/* Highlighted Robot Base Banner */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-blue-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
              📍
            </div>
            <div>
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                ROBOT BASE STATION
              </div>
              <div className="font-semibold text-slate-800">
                Sahyadri College of Engineering & Management
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Sahyadri Campus, Adyar, Mangaluru • GPS: {SAHYADRI_COORDINATES.lat.toFixed(6)}° N, {SAHYADRI_COORDINATES.lng.toFixed(6)}° E
              </div>
            </div>
          </div>

          <div className="font-mono text-[11px] text-slate-600 bg-white px-3 py-1.5 rounded border border-slate-200 shrink-0">
            Rover: <strong className="text-slate-900">ROBOT-01</strong> | Status: <strong className="text-emerald-700">ONLINE</strong>
          </div>
        </div>
      </div>

      {/* System Pipeline Workflow */}
      <div className="bg-white border border-slate-200 rounded p-4 sm:p-5 space-y-4">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Cpu className="w-4 h-4 text-blue-700" />
          Autonomous Detection & Repair Lifecycle
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          {steps.map((s, i) => (
            <div key={s.step} className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1 relative">
              <div className="font-mono text-[10px] font-bold text-blue-700">STAGE {s.step}</div>
              <div className="font-bold text-slate-900">{s.name}</div>
              <p className="text-[11px] text-slate-500 leading-snug">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Map Preview */}
      <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Dakshina Kannada Road Condition Map Preview
            </h2>
            <p className="text-[11px] text-slate-500 font-mono">
              Centered on Sahyadri College Robot Base & Adyar Transit Corridors
            </p>
          </div>
          <Link
            to="/map"
            className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
          >
            Full Interactive Map
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <PotholeMap heightClass="h-[400px]" showFilters={false} />
      </div>
    </div>
  );
};
