import React from 'react';
import { PriorityLevel } from '../../types';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  const sizeClass = size === 'md' ? 'text-xs px-2 py-0.5' : 'text-[11px] px-1.5 py-0.2';

  switch (priority) {
    case 'CRITICAL':
      return (
        <span className={`inline-block font-mono font-bold rounded-sm border border-red-600 bg-red-600 text-white ${sizeClass}`}>
          Critical
        </span>
      );
    case 'HIGH':
      return (
        <span className={`inline-block font-mono font-semibold rounded-sm border border-orange-500 bg-orange-50 text-orange-800 ${sizeClass}`}>
          High
        </span>
      );
    case 'MEDIUM':
      return (
        <span className={`inline-block font-mono font-medium rounded-sm border border-slate-300 bg-slate-100 text-slate-700 ${sizeClass}`}>
          Medium
        </span>
      );
    case 'LOW':
      return (
        <span className={`inline-block font-mono font-normal rounded-sm border border-slate-200 bg-white text-slate-600 ${sizeClass}`}>
          Low
        </span>
      );
  }
};
