import React from 'react';

export const MapLegend: React.FC = () => {
  return (
    <div className="bg-white p-2.5 rounded border border-slate-300 shadow-sm text-xs font-sans">
      <div className="font-semibold text-slate-900 mb-1.5 text-[11px]">
        Condition Map Legend
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-slate-700">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-white"></span>
          <span>Critical / Severe</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-600 border border-white"></span>
          <span>High Priority</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white"></span>
          <span>Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 border border-white"></span>
          <span>Repaired</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2 pt-0.5 border-t border-slate-100">
          <span className="w-2.5 h-2.5 rounded bg-blue-900 border border-white"></span>
          <span className="font-medium text-blue-900">📍 Robot Base (Sahyadri College)</span>
        </div>
      </div>
    </div>
  );
};
