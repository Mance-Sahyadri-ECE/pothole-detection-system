import React, { useState, useEffect } from 'react';
import { Complaint, SeverityLevel } from '../types';
import * as api from '../services/api';
import { subscribeToPotholeUpdates } from '../services/eventBus';
import { useNotifications } from '../context/NotificationContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatDateTime } from '../utils/formatters';
import { SAHYADRI_COORDINATES } from '../utils/geoUtils';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const ComplaintBoxPage: React.FC = () => {
  const { addToast } = useNotifications();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [location, setLocation] = useState('Sahyadri College Campus Road, Adyar');
  const [latitude, setLatitude] = useState<number>(SAHYADRI_COORDINATES.lat);
  const [longitude, setLongitude] = useState<number>(SAHYADRI_COORDINATES.lng);
  const [description, setDescription] = useState('');
  const [severityEstimate, setSeverityEstimate] = useState<SeverityLevel>('SEVERE');
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Review Modal State
  const [selectedComplaintForReview, setSelectedComplaintForReview] = useState<Complaint | null>(null);
  const [reviewActionLoading, setReviewActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const loadComplaints = async () => {
    try {
      const data = await api.getComplaints();
      setComplaints(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
    const unsubscribe = subscribeToPotholeUpdates(e => {
      if (
        e.type === 'NEW_COMPLAINT' || 
        e.type === 'COMPLAINT_UPDATED' || 
        e.type === 'POTHOLE_REPAIRED' ||
        e.type === 'DEMO_RESET'
      ) {
        loadComplaints();
      }
    });
    return () => unsubscribe();
  }, []);

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setLocationLoading(true);
    setLocationStatus('Getting location...');
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lng);
        setLocationLoading(false);
        setLocationStatus('Location detected');
        setLocationError(null);
      },
      (err) => {
        setLocationLoading(false);
        setLocationStatus(null);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError('Permission denied. Please allow location access in your browser settings.');
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError('Location position unavailable. Please try again.');
            break;
          case err.TIMEOUT:
            setLocationError('Location request timed out. Please try again.');
            break;
          default:
            setLocationError('Unable to retrieve location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName.trim() || !description.trim()) {
      alert('Please fill in your name and a description of the road defect.');
      return;
    }

    setSubmitting(true);
    try {
      const created = await api.createComplaint({
        citizenName,
        citizenPhone: citizenPhone || undefined,
        location,
        latitude,
        longitude,
        description,
        severityEstimate,
        imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
      });

      setSubmittedId(created.id);
      addToast({
        type: 'SUCCESS',
        title: 'COMPLAINT REGISTERED',
        message: `${created.id} submitted.`
      });

      setDescription('');
      await loadComplaints();
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptComplaint = async () => {
    if (!selectedComplaintForReview) return;
    setReviewActionLoading(true);
    try {
      const result = await api.acceptComplaintAndCreateRepairTask(selectedComplaintForReview.id);
      addToast({
        type: 'SUCCESS',
        title: 'REPAIR TASK CREATED',
        message: `Task ${result.repairTask.id} generated from ${selectedComplaintForReview.id}`
      });
      setSelectedComplaintForReview(null);
      setShowRejectInput(false);
      await loadComplaints();
    } catch (e: any) {
      console.error(e);
      addToast({
        type: 'CRITICAL',
        title: 'ERROR',
        message: e.message || 'Failed to accept complaint'
      });
    } finally {
      setReviewActionLoading(false);
    }
  };

  const handleRejectComplaint = async () => {
    if (!selectedComplaintForReview) return;
    if (!rejectReason.trim()) {
      setShowRejectInput(true);
      return;
    }
    setReviewActionLoading(true);
    try {
      await api.rejectComplaint(selectedComplaintForReview.id, rejectReason.trim());
      addToast({
        type: 'INFO',
        title: 'COMPLAINT REJECTED',
        message: `${selectedComplaintForReview.id} has been marked rejected.`
      });
      setSelectedComplaintForReview(null);
      setRejectReason('');
      setShowRejectInput(false);
      await loadComplaints();
    } catch (e: any) {
      console.error(e);
    } finally {
      setReviewActionLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: Complaint['status']) => {
    await api.updateComplaintStatus(id, newStatus);
    await loadComplaints();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
          Report a Road Pothole
        </h1>
        <p className="text-xs text-slate-500 font-mono">
          Citizen grievance submission portal • Dakshina Kannada Road Maintenance
        </p>
      </div>

      {submittedId && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 flex items-center justify-between">
          <div>
            <strong>Complaint submitted successfully.</strong> Complaint ID: <span className="font-mono font-bold">{submittedId}</span>
          </div>
          <button
            onClick={() => setSubmittedId(null)}
            className="text-xs text-emerald-700 hover:text-emerald-950"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 cols: Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded p-4 space-y-3 text-xs">
          <h2 className="font-bold text-slate-800 uppercase tracking-wider text-xs">
            Complaint Submission Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Your Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Karthik Shenoy"
                value={citizenName}
                onChange={e => setCitizenName(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Contact Number / Email (Optional)</label>
              <input
                type="text"
                placeholder="e.g. +91 98450 12345"
                value={citizenPhone}
                onChange={e => setCitizenPhone(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Location / Landmark *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sahyadri College Gate 1, Adyar"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-slate-900"
              />
            </div>

            {/* GPS with Use Current Location */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">GPS Location</span>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={locationLoading}
                  className="text-xs font-semibold text-blue-700 hover:underline disabled:opacity-50"
                >
                  {locationLoading ? 'Getting location...' : 'Use My Current Location'}
                </button>
              </div>

              {locationStatus && (
                <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{locationStatus}</span>
                </div>
              )}

              {locationError && (
                <div className="text-[11px] text-rose-700 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>{locationError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Lat:</span>
                  <input
                    type="number"
                    step="0.000001"
                    value={latitude}
                    onChange={e => setLatitude(Number(e.target.value))}
                    className="w-full px-2 py-1 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Lng:</span>
                  <input
                    type="number"
                    step="0.000001"
                    value={longitude}
                    onChange={e => setLongitude(Number(e.target.value))}
                    className="w-full px-2 py-1 border border-slate-300 rounded bg-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Severity Estimate</label>
              <select
                value={severityEstimate}
                onChange={e => setSeverityEstimate(e.target.value as SeverityLevel)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:border-slate-900"
              >
                <option value="SEVERE">Severe - Dangerous crater</option>
                <option value="MODERATE">Moderate - Noticeable cavity</option>
                <option value="NORMAL">Normal - Minor crack</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Description *</label>
              <textarea
                required
                rows={3}
                placeholder="Details about road hazard, traffic impact, or vehicle damage..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-slate-900 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </div>

        {/* Right 7 cols: Complaints Queue Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded overflow-hidden">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Citizen Grievance Queue ({complaints.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Citizen & Location</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Submitted</th>
                  <th className="py-2.5 px-3 text-right">Triage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {complaints.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{c.id}</td>
                    <td className="py-2.5 px-3 font-sans">
                      <div className="font-semibold text-slate-900">{c.location}</div>
                      <div className="text-[11px] text-slate-500">{c.citizenName}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge severity={c.severityEstimate} />
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        c.status === 'NEW' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        c.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-900' :
                        c.status === 'IN PROGRESS' ? 'bg-indigo-100 text-indigo-900' :
                        c.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-900' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                      {formatDateTime(c.submittedAt)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-sans whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Primary Action for NEW complaints */}
                        {c.status === 'NEW' ? (
                          <button
                            onClick={() => {
                              setSelectedComplaintForReview(c);
                              setShowRejectInput(false);
                              setRejectReason('');
                            }}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-semibold shadow-sm transition-colors"
                          >
                            Review & Create Task
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedComplaintForReview(c);
                              setShowRejectInput(false);
                              setRejectReason('');
                            }}
                            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium"
                          >
                            Review
                          </button>
                        )}

                        {c.status !== 'NEW' && c.status !== 'IN PROGRESS' && c.status !== 'RESOLVED' && (
                          <button
                            onClick={() => handleUpdateStatus(c.id, 'IN PROGRESS')}
                            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-medium"
                          >
                            In Progress
                          </button>
                        )}
                        {c.status !== 'RESOLVED' && c.status !== 'NEW' && (
                          <button
                            onClick={() => handleUpdateStatus(c.id, 'RESOLVED')}
                            className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded text-[11px] font-medium border border-emerald-200"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {complaints.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-sans">
                      No citizen complaints logged yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* COMPLAINT REVIEW MODAL */}
      {selectedComplaintForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl p-5 max-w-lg w-full space-y-4 text-xs">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Officer Review & Triage
                </span>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span>Complaint {selectedComplaintForReview.id}</span>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    selectedComplaintForReview.status === 'NEW' ? 'bg-amber-100 text-amber-900' :
                    selectedComplaintForReview.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-900' :
                    selectedComplaintForReview.status === 'IN PROGRESS' ? 'bg-indigo-100 text-indigo-900' :
                    selectedComplaintForReview.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-900' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {selectedComplaintForReview.status}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedComplaintForReview(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Content / Details Grid */}
            <div className="space-y-3 font-sans">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-semibold block">Citizen Name:</span>
                  <span className="font-semibold text-slate-900">{selectedComplaintForReview.citizenName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-semibold block">Contact Details:</span>
                  <span className="font-mono text-slate-800">
                    {selectedComplaintForReview.citizenPhone || selectedComplaintForReview.citizenEmail || 'Not provided'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-semibold block">Location / Road:</span>
                  <span className="font-medium text-slate-900">{selectedComplaintForReview.location}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-semibold block">GPS Coordinates:</span>
                  <span className="font-mono text-slate-800">
                    {Number(selectedComplaintForReview.latitude).toFixed(4)}°N, {Number(selectedComplaintForReview.longitude).toFixed(4)}°E
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-semibold block">Severity Estimate:</span>
                  <div className="mt-0.5">
                    <StatusBadge severity={selectedComplaintForReview.severityEstimate} />
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-semibold block">Submission Date:</span>
                  <span className="font-mono text-slate-700">{formatDateTime(selectedComplaintForReview.submittedAt)}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-600 font-semibold block mb-1">Citizen Description:</span>
                <div className="p-2.5 bg-slate-100 border border-slate-200 rounded text-slate-800 leading-relaxed font-sans">
                  "{selectedComplaintForReview.description}"
                </div>
              </div>

              {/* Show linked pothole ID if already converted */}
              {selectedComplaintForReview.linkedPotholeId && (
                <div className="p-2 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900 font-mono">
                  Linked Repair Task: <strong>{selectedComplaintForReview.linkedPotholeId}</strong>
                </div>
              )}

              {/* Reject Reason Form (if toggled) */}
              {showRejectInput && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded space-y-2">
                  <label className="block text-rose-900 font-semibold text-[11px]">Reason for Rejection:</label>
                  <input
                    type="text"
                    placeholder="e.g. Duplicate report, private property driveway, already scheduled..."
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    className="w-full px-2 py-1 border border-rose-300 rounded text-xs bg-white focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <div>
                {!showRejectInput ? (
                  <button
                    type="button"
                    onClick={() => setShowRejectInput(true)}
                    className="text-xs text-rose-700 hover:text-rose-900 font-medium hover:underline"
                  >
                    Reject Complaint
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRejectComplaint}
                    disabled={reviewActionLoading || !rejectReason.trim()}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-semibold text-xs disabled:opacity-50"
                  >
                    Confirm Rejection
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaintForReview(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded font-medium text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAcceptComplaint}
                  disabled={reviewActionLoading}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold text-xs shadow-sm transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {reviewActionLoading ? 'Processing...' : 'Accept / Create Repair Task'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
