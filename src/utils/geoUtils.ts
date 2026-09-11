// Geographic utilities and region points for Dakshina Kannada & Sahyadri College, Adyar

export const SAHYADRI_COORDINATES = {
  lat: 12.8650354,
  lng: 74.9257386,
  name: 'Sahyadri College of Engineering & Management, Adyar, Mangaluru'
};

export const ROBOT_BASE_COORDINATES = {
  lat: 12.8650354,
  lng: 74.9257386,
  name: 'ROBOT BASE - Sahyadri College of Engineering & Management',
  location: 'Sahyadri Campus, Adyar, Mangaluru, Dakshina Kannada, Karnataka, India'
};

export const DAKSHINA_KANNADA_BOUNDS = {
  minLat: 12.75,
  maxLat: 13.05,
  minLng: 74.75,
  maxLng: 75.10
};

export const LOCAL_ROADS = [
  { name: 'Sahyadri Campus Access Road', area: 'Adyar, Mangaluru', baseLat: 12.8650, baseLng: 74.9257 },
  { name: 'NH 73 Mangaluru-Bantwal Highway', area: 'Adyar Junction', baseLat: 12.8665, baseLng: 74.9280 },
  { name: 'Valachil Access Road', area: 'Valachil, Mangaluru', baseLat: 12.8682, baseLng: 74.9310 },
  { name: 'Farangipete Bypass', area: 'Farangipete, Dakshina Kannada', baseLat: 12.8710, baseLng: 74.9390 },
  { name: 'Netravati Riverbank Road', area: 'Adyar Riverview', baseLat: 12.8630, baseLng: 74.9210 },
  { name: 'Arkula Industrial Link Road', area: 'Arkula, Mangaluru', baseLat: 12.8750, baseLng: 74.9350 }
];

export function getRandomRoadPoint(): { roadName: string; area: string; lat: number; lng: number } {
  const road = LOCAL_ROADS[Math.floor(Math.random() * LOCAL_ROADS.length)];
  // Add small jitter within 100-300 meters
  const jitterLat = (Math.random() - 0.5) * 0.005;
  const jitterLng = (Math.random() - 0.5) * 0.005;
  return {
    roadName: road.name,
    area: road.area,
    lat: Number((road.baseLat + jitterLat).toFixed(6)),
    lng: Number((road.baseLng + jitterLng).toFixed(6))
  };
}

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}
