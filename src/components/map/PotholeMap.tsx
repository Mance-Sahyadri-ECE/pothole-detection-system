import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Pothole, PotholeStatus } from '../../types';
import { SAHYADRI_COORDINATES } from '../../utils/geoUtils';
import { usePotholes } from '../../context/PotholeContext';
import { useRobot } from '../../context/RobotContext';
import { StatusBadge } from '../common/StatusBadge';
import { MapLegend } from './MapLegend';
import { formatConfidence, formatDateTime } from '../../utils/formatters';
import { Search, Crosshair, Cpu, XCircle, AlertCircle } from 'lucide-react';

// Fix standard Leaflet default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapController: React.FC<{
  centerTarget: [number, number] | null;
  zoomTarget: number;
  filteredPotholes: Pothole[];
  searchTrigger: number;
}> = ({ centerTarget, zoomTarget, filteredPotholes, searchTrigger }) => {
  const map = useMap();

  // Handle explicit center button click or rover click
  useEffect(() => {
    if (centerTarget) {
      map.flyTo(centerTarget, zoomTarget, { duration: 0.8 });
    }
  }, [centerTarget, zoomTarget, map]);

  // Handle search zooming/bounds fitting
  useEffect(() => {
    if (searchTrigger > 0 && filteredPotholes.length > 0) {
      if (filteredPotholes.length === 1) {
        const p = filteredPotholes[0];
        map.flyTo([p.latitude, p.longitude], 16, { duration: 0.8 });
      } else {
        const bounds = L.latLngBounds(filteredPotholes.map(p => [p.latitude, p.longitude]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      }
    }
  }, [searchTrigger, filteredPotholes, map]);

  return null;
};

export const getRepairStatusCategory = (status: PotholeStatus) => {
  if (status === 'REPAIRED') {
    return 'REPAIRED';
  }
  if (status === 'REPAIR IN PROGRESS' || status === 'ASSIGNED' || status === 'INSPECTION') {
    return 'WORK_IN_PROGRESS';
  }
  return 'PENDING_REPAIR';
};

const createMarkerIcon = (pothole: Pothole) => {
  const category = getRepairStatusCategory(pothole.status);
  let bgColor = '#dc2626'; // 🔴 RED marker = PENDING REPAIR

  if (category === 'REPAIRED') {
    bgColor = '#16a34a'; // 🟢 GREEN marker = REPAIRED
  } else if (category === 'WORK_IN_PROGRESS') {
    bgColor = '#eab308'; // 🟡 YELLOW marker = WORK IN PROGRESS / REPAIR IN PROGRESS
  }

  const html = `
    <div style="
      width: 16px; 
      height: 16px; 
      border-radius: 50%; 
      background-color: ${bgColor}; 
      border: 2px solid #ffffff; 
      box-shadow: 0 2px 5px rgba(0,0,0,0.4);
    "></div>
  `;

  return L.divIcon({
    html,
    className: 'custom-pothole-pin',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10]
  });
};

const createRobotBaseIcon = () => {
  const html = `
    <div style="
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 3px 6px;
      background-color: #1e3a8a;
      color: #ffffff;
      border: 2px solid #ffffff;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      font-family: monospace;
      white-space: nowrap;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    ">
      <span style="
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #60a5fa;
        display: inline-block;
      "></span>
      ROBOT BASE
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-robot-base-pin',
    iconSize: [110, 24],
    iconAnchor: [55, 12],
    popupAnchor: [0, -14]
  });
};

const createRobotIcon = () => {
  const html = `
    <div style="
      width: 16px; 
      height: 16px; 
      border-radius: 50%; 
      background-color: #2563eb; 
      border: 2px solid #ffffff; 
      box-shadow: 0 1px 4px rgba(0,0,0,0.4);
    "></div>
  `;
  return L.divIcon({
    html,
    className: 'custom-robot-pin',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10]
  });
};

interface PotholeMapProps {
  heightClass?: string;
  showFilters?: boolean;
}

export const PotholeMap: React.FC<PotholeMapProps> = ({
  heightClass = 'h-[550px]',
  showFilters = true
}) => {
  const { potholes, setSelectedPothole } = usePotholes();
  const { robotStatus } = useRobot();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'NORMAL' | 'MODERATE' | 'HIGH' | 'SEVERE' | 'REPAIRED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(0);

  const [centerTarget, setCenterTarget] = useState<[number, number] | null>([
    SAHYADRI_COORDINATES.lat,
    SAHYADRI_COORDINATES.lng
  ]);
  const [zoomTarget, setZoomTarget] = useState(14);

  // Dynamic filter counts
  const filterCounts = useMemo(() => {
    return {
      ALL: potholes.length,
      NORMAL: potholes.filter(p => p.severity === 'NORMAL').length,
      MODERATE: potholes.filter(p => p.severity === 'MODERATE').length,
      HIGH: potholes.filter(p => p.severity === 'HIGH').length,
      SEVERE: potholes.filter(p => p.severity === 'SEVERE').length,
      REPAIRED: potholes.filter(p => p.status === 'REPAIRED').length,
    };
  }, [potholes]);

  // Filtered map dataset
  const filteredPotholes = useMemo(() => {
    return potholes.filter(p => {
      // Category filter
      if (activeFilter === 'NORMAL' && p.severity !== 'NORMAL') return false;
      if (activeFilter === 'MODERATE' && p.severity !== 'MODERATE') return false;
      if (activeFilter === 'HIGH' && p.severity !== 'HIGH') return false;
      if (activeFilter === 'SEVERE' && p.severity !== 'SEVERE') return false;
      if (activeFilter === 'REPAIRED' && p.status !== 'REPAIRED') return false;

      // Text search filter
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const match =
          p.id.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.roadName.toLowerCase().includes(q) ||
          p.area.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [potholes, activeFilter, searchQuery]);

  // Execute search and trigger map zooming
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCenterTarget(null); // Clear manual center target so search bounds trigger
    setSearchTrigger(prev => prev + 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    setCenterTarget(null);
    setSearchTrigger(prev => prev + 1);
  };

  const handleCenterMap = () => {
    setCenterTarget([SAHYADRI_COORDINATES.lat, SAHYADRI_COORDINATES.lng]);
    setZoomTarget(15);
  };

  const handleLocateRover = () => {
    if (robotStatus) {
      setCenterTarget([robotStatus.currentLatitude, robotStatus.currentLongitude]);
      setZoomTarget(16);
    }
  };

  const noResultsFound = searchQuery.trim() !== '' && filteredPotholes.length === 0;

  return (
    <div className="w-full border border-slate-200 rounded bg-white overflow-hidden flex flex-col">
      {/* Top Map Toolbar */}
      {showFilters && (
        <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Dynamic Severity & Status Filters */}
          <div className="flex items-center gap-1.5 font-medium flex-wrap">
            <span className="text-slate-500 mr-1">Filter:</span>
            {(['ALL', 'NORMAL', 'MODERATE', 'HIGH', 'SEVERE', 'REPAIRED'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setCenterTarget(null);
                  setSearchTrigger(prev => prev + 1);
                }}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  activeFilter === filter
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                }`}
              >
                {filter === 'ALL'
                  ? `All (${filterCounts.ALL})`
                  : filter === 'NORMAL'
                  ? `Normal (${filterCounts.NORMAL})`
                  : filter === 'MODERATE'
                  ? `Moderate (${filterCounts.MODERATE})`
                  : filter === 'HIGH'
                  ? `High (${filterCounts.HIGH})`
                  : filter === 'SEVERE'
                  ? `Severe (${filterCounts.SEVERE})`
                  : `Repaired (${filterCounts.REPAIRED})`}
              </button>
            ))}
          </div>

          {/* Search Box & Controls */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search road, area (e.g. Adyar, Kulshekar), or PTH ID..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-8 pr-7 py-1 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:border-slate-900"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setCenterTarget(null);
                    setSearchTrigger(prev => prev + 1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  title="Clear search"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            <button
              onClick={handleCenterMap}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded font-medium flex items-center gap-1 transition-colors whitespace-nowrap"
              title="Center Map on Sahyadri College, Adyar (12.8650354° N, 74.9257386° E)"
            >
              <Crosshair className="w-3.5 h-3.5 text-blue-700" />
              <span>Center</span>
            </button>

            {robotStatus && (
              <button
                onClick={handleLocateRover}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded font-medium flex items-center gap-1 transition-colors whitespace-nowrap"
                title="Locate Robot Patrol Rover"
              >
                <Cpu className="w-3.5 h-3.5 text-blue-700" />
                <span>Rover</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Inline Banner when Search Has No Matches */}
      {noResultsFound && (
        <div className="px-3 py-1.5 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>No matching road or PTH ID found for "{searchQuery}"</span>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSearchTrigger(prev => prev + 1);
            }}
            className="text-amber-800 hover:text-amber-950 text-[11px] underline font-bold"
          >
            Reset Search
          </button>
        </div>
      )}

      {/* Map View */}
      <div className={`relative w-full ${heightClass}`}>
        <MapContainer
          center={[SAHYADRI_COORDINATES.lat, SAHYADRI_COORDINATES.lng]}
          zoom={14}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <MapController
            centerTarget={centerTarget}
            zoomTarget={zoomTarget}
            filteredPotholes={filteredPotholes}
            searchTrigger={searchTrigger}
          />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* PERMANENT ROBOT BASE MARKER AT SAHYADRI COLLEGE */}
          <Marker
            position={[SAHYADRI_COORDINATES.lat, SAHYADRI_COORDINATES.lng]}
            icon={createRobotBaseIcon()}
          >
            <Popup className="custom-leaflet-popup">
              <div className="space-y-1.5 text-xs min-w-[240px] font-sans">
                <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
                  <span>📍 ROBOT BASE STATION</span>
                  <span className="font-mono text-[10px] text-blue-700 font-semibold">SAHYADRI</span>
                </div>
                <div className="font-semibold text-slate-800">
                  Sahyadri College of Engineering & Management
                </div>
                <div className="text-slate-500 text-[11px]">
                  Sahyadri Campus, Adyar, Mangaluru, Dakshina Kannada
                </div>
                <div className="font-mono text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200 space-y-0.5 mt-1">
                  <div>GPS Base: {SAHYADRI_COORDINATES.lat.toFixed(7)}° N, {SAHYADRI_COORDINATES.lng.toFixed(7)}° E</div>
                  <div>Primary Rover: Pothole Patrol Robot 01</div>
                  <div>Base Status: ONLINE • Base Operations Center</div>
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Robot Marker */}
          {robotStatus && (
            <Marker
              position={[robotStatus.currentLatitude, robotStatus.currentLongitude]}
              icon={createRobotIcon()}
            >
              <Popup className="custom-leaflet-popup">
                <div className="space-y-1 text-xs min-w-[180px] font-sans">
                  <div className="font-semibold text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
                    <span>{robotStatus.name}</span>
                    <span className="font-mono text-[10px] text-emerald-700">{robotStatus.status}</span>
                  </div>
                  <div className="text-slate-600 text-[11px]">{robotStatus.currentLocation}</div>
                  <div className="font-mono text-[10px] text-slate-500">
                    GPS: {robotStatus.currentLatitude.toFixed(5)}, {robotStatus.currentLongitude.toFixed(5)}
                  </div>
                  <div className="text-[11px] text-slate-700 pt-1 flex justify-between font-mono">
                    <span>Batt: {robotStatus.batteryLevel}%</span>
                    <span>Speed: {robotStatus.currentSpeedKmh} km/h</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Pothole / Road Condition Markers */}
          {filteredPotholes.map(pothole => {
            const category = getRepairStatusCategory(pothole.status);
            const lastHistory = pothole.repairHistory && pothole.repairHistory.length > 0
              ? pothole.repairHistory[pothole.repairHistory.length - 1]
              : null;
            const lastUpdatedTime = lastHistory?.timestamp || pothole.detectedAt;
            const displayImage = (pothole.status === 'REPAIRED' && pothole.repairedImageUrl)
              ? pothole.repairedImageUrl
              : pothole.imageUrl;

            return (
              <Marker
                key={pothole.id}
                position={[pothole.latitude, pothole.longitude]}
                icon={createMarkerIcon(pothole)}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="space-y-2 text-xs min-w-[240px] max-w-[280px] font-sans">
                    {/* Header: ID & Badges */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="font-mono font-bold text-slate-900 text-sm">{pothole.id}</span>
                      <div className="flex items-center gap-1">
                        <StatusBadge severity={pothole.severity} />
                        {category === 'REPAIRED' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            🟢 REPAIRED
                          </span>
                        )}
                        {category === 'WORK_IN_PROGRESS' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                            🟡 IN PROGRESS
                          </span>
                        )}
                        {category === 'PENDING_REPAIR' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-800 border border-red-300">
                            🔴 PENDING
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Appropriate Road-Condition / Detection Image */}
                    {displayImage && (
                      <div className="w-full h-28 rounded overflow-hidden bg-slate-100 border border-slate-200 relative">
                        <img
                          src={displayImage}
                          alt={pothole.id}
                          className="w-full h-full object-cover"
                        />
                        {pothole.status === 'REPAIRED' && pothole.repairedImageUrl && (
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-emerald-800/90 text-white font-mono text-[9px] rounded font-semibold">
                            Post-Repair Photo
                          </span>
                        )}
                      </div>
                    )}

                    {/* Road / Location */}
                    <div>
                      <div className="font-semibold text-slate-900 leading-snug">{pothole.location}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{pothole.roadName} ({pothole.area})</div>
                    </div>

                    {/* Telemetry Details */}
                    <div className="font-mono text-[10px] bg-slate-50 p-2 rounded border border-slate-200 space-y-1 text-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-500">GPS:</span>
                        <span className="font-bold">{pothole.latitude.toFixed(5)}° N, {pothole.longitude.toFixed(5)}° E</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">AI Confidence:</span>
                        <span className="font-bold">{formatConfidence(pothole.confidence)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Severity:</span>
                        <span className="font-bold">{pothole.severity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Repair Status:</span>
                        <span className="font-bold">
                          {category === 'REPAIRED' ? '🟢 REPAIRED' : category === 'WORK_IN_PROGRESS' ? '🟡 WORK IN PROGRESS' : '🔴 PENDING REPAIR'} ({pothole.status})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Assigned Engineer:</span>
                        <span className="font-semibold text-slate-900 truncate max-w-[140px]">
                          {pothole.assignedEngineer || 'Unassigned'}
                        </span>
                      </div>
                      {pothole.contractorCrew && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Crew:</span>
                          <span className="font-semibold text-slate-800">{pothole.contractorCrew}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-500">Last Updated:</span>
                        <span>{formatDateTime(lastUpdatedTime)}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => setSelectedPothole(pothole)}
                      className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors"
                    >
                      View Full Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-20 pointer-events-auto hidden sm:block">
          <MapLegend />
        </div>
      </div>
    </div>
  );
};
