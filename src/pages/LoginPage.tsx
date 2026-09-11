import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { Lock, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const targetPath = (location.state as any)?.from || '/engineer-portal';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('EXECUTIVE_ENGINEER');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await login(email, password, role);
      setLoading(false);

      if (res.success) {
        navigate(targetPath, { replace: true });
      } else {
        setErrorMessage(res.error || 'Invalid credentials or unauthorized role access.');
      }
    } catch {
      setLoading(false);
      setErrorMessage('Server connection error. Please try again.');
    }
  };

  const handleQuickDemoRole = async (demoRole: UserRole, demoEmail: string) => {
    setErrorMessage(null);
    setLoading(true);
    setEmail(demoEmail);
    setRole(demoRole);

    // Call server-side authentication for demo role access
    const demoPassToken = `session_auth_${Date.now().toString(36)}`;
    const res = await login(demoEmail, demoPassToken, demoRole);
    setLoading(false);

    if (res.success) {
      navigate(targetPath, { replace: true });
    } else {
      setErrorMessage(res.error || 'Demo role authentication failed.');
    }
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

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded flex items-start gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Official Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter official email (e.g., officer@dkpwd.gov.in)"
              className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:border-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter secure password"
              className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:border-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Designated Role *</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 border border-slate-300 rounded bg-white font-medium focus:outline-none focus:border-slate-900"
            >
              <option value="EXECUTIVE_ENGINEER">Executive Engineer (PWD / NHAI)</option>
              <option value="SUB_ENGINEER">Assistant Sub-Engineer</option>
              <option value="FIELD_ENGINEER">Field Inspection Crew</option>
              <option value="GOVT_ADMIN">System Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            {loading ? 'Authenticating Server-Side...' : 'Sign In to Government Portal'}
          </button>
        </form>

        {/* Quick Demo Role Selection (Server Auth) */}
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
            Development Quick Role Selector
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono">
            <button
              onClick={() => handleQuickDemoRole('EXECUTIVE_ENGINEER', 'rajesh.bhat@dkpwd.gov.in')}
              disabled={loading}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-medium text-slate-800 text-left"
            >
              <div className="font-semibold text-blue-700 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Executive Engineer
              </div>
              <div className="text-[9px] text-slate-500">DK PWD Division</div>
            </button>

            <button
              onClick={() => handleQuickDemoRole('FIELD_ENGINEER', 'sandeep.rai@dkpwd.gov.in')}
              disabled={loading}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-medium text-slate-800 text-left"
            >
              <div className="font-semibold text-slate-900 flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> Field Inspection Crew
              </div>
              <div className="text-[9px] text-slate-500">Site Patch Crew</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
