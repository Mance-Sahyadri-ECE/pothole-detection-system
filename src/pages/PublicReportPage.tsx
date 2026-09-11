import React, { useState } from 'react';
import { SeverityLevel } from '../types';
import * as api from '../services/api';
import { SAHYADRI_COORDINATES } from '../utils/geoUtils';
import { Search, AlertCircle, CheckCircle2 } from 'lucide-react';

export const PublicReportPage: React.FC = () => {
  // Form State
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');
  const [location, setLocation] = useState('Sahyadri Campus Access Road, Adyar');
  const [latitude, setLatitude] = useState<number>(SAHYADRI_COORDINATES.lat);
  const [longitude, setLongitude] = useState<number>(SAHYADRI_COORDINATES.lng);
  const [description, setDescription] = useState('');
  const [severityEstimate, setSeverityEstimate] = useState<SeverityLevel>('SEVERE');
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Status Lookup State
  const [lookupId, setLookupId] = useState('');
  const [lookupResult, setLookupResult] = useState<any | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

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
        citizenEmail: citizenEmail || undefined,
        location,
        latitude,
        longitude,
        description,
        severityEstimate,
        imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
      });

      setSubmittedId(created.id);
      setDescription('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookupStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupId.trim()) return;
    setLookupLoading(true);
    setLookupError(null);
    setLookupResult(null);
    try {
      const complaints = await api.getComplaints();
      const found = complaints.find(c => c.id.toLowerCase() === lookupId.trim().toLowerCase());
      if (found) {
        setLookupResult(found);
      } else {
        setLookupError(`No complaint record found matching ID "${lookupId.trim()}".`);
      }
    } catch (err: any) {
      setLookupError(`Lookup failed: ${err.message}`);
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
          Report a Road Defect
        </h1>
        <p className="text-xs text-slate-500 font-mono">
          Citizen grievance submission portal • Dakshina Kannada Road Maintenance
        </p>
      </div>

      {/* Submission Success Alert */}
      {submittedId && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-950 flex items-start gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-emerald-900">Complaint Submitted Successfully!</div>
            <p>
              Your official Grievance Reference ID is: <strong className="font-mono text-sm font-bold text-emerald-950">{submittedId}</strong>.
            </p>
            <p className="text-emerald-800 text-[11px]">
              Keep this reference ID to track asphalt inspection and repair progress.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Submission Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded p-4 space-y-4 text-xs shadow-xs">
          <h2 className="font-bold text-slate-800 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
            Submit Road Hazard Report
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98450 12345"
                  value={citizenPhone}
                  onChange={e => setCitizenPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. citizen@gmail.com"
                  value={citizenEmail}
                  onChange={e => setCitizenEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-slate-900"
                />
              </div>
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
                  <span className="text-slate-400 block text-[10px]">Latitude:</span>
                  <input
                    type="number"
                    step="0.000001"
                    value={latitude}
                    onChange={e => setLatitude(Number(e.target.value))}
                    className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-bold"
                  />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Longitude:</span>
                  <input
                    type="number"
                    step="0.000001"
                    value={longitude}
                    onChange={e => setLongitude(Number(e.target.value))}
                    className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-bold"
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
                <option value="SEVERE">Severe - Dangerous crater hazard</option>
                <option value="MODERATE">Moderate - Noticeable road depression</option>
                <option value="NORMAL">Normal - Minor crack</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Description *</label>
              <textarea
                required
                rows={3}
                placeholder="Details regarding defect size, traffic impact, or vehicle risk..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-slate-900 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors disabled:opacity-50 shadow-xs"
            >
              {submitting ? 'Submitting Report...' : 'Submit Report'}
            </button>
          </form>
        </div>

        {/* Right 5 cols: Status Lookup Tool */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded p-4 space-y-3 text-xs shadow-xs">
            <h2 className="font-bold text-slate-800 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
              Track Complaint Status
            </h2>

            <form onSubmit={handleLookupStatus} className="space-y-2">
              <label className="block text-slate-600 font-medium">Enter Complaint ID:</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. CMP-0001"
                  value={lookupId}
                  onChange={e => setLookupId(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded font-mono text-slate-900 focus:outline-none focus:border-slate-900"
                />
                <button
                  type="submit"
                  disabled={lookupLoading}
                  className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <Search className="w-3.5 h-3.5" />
                  Check
                </button>
              </div>
            </form>

            {lookupError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-800 text-[11px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{lookupError}</span>
              </div>
            )}

            {lookupResult && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-mono font-bold text-slate-900">{lookupResult.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-900">
                    {lookupResult.status}
                  </span>
                </div>

                <div className="space-y-1 font-sans text-slate-700 text-[11px]">
                  <div><strong className="text-slate-900">Location:</strong> {lookupResult.location}</div>
                  <div><strong className="text-slate-900">Submitted:</strong> {new Date(lookupResult.submittedAt).toLocaleDateString()}</div>
                  {lookupResult.adminNotes && (
                    <div className="pt-1 text-slate-600 italic">
                      "Notes: {lookupResult.adminNotes}"
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2 text-xs text-slate-600 font-mono">
            <div className="font-bold text-slate-800 uppercase text-[10px]">Municipal Helpline</div>
            <p className="text-[11px] text-slate-500 font-sans">
              Dakshina Kannada Public Works Department & Mangaluru City Corporation Emergency Dispatch Desk.
            </p>
            <div>Tel: +91 824 2220000</div>
          </div>
        </div>
      </div>
    </div>
  );
};
