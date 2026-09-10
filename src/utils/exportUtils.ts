import { Pothole } from '../types';

export function exportToCSV(potholes: Pothole[], filename = 'pothole-detection-report.csv') {
  const headers = [
    'Pothole ID',
    'Road Name',
    'Area',
    'Latitude',
    'Longitude',
    'Severity',
    'AI Confidence',
    'Priority',
    'Status',
    'Detected By',
    'Detected At',
    'Traffic Level',
    'Complaints'
  ];

  const rows = potholes.map(p => [
    `"${p.id}"`,
    `"${p.roadName.replace(/"/g, '""')}"`,
    `"${p.area.replace(/"/g, '""')}"`,
    p.latitude,
    p.longitude,
    p.severity,
    `${Math.round(p.confidence * 100)}%`,
    p.priority,
    p.status,
    `"${p.detectedBy}"`,
    `"${p.detectedAt}"`,
    p.trafficLevel,
    p.complaintCount
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(data: any, filename = 'pothole-data-export.json') {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
