import React, { useState } from 'react';
import { usePotholes } from '../context/PotholeContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { formatDateTime, formatConfidence } from '../utils/formatters';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';
import { Search } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { potholes, setSelectedPothole } = usePotholes();

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  const filtered = potholes.filter(p => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.id.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.roadName.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q) ||
        p.detectedBy.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (severityFilter !== 'ALL' && p.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && p.priority !== priorityFilter) return false;

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Pothole Reports
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            {potholes.length} total logged detections • Official audit ledger
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => exportToCSV(filtered)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded font-medium transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={() => exportToJSON(filtered)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded font-medium transition-colors"
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* Filter and search row */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search road or ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:border-slate-900"
          >
            <option value="ALL">Severity: All</option>
            <option value="SEVERE">Severe</option>
            <option value="MODERATE">Moderate</option>
            <option value="NORMAL">Normal</option>
          </select>
        </div>

        <div>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:border-slate-900"
          >
            <option value="ALL">Priority: All</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:border-slate-900"
          >
            <option value="ALL">Status: All</option>
            <option value="PENDING">Pending</option>
            <option value="INSPECTION">Inspection</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="REPAIR IN PROGRESS">In Progress</option>
            <option value="REPAIRED">Repaired</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white border border-slate-200 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">ID</th>
                <th className="py-2.5 px-3">Location & Road</th>
                <th className="py-2.5 px-3">GPS</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">AI Conf.</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Detected At</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filtered.map(p => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedPothole(p)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-2 px-3 font-bold text-slate-900">{p.id}</td>
                  <td className="py-2 px-3 font-sans text-slate-800">{p.location}</td>
                  <td className="py-2 px-3 text-slate-500 text-[11px]">{p.latitude.toFixed(4)}, {p.longitude.toFixed(4)}</td>
                  <td className="py-2 px-3"><StatusBadge severity={p.severity} /></td>
                  <td className="py-2 px-3 text-slate-800">{formatConfidence(p.confidence)}</td>
                  <td className="py-2 px-3"><PriorityBadge priority={p.priority} /></td>
                  <td className="py-2 px-3 font-sans"><StatusBadge status={p.status} /></td>
                  <td className="py-2 px-3 text-slate-500 text-[11px] whitespace-nowrap">{formatDateTime(p.detectedAt)}</td>
                  <td className="py-2 px-3 text-right font-sans">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedPothole(p);
                      }}
                      className="text-xs font-semibold text-blue-700 hover:underline"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 font-sans">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
