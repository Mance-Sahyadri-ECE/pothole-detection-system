import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isGovernmentUser } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user || !isGovernmentUser) {
    return <Navigate to="/login" state={{ from: location.pathname, accessDenied: true }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-md shadow-sm">
        <h2 className="text-lg font-bold text-red-700">Access Restricted</h2>
        <p className="text-sm text-slate-600 mt-2">
          Your current role (<strong>{user.roleTitle}</strong>) does not have permission to access this government portal section.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
