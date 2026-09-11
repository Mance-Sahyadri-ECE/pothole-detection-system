import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Pothole } from '../../types';
import { SAHYADRI_COORDINATES } from '../../utils/geoUtils';
import { usePotholes } from '../../context/PotholeContext';
import { useRobot } from '../../context/RobotContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { MapLegend } from './MapLegend';
import { formatConfidence } from '../../utils/formatters';
import { Search, Crosshair, Cpu } from 'lucide-react';

// Fix standard Leaflet default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1 });
  }, [center, zoom, map]);
  return null;
};

const createMarkerIcon = (pothole: Pothole) => {
  let bgColor = '#dc2626'; // RED: Severe / Critical Pothole
  if (pothole.status === 'REPAIRED') {
    bgColor = '#0d9488'; // TEAL/GREEN: Repaired Location
  } else if (pothole.severity === 'NORMAL' || pothole.priority === 'NONE') {
    bgColor = '#16a34a'; // GREEN: Normal / Safe Road Surface
  } else if (pothole.priority === 'HIGH' || pothole.severity === 'HIGH') {
    bgColor = '#ea580c'; // ORANGE: High-Severity Damage
  } else if (pothole.severity === 'MODERATE') {
    bgColor = '#eab308'; // YELLOW: Moderate Damage
  }

  const html = `
    <div style="
      width: 14px; 
      height: 14px; 
      border-radius: 50%; 
      background-color: ${bgColor}; 
      border: 2px solid #ffffff; 
      box-shadow: 0 1px 4px rgba(0,0,0,0.35);
    "></div>
  `;

  return L.divIcon({
    html,
    className: 'custom-pothole-pin',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
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
  const [mapCenter, setMapCenter] = useState<[number, number]>([SAHYADRI_COORDINATES.lat, SAHYADRI_COORDINATES.lng]);
  const [zoomLevel, setZoomLevel] = useState(14);

  const filteredPotholes = potholes.filter(p => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.id.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.roadName.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (activeFilter === 'NORMAL') return p.severity === 'NORMAL';
    if (activeFilter === 'MODERATE') return p.severity === 'MODERATE' && p.status !== 'REPAIRED';
    if (activeFilter === 'HIGH') return (p.severity === 'HIGH' || p.priority === 'HIGH') && p.status !== 'REPAIRED';
    if (activeFilter === 'SEVERE') return (p.severity === 'SEVERE' || p.priority === 'CRITICAL') && p.status !== 'REPAIRED';
    if (activeFilter === 'REPAIRED') return p.status === 'REPAIRED';
    return true;
  });

  return (
    <div className="w-full border border-slate-200 rounded bg-white overflow-hidden flex flex-col">
      {/* Top Map Toolbar */}
      {showFilters && (
        <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Filters */}
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-slate-500 mr-1">Filter:</span>
            {(['ALL', 'NORMAL', 'MODERATE', 'HIGH', 'SEVERE', 'REPAIRED'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  activeFilter === filter
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                }`}
              >
                {filter === 'ALL' ? `All (${potholes.length})` : filter}
              </button>
            ))}
          </div>

          {/* Search and Centering */}
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search road or PTH ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:border-slate-900"
              />
            </div>

            <button
              onClick={() => {
                setMapCenter([SAHYADRI_COORDINATES.lat, SAHYADRI_COORDINATES.lng]);
                setZoomLevel(15);
              }}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded font-medium flex items-center gap-1 transition-colors whitespace-nowrap"
              title="Center Map on Sahyadri College, Adyar"
            >
              <Crosshair className="w-3.5 h-3.5 text-blue-700" />
              <span>Center</span>
            </button>

            {robotStatus && (
              <button
                onClick={() => {
                  setMapCenter([robotStatus.currentLatitude, robotStatus.currentLongitude]);
                  setZoomLevel(16);
                }}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded font-medium flex items-center gap-1 transition-colors whitespace-nowrap"
                title="Locate Robot"
              >
                <Cpu className="w-3.5 h-3.5 text-blue-700" />
                <span>Rover</span>
              </button>
            )}
          </div>
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
          <MapController center={mapCenter} zoom={zoomLevel} />

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
                  <div>GPS Base: {SAHYADRI_COORDINATES.lat.toFixed(6)}° N, {SAHYADRI_COORDINATES.lng.toFixed(6)}° E</div>
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

          {/* Pothole Markers */}
          {filteredPotholes.map(pothole => (
            <Marker
              key={pothole.id}
              position={[pothole.latitude, pothole.longitude]}
              icon={createMarkerIcon(pothole)}
            >
              <Popup className="custom-leaflet-popup">
                {pothole.severity === 'NORMAL' ? (
                  <div className="space-y-2 text-xs min-w-[230px] max-w-[270px] font-sans">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                      <span className="font-mono font-bold text-slate-900">{pothole.id}</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        NORMAL / SAFE
                      </span>
                    </div>

                    {pothole.imageUrl && (
                      <div className="w-full h-24 rounded overflow-hidden bg-slate-100 border border-slate-200">
                        <img
                          src={pothole.imageUrl}
                          alt={pothole.id}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div>
                      <div className="font-semibold text-slate-900 leading-snug">Road Inspection</div>
                      <div className="text-[11px] text-emerald-700 font-semibold">No pothole detected</div>
                      <div className="text-[11px] text-slate-500">{pothole.location}</div>
                    </div>

                    <div className="font-mono text-[10px] bg-slate-50 p-1.5 rounded border border-slate-200 space-y-0.5 text-slate-700">
                      <div>GPS: {pothole.latitude.toFixed(5)}, {pothole.longitude.toFixed(5)}</div>
                      <div>AI Confidence: {formatConfidence(pothole.confidence)}</div>
                      <div>Status: Safe / No Defect</div>
                      <div>Inspected: {new Date(pothole.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>

                    <button
                      onClick={() => setSelectedPothole(pothole)}
                      className="w-full py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs min-w-[230px] max-w-[270px] font-sans">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900">{pothole.id}</span>
                      <StatusBadge severity={pothole.severity} />
                    </div>

                    {pothole.imageUrl && (
                      <div className="w-full h-24 rounded overflow-hidden bg-slate-100 border border-slate-200">
                        <img
                          src={pothole.imageUrl}
                          alt={pothole.id}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div>
                      <div className="font-semibold text-slate-900 leading-snug">{pothole.location}</div>
                      <div className="text-[11px] text-slate-500">{pothole.area}</div>
                    </div>

                    <div className="font-mono text-[10px] bg-slate-50 p-1.5 rounded border border-slate-200 space-y-0.5 text-slate-700">
                      <div>GPS: {pothole.latitude.toFixed(5)}, {pothole.longitude.toFixed(5)}</div>
                      <div>AI Confidence: {formatConfidence(pothole.confidence)}</div>
                      <div>Priority: {pothole.priority}</div>
                      <div>Status: {pothole.status}</div>
                      <div>Detected: {new Date(pothole.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>

                    <button
                      onClick={() => setSelectedPothole(pothole)}
                      className="w-full py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-20 pointer-events-auto hidden sm:block">
          <MapLegend />
        </div>
      </div>
    </div>
  );
};
