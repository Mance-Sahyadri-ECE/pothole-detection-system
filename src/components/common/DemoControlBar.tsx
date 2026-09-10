import React, { useState } from 'react';
import { usePotholes } from '../../context/PotholeContext';
import { useRobot } from '../../context/RobotContext';
import { Play, Pause, RefreshCw, RotateCcw } from 'lucide-react';

export const DemoControlBar: React.FC = () => {
  const { simulateDetection, simulateCriticalEmergency, resetAllData } = usePotholes();
  const { autoPatrol, setAutoPatrol } = useRobot();
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      await simulateDetection();
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateSevere = async () => {
    setLoading(true);
    try {
      await simulateCriticalEmergency();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 py-1.5 px-4 lg:pl-60">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Source tag */}
        <div className="flex items-center gap-2 font-mono text-slate-500 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          <span>Data source: Simulation (Dakshina Kannada)</span>
        </div>

        {/* Right: Technical simulation controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulate}
            disabled={loading}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded text-xs font-medium transition-colors disabled:opacity-50"
            title="Generate a simulated pothole detection record"
          >
            Simulate Detection
          </button>

          <button
            onClick={handleSimulateSevere}
            disabled={loading}
            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 rounded text-xs font-medium transition-colors disabled:opacity-50"
            title="Generate a high-priority severe pothole detection"
          >
            Simulate Severe
          </button>

          <button
            onClick={() => setAutoPatrol(!autoPatrol)}
            className={`px-2.5 py-1 rounded border text-xs font-medium flex items-center gap-1 transition-colors ${
              autoPatrol
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {autoPatrol ? (
              <>
                <Pause className="w-3 h-3" />
                <span>Auto Stream: On</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                <span>Auto Stream: Off</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset simulated dataset to initial seed records?')) {
                resetAllData();
              }
            }}
            className="p-1 text-slate-500 hover:text-slate-800 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
            title="Reset simulation data"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
