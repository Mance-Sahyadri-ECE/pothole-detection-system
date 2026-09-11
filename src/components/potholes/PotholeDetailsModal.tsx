import React, { useState } from 'react';
import { Pothole, PotholeStatus } from '../../types';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { formatDateTime, formatConfidence } from '../../utils/formatters';
import { usePotholes } from '../../context/PotholeContext';
import { useNotifications } from '../../context/NotificationContext';

interface PotholeDetailsModalProps {
  pothole: Pothole | null;
  onClose: () => void;
}

export const PotholeDetailsModal: React.FC<PotholeDetailsModalProps> = ({ pothole, onClose }) => {
  const { updateRepair } = usePotholes();
  const { addToast } = useNotifications();
  const [engineerInput, setEngineerInput] = useState('');
  const [repairNoteInput, setRepairNoteInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  if (!pothole) return null;

  const handleStatusChange = async (newStatus: PotholeStatus) => {
    setActionLoading(true);
    try {
      await updateRepair(
        pothole.id,
        newStatus,
        repairNoteInput || `Status changed to ${newStatus}`,
        engineerInput || pothole.assignedEngineer
      );
      setRepairNoteInput('');
      addToast({
        type: newStatus === 'REPAIRED' ? 'SUCCESS' : 'INFO',
        title: `Status: ${newStatus}`,
        message: `${pothole.id} updated.`
      });
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const isRepaired = pothole.status === 'REPAIRED';

  return (
    <Modal
      isOpen={!!pothole}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2.5 font-mono">
          <span className="font-bold text-slate-900">{pothole.id}</span>
          <StatusBadge severity={pothole.severity} />
          <PriorityBadge priority={pothole.priority} />
          <StatusBadge status={pothole.status} />
        </div>
      }
    >
      <div className="space-y-4 text-xs font-sans">
        {/* Main Grid: Photo and Telemetry Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Photo */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold uppercase text-slate-500">
              {isRepaired ? 'Resolution Photo' : 'Detection Capture'}
            </div>
            <div className="relative border border-slate-200 rounded overflow-hidden aspect-video bg-slate-100">
              <img
                src={isRepaired && pothole.repairedImageUrl ? pothole.repairedImageUrl : pothole.imageUrl}
                alt={pothole.roadName}
                className="w-full h-full object-cover"
              />
              {pothole.boundingBox && !isRepaired && (
                <div
                  className="absolute border border-red-500 bg-red-500/10 pointer-events-none"
                  style={{
                    left: `${pothole.boundingBox.x}%`,
                    top: `${pothole.boundingBox.y}%`,
                    width: `${pothole.boundingBox.width}%`,
                    height: `${pothole.boundingBox.height}%`
                  }}
                >
                  <span className="absolute -top-4 left-0 bg-red-600 text-white text-[9px] font-mono px-1 py-0.2">
                    {formatConfidence(pothole.confidence)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Telemetry Table */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold uppercase text-slate-500">
              Telemetry Parameters
            </div>
            <table className="w-full border border-slate-200 text-xs">
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-1.5 px-2.5 bg-slate-50 text-slate-500 font-medium">Location</td>
                  <td className="py-1.5 px-2.5 font-semibold text-slate-900">{pothole.location}</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-2.5 bg-slate-50 text-slate-500 font-medium">GPS</td>
                  <td className="py-1.5 px-2.5 font-mono text-slate-800">{pothole.latitude.toFixed(5)}, {pothole.longitude.toFixed(5)}</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-2.5 bg-slate-50 text-slate-500 font-medium">AI Confidence</td>
                  <td className="py-1.5 px-2.5 font-mono font-bold text-slate-900">{formatConfidence(pothole.confidence)}</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-2.5 bg-slate-50 text-slate-500 font-medium">Estimated Dimensions</td>
                  <td className="py-1.5 px-2.5 font-mono text-slate-800">
                    {pothole.estimatedDimensions ? `${pothole.estimatedDimensions.lengthCm}x${pothole.estimatedDimensions.widthCm} cm, Depth: ~${pothole.estimatedDimensions.depthCm} cm` : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 px-2.5 bg-slate-50 text-slate-500 font-medium">Traffic Density</td>
                  <td className="py-1.5 px-2.5 text-slate-800">{pothole.trafficLevel}</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-2.5 bg-slate-50 text-slate-500 font-medium">Detected By</td>
                  <td className="py-1.5 px-2.5 text-slate-800">{pothole.detectedBy}</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-2.5 bg-slate-50 text-slate-500 font-medium">Timestamp</td>
                  <td className="py-1.5 px-2.5 font-mono text-slate-600 text-[11px]">{formatDateTime(pothole.detectedAt)}</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-2.5 bg-slate-50 text-slate-500 font-medium">Assigned Engineer</td>
                  <td className="py-1.5 px-2.5 font-semibold text-slate-900">{pothole.assignedEngineer || 'Unassigned'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit History */}
        <div className="space-y-1.5 pt-2 border-t border-slate-200">
          <div className="text-[11px] font-semibold uppercase text-slate-500">
            Audit Trail ({pothole.repairHistory.length})
          </div>
          <div className="space-y-1.5 max-h-32 overflow-y-auto font-mono text-[11px] bg-slate-50 p-2.5 border border-slate-200 rounded">
            {pothole.repairHistory.map(item => (
              <div key={item.id} className="flex items-start justify-between gap-2 border-b border-slate-200/60 pb-1 last:border-0 last:pb-0">
                <div>
                  <span className="font-bold text-slate-900">[{item.status}]</span>{' '}
                  <span className="font-sans text-slate-700">{item.note}</span>
                </div>
                <span className="text-slate-400 whitespace-nowrap text-[10px]">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Actions */}
        {pothole.severity === 'NORMAL' ? (
          <div className="pt-3 border-t border-slate-200 p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs">
            <span className="font-bold">Normal Road Segment: </span>
            This location represents a normal intact road surface. Autonomous monitoring is active. No maintenance action required.
          </div>
        ) : (
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <div className="text-[11px] font-semibold uppercase text-slate-700">
              Government Engineer Workflow
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Assign Engineer (e.g. Er. Rajesh Bhat)"
                value={engineerInput}
                onChange={e => setEngineerInput(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-slate-900"
              />
              <input
                type="text"
                placeholder="Add inspection or repair note..."
                value={repairNoteInput}
                onChange={e => setRepairNoteInput(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-slate-900"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
              {!isRepaired ? (
                <>
                  <button
                    onClick={() => handleStatusChange('INSPECTION')}
                    disabled={actionLoading}
                    className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded font-medium transition-colors"
                  >
                    Mark Inspection
                  </button>
                  <button
                    onClick={() => handleStatusChange('ASSIGNED')}
                    disabled={actionLoading}
                    className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded font-medium transition-colors"
                  >
                    Assign Crew
                  </button>
                  <button
                    onClick={() => handleStatusChange('REPAIR IN PROGRESS')}
                    disabled={actionLoading}
                    className="px-3 py-1 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-300 rounded font-medium transition-colors"
                  >
                    Start Repair
                  </button>
                  <button
                    onClick={() => handleStatusChange('REJECTED')}
                    disabled={actionLoading}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition-colors"
                    title="Mark as False Detection or Not a Pothole"
                  >
                    Reject False Alarm
                  </button>
                  <button
                    onClick={() => handleStatusChange('REPAIRED')}
                    disabled={actionLoading}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold transition-colors"
                  >
                    Mark Repaired & Certified
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleStatusChange('REOPENED')}
                  disabled={actionLoading}
                  className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 rounded font-medium transition-colors"
                >
                  Reopen Resurfaced Record
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
