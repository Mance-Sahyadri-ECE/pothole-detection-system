import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Lock, ShieldCheck, UserCheck, AlertCircle, Users, Building2, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginCitizen, registerCitizen } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const accessDenied = (location.state as any)?.accessDenied;
  const targetPath = (location.state as any)?.from;

  // Active view state: 'SELECTION' | 'PUBLIC' | 'GOVERNMENT'
  const [portalView, setPortalView] = useState<'SELECTION' | 'PUBLIC' | 'GOVERNMENT'>(
    accessDenied ? 'GOVERNMENT' : 'SELECTION'
  );

  // Citizen auth form state
  const [citizenMode, setCitizenMode] = useState<'SIGN_IN' | 'REGISTER' | 'FORGOT'>('SIGN_IN');
  const [citizenName, setCitizenName] = useState('');
  const [citizenContact, setCitizenContact] = useState('');
  const [citizenPassword, setCitizenPassword] = useState('');
  const [citizenSuccessMsg, setCitizenSuccessMsg] = useState<string | null>(null);

  // Government auth form state
  const [govEmail, setGovEmail] = useState('');
  const [govPassword, setGovPassword] = useState('');
  const [govRole, setGovRole] = useState<UserRole>('EXECUTIVE_ENGINEER');

  // Shared state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    accessDenied ? 'Access Denied: Government Authorization Required. Citizen accounts cannot access internal government portal pages.' : null
  );

  // Citizen submit handler
  const handleCitizenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setCitizenSuccessMsg(null);
    setLoading(true);

    try {
      if (citizenMode === 'FORGOT') {
        setLoading(false);
        setCitizenSuccessMsg('Password reset instructions sent to your email/mobile.');
        return;
      }

      if (citizenMode === 'REGISTER') {
        const res = await registerCitizen(citizenName, citizenContact, citizenPassword);
        setLoading(false);
        if (res.success) {
          navigate('/', { replace: true });
        } else {
          setErrorMessage(res.error || 'Citizen registration failed.');
        }
      } else {
        const res = await loginCitizen(citizenContact, citizenPassword);
        setLoading(false);
        if (res.success) {
          navigate('/', { replace: true });
        } else {
          setErrorMessage(res.error || 'Invalid citizen credentials.');
        }
      }
    } catch {
      setLoading(false);
      setErrorMessage('Server connection error. Please try again.');
    }
  };

  // Government submit handler
  const handleGovSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await login(govEmail, govPassword, govRole);
      setLoading(false);

      if (res.success) {
        const destination = targetPath || '/engineer-portal';
        navigate(destination, { replace: true });
      } else {
        setErrorMessage(res.error || 'Invalid credentials or unauthorized government access.');
      }
    } catch {
      setLoading(false);
      setErrorMessage('Server connection error. Please try again.');
    }
  };

  // Quick Demo Government Role login
  const handleQuickDemoRole = async (demoRole: UserRole, demoEmail: string) => {
    setErrorMessage(null);
    setLoading(true);
    setGovEmail(demoEmail);
    setGovRole(demoRole);

    const demoPassToken = `session_auth_${Date.now().toString(36)}`;
    const res = await login(demoEmail, demoPassToken, demoRole);
    setLoading(false);

    if (res.success) {
      navigate('/engineer-portal', { replace: true });
    } else {
      setErrorMessage(res.error || 'Demo role authentication failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 px-4">
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm max-w-xl w-full p-6 sm:p-8 space-y-6 text-xs font-sans">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <img
              src="/logo.png"
              alt="Pothole Detection System Logo"
              className="w-12 h-12 rounded border border-slate-200 bg-white object-contain p-1 shadow-xs"
            />
          </div>

          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            POTHOLE DETECTION SYSTEM
          </h1>
          <p className="text-slate-500 font-mono text-[11px]">
            AI-Based Road Condition Monitoring • Dakshina Kannada Administration
          </p>
        </div>

        {/* Global Error or Access Denied Alert */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded flex items-start gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {citizenSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded flex items-start gap-2 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{citizenSuccessMsg}</span>
          </div>
        )}

        {/* SCREEN 1: PORTAL SELECTION */}
        {portalView === 'SELECTION' && (
          <div className="space-y-6 pt-2">
            <div className="text-center">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Select Access Portal</h2>
              <p className="text-slate-500 text-[11px] mt-0.5">Choose your authorization pathway below to enter the portal.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Public Portal Card */}
              <div 
                onClick={() => { setErrorMessage(null); setPortalView('PUBLIC'); }}
                className="border-2 border-slate-200 hover:border-slate-800 rounded-xl p-5 space-y-3 cursor-pointer transition-all hover:shadow-md group bg-slate-50/50 hover:bg-white flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">PUBLIC PORTAL</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Citizen access for submitting road complaints, reporting potholes, and tracking public repair status.
                  </p>
                </div>
                <button className="w-full py-2 bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-800 font-semibold rounded text-xs transition-colors flex items-center justify-center gap-1.5 mt-2">
                  Enter Public Portal →
                </button>
              </div>

              {/* Government Portal Card */}
              <div 
                onClick={() => { setErrorMessage(null); setPortalView('GOVERNMENT'); }}
                className="border-2 border-slate-200 hover:border-slate-800 rounded-xl p-5 space-y-3 cursor-pointer transition-all hover:shadow-md group bg-slate-50/50 hover:bg-white flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">GOVERNMENT PORTAL</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Authorized access for PWD/NHAI Executive Engineers, Field Crews, Sub-Engineers, and Admins.
                  </p>
                </div>
                <button className="w-full py-2 bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-800 font-semibold rounded text-xs transition-colors flex items-center justify-center gap-1.5 mt-2">
                  Enter Government Portal →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 2: PUBLIC PORTAL LOGIN / REGISTRATION */}
        {portalView === 'PUBLIC' && (
          <div className="space-y-5">
            <button
              onClick={() => { setErrorMessage(null); setPortalView('SELECTION'); }}
              className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 text-[11px] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Portal Selection
            </button>

            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">CITIZEN / PUBLIC PORTAL</h2>
                <p className="text-slate-500 text-[11px]">Sign in or create a citizen account to submit & track road reports</p>
              </div>
              <span className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded font-semibold text-[10px]">
                ROLE: CITIZEN
              </span>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg font-medium text-slate-700">
              <button
                type="button"
                onClick={() => { setCitizenMode('SIGN_IN'); setErrorMessage(null); }}
                className={`flex-1 py-1.5 text-center rounded transition-colors ${citizenMode === 'SIGN_IN' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'hover:text-slate-900'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setCitizenMode('REGISTER'); setErrorMessage(null); }}
                className={`flex-1 py-1.5 text-center rounded transition-colors ${citizenMode === 'REGISTER' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'hover:text-slate-900'}`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => { setCitizenMode('FORGOT'); setErrorMessage(null); }}
                className={`flex-1 py-1.5 text-center rounded transition-colors ${citizenMode === 'FORGOT' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'hover:text-slate-900'}`}
              >
                Forgot Password
              </button>
            </div>

            {/* Citizen Form */}
            <form onSubmit={handleCitizenSubmit} className="space-y-4 pt-1">
              {citizenMode === 'REGISTER' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={citizenName}
                    onChange={e => setCitizenName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-slate-900 bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {citizenMode === 'FORGOT' ? 'Registered Email or Mobile Number *' : 'Email Address / Mobile Number *'}
                </label>
                <input
                  type="text"
                  required
                  value={citizenContact}
                  onChange={e => setCitizenContact(e.target.value)}
                  placeholder="Enter email or 10-digit mobile number"
                  className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:border-slate-900 bg-white"
                />
              </div>

              {citizenMode !== 'FORGOT' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={citizenPassword}
                    onChange={e => setCitizenPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:border-slate-900 bg-white"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                {loading
                  ? 'Processing Server Auth...'
                  : citizenMode === 'REGISTER'
                  ? 'Create Citizen Account'
                  : citizenMode === 'FORGOT'
                  ? 'Send Reset Instructions'
                  : 'Sign In to Public Portal'}
              </button>
            </form>
          </div>
        )}

        {/* SCREEN 3: GOVERNMENT PORTAL LOGIN */}
        {portalView === 'GOVERNMENT' && (
          <div className="space-y-5">
            <button
              onClick={() => { setErrorMessage(null); setPortalView('SELECTION'); }}
              className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 text-[11px] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Portal Selection
            </button>

            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">GOVERNMENT ENGINEER PORTAL</h2>
                <p className="text-slate-500 text-[11px]">Authorized PWD / NHAI personnel authentication</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-semibold text-[10px]">
                GOVERNMENT ROLE
              </span>
            </div>

            {/* Government Login Form */}
            <form onSubmit={handleGovSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Official Email Address *</label>
                <input
                  type="email"
                  required
                  value={govEmail}
                  onChange={e => setGovEmail(e.target.value)}
                  placeholder="Enter official email (e.g., officer@dkpwd.gov.in)"
                  className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:border-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={govPassword}
                  onChange={e => setGovPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:border-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Designated Government Role *</label>
                <select
                  value={govRole}
                  onChange={e => setGovRole(e.target.value as UserRole)}
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

            {/* Quick Demo Role Selection */}
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
        )}
      </div>
    </div>
  );
};

export default LoginPage;
