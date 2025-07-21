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
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Validación inicial al montar la app
  useEffect(() => {
    const validateSession = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/me`, { withCredentials: true });
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    validateSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const loginRes = await axios.post(`${API_BASE_URL}/login`, credentials, {
        withCredentials: true,
      });
      // El backend ya establece las cookies, solo actualiza el usuario con la respuesta si la incluye
      if (loginRes.data && loginRes.data.user) {
        setUser(loginRes.data.user);
      } else {
        // Si no, realiza solo una petición a /me
        const userRes = await axios.get(`${API_BASE_URL}/me`, { withCredentials: true });
        setUser(userRes.data);
      }
    } catch {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
      setUser(null);
      router.push('/login');
    } catch {
      setUser(null);
      router.push('/login');
    }
  };

  const refreshUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/me`, { withCredentials: true });
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