import React from 'react';
import { usePotholes } from '../context/PotholeContext';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  CartesianGrid
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { potholes, stats } = usePotholes();

  const severityData = [
    { name: 'Severe', value: potholes.filter(p => p.severity === 'SEVERE').length, color: '#dc2626' },
    { name: 'Moderate', value: potholes.filter(p => p.severity === 'MODERATE').length, color: '#f59e0b' },
    { name: 'Normal/Repaired', value: potholes.filter(p => p.status === 'REPAIRED' || p.severity === 'NORMAL').length, color: '#16a34a' }
  ];

  const areaCounts: Record<string, { total: number; repaired: number; critical: number }> = {};
  potholes.forEach(p => {
    const areaKey = p.area || 'Adyar, Mangaluru';
    if (!areaCounts[areaKey]) {
      areaCounts[areaKey] = { total: 0, repaired: 0, critical: 0 };
    }
    areaCounts[areaKey].total += 1;
    if (p.status === 'REPAIRED') areaCounts[areaKey].repaired += 1;
    if (p.priority === 'CRITICAL' && p.status !== 'REPAIRED') areaCounts[areaKey].critical += 1;
  });

  const areaData = Object.entries(areaCounts).map(([area, val]) => ({
    name: area.replace(', Mangaluru', '').replace(', Dakshina Kannada', ''),
    Total: val.total,
    Repaired: val.repaired,
    Critical: val.critical
  }));

  const timelineData = [
    { day: 'Mon', Detections: 14, Repairs: 12 },
    { day: 'Tue', Detections: 22, Repairs: 18 },
    { day: 'Wed', Detections: 19, Repairs: 16 },
    { day: 'Thu', Detections: 28, Repairs: 22 },
    { day: 'Fri', Detections: 35, Repairs: 29 },
    { day: 'Sat', Detections: 26, Repairs: 24 },
    { day: 'Sun', Detections: 18, Repairs: 17 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
          System Analytics
        </h1>
        <p className="text-xs text-slate-500 font-mono">
          Statistical condition metrics & repair throughput • Dakshina Kannada
        </p>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-white border border-slate-200 rounded">
          <span className="text-slate-500 block">Avg. Repair Turnaround</span>
          <span className="text-xl font-mono font-bold text-slate-900 mt-1 block">16.4 hrs</span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded">
          <span className="text-slate-500 block">Govt Response Rate</span>
          <span className="text-xl font-mono font-bold text-emerald-700 mt-1 block">96.8%</span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded">
          <span className="text-slate-500 block">AI Accuracy Rate</span>
          <span className="text-xl font-mono font-bold text-slate-900 mt-1 block">94.2%</span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded">
          <span className="text-slate-500 block">Distance Scanned</span>
          <span className="text-xl font-mono font-bold text-slate-900 mt-1 block">184.2 km</span>
        </div>
      </div>

      {/* Row 1 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Severity Distribution */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded p-4 space-y-3">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Severity Distribution
          </h2>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs font-mono">
            {severityData.map(item => (
              <div key={item.name} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}: <strong>{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Detections Over Time */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded p-4 space-y-3">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Potholes Detected & Repaired Over Time
          </h2>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Line type="monotone" dataKey="Detections" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Repairs" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Area-wise Detections */}
      <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Area-wise Detections (Mangaluru Corridors)
        </h2>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', fontSize: '11px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
              <Bar dataKey="Total" fill="#64748b" />
              <Bar dataKey="Critical" fill="#dc2626" />
              <Bar dataKey="Repaired" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
