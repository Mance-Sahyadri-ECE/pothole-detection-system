import React from 'react';

export const WorkflowBanner: React.FC = () => {
  const steps = [
    { num: '01', title: 'Rover Camera', desc: 'Optical sensor captures road surface frame' },
    { num: '02', title: 'AI Inference', desc: 'YOLO/Vision model detects cavity & severity' },
    { num: '03', title: 'GPS Logging', desc: 'High-precision coordinate tagged' },
    { num: '04', title: 'Govt Alert', desc: 'Automated notification dispatched to PWD' },
    { num: '05', title: 'Repair Crew', desc: 'Field engineer assigned for cold-mix patching' },
    { num: '06', title: 'Resolution', desc: 'Audit verified & map marker updated to safe' }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded p-4">
      <div className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3">
        System Pipeline Architecture
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {steps.map(step => (
          <div key={step.num} className="p-2.5 border border-slate-200 rounded bg-slate-50">
            <div className="font-mono text-[10px] text-slate-400 font-bold mb-1">
              STAGE {step.num}
            </div>
            <div className="font-semibold text-slate-900">{step.title}</div>
            <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{step.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
