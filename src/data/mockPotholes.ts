import { Pothole } from '../types';

export const INITIAL_POTHOLES: Pothole[] = [
  {
    id: 'PTH-001',
    latitude: 12.8650,
    longitude: 74.9257,
    location: 'Near Sahyadri College Gate 1, Adyar',
    roadName: 'Sahyadri Campus Access Road',
    area: 'Adyar, Mangaluru',
    severity: 'SEVERE',
    confidence: 0.96,
    priority: 'CRITICAL',
    status: 'PENDING',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 24).toISOString(), // 24m ago
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'HIGH',
    estimatedDimensions: {
      lengthCm: 65,
      widthCm: 48,
      depthCm: 14,
      areaSqM: 0.31
    },
    complaintCount: 4,
    assignedDepartment: 'Dakshina Kannada PWD - Mangaluru Division',
    assignedEngineer: 'Er. Rajesh Bhat (Executive Engineer)',
    repairNotes: 'High-risk deep crater directly on student transit path. Immediate barricading needed.',
    repairHistory: [
      {
        id: 'RH-001-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
        status: 'PENDING',
        note: 'Autonomous detection registered by Robot-01 with 96% AI confidence.',
        updatedBy: 'Pothole Patrol Robot 01'
      }
    ],
    governmentNotificationSent: true,
    boundingBox: {
      x: 25,
      y: 30,
      width: 50,
      height: 40
    }
  },
  {
    id: 'PTH-002',
    latitude: 12.8665,
    longitude: 74.9280,
    location: 'NH 73 Junction, Opp. Adyar Petrol Pump',
    roadName: 'NH 73 Mangaluru-Bantwal Highway',
    area: 'Adyar Junction',
    severity: 'HIGH',
    confidence: 0.94,
    priority: 'HIGH',
    status: 'REPAIR IN PROGRESS',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'HIGH',
    estimatedDimensions: {
      lengthCm: 80,
      widthCm: 60,
      depthCm: 16,
      areaSqM: 0.48
    },
    complaintCount: 6,
    assignedDepartment: 'National Highways Authority of India (NHAI)',
    assignedEngineer: 'Er. Suresh Kumar (NHAI Inspector)',
    repairNotes: 'Patching team on site with hot mix bitumen asphalt.',
    repairHistory: [
      {
        id: 'RH-002-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        status: 'PENDING',
        note: 'AI detected significant road surface deformation on highway lane.',
        updatedBy: 'Pothole Patrol Robot 01'
      },
      {
        id: 'RH-002-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        status: 'ASSIGNED',
        note: 'Assigned to NHAI Mangalore quick-response repair team.',
        updatedBy: 'PWD Control Room'
      },
      {
        id: 'RH-002-3',
        timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
        status: 'REPAIR IN PROGRESS',
        note: 'Asphalt cold roller currently leveling base aggregate.',
        updatedBy: 'Er. Suresh Kumar'
      }
    ],
    governmentNotificationSent: true,
    boundingBox: {
      x: 30,
      y: 25,
      width: 45,
      height: 45
    }
  },
  {
    id: 'PTH-003',
    latitude: 12.8942,
    longitude: 74.8820,
    location: 'Valachil Entrance, Near Srinivas University Road',
    roadName: 'Valachil Access Road',
    area: 'Valachil, Mangaluru',
    severity: 'MODERATE',
    confidence: 0.89,
    priority: 'MEDIUM',
    status: 'ASSIGNED',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'HIGH',
    estimatedDimensions: {
      lengthCm: 42,
      widthCm: 35,
      depthCm: 7,
      areaSqM: 0.15
    },
    complaintCount: 2,
    assignedDepartment: 'Dakshina Kannada PWD',
    assignedEngineer: 'Er. Sandeep Rai',
    repairNotes: 'Scheduled for road resurfacing round on Friday.',
    repairHistory: [
      {
        id: 'RH-003-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
        status: 'PENDING',
        note: 'Moderate cavity detected along road shoulder.',
        updatedBy: 'Pothole Patrol Robot 01'
      },
      {
        id: 'RH-003-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        status: 'ASSIGNED',
        note: 'Allocated to PWD Zone 3 maintenance unit.',
        updatedBy: 'PWD Control Room'
      }
    ],
    governmentNotificationSent: true,
    boundingBox: {
      x: 20,
      y: 35,
      width: 40,
      height: 35
    }
  },
  {
    id: 'PTH-004',
    latitude: 12.8920,
    longitude: 74.8650,
    location: 'Adyar Riverbank Road, Near Netravati Viewpoint',
    roadName: 'Netravati Riverbank Road',
    area: 'Adyar Riverview',
    severity: 'NORMAL',
    confidence: 0.98,
    priority: 'NONE',
    status: 'INSPECTION',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 540).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'NORMAL',
    complaintCount: 0,
    assignedDepartment: 'Mangaluru City Corporation (MCC)',
    repairNotes: 'Routine autonomous road surface inspection. No defect logged.',
    repairHistory: [
      {
        id: 'RH-004-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 540).toISOString(),
        status: 'INSPECTION',
        note: 'Normal surface scanned during morning riverbank survey route.',
        updatedBy: 'Pothole Patrol Robot 01'
      }
    ],
    governmentNotificationSent: false
  },
  {
    id: 'PTH-005',
    latitude: 12.8870,
    longitude: 74.8950,
    location: 'Farangipete Market Cross Road',
    roadName: 'Farangipete Bypass',
    area: 'Farangipete, Dakshina Kannada',
    severity: 'SEVERE',
    confidence: 0.97,
    priority: 'CRITICAL',
    status: 'REPAIRED',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), // 1 day ago
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    repairedImageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'HIGH',
    estimatedDimensions: {
      lengthCm: 70,
      widthCm: 55,
      depthCm: 15,
      areaSqM: 0.38
    },
    complaintCount: 5,
    assignedDepartment: 'Dakshina Kannada PWD',
    assignedEngineer: 'Er. Naveen Hegde',
    repairNotes: 'Bituminous overlay applied. Density testing passed. Road opened for public traffic.',
    repairHistory: [
      {
        id: 'RH-005-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
        status: 'PENDING',
        note: 'Severe disruption flagged by Robot-01.',
        updatedBy: 'Pothole Patrol Robot 01'
      },
      {
        id: 'RH-005-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 1200).toISOString(),
        status: 'ASSIGNED',
        note: 'Assigned to urgent maintenance contractor.',
        updatedBy: 'PWD Control Room'
      },
      {
        id: 'RH-005-3',
        timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
        status: 'REPAIR IN PROGRESS',
        note: 'Tar compaction underway.',
        updatedBy: 'Er. Naveen Hegde'
      },
      {
        id: 'RH-005-4',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        status: 'REPAIRED',
        note: 'Quality inspection verified. Sealed and certified.',
        updatedBy: 'Er. Naveen Hegde'
      }
    ],
    governmentNotificationSent: true,
    boundingBox: {
      x: 28,
      y: 22,
      width: 52,
      height: 48
    }
  },
  {
    id: 'PTH-006',
    latitude: 12.8680,
    longitude: 74.8560,
    location: 'Pumpwell Flyover Service Road',
    roadName: 'Pumpwell Circle Connector',
    area: 'Pumpwell, Mangaluru',
    severity: 'MODERATE',
    confidence: 0.88,
    priority: 'MEDIUM',
    status: 'REPAIRED',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 2200).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    repairedImageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'HIGH',
    estimatedDimensions: {
      lengthCm: 45,
      widthCm: 38,
      depthCm: 6,
      areaSqM: 0.17
    },
    complaintCount: 3,
    assignedDepartment: 'Mangaluru City Corporation (MCC)',
    assignedEngineer: 'Er. Rajesh Bhat',
    repairNotes: 'Cold mix patching applied cleanly.',
    repairHistory: [
      {
        id: 'RH-006-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 2200).toISOString(),
        status: 'PENDING',
        note: 'Detected during routine highway sweep.',
        updatedBy: 'Pothole Patrol Robot 01'
      },
      {
        id: 'RH-006-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        status: 'REPAIRED',
        note: 'Repaired by quick-fix unit.',
        updatedBy: 'MCC Road Works'
      }
    ],
    governmentNotificationSent: true
  },
  {
    id: 'PTH-007',
    latitude: 12.9050,
    longitude: 74.8880,
    location: 'Arkula Link, Near Kethikal',
    roadName: 'Arkula Industrial Link Road',
    area: 'Arkula, Mangaluru',
    severity: 'SEVERE',
    confidence: 0.95,
    priority: 'HIGH',
    status: 'PENDING',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'MEDIUM',
    estimatedDimensions: {
      lengthCm: 60,
      widthCm: 50,
      depthCm: 12,
      areaSqM: 0.30
    },
    complaintCount: 2,
    assignedDepartment: 'Dakshina Kannada PWD',
    repairNotes: 'Fresh detection in heavy goods vehicle lane.',
    repairHistory: [
      {
        id: 'RH-007-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        status: 'PENDING',
        note: 'Telemetry logged by Robot-01 with GPS lock.',
        updatedBy: 'Pothole Patrol Robot 01'
      }
    ],
    governmentNotificationSent: true,
    boundingBox: {
      x: 32,
      y: 28,
      width: 42,
      height: 38
    }
  }
];
