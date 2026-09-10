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
  { name: 'Sahyadri Campus Main Road', area: 'Adyar, Mangaluru', baseLat: 12.9004, baseLng: 74.8700 },
  { name: 'NH 73 Mangaluru-Bantwal Highway', area: 'Adyar Junction', baseLat: 12.8980, baseLng: 74.8745 },
  { name: 'Valachil Access Road', area: 'Valachil, Mangaluru', baseLat: 12.8942, baseLng: 74.8820 },
  { name: 'Farangipete Bypass', area: 'Farangipete, Dakshina Kannada', baseLat: 12.8870, baseLng: 74.8950 },
  { name: 'Netravati Riverbank Road', area: 'Adyar Riverview', baseLat: 12.8920, baseLng: 74.8650 },
  { name: 'Pumpwell Circle Connector', area: 'Pumpwell, Mangaluru', baseLat: 12.8680, baseLng: 74.8560 },
  { name: 'Kankanady Bypass Road', area: 'Kankanady, Mangaluru', baseLat: 12.8640, baseLng: 74.8520 },
  { name: 'Arkula Industrial Link Road', area: 'Arkula, Mangaluru', baseLat: 12.9050, baseLng: 74.8880 }
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
