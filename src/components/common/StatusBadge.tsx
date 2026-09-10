import React from 'react';
import { PotholeStatus, SeverityLevel } from '../../types';

interface StatusBadgeProps {
  status?: PotholeStatus;
  severity?: SeverityLevel;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, severity, size = 'sm' }) => {
  const sizeClass = size === 'md' ? 'text-xs px-2 py-0.5' : 'text-[11px] px-1.5 py-0.2';

  if (severity) {
    switch (severity) {
      case 'SEVERE':
        return (
          <span className={`inline-block font-mono font-medium rounded-sm border border-red-300 bg-red-50 text-red-700 ${sizeClass}`}>
            Severe
          </span>
        );
      case 'MODERATE':
        return (
          <span className={`inline-block font-mono font-medium rounded-sm border border-amber-300 bg-amber-50 text-amber-800 ${sizeClass}`}>
            Moderate
          </span>
        );
      case 'NORMAL':
        return (
          <span className={`inline-block font-mono font-medium rounded-sm border border-emerald-300 bg-emerald-50 text-emerald-700 ${sizeClass}`}>
            Normal
          </span>
        );
    }
  }

  if (status) {
    switch (status) {
      case 'PENDING':
        return (
          <span className={`inline-block font-medium rounded-sm border border-red-200 bg-red-50 text-red-700 ${sizeClass}`}>
            Pending
          </span>
        );
      case 'INSPECTION':
        return (
          <span className={`inline-block font-medium rounded-sm border border-blue-200 bg-blue-50 text-blue-700 ${sizeClass}`}>
            Inspection
          </span>
        );
      case 'ASSIGNED':
        return (
          <span className={`inline-block font-medium rounded-sm border border-slate-300 bg-slate-100 text-slate-800 ${sizeClass}`}>
            Assigned
          </span>
        );
      case 'REPAIR IN PROGRESS':
        return (
          <span className={`inline-block font-medium rounded-sm border border-orange-200 bg-orange-50 text-orange-800 ${sizeClass}`}>
            In Progress
          </span>
        );
      case 'REPAIRED':
        return (
          <span className={`inline-block font-medium rounded-sm border border-emerald-200 bg-emerald-50 text-emerald-800 ${sizeClass}`}>
            Repaired
          </span>
        );
    }
  }

  return null;
};
