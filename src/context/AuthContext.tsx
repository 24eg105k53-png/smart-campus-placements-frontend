'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, setAuthToken, removeAuthToken, getAuthToken } from '@/lib/api';

export type UserRole = 'STUDENT' | 'RECRUITER' | 'TPO';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  profileId?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  loginAsDemo: (role: UserRole) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = getAuthToken();
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        removeAuthToken();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<User> => {
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: pass }),
      });

      setAuthToken(data.token);
      setToken(data.token);

      const loggedUser: User = {
        id: data.userId,
        email: data.email,
        fullName: data.fullName,
        role: data.role as UserRole,
        profileId: data.profileId,
      };

      setUser(loggedUser);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      return loggedUser;
    } catch (err: any) {
      throw err;
    }
  };

  const loginAsDemo = async (role: UserRole): Promise<User> => {
    let email = 'student@smartcampus.edu';
    if (role === 'RECRUITER') email = 'recruiter@google.com';
    if (role === 'TPO') email = 'tpo@smartcampus.edu';

    return login(email, 'Password@123');
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const refreshUser = async () => {
    try {
      const data = await apiRequest('/auth/me');
      const updated: User = {
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        role: data.role as UserRole,
        profileId: data.profileId,
      };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    } catch (e) {
      // Ignored
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, loginAsDemo, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
