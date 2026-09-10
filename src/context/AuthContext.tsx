import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'PUBLIC' | 'FIELD_ENGINEER' | 'GOVERNMENT_ENGINEER' | 'ADMIN';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  token?: string;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole, name?: string) => void;
  logout: () => void;
}

const STORAGE_KEY = 'pds_auth_session_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (email: string, role: UserRole, name?: string) => {
    const session: UserSession = {
      id: `usr-${Date.now()}`,
      name: name || (role === 'ADMIN' ? 'Admin Officer' : role === 'GOVERNMENT_ENGINEER' ? 'Er. Rajesh Bhat' : 'Er. Sandeep Rai'),
      email,
      role,
      department: role === 'ADMIN' ? 'Dakshina Kannada PWD Head Office' : 'Dakshina Kannada PWD - Mangaluru Division',
      token: `jwt_token_demo_${Date.now()}`
    };
    setUser(session);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
