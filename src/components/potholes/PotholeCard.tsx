import React from 'react';
import { Pothole } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { formatRelativeTime, formatConfidence } from '../../utils/formatters';
import { MapPin, Bot, Clock, ArrowUpRight } from 'lucide-react';

interface PotholeCardProps {
  pothole: Pothole;
  onClick: () => void;
}

export const PotholeCard: React.FC<PotholeCardProps> = ({ pothole, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 hover:border-slate-400 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        {/* Header: ID, Severity, Priority */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {pothole.id}
            </span>
            <StatusBadge severity={pothole.severity} />
          </div>
          <PriorityBadge priority={pothole.priority} />
        </div>

        {/* Location */}
        <div className="flex items-start gap-1.5 mb-2">
          <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5 group-hover:text-red-500 transition-colors" />
          <div>
            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{pothole.location}</h4>
            <p className="text-[11px] text-slate-500 line-clamp-1">{pothole.area}</p>
          </div>
        </div>

        {/* Image thumbnail & stats */}
        <div className="flex items-center gap-3 my-2.5">
          <div className="w-16 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
            <img
              src={pothole.status === 'REPAIRED' && pothole.repairedImageUrl ? pothole.repairedImageUrl : pothole.imageUrl}
              alt={pothole.roadName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="text-[11px] space-y-0.5 text-slate-600">
            <div>
              <span className="text-slate-400">AI Confidence:</span>{' '}
              <span className="font-bold text-slate-800">{formatConfidence(pothole.confidence)}</span>
            </div>
            <div>
              <span className="text-slate-400">GPS:</span>{' '}
              <span className="font-mono text-[10px] text-slate-700">{pothole.latitude.toFixed(4)}, {pothole.longitude.toFixed(4)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: status and time */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <StatusBadge status={pothole.status} />
        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
          <Clock className="w-3 h-3" />
          <span>{formatRelativeTime(pothole.detectedAt)}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ml-1" />
        </div>
      </div>
    </div>
  );
};
