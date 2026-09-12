import React from 'react';

export const MapLegend: React.FC = () => {
  return (
    <div className="bg-white p-2.5 rounded border border-slate-300 shadow-sm text-xs font-sans">
      <div className="font-bold text-slate-900 mb-1.5 text-[11px] uppercase tracking-wider border-b border-slate-100 pb-1">
        Repair Status Legend
      </div>
      <div className="space-y-1.5 text-[11px] text-slate-700 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-600 border-2 border-white shadow-xs inline-block"></span>
          <span>🟢 Repaired</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-xs inline-block"></span>
          <span>🟡 Work in Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600 border-2 border-white shadow-xs inline-block"></span>
          <span>🔴 Pending Repair</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 mt-1 text-slate-600">
          <span className="w-3 h-3 rounded bg-blue-900 border border-white inline-block"></span>
          <span className="font-mono text-[10px] font-semibold text-blue-900">📍 Robot Base (Sahyadri)</span>
        </div>
      </div>
    </div>
  );
};

