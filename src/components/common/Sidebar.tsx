import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home,
  LayoutDashboard, 
  Map, 
  Cpu, 
  ScanLine, 
  FileText, 
  Bell, 
  AlertCircle, 
  Wrench, 
  BarChart2, 
  Settings,
  Info,
  Activity,
  Lock
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { unreadCount } = useNotifications();
  const { isAuthenticated } = useAuth();

  const publicNavItems = [
    { to: '/', label: 'Home Overview', icon: Home },
    { to: '/map', label: 'Dakshina Kannada Map', icon: Map },
    { to: '/report', label: 'Report Pothole', icon: AlertCircle },
    { to: '/about', label: 'About System', icon: Info },
    { to: '/status', label: 'System Status', icon: Activity },
    { to: '/public-status', label: 'Public Government Status', icon: FileText }
  ];

  const govtNavItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/government/map', label: 'Live Map', icon: Map },
    { to: '/robot', label: 'Robot Monitoring', icon: Cpu },
    { to: '/ai-detect', label: 'AI Detection', icon: ScanLine },
    { to: '/reports', label: 'Pothole Reports', icon: FileText },
    { to: '/notifications', label: 'Notifications', icon: Bell, count: unreadCount },
    { to: '/complaints', label: 'Complaints Queue', icon: AlertCircle },
    { to: '/repairs', label: 'Repair Management', icon: Wrench },
    { to: '/analytics', label: 'Analytics', icon: BarChart2 },
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/engineer-portal', label: 'Engineer Portal', icon: Wrench }
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-14 bottom-0 left-0 z-40 w-56 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-150 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="py-3 px-2 space-y-4 overflow-y-auto">
          {/* Public Portal Section */}
          <div className="space-y-0.5">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Public Portal
            </div>

            {publicNavItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-1.5 text-xs rounded transition-colors ${
                      isActive
                        ? 'bg-slate-100 text-slate-950 font-semibold border-l-2 border-slate-900'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              );
            })}
          </div>

          {/* Government Portal Section */}
          <div className="space-y-0.5 pt-2 border-t border-slate-100">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 flex items-center justify-between">
              <span>Government Portal</span>
              {isAuthenticated && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
            </div>

            {govtNavItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-1.5 text-xs rounded transition-colors ${
                      isActive
                        ? 'bg-slate-100 text-slate-950 font-semibold border-l-2 border-slate-900'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-red-100 text-red-700">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] font-mono text-slate-500">
          <div>Region: Dakshina Kannada</div>
          <div className="text-[10px] text-slate-400">Station: Sahyadri, Adyar</div>
        </div>
      </aside>
    </>
  );
};
