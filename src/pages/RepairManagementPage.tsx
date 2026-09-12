import React, { useState } from 'react';
import { usePotholes } from '../context/PotholeContext';
import { useNotifications } from '../context/NotificationContext';
import { Pothole, PotholeStatus } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { formatDateTime, getEffectiveSeverity } from '../utils/formatters';
import { Search, Bot, UserCheck } from 'lucide-react';

const ENGINEERS = [
  'Er. Rajesh Bhat (PWD)',
  'Er. Sandeep Rai (PWD Zone 3)',
  'Er. Suresh Kumar (NHAI)',
  'Er. Anitha Shetty (MCC)',
  'Er. Naveen Hegde (Highway)'
];

export const RepairManagementPage: React.FC = () => {
  const { potholes, updateRepair, setSelectedPothole } = usePotholes();
  const { addToast } = useNotifications();

  // Table view as DEFAULT
  const [viewMode, setViewMode] = useState<'TABLE' | 'KANBAN'>('TABLE');
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'ALL' | 'AI_DETECTION' | 'CITIZEN_COMPLAINT'>('ALL');
  const [selectedPotholeToAssign, setSelectedPotholeToAssign] = useState<Pothole | null>(null);
  const [assignedEngineerName, setAssignedEngineerName] = useState(ENGINEERS[0]);
  const [repairNote, setRepairNote] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  const filteredPotholes = potholes.filter(p => {
    if (p.severity === 'NORMAL') return false; // Normal road observations do not enter repair workflow

    const isCitizen = p.source === 'CITIZEN_COMPLAINT' || p.id.startsWith('CMP-');
    if (sourceFilter === 'AI_DETECTION' && isCitizen) return false;
    if (sourceFilter === 'CITIZEN_COMPLAINT' && !isCitizen) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.id.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.roadName.toLowerCase().includes(q) ||
        (p.assignedEngineer && p.assignedEngineer.toLowerCase().includes(q)) ||
        (p.detectedBy && p.detectedBy.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const columns: { status: PotholeStatus; title: string }[] = [
    { status: 'PENDING', title: 'Pending' },
    { status: 'INSPECTION', title: 'Inspection' },
    { status: 'ASSIGNED', title: 'Assigned' },
    { status: 'REPAIR IN PROGRESS', title: 'In Progress' },
    { status: 'REPAIRED', title: 'Repaired' }
  ];

  const handleSaveAssignment = async () => {
    if (!selectedPotholeToAssign) return;
    setAssignLoading(true);
    try {
      await updateRepair(
        selectedPotholeToAssign.id,
        'ASSIGNED',
        repairNote || 'Assigned to field engineer for execution.',
        assignedEngineerName
      );
      addToast({
        type: 'SUCCESS',
        title: 'CREW ASSIGNED',
        message: `${selectedPotholeToAssign.id} assigned to ${assignedEngineerName}`
      });
      setSelectedPotholeToAssign(null);
      setRepairNote('');
    } catch (e: any) {
      console.error(e);
      addToast({
        type: 'CRITICAL',
        title: 'ASSIGNMENT FAILED',
        message: e.message || 'Could not assign engineer.'
      });
    } finally {
      setAssignLoading(false);
    }
  };

  const handleQuickStatusMove = async (pothole: Pothole, newStatus: PotholeStatus) => {
    try {
      await updateRepair(pothole.id, newStatus, `Status transitioned to ${newStatus}`);
      addToast({
        type: newStatus === 'REPAIRED' ? 'SUCCESS' : 'INFO',
        title: `STATUS UPDATED: ${newStatus}`,
        message: `${pothole.id} is now ${newStatus}`
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Repair Management
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Maintenance workflow tracking • Public Works Department & Citizen Grievance Tasks
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {/* Source Quick Filter Tabs */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200">
            <button
              onClick={() => setSourceFilter('ALL')}
              className={`px-2.5 py-1 rounded font-medium text-xs transition-colors ${
                sourceFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({potholes.length})
            </button>
            <button
              onClick={() => setSourceFilter('AI_DETECTION')}
              className={`px-2.5 py-1 rounded font-medium text-xs transition-colors flex items-center gap-1 ${
                sourceFilter === 'AI_DETECTION' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot className="w-3 h-3" />
              AI Detected ({potholes.filter(p => !p.id.startsWith('CMP-') && p.source !== 'CITIZEN_COMPLAINT').length})
            </button>
            <button
              onClick={() => setSourceFilter('CITIZEN_COMPLAINT')}
              className={`px-2.5 py-1 rounded font-medium text-xs transition-colors flex items-center gap-1 ${
                sourceFilter === 'CITIZEN_COMPLAINT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              Citizen Complaints ({potholes.filter(p => p.id.startsWith('CMP-') || p.source === 'CITIZEN_COMPLAINT').length})
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          <button
            onClick={() => setViewMode('TABLE')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              viewMode === 'TABLE'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode('KANBAN')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              viewMode === 'KANBAN'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            Kanban View
          </button>
        </div>
      </div>

      {/* Search Filter & Metrics */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative max-w-sm w-full text-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID (PTH/CMP), road, or engineer..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
          <span>Pending: <strong>{potholes.filter(p => p.status !== 'REPAIRED').length}</strong></span>
          <span>•</span>
          <span>In Progress: <strong className="text-blue-700">{potholes.filter(p => p.status === 'REPAIR IN PROGRESS').length}</strong></span>
          <span>•</span>
          <span>Repaired: <strong className="text-emerald-700">{potholes.filter(p => p.status === 'REPAIRED').length}</strong></span>
        </div>
      </div>

      {/* DEFAULT VIEW: Clean Table */}
      {viewMode === 'TABLE' && (
        <div className="bg-white border border-slate-200 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Task ID</th>
                  <th className="py-2.5 px-3">Source / Type</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Assigned Engineer</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Last Updated</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredPotholes.map(p => {
                  const isCitizen = p.source === 'CITIZEN_COMPLAINT' || p.id.startsWith('CMP-');
                  const lastHistory = p.repairHistory && p.repairHistory.length > 0
                    ? p.repairHistory[p.repairHistory.length - 1]
                    : null;
                  const lastUpdatedTime = lastHistory?.timestamp || p.detectedAt;

                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedPothole(p)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="py-2 px-3 font-bold text-slate-900">{p.id}</td>
                      <td className="py-2 px-3 font-sans">
                        {isCitizen ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                            <UserCheck className="w-2.5 h-2.5" />
                            CITIZEN COMPLAINT
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-900 border border-sky-200">
                            <Bot className="w-2.5 h-2.5" />
                            AI DETECTION
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-sans text-slate-800">
                        <div>{p.location}</div>
                        {isCitizen && <div className="text-[10px] text-slate-400 font-mono">{p.detectedBy}</div>}
                      </td>
                      <td className="py-2 px-3"><StatusBadge severity={getEffectiveSeverity(p)} /></td>
                      <td className="py-2 px-3"><PriorityBadge priority={p.priority} /></td>
                      <td className="py-2 px-3 font-sans text-slate-700">{p.assignedEngineer || <span className="text-slate-400 italic">Unassigned</span>}</td>
                      <td className="py-2 px-3 font-sans"><StatusBadge status={p.status} /></td>
                      <td className="py-2 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                        {formatDateTime(lastUpdatedTime)}
                      </td>
                      <td className="py-2 px-3 text-right font-sans whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {p.status !== 'REPAIRED' && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setSelectedPotholeToAssign(p);
                              }}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-medium"
                            >
                              Assign
                            </button>
                          )}

                          {p.status === 'ASSIGNED' && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleQuickStatusMove(p, 'REPAIR IN PROGRESS');
                              }}
                              className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded text-[11px] font-medium"
                            >
                              Start
                            </button>
                          )}

                          {p.status !== 'REPAIRED' && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleQuickStatusMove(p, 'REPAIRED');
                              }}
                              className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[11px] font-medium"
                            >
                              Mark Repaired
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredPotholes.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400 font-sans">
                      No repair tasks found matching your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECONDARY VIEW: Kanban */}
      {viewMode === 'KANBAN' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 overflow-x-auto pb-2">
          {columns.map(col => {
            const colPotholes = filteredPotholes.filter(p => p.status === col.status);
            return (
              <div
                key={col.status}
                className="bg-slate-50 rounded border border-slate-200 p-2.5 min-w-[200px] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200 text-xs">
                    <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                      {col.title}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 font-semibold">
                      {colPotholes.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {colPotholes.map(p => {
                      const isCitizen = p.source === 'CITIZEN_COMPLAINT' || p.id.startsWith('CMP-');
                      return (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPothole(p)}
                          className="bg-white p-2.5 rounded border border-slate-200 shadow-xs hover:border-slate-400 cursor-pointer space-y-1.5 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-slate-900">{p.id}</span>
                            <PriorityBadge priority={p.priority} />
                          </div>

                          <div>
                            {isCitizen ? (
                              <span className="inline-flex items-center gap-0.5 px-1 py-0.2 text-[9px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 rounded">
                                <UserCheck className="w-2.5 h-2.5" />
                                CITIZEN
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 px-1 py-0.2 text-[9px] font-semibold bg-sky-50 text-sky-900 border border-sky-200 rounded">
                                <Bot className="w-2.5 h-2.5" />
                                AI
                              </span>
                            )}
                          </div>

                          <div className="text-slate-800 font-medium line-clamp-1">{p.location}</div>
                          <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-1 border-t border-slate-100">
                            <span>{p.assignedEngineer ? p.assignedEngineer.split(' ')[1] || p.assignedEngineer : 'Unassigned'}</span>
                            <span className="text-[10px] text-slate-400">{p.severity}</span>
                          </div>
                        </div>
                      );
                    })}

                    {colPotholes.length === 0 && (
                      <div className="py-4 text-center text-[11px] text-slate-400 font-sans">
                        None
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assign Modal */}
      {selectedPotholeToAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-300 shadow-xl p-4 max-w-md w-full space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Assign Crew - {selectedPotholeToAssign.id}
              </h3>
              <button
                onClick={() => setSelectedPotholeToAssign(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-2 bg-slate-50 border border-slate-200 rounded space-y-1 text-slate-700">
              <div><strong className="text-slate-900">Location:</strong> {selectedPotholeToAssign.location}</div>
              <div>
                <strong className="text-slate-900">Type:</strong>{' '}
                {selectedPotholeToAssign.source === 'CITIZEN_COMPLAINT' || selectedPotholeToAssign.id.startsWith('CMP-')
                  ? 'Citizen Grievance Task'
                  : 'AI Detected Pothole'}
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Designated Engineer:</label>
              <select
                value={assignedEngineerName}
                onChange={e => setAssignedEngineerName(e.target.value)}
                className="w-full p-1.5 border border-slate-300 rounded bg-white font-medium focus:outline-none focus:border-slate-900"
              >
                {ENGINEERS.map(eng => (
                  <option key={eng} value={eng}>{eng}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Work Order Instructions:</label>
              <textarea
                rows={2}
                placeholder="e.g. Deploy safety cones, apply hot-mix asphalt, verify surface compaction..."
                value={repairNote}
                onChange={e => setRepairNote(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-slate-900 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedPotholeToAssign(null)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssignment}
                disabled={assignLoading}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium disabled:opacity-50 transition-colors"
              >
                {assignLoading ? 'Saving...' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
