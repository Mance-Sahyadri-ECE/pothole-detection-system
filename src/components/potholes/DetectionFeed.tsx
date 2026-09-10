import React from 'react';
import { usePotholes } from '../../context/PotholeContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { formatConfidence } from '../../utils/formatters';
import { Link } from 'react-router-dom';

export const DetectionFeed: React.FC = () => {
  const { potholes, setSelectedPothole } = usePotholes();

  // Show top 8 latest detections
  const latestDetections = potholes.slice(0, 8);

  return (
    <div className="bg-white border border-slate-200 rounded overflow-hidden">
      <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Recent Pothole Detections
        </h3>
        <Link
          to="/reports"
          className="text-xs font-semibold text-blue-700 hover:underline"
        >
          View all reports →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-2.5 px-3">ID</th>
              <th className="py-2.5 px-3">Location</th>
              <th className="py-2.5 px-3">Severity</th>
              <th className="py-2.5 px-3">AI Conf.</th>
              <th className="py-2.5 px-3">GPS Coordinates</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Detected</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {latestDetections.map(pothole => (
              <tr
                key={pothole.id}
                onClick={() => setSelectedPothole(pothole)}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="py-2 px-3 font-bold text-slate-900">
                  {pothole.id}
                </td>
                <td className="py-2 px-3 font-sans text-slate-800">
                  {pothole.location}
                </td>
                <td className="py-2 px-3">
                  <StatusBadge severity={pothole.severity} />
                </td>
                <td className="py-2 px-3 font-semibold text-slate-700">
                  {formatConfidence(pothole.confidence)}
                </td>
                <td className="py-2 px-3 text-slate-500 text-[11px]">
                  {pothole.latitude.toFixed(4)}, {pothole.longitude.toFixed(4)}
                </td>
                <td className="py-2 px-3">
                  <PriorityBadge priority={pothole.priority} />
                </td>
                <td className="py-2 px-3 font-sans">
                  <StatusBadge status={pothole.status} />
                </td>
                <td className="py-2 px-3 text-right text-slate-500 text-[11px] whitespace-nowrap">
                  {new Date(pothole.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}

            {latestDetections.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-slate-400 font-sans">
                  No detection telemetry recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
