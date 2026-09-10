import React from 'react';
import { PotholeMap } from '../components/map/PotholeMap';
import { usePotholes } from '../context/PotholeContext';
import { SAHYADRI_COORDINATES } from '../utils/geoUtils';

export const LiveMapPage: React.FC = () => {
  const { stats } = usePotholes();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Live Road Condition Map
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            {SAHYADRI_COORDINATES.name} (12.9004° N, 74.8700° E)
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
          <div>Total: <span className="font-bold text-slate-900">{stats.total}</span></div>
          <div>Critical: <span className="font-bold text-red-700">{stats.critical}</span></div>
          <div>Repaired: <span className="font-bold text-emerald-700">{stats.repaired}</span></div>
        </div>
      </div>

      {/* Main Full-Height Map */}
      <PotholeMap heightClass="h-[calc(100vh-13rem)] min-h-[500px]" showFilters={true} />
    </div>
  );
};
