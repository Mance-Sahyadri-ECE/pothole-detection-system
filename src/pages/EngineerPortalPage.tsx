import React, { useState, useMemo } from 'react';
import { usePotholes } from '../context/PotholeContext';
import { useAuth } from '../context/AuthContext';
import { Pothole, PotholeStatus, PriorityLevel } from '../types';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  UserCheck, 
  Search, 
  FileSpreadsheet, 
  XCircle,
  Eye
} from 'lucide-react';

export const EngineerPortalPage: React.FC = () => {
  const { potholes, updateRepair, setSelectedPothole } = usePotholes();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCaseForAction, setSelectedCaseForAction] = useState<Pothole | null>(null);
  const [actionType, setActionType] = useState<string | null>(null);

  // Modal form states
  const [assignedEng, setAssignedEng] = useState<string>('');
  const [contractorCrewInput, setContractorCrewInput] = useState<string>('');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('HIGH');
  const [actionNote, setActionNote] = useState<string>('');

  // Summary Metrics (5 required cards)
  const metrics = useMemo(() => {
    const activeCases = potholes.filter(p => p.severity !== 'NORMAL');
    const pendingVerification = activeCases.filter(p => p.status === 'PENDING');
    const assignedCases = activeCases.filter(p => p.status === 'ASSIGNED' || p.status === 'INSPECTION');
    const activeRepairs = activeCases.filter(p => p.status === 'REPAIR IN PROGRESS');
    const awaitingVerification = activeCases.filter(p => p.status === 'REPAIRED');
    const resolved = activeCases.filter(p => p.status === 'REPAIRED' || p.status === 'REJECTED');

    return {
      pendingVerification: pendingVerification.length,
      assignedCases: assignedCases.length,
      activeRepairs: activeRepairs.length,
      awaitingVerification: awaitingVerification.length,
      resolved: resolved.length
    };
  }, [potholes]);

  // Filtered List
  const filteredCases = useMemo(() => {
    return potholes.filter(p => {
      // Exclude safe normal observations from internal defect workflow queue unless specifically searching
      const isDefect = p.severity !== 'NORMAL';
      if (!isDefect && activeTab !== 'ALL') return false;

      // Tab filter
      if (activeTab === 'PENDING' && p.status !== 'PENDING') return false;
      if (activeTab === 'ASSIGNED' && (p.status !== 'ASSIGNED' && p.status !== 'INSPECTION')) return false;
      if (activeTab === 'REPAIR_IN_PROGRESS' && p.status !== 'REPAIR IN PROGRESS') return false;
      if (activeTab === 'AWAITING_VERIFICATION' && p.status !== 'REPAIRED') return false;
      if (activeTab === 'RESOLVED' && (p.status !== 'REPAIRED' && p.status !== 'REJECTED')) return false;

      // Search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          p.id.toLowerCase().includes(term) ||
          p.location.toLowerCase().includes(term) ||
          p.roadName.toLowerCase().includes(term) ||
          (p.assignedEngineer && p.assignedEngineer.toLowerCase().includes(term))
        );
      }

      return true;
    });
  }, [potholes, activeTab, searchTerm]);

  // Open action modal handler
  const openActionModal = (pothole: Pothole, type: string) => {
    setSelectedCaseForAction(pothole);
    setActionType(type);
    setAssignedEng(pothole.assignedEngineer || user?.name || 'Er. Rajesh Bhat');
    setContractorCrewInput(pothole.contractorCrew || 'Dakshina Kannada PWD Work Crew 4');
    setNewPriority(pothole.priority);
    setActionNote('');
  };

  // Submit action handler
  const handleExecuteAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseForAction || !actionType) return;

    const pId = selectedCaseForAction.id;

    switch (actionType) {
      case 'VERIFY':
        await updateRepair(
          pId, 
          'INSPECTION', 
          actionNote || 'Detection verified by field engineer. Physical site inspection initiated.', 
          assignedEng
        );
        break;

      case 'ASSIGN':
        await updateRepair(
          pId, 
          'ASSIGNED', 
          actionNote || `Assigned to engineer ${assignedEng} / Crew: ${contractorCrewInput}.`, 
          assignedEng
        );
        break;

      case 'START_REPAIR':
        await updateRepair(
          pId, 
          'REPAIR IN PROGRESS', 
          actionNote || 'Repair crew deployed on site. Hot-mix asphalt patching active.', 
          assignedEng
        );
        break;

      case 'COMPLETE':
        await updateRepair(
          pId, 
          'REPAIRED', 
          actionNote || 'Patchwork completed by contractor crew. Ready for final engineering audit.', 
          assignedEng
        );
        break;

      case 'RESOLVE':
        await updateRepair(
          pId, 
          'REPAIRED', 
          actionNote || 'Case officially resolved and verified safe for traffic.', 
          assignedEng
        );
        break;

      case 'REOPEN':
        await updateRepair(
          pId, 
          'REOPENED', 
          actionNote || 'Surface degradation recurred at location. Case reopened for emergency patch.', 
          assignedEng
        );
        break;

      default:
        break;
    }

    setSelectedCaseForAction(null);
    setActionType(null);
  };

  const getStatusBadge = (status: PotholeStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">Pending Verification</span>;
      case 'INSPECTION':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">Under Inspection</span>;
      case 'ASSIGNED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">Engineer Assigned</span>;
      case 'REPAIR IN PROGRESS':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200 animate-pulse">Repair Active</span>;
      case 'REPAIRED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Repaired / Safe</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">False Alarm</span>;
      case 'REOPENED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">Resurfaced / Reopened</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'SEVERE':
        return <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">SEVERE</span>;
      case 'HIGH':
        return <span className="text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">HIGH</span>;
      case 'MODERATE':
        return <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">MODERATE</span>;
      default:
        return <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">NORMAL</span>;
    }
  };

  const formatLastUpdated = (dateStr?: string) => {
    if (!dateStr) return 'Just now';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">ENGINEER PORTAL</h1>
          <p className="text-sm font-semibold text-blue-700 mt-0.5">
            Road Condition & Repair Operations
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <strong>{user?.name || 'Er. Rajesh Bhat'}</strong> ({user?.roleTitle || 'Executive Engineer'}) &bull; Dakshina Kannada Division
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.print()} 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-500" />
            Export Work Orders
          </button>
        </div>
      </div>

      {/* 5 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 bg-white border border-slate-200 rounded-md shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Pending Verification</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{metrics.pendingVerification}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Awaiting inspection</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-md shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Assigned Cases</span>
            <UserCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{metrics.assignedCases}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Work order assigned</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-md shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Active Repairs</span>
            <Wrench className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{metrics.activeRepairs}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Patch crew on site</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-md shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Awaiting Verification</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{metrics.awaitingVerification}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Audit signoff pending</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-md shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Resolved</span>
            <ShieldAlert className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{metrics.resolved}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Case history closed</p>
        </div>
      </div>

      {/* Queue Tabs & Search */}
      <div className="bg-white border border-slate-200 rounded-md shadow-sm p-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded transition ${activeTab === 'ALL' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              All Cases ({potholes.length})
            </button>
            <button
              onClick={() => setActiveTab('PENDING')}
              className={`px-3 py-1.5 rounded transition ${activeTab === 'PENDING' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Pending ({metrics.pendingVerification})
            </button>
            <button
              onClick={() => setActiveTab('ASSIGNED')}
              className={`px-3 py-1.5 rounded transition ${activeTab === 'ASSIGNED' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Assigned ({metrics.assignedCases})
            </button>
            <button
              onClick={() => setActiveTab('REPAIR_IN_PROGRESS')}
              className={`px-3 py-1.5 rounded transition ${activeTab === 'REPAIR_IN_PROGRESS' ? 'bg-purple-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Active Repairs ({metrics.activeRepairs})
            </button>
            <button
              onClick={() => setActiveTab('AWAITING_VERIFICATION')}
              className={`px-3 py-1.5 rounded transition ${activeTab === 'AWAITING_VERIFICATION' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Awaiting Verification ({metrics.awaitingVerification})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ID, location, engineer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
            />
          </div>
        </div>

        {/* Master Case Table (Exact requested columns) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                <th className="p-3">Case ID</th>
                <th className="p-3">Location</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3">Assigned Engineer</th>
                <th className="p-3">Last Updated</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No cases match the selected filter query.
                  </td>
                </tr>
              ) : (
                filteredCases.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    {/* Case ID */}
                    <td className="p-3 font-mono font-bold text-slate-900">
                      <button 
                        onClick={() => setSelectedPothole(p)} 
                        className="text-slate-900 hover:underline flex items-center gap-1"
                      >
                        {p.id}
                        <Eye className="w-3 h-3 text-slate-400" />
                      </button>
                    </td>

                    {/* Location */}
                    <td className="p-3 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate">{p.location}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {p.latitude.toFixed(4)}° N, {p.longitude.toFixed(4)}° E
                      </div>
                    </td>

                    {/* Severity */}
                    <td className="p-3">
                      {getSeverityBadge(p.severity)}
                    </td>

                    {/* Priority */}
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        p.priority === 'CRITICAL' ? 'bg-red-50 text-red-800 border-red-200' :
                        p.priority === 'HIGH' ? 'bg-orange-50 text-orange-800 border-orange-200' : 
                        p.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}>
                        {p.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      {getStatusBadge(p.status)}
                    </td>

                    {/* Assigned Engineer */}
                    <td className="p-3">
                      <div className="font-medium text-slate-900">
                        {p.assignedEngineer || <span className="text-slate-400 italic">Unassigned</span>}
                      </div>
                      {p.contractorCrew && (
                        <div className="text-[10px] text-slate-500 font-mono">
                          Crew: {p.contractorCrew}
                        </div>
                      )}
                    </td>

                    {/* Last Updated */}
                    <td className="p-3 font-mono text-slate-500 text-[11px]">
                      {formatLastUpdated(p.detectedAt)}
                    </td>

                    {/* Action (Example actions: Review, Verify, Assign, Start Repair, Complete, Resolve, Reopen) */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1 flex-wrap">
                        <button
                          onClick={() => setSelectedPothole(p)}
                          className="px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[11px] font-semibold hover:bg-slate-200"
                        >
                          Review
                        </button>

                        {p.status === 'PENDING' && (
                          <button
                            onClick={() => openActionModal(p, 'VERIFY')}
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-semibold hover:bg-emerald-100"
                          >
                            Verify
                          </button>
                        )}

                        {p.status !== 'REPAIRED' && p.status !== 'REJECTED' && (
                          <button
                            onClick={() => openActionModal(p, 'ASSIGN')}
                            className="px-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[11px] font-semibold hover:bg-indigo-100"
                          >
                            Assign
                          </button>
                        )}

                        {(p.status === 'ASSIGNED' || p.status === 'INSPECTION') && (
                          <button
                            onClick={() => openActionModal(p, 'START_REPAIR')}
                            className="px-2 py-1 bg-purple-600 text-white rounded text-[11px] font-semibold hover:bg-purple-700"
                          >
                            Start Repair
                          </button>
                        )}

                        {p.status === 'REPAIR IN PROGRESS' && (
                          <button
                            onClick={() => openActionModal(p, 'COMPLETE')}
                            className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold hover:bg-emerald-700"
                          >
                            Complete
                          </button>
                        )}

                        {p.status === 'REPAIRED' && (
                          <>
                            <button
                              onClick={() => openActionModal(p, 'RESOLVE')}
                              className="px-2 py-1 bg-slate-900 text-white rounded text-[11px] font-semibold hover:bg-slate-800"
                            >
                              Resolve
                            </button>
                            <button
                              onClick={() => openActionModal(p, 'REOPEN')}
                              className="px-2 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[11px] font-semibold hover:bg-rose-100"
                            >
                              Reopen
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Dialog */}
      {selectedCaseForAction && actionType && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-300 rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Action: {actionType} ({selectedCaseForAction.id})
              </h3>
              <button 
                onClick={() => { setSelectedCaseForAction(null); setActionType(null); }}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded text-xs space-y-1">
              <div className="font-semibold text-slate-900">{selectedCaseForAction.location}</div>
              <div className="text-slate-500">
                Current Status: <strong>{selectedCaseForAction.status}</strong> &bull; Priority: <strong>{selectedCaseForAction.priority}</strong>
              </div>
            </div>

            <form onSubmit={handleExecuteAction} className="space-y-4 text-xs">
              {actionType === 'ASSIGN' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Designate Lead Engineer</label>
                    <input
                      type="text"
                      value={assignedEng}
                      onChange={(e) => setAssignedEng(e.target.value)}
                      required
                      className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900"
                      placeholder="e.g. Er. Sandeep Rai"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contractor / Repair Crew</label>
                    <input
                      type="text"
                      value={contractorCrewInput}
                      onChange={(e) => setContractorCrewInput(e.target.value)}
                      required
                      className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900"
                      placeholder="e.g. Mangaluru Asphalt Patch Crew 03"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Engineering Audit Note / Order Instructions</label>
                <textarea
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900"
                  placeholder="Enter detailed directive or audit verification note..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => { setSelectedCaseForAction(null); setActionType(null); }}
                  className="px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded font-bold hover:bg-slate-800 shadow-sm"
                >
                  Confirm & Update Case Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EngineerPortalPage;
