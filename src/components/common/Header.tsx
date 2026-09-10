import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useRobot } from '../../context/RobotContext';
import { useAuth } from '../../context/AuthContext';
import { Bell, Menu, X, LogOut, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  mobileSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar, mobileSidebarOpen }) => {
  const { unreadCount, notifications } = useNotifications();
  const { robotStatus } = useRobot();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-IN', { hour12: false }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-IN', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Official Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="Pothole Detection System Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded object-contain border border-slate-200 bg-white p-0.5"
            />
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight tracking-tight">
                Pothole Detection System
              </span>
              <span className="text-[10px] text-blue-700 font-semibold font-mono leading-tight">
                AI-Based Road Condition Monitoring
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Technical status info & User Profile */}
        <div className="flex items-center gap-3 text-xs font-mono text-slate-600">
          {/* Status indicators */}
          <div className="hidden md:flex items-center gap-3 pr-3 border-r border-slate-200">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">System:</span>
              <span className="font-semibold text-emerald-700">Online</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Robot:</span>
              <span className="font-semibold text-slate-900">
                {robotStatus?.status === 'ONLINE' ? 'Connected' : 'Offline'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Time:</span>
              <span className="text-slate-700">{currentTime}</span>
            </div>
          </div>

          {/* Notification Bell (Only for logged-in or alert view) */}
          <div className="relative font-sans">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-1 rounded-full bg-red-600 text-[9px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifDropdown(false)} 
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded border border-slate-200 shadow-lg z-50 overflow-hidden text-xs">
                  <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between font-semibold text-slate-800">
                    <span>Government Notifications</span>
                    <span className="text-[10px] text-slate-500">{unreadCount} unread</span>
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {notifications.slice(0, 5).map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          setShowNotifDropdown(false);
                          navigate('/notifications');
                        }}
                        className={`p-2.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                          !n.viewed ? 'bg-amber-50/50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`font-semibold ${n.priority === 'CRITICAL' ? 'text-red-700' : 'text-slate-800'}`}>
                            {n.potholeId}
                          </span>
                          <span className="text-slate-400 font-mono text-[10px]">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-700 mt-0.5 line-clamp-1">{n.location}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-2 bg-slate-50 border-t border-slate-200 text-center">
                    <Link
                      to="/notifications"
                      onClick={() => setShowNotifDropdown(false)}
                      className="text-[11px] font-semibold text-blue-700 hover:underline"
                    >
                      View all notifications →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Session Profile & Auth Control */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="hidden sm:flex flex-col text-right font-sans text-xs">
                <span className="font-semibold text-slate-900 leading-tight">{user.name}</span>
                <span className="text-[10px] text-blue-700 font-mono font-bold leading-tight">
                  {user.role.replace(/_/g, ' ')}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-sans font-semibold transition-colors flex items-center gap-1 shadow-xs"
            >
              <Lock className="w-3 h-3 text-slate-300" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
