import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { usePotholes } from '../context/PotholeContext';
import { useAuth } from '../context/AuthContext';
import { GovernmentNotification } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { formatDateTime } from '../utils/formatters';

export const NotificationsPage: React.FC = () => {
  const { notifications, unreadCount, markAsViewed, markAllAsViewed, updateNotification } = useNotifications();
  const { updateRepair, setSelectedPothole, potholes } = usePotholes();
  const { isGovernmentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'ALL' | 'CRITICAL' | 'RESOLVED'>('ALL');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const filtered = notifications.filter(n => {
    if (n.severity === 'NORMAL') return false; // Normal road observations do not generate alerts
    if (activeTab === 'CRITICAL') return n.priority === 'CRITICAL' && !n.resolved;
    if (activeTab === 'RESOLVED') return n.resolved;
    return true;
  });

  const handleAcknowledge = async (notif: GovernmentNotification) => {
    setActionLoadingId(notif.id);
    try {
      await markAsViewed(notif.id);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAssignRepair = async (notif: GovernmentNotification) => {
    setActionLoadingId(notif.id);
    try {
      await updateNotification(notif.id, { status: 'REPAIR_ASSIGNED', viewed: true });
      if (notif.potholeId) {
        await updateRepair(notif.potholeId, 'ASSIGNED', 'Assigned via Government Notification Hub');
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleViewPotholeDetails = (potholeId: string) => {
    const found = potholes.find(p => p.id === potholeId);
    if (found) {
      setSelectedPothole(found);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Government Notifications
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Automated alerts dispatched to PWD & Highway Administration • {unreadCount} unread
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsViewed}
            disabled={!isGovernmentUser}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={isGovernmentUser ? "Mark all as viewed" : "Government authorization required"}
          >
            Mark All as Viewed
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-2 text-xs">
        {(['ALL', 'CRITICAL', 'RESOLVED'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === tab
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab === 'ALL'
              ? `All (${notifications.length})`
              : tab === 'CRITICAL'
              ? `Critical Alerts (${notifications.filter(n => n.priority === 'CRITICAL' && !n.resolved).length})`
              : `Resolved (${notifications.filter(n => n.resolved).length})`}
          </button>
        ))}
      </div>

      {/* Notifications Table */}
      <div className="bg-white border border-slate-200 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Notification ID</th>
                <th className="py-2.5 px-3">Pothole ID</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filtered.map(notif => (
                <tr
                  key={notif.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    !notif.viewed ? 'bg-amber-50/40' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      {notif.priority === 'CRITICAL' && !notif.resolved && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                      )}
                      <span>{notif.id}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-blue-700 hover:underline cursor-pointer" onClick={() => handleViewPotholeDetails(notif.potholeId)}>
                    {notif.potholeId}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-800 max-w-xs truncate">
                    {notif.location}
                  </td>
                  <td className="py-2.5 px-3">
                    <StatusBadge severity={notif.severity} />
                  </td>
                  <td className="py-2.5 px-3">
                    <PriorityBadge priority={notif.priority} />
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                    {formatDateTime(notif.timestamp)}
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="text-[11px] font-medium text-slate-700">
                      {notif.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-sans whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {!notif.viewed && (
                        <button
                          onClick={() => handleAcknowledge(notif)}
                          disabled={!isGovernmentUser || actionLoadingId === notif.id}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={isGovernmentUser ? "Acknowledge Alert" : "Government authorization required"}
                        >
                          Acknowledge
                        </button>
                      )}
                      {!notif.resolved && (
                        <button
                          onClick={() => handleAssignRepair(notif)}
                          disabled={!isGovernmentUser || actionLoadingId === notif.id}
                          className="px-2 py-0.5 bg-white hover:bg-slate-50 text-blue-700 border border-blue-300 rounded text-[11px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={isGovernmentUser ? "Assign Repair" : "Government authorization required"}
                        >
                          Assign Repair
                        </button>
                      )}
                      <button
                        onClick={() => handleViewPotholeDetails(notif.potholeId)}
                        className="px-2 py-0.5 text-slate-500 hover:text-slate-900 rounded text-[11px] hover:underline"
                      >
                        Inspect
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-sans">
                    No notifications in this queue.
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
