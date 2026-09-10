import React from 'react';
import { SAHYADRI_COORDINATES } from '../utils/geoUtils';
import { Cpu, ShieldCheck, MapPin } from 'lucide-react';

export const PublicAboutPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
          About Pothole Detection System
        </h1>
        <p className="text-xs text-slate-500 font-mono">
          Autonomous Road Condition Monitoring Platform • Sahyadri College of Engineering & Management
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded p-5 space-y-4 text-xs leading-relaxed text-slate-700 font-sans">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded bg-blue-900 text-white flex items-center justify-center font-bold text-base shrink-0">
            📍
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm">ROBOT BASE STATION</h2>
            <div className="font-semibold text-blue-700">Sahyadri College of Engineering & Management</div>
            <div className="text-[11px] text-slate-500 font-mono">
              Sahyadri Campus, Adyar, Mangaluru, Dakshina Kannada, Karnataka, India (`12.8650354° N, 74.9257386° E`)
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">Mission Statement</h3>
          <p>
            The Pothole Detection System is an end-to-end municipal infrastructure monitoring solution developed to automate road defect identification, capture high-precision RTK GPS coordinates, alert government engineers instantly, and track repairs to completion across transit corridors in Dakshina Kannada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-blue-700" />
              Autonomous Edge AI
            </div>
            <p className="text-[11px] text-slate-500">
              Jetson Orin Nano on-board vision computer running real-time YOLOv8 cavity severity classification models.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-blue-700" />
              Centimeter RTK GPS
            </div>
            <p className="text-[11px] text-slate-500">
              u-blox ZED-F9P dual-band GNSS tagging coordinates with sub-decimeter precision.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              PWD & NHAI Dispatch
            </div>
            <p className="text-[11px] text-slate-500">
              Direct automated dispatch to Dakshina Kannada Public Works Department and NHAI field maintenance crews.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
