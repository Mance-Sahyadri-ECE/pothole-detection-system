import React from 'react';
import { PotholeMap } from '../components/map/PotholeMap';

export const PublicMapPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            DAKSHINA KANNADA ROAD CONDITION MAP
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Public road surface defect tracking • Robot Base: Sahyadri College, Adyar, Mangaluru
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-600">
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 font-semibold">
            📍 ROBOT BASE: SAHYADRI COLLEGE
          </span>
        </div>
      </div>

      <PotholeMap heightClass="h-[620px]" showFilters={true} />
    </div>
  );
};
