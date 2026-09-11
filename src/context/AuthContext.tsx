import React, { createContext, useContext, useState } from 'react';
import * as api from '../services/api';

export type UserRole = 
  | 'PUBLIC' 
  | 'FIELD_ENGINEER' 
  | 'SUB_ENGINEER' 
  | 'EXECUTIVE_ENGINEER' 
  | 'GOVT_ADMIN';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  token?: string;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const STORAGE_KEY = 'pds_auth_session_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_TITLES: Record<UserRole, string> = {
  PUBLIC: 'Public Citizen Viewer',
  FIELD_ENGINEER: 'Field Inspection Engineer',
  SUB_ENGINEER: 'Assistant Sub-Engineer',
  EXECUTIVE_ENGINEER: 'Executive Engineer (PWD)',
  GOVT_ADMIN: 'Government PWD Administrator'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      return null;
    } catch {
      return null;
    }
  });

  const login = async (email: string, password: string, role?: UserRole): Promise<{ success: boolean; error?: string }> => {
    const res = await api.loginGovernmentUser(email, password, role);
    if (res.success && res.user) {
      const session: UserSession = {
        id: res.user.id || `usr-${Date.now()}`,
        name: res.user.name || 'Er. Rajesh Bhat',
        email: res.user.email || email,
        role: (res.user.role as UserRole) || role || 'EXECUTIVE_ENGINEER',
        roleTitle: res.user.roleTitle || ROLE_TITLES[res.user.role as UserRole] || 'Executive Engineer (PWD)',
        department: res.user.department || 'Dakshina Kannada PWD - Mangaluru Division',
        token: res.token || res.user.token
      };
      setUser(session);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return { success: true };
    }
    return { success: false, error: res.error || 'Authentication failed' };
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const updated: UserSession = {
      ...user,
      role: newRole,
      roleTitle: ROLE_TITLES[newRole]
    };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user && user.role !== 'PUBLIC', login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
