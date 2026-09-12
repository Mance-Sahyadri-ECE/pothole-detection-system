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
    detectedAt: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
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
    boundingBox: { x: 25, y: 30, width: 50, height: 40 }
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
    detectedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
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
    governmentNotificationSent: true
  },
  {
    id: 'PTH-003',
    latitude: 12.8682,
    longitude: 74.9310,
    location: 'Valachil Entrance, Near Srinivas University Road',
    roadName: 'Valachil Access Road',
    area: 'Valachil, Mangaluru',
    severity: 'MODERATE',
    confidence: 0.89,
    priority: 'MEDIUM',
    status: 'ASSIGNED',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
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
    repairNotes: 'Scheduled for road resurfacing round.',
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
    governmentNotificationSent: true
  },
  {
    id: 'PTH-004',
    latitude: 12.8630,
    longitude: 74.9210,
    location: 'Adyar Riverbank Road, Near Netravati Viewpoint',
    roadName: 'Netravati Riverbank Road',
    area: 'Adyar Riverview',
    severity: 'NORMAL',
    confidence: 0.98,
    priority: 'NONE',
    status: 'INSPECTION',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 540).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'NORMAL',
    complaintCount: 0,
    assignedDepartment: 'Mangaluru City Corporation (MCC)',
    repairNotes: 'Routine autonomous road surface inspection. Intact clean asphalt.',
    repairHistory: [
      {
        id: 'RH-004-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 540).toISOString(),
        status: 'INSPECTION',
        note: 'Normal surface scanned during riverbank survey route.',
        updatedBy: 'Pothole Patrol Robot 01'
      }
    ],
    governmentNotificationSent: false
  },
  {
    id: 'PTH-005',
    latitude: 12.8710,
    longitude: 74.9390,
    location: 'Farangipete Market Cross Road',
    roadName: 'Farangipete Bypass',
    area: 'Farangipete, Dakshina Kannada',
    severity: 'SEVERE',
    confidence: 0.97,
    priority: 'CRITICAL',
    status: 'REPAIRED',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
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
    contractorCrew: 'DK Highway Maintenance Unit 2',
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
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        status: 'REPAIRED',
        note: 'Quality inspection verified. Sealed and certified with asphalt road patch.',
        updatedBy: 'Er. Naveen Hegde'
      }
    ],
    governmentNotificationSent: true
  },
  {
    id: 'PTH-006',
    latitude: 12.8580,
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
    imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    repairedImageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
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
    contractorCrew: 'MCC Quick Patch Unit',
    repairNotes: 'Cold mix asphalt patch applied cleanly. Road sealed.',
    repairHistory: [
      {
        id: 'RH-006-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        status: 'REPAIRED',
        note: 'Repaired by quick-fix unit. Sealed asphalt patch verified.',
        updatedBy: 'MCC Road Works'
      }
    ],
    governmentNotificationSent: true
  },
  {
    id: 'PTH-007',
    latitude: 12.8750,
    longitude: 74.9350,
    location: 'Arkula Link, Near Kethikal',
    roadName: 'Arkula Industrial Link Road',
    area: 'Arkula, Mangaluru',
    severity: 'SEVERE',
    confidence: 0.95,
    priority: 'HIGH',
    status: 'PENDING',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
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
    governmentNotificationSent: true
  },
  {
    id: 'PTH-008',
    latitude: 12.8835,
    longitude: 74.8760,
    location: 'Kulshekar Chowki, Bikarnakatte Road',
    roadName: 'Kulshekar Main Road',
    area: 'Kulshekar, Mangaluru',
    severity: 'MODERATE',
    confidence: 0.91,
    priority: 'MEDIUM',
    status: 'PENDING',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'HIGH',
    estimatedDimensions: {
      lengthCm: 38,
      widthCm: 32,
      depthCm: 5,
      areaSqM: 0.12
    },
    complaintCount: 1,
    assignedDepartment: 'Dakshina Kannada PWD',
    repairHistory: [
      {
        id: 'RH-008-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
        status: 'PENDING',
        note: 'Moderate pavement cracking detected near bus stop.',
        updatedBy: 'Pothole Patrol Robot 01'
      }
    ],
    governmentNotificationSent: false
  },
  {
    id: 'PTH-009',
    latitude: 12.8752,
    longitude: 74.8635,
    location: 'Nanthoor Circle, NH 66 Crossing',
    roadName: 'NH 66 Highway Junction',
    area: 'Nanthoor, Mangaluru',
    severity: 'SEVERE',
    confidence: 0.97,
    priority: 'CRITICAL',
    status: 'REPAIR IN PROGRESS',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'HIGH',
    estimatedDimensions: {
      lengthCm: 90,
      widthCm: 70,
      depthCm: 18,
      areaSqM: 0.63
    },
    complaintCount: 9,
    assignedDepartment: 'NHAI Mangaluru',
    assignedEngineer: 'Er. Suresh Kumar (NHAI)',
    contractorCrew: 'NHAI Heavy Asphalt Repair Crew 1',
    repairNotes: 'Heavy traffic junction hazard. Milling machine deployed for asphalt patch.',
    repairHistory: [
      {
        id: 'RH-009-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
        status: 'REPAIR IN PROGRESS',
        note: 'Milling out damaged section for hot mix asphalt inlay.',
        updatedBy: 'Er. Suresh Kumar'
      }
    ],
    governmentNotificationSent: true
  },
  {
    id: 'PTH-010',
    latitude: 12.8985,
    longitude: 74.8412,
    location: 'Kottara Chowki Flyover Underpass',
    roadName: 'Kottara Service Road',
    area: 'Kottara, Mangaluru',
    severity: 'HIGH',
    confidence: 0.92,
    priority: 'HIGH',
    status: 'PENDING',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'HIGH',
    estimatedDimensions: {
      lengthCm: 55,
      widthCm: 45,
      depthCm: 10,
      areaSqM: 0.25
    },
    complaintCount: 3,
    assignedDepartment: 'Mangaluru City Corporation (MCC)',
    repairHistory: [
      {
        id: 'RH-010-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
        status: 'PENDING',
        note: 'Pavement dislocation logged during underpass patrol.',
        updatedBy: 'Pothole Patrol Robot 01'
      }
    ],
    governmentNotificationSent: true
  },
  {
    id: 'PTH-011',
    latitude: 12.8790,
    longitude: 74.8540,
    location: 'Kadri Hills Road, Near Kadri Park',
    roadName: 'Kadri Park Road',
    area: 'Kadri, Mangaluru',
    severity: 'NORMAL',
    confidence: 0.99,
    priority: 'NONE',
    status: 'INSPECTION',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'NORMAL',
    complaintCount: 0,
    assignedDepartment: 'MCC Zone 2',
    repairNotes: 'Smooth clean asphalt surface in good condition.',
    repairHistory: [
      {
        id: 'RH-011-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
        status: 'INSPECTION',
        note: 'Regular scan passed with zero defects.',
        updatedBy: 'Pothole Patrol Robot 01'
      }
    ],
    governmentNotificationSent: false
  },
  {
    id: 'PTH-012',
    latitude: 12.8870,
    longitude: 74.8465,
    location: 'Bejai Main Road, Near KSRTC Bus Stand',
    roadName: 'Bejai Church Road',
    area: 'Bejai, Mangaluru',
    severity: 'MODERATE',
    confidence: 0.87,
    priority: 'MEDIUM',
    status: 'ASSIGNED',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'HIGH',
    estimatedDimensions: {
      lengthCm: 40,
      widthCm: 30,
      depthCm: 6,
      areaSqM: 0.12
    },
    complaintCount: 2,
    assignedDepartment: 'Mangaluru City Corporation (MCC)',
    assignedEngineer: 'Er. Anitha Shetty',
    repairNotes: 'Work order dispatched to MCC Bejai maintenance gang.',
    repairHistory: [
      {
        id: 'RH-012-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
        status: 'PENDING',
        note: 'Minor edge cracking detected.',
        updatedBy: 'Pothole Patrol Robot 01'
      },
      {
        id: 'RH-012-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        status: 'ASSIGNED',
        note: 'Assigned to Er. Anitha Shetty.',
        updatedBy: 'MCC Control Desk'
      }
    ],
    governmentNotificationSent: false
  },
  {
    id: 'PTH-013',
    latitude: 12.8910,
    longitude: 74.8320,
    location: 'Urwa Store Circle, Swimming Pool Road',
    roadName: 'Urwa Market Access Road',
    area: 'Urwa, Mangaluru',
    severity: 'HIGH',
    confidence: 0.93,
    priority: 'HIGH',
    status: 'REPAIRED',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 1800).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
    repairedImageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'NORMAL',
    estimatedDimensions: {
      lengthCm: 50,
      widthCm: 40,
      depthCm: 9,
      areaSqM: 0.20
    },
    complaintCount: 3,
    assignedDepartment: 'MCC Zone 1',
    assignedEngineer: 'Er. Anitha Shetty',
    contractorCrew: 'MCC Asphalt Crew 2',
    repairNotes: 'Complete cold patch replacement completed & roller compacted.',
    repairHistory: [
      {
        id: 'RH-013-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 1800).toISOString(),
        status: 'PENDING',
        note: 'High severity hole logged near bus shelter.',
        updatedBy: 'Pothole Patrol Robot 01'
      },
      {
        id: 'RH-013-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        status: 'REPAIRED',
        note: 'Repaired & verified with smooth asphalt road patch.',
        updatedBy: 'Er. Anitha Shetty'
      }
    ],
    governmentNotificationSent: true
  },
  {
    id: 'PTH-014',
    latitude: 12.9050,
    longitude: 74.8390,
    location: 'Derebail Church Road, Near Highway Link',
    roadName: 'Derebail Main Road',
    area: 'Derebail, Mangaluru',
    severity: 'SEVERE',
    confidence: 0.96,
    priority: 'CRITICAL',
    status: 'PENDING',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'HIGH',
    estimatedDimensions: {
      lengthCm: 75,
      widthCm: 65,
      depthCm: 16,
      areaSqM: 0.49
    },
    complaintCount: 5,
    assignedDepartment: 'Dakshina Kannada PWD',
    repairNotes: 'Deep hole on curve causing sharp vehicle swerving.',
    repairHistory: [
      {
        id: 'RH-014-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
        status: 'PENDING',
        note: 'Critical defect flagged during evening scan.',
        updatedBy: 'Pothole Patrol Robot 01'
      }
    ],
    governmentNotificationSent: true
  },
  {
    id: 'PTH-015',
    latitude: 12.9120,
    longitude: 74.8480,
    location: 'Konchady Colony Main Road',
    roadName: 'Konchady Link Road',
    area: 'Konchady, Mangaluru',
    severity: 'NORMAL',
    confidence: 0.97,
    priority: 'NONE',
    status: 'INSPECTION',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 620).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'LOW',
    complaintCount: 0,
    assignedDepartment: 'MCC Zone 3',
    repairNotes: 'Residential road segment in excellent condition.',
    repairHistory: [
      {
        id: 'RH-015-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 620).toISOString(),
        status: 'INSPECTION',
        note: 'Normal road telemetry recorded.',
        updatedBy: 'Pothole Patrol Robot 01'
      }
    ],
    governmentNotificationSent: false
  },
  {
    id: 'PTH-016',
    latitude: 12.8510,
    longitude: 74.8430,
    location: 'Jeppu Bappal Road, Near Gujjarakere',
    roadName: 'Jeppu Market Road',
    area: 'Jeppu, Mangaluru',
    severity: 'HIGH',
    confidence: 0.91,
    priority: 'HIGH',
    status: 'REPAIR IN PROGRESS',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 310).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'MEDIUM',
    estimatedDimensions: {
      lengthCm: 58,
      widthCm: 42,
      depthCm: 11,
      areaSqM: 0.24
    },
    complaintCount: 4,
    assignedDepartment: 'MCC South Division',
    assignedEngineer: 'Er. Rajesh Bhat',
    contractorCrew: 'MCC South Maintenance Unit',
    repairNotes: 'Field crew currently applying bitumen tack coat and hot mix asphalt patch.',
    repairHistory: [
      {
        id: 'RH-016-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 310).toISOString(),
        status: 'PENDING',
        note: 'Defect detected near pond drainage outlet.',
        updatedBy: 'Pothole Patrol Robot 01'
      },
      {
        id: 'RH-016-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        status: 'REPAIR IN PROGRESS',
        note: 'Crew deployed on site for active asphalt patch work.',
        updatedBy: 'Er. Rajesh Bhat'
      }
    ],
    governmentNotificationSent: true
  },
  {
    id: 'PTH-017',
    latitude: 12.8630,
    longitude: 74.8820,
    location: 'Padil Junction, Railway Underpass Access Road',
    roadName: 'Padil-Bypass Road',
    area: 'Padil, Mangaluru',
    severity: 'SEVERE',
    confidence: 0.96,
    priority: 'CRITICAL',
    status: 'REPAIRED',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 2500).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    repairedImageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'HIGH',
    estimatedDimensions: {
      lengthCm: 85,
      widthCm: 60,
      depthCm: 17,
      areaSqM: 0.51
    },
    complaintCount: 7,
    assignedDepartment: 'Dakshina Kannada PWD',
    assignedEngineer: 'Er. Sandeep Rai',
    contractorCrew: 'PWD Heavy Patch Crew 4',
    repairNotes: 'Full depth patch repair completed. Certified for high axle load.',
    repairHistory: [
      {
        id: 'RH-017-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 2500).toISOString(),
        status: 'PENDING',
        note: 'Severe underpass crater reported.',
        updatedBy: 'Pothole Patrol Robot 01'
      },
      {
        id: 'RH-017-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 450).toISOString(),
        status: 'REPAIRED',
        note: 'Asphalt paving completed and quality verified.',
        updatedBy: 'Er. Sandeep Rai'
      }
    ],
    governmentNotificationSent: true
  },
  {
    id: 'PTH-018',
    latitude: 12.9620,
    longitude: 74.8910,
    location: 'Mangaluru Airport Road, Bajpe Junction',
    roadName: 'Airport Access Road',
    area: 'Bajpe, Mangaluru',
    severity: 'MODERATE',
    confidence: 0.90,
    priority: 'MEDIUM',
    status: 'REPAIRED',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 3000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    repairedImageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'HIGH',
    estimatedDimensions: {
      lengthCm: 35,
      widthCm: 30,
      depthCm: 5,
      areaSqM: 0.10
    },
    complaintCount: 1,
    assignedDepartment: 'Public Works Department (PWD)',
    assignedEngineer: 'Er. Naveen Hegde',
    contractorCrew: 'Airport Corridor Maintenance Crew',
    repairNotes: 'Pre-monsoon patching round completed with sealed asphalt road patch.',
    repairHistory: [
      {
        id: 'RH-018-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
        status: 'REPAIRED',
        note: 'Surface defect sealed with rapid cure asphalt patch.',
        updatedBy: 'Er. Naveen Hegde'
      }
    ],
    governmentNotificationSent: false
  },
  {
    id: 'PTH-019',
    latitude: 12.8250,
    longitude: 74.8520,
    location: 'Thokottu Overbridge Access Road',
    roadName: 'Thokottu Circle Link',
    area: 'Thokottu, Mangaluru',
    severity: 'HIGH',
    confidence: 0.93,
    priority: 'HIGH',
    status: 'PENDING',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'HIGH',
    estimatedDimensions: {
      lengthCm: 62,
      widthCm: 48,
      depthCm: 12,
      areaSqM: 0.30
    },
    complaintCount: 4,
    assignedDepartment: 'NHAI Mangaluru',
    repairNotes: 'Pavement wear near bridge expansion joint.',
    repairHistory: [
      {
        id: 'RH-019-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
        status: 'PENDING',
        note: 'High severity pothole detected at bridge ramp.',
        updatedBy: 'Pothole Patrol Robot 01'
      }
    ],
    governmentNotificationSent: true
  },
  {
    id: 'PTH-020',
    latitude: 12.8715,
    longitude: 74.8450,
    location: 'Bunts Hostel Circle, MG Road Link',
    roadName: 'MG Road',
    area: 'Bunts Hostel, Mangaluru',
    severity: 'NORMAL',
    confidence: 0.99,
    priority: 'NONE',
    status: 'INSPECTION',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'HIGH',
    complaintCount: 0,
    assignedDepartment: 'MCC Central',
    repairNotes: 'Well-maintained city corridor. Clean intact asphalt pavement.',
    repairHistory: [
      {
        id: 'RH-020-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
        status: 'INSPECTION',
        note: 'Pavement scan normal.',
        updatedBy: 'Pothole Patrol Robot 01'
      }
    ],
    governmentNotificationSent: false
  },
  {
    id: 'PTH-021',
    latitude: 12.9510,
    longitude: 74.8150,
    location: 'Surathkal Highway Connector, Near NITK Gate',
    roadName: 'NH 66 Surathkal Stretch',
    area: 'Surathkal, Mangaluru',
    severity: 'NORMAL',
    confidence: 0.98,
    priority: 'NONE',
    status: 'INSPECTION',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 700).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'HIGH',
    complaintCount: 0,
    assignedDepartment: 'NHAI Surathkal',
    repairNotes: 'Newly resurfaced highway lane.',
    repairHistory: [
      {
        id: 'RH-021-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 700).toISOString(),
        status: 'INSPECTION',
        note: 'Autonomous scan confirmed clear surface.',
        updatedBy: 'Pothole Patrol Robot 01'
      }
    ],
    governmentNotificationSent: false
  },
  {
    id: 'PTH-022',
    latitude: 12.8450,
    longitude: 74.8380,
    location: 'Mangaladevi Temple Car Street',
    roadName: 'Mangaladevi Road',
    area: 'Mangaladevi, Mangaluru',
    severity: 'MODERATE',
    confidence: 0.88,
    priority: 'MEDIUM',
    status: 'PENDING',
    detectedBy: 'Pothole Patrol Robot 01',
    detectedAt: new Date(Date.now() - 1000 * 60 * 160).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    trafficLevel: 'MEDIUM',
    estimatedDimensions: {
      lengthCm: 44,
      widthCm: 32,
      depthCm: 6,
      areaSqM: 0.14
    },
    complaintCount: 2,
    assignedDepartment: 'MCC Zone 4',
    repairHistory: [
      {
        id: 'RH-022-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 160).toISOString(),
        status: 'PENDING',
        note: 'Surface roughness logged near temple entrance.',
        updatedBy: 'Pothole Patrol Robot 01'
      }
    ],
    governmentNotificationSent: false
  }
];
