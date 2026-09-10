import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { Lock, ShieldCheck, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('engineer@dkpwd.gov.in');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<UserRole>('GOVERNMENT_ENGINEER');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      login(email, role);
      setLoading(false);
      navigate('/dashboard');
    }, 400);
  };

  const handleQuickDemo = (demoRole: UserRole, demoEmail: string) => {
    setEmail(demoEmail);
    setRole(demoRole);
    login(demoEmail, demoRole);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 px-4">
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm max-w-md w-full p-6 sm:p-8 space-y-6 text-xs">
        {/* Header with official logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <img
              src="/logo.png"
              alt="Pothole Detection System Logo"
              className="w-12 h-12 rounded border border-slate-200 bg-white object-contain p-1 shadow-xs"
            />
          </div>

          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Government Engineer Portal
          </h1>
          <p className="text-slate-500 font-mono text-[11px]">
            Pothole Detection System • Dakshina Kannada Administration
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Official Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. engineer@dkpwd.gov.in"
              className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Designated Role *</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 border border-slate-300 rounded bg-white font-medium focus:outline-none focus:border-slate-900"
            >
              <option value="GOVERNMENT_ENGINEER">Government Engineer (PWD / NHAI)</option>
              <option value="FIELD_ENGINEER">Field Inspection Crew</option>
              <option value="ADMIN">System Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            {loading ? 'Authenticating...' : 'Sign In to Government Portal'}
          </button>
        </form>

        {/* Quick Demo Credentials Selector */}
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
            Quick Demo Role Selection
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono">
            <button
              onClick={() => handleQuickDemo('GOVERNMENT_ENGINEER', 'engineer@dkpwd.gov.in')}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-medium text-slate-800 text-left"
            >
              <div className="font-semibold text-blue-700 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Govt Engineer
              </div>
              <div className="text-[9px] text-slate-500">Full Portal Access</div>
            </button>

            <button
              onClick={() => handleQuickDemo('FIELD_ENGINEER', 'field.crew@dkpwd.gov.in')}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-medium text-slate-800 text-left"
            >
              <div className="font-semibold text-slate-900 flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> Field Crew
              </div>
              <div className="text-[9px] text-slate-500">Repair Task Access</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
