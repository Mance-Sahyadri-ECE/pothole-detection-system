import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotifications();
  const navigate = useNavigate();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3 rounded border text-xs shadow-md flex items-start justify-between gap-2 bg-white ${
            toast.type === 'CRITICAL'
              ? 'border-red-600 text-slate-900 border-l-4'
              : toast.type === 'SUCCESS'
              ? 'border-emerald-600 text-slate-900 border-l-4'
              : 'border-slate-300 text-slate-900 border-l-4'
          }`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className={`font-bold ${toast.type === 'CRITICAL' ? 'text-red-700' : 'text-slate-900'}`}>
                {toast.title}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Now</span>
            </div>
            <p className="text-slate-600 mt-0.5">{toast.message}</p>

            {toast.potholeId && (
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    removeToast(toast.id);
                    navigate('/map');
                  }}
                  className="text-[11px] font-semibold text-blue-700 hover:underline"
                >
                  Locate on map →
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
