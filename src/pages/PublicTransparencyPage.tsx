import React, { useState } from 'react';
import { usePotholes } from '../context/PotholeContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatDateTime, getEffectiveSeverity, getPotholePhoto } from '../utils/formatters';
import { Search, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { Pothole } from '../types';

export const PublicTransparencyPage: React.FC = () => {
  const { potholes } = usePotholes();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<Pothole | null>(null);

  // Filter public relevant defect records
  const publicRecords = potholes.filter(p => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.id.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.roadName.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (statusFilter === 'REPAIRED') return p.status === 'REPAIRED';
    if (statusFilter === 'PENDING') return p.status !== 'REPAIRED';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-700" />
            Public Repair Transparency Portal
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Government of Karnataka • PWD Dakshina Kannada Citizen Accountability Ledger
          </p>
        </div>
        <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 text-xs font-medium flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Public Access: Read-Only Ledger</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Report ID, road name, or location..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium">Status Filter:</span>
          {(['ALL', 'PENDING', 'REPAIRED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                statusFilter === tab
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              {tab === 'ALL' ? 'All Reports' : tab === 'PENDING' ? 'Active Repairs' : 'Completed Repairs'}
            </button>
          ))}
        </div>
      </div>

      {/* Public Records Grid/Table */}
      <div className="bg-white border border-slate-200 rounded overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Report ID</th>
                <th className="py-2.5 px-3">Location & Road</th>
                <th className="py-2.5 px-3">Road Condition</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Department Responsible</th>
                <th className="py-2.5 px-3">Current Status</th>
                <th className="py-2.5 px-3">Reported Date</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {publicRecords.map(p => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedRecord(p)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-3 font-bold text-slate-900">{p.id}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-800">
                    <div className="font-semibold">{p.location}</div>
                    <div className="text-[11px] text-slate-500">{p.roadName}</div>
                  </td>
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-700">
                    {p.severity === 'NORMAL' ? 'Normal Surface' : p.severity === 'SEVERE' ? 'Severe Crater' : p.severity === 'HIGH' ? 'High Damage' : 'Moderate Crack'}
                  </td>
                  <td className="py-2.5 px-3">
                    <StatusBadge severity={p.severity} />
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-700">
                    {p.assignedDepartment || 'Dakshina Kannada PWD'}
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                    {formatDateTime(p.detectedAt)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-sans">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedRecord(p);
                      }}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors"
                    >
                      Track Progress
                    </button>
                  </td>
                </tr>
              ))}

              {publicRecords.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-sans">
                    No public records match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Public Record Detail Modal (Read-Only) */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-300 shadow-xl p-5 max-w-2xl w-full space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <span className="font-mono font-bold text-slate-900 text-sm mr-2">{selectedRecord.id}</span>
                <StatusBadge status={selectedRecord.status} size="md" />
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Photo Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase text-slate-500 mb-1">
                  Reported Defect Frame
                </div>
                <div className="relative border border-slate-200 rounded overflow-hidden aspect-video bg-slate-100">
                  <img
                    src={getPotholePhoto(selectedRecord)}
                    alt={selectedRecord.id}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold uppercase text-slate-500 mb-1">
                  {selectedRecord.status === 'REPAIRED' ? 'Completed Repair Evidence' : 'Repair Status Photo'}
                </div>
                <div className="relative border border-slate-200 rounded overflow-hidden aspect-video bg-slate-100 flex items-center justify-center">
                  {selectedRecord.status === 'REPAIRED' ? (
                    <img
                      src="/assets/repaired_safe.jpg"
                      alt="Repaired Road"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="p-4 text-center text-slate-400">
                      <Clock className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                      <div>Repair work order in progress</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Evidence photo will be updated upon completion</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Public Timeline & Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded">
              <div className="space-y-1">
                <div><strong className="text-slate-900">Location:</strong> {selectedRecord.location}</div>
                <div><strong className="text-slate-900">Road Name:</strong> {selectedRecord.roadName}</div>
                <div><strong className="text-slate-900">Severity:</strong> {selectedRecord.severity}</div>
                <div><strong className="text-slate-900">Department:</strong> {selectedRecord.assignedDepartment || 'Dakshina Kannada PWD'}</div>
              </div>

              <div className="space-y-1 font-mono text-[11px]">
                <div><strong className="text-slate-900 font-sans">Reported:</strong> {formatDateTime(selectedRecord.detectedAt)}</div>
                <div><strong className="text-slate-900 font-sans">Assigned Engineer:</strong> {selectedRecord.assignedEngineer || 'Assigned to Division Crew'}</div>
                <div><strong className="text-slate-900 font-sans">Current Progress:</strong> {selectedRecord.status}</div>
                <div><strong className="text-slate-900 font-sans">GPS:</strong> {selectedRecord.latitude.toFixed(4)}° N, {selectedRecord.longitude.toFixed(4)}° E</div>
              </div>
            </div>

            {/* Verification Notice */}
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-blue-900 text-xs flex items-center justify-between">
              <span>This record is verified and tracked on the PWD Dakshina Kannada Public Ledger.</span>
              <span className="font-semibold text-blue-700">Read-Only View</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold"
              >
                Close Tracking View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
