'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  username: string;
  createdAt?: string;
  role?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  refreshUser: async () => {}
});

const API_BASE_URL = 'https://pcforge-backend.onrender.com/api/auth';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Validación inicial al montar la app
  useEffect(() => {
    const validateSession = async () => {
      if (!accessToken) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    validateSession();
  }, [accessToken]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const loginRes = await axios.post(`${API_BASE_URL}/login`, credentials);
      if (loginRes.data && loginRes.data.accessToken && loginRes.data.user) {
        setAccessToken(loginRes.data.accessToken);
        setUser(loginRes.data.user);
      } else {
        setUser(null);
        setAccessToken(null);
        throw new Error('Login failed');
      }
    } catch {
      setUser(null);
      setAccessToken(null);
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    setUser(null);
    setAccessToken(null);
    router.push('/login');
  };

  const refreshUser = async () => {
    if (!accessToken) {
      setUser(null);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};