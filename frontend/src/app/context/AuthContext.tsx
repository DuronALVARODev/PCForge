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
  accessToken: string | null;
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
  accessToken: null,
  login: async () => {},
  logout: async () => {},
  refreshUser: async () => {}
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken] = useState<string | null>(null); // No se usa más accessToken local
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Validación inicial al montar la app
  // Sincroniza accessToken con localStorage
  // Eliminado: sincronización con localStorage

  // Validación inicial al montar la app
  useEffect(() => {
    const validateSession = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/me`, { withCredentials: true });
        setUser(res.data);
        console.log('[Auth] Usuario autenticado:', res.data);
      } catch (err) {
        setUser(null);
        console.log('[Auth] Usuario fuera de sesión o token inválido. Error:', err);
      } finally {
        setLoading(false);
      }
    };
    validateSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const loginRes = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials, { withCredentials: true });
      console.log('[Auth] Respuesta de login:', loginRes.data);
      if (loginRes.data && loginRes.data.user) {
        setUser(loginRes.data.user);
        console.log('[Auth] Login exitoso. Usuario:', loginRes.data.user);
      } else {
        setUser(null);
        console.log('[Auth] Login fallido. Respuesta inesperada:', loginRes.data);
        throw new Error('Login failed');
      }
    } catch (err) {
      setUser(null);
      console.log('[Auth] Error en login:', err);
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
    } catch {}
    setUser(null);
    console.log('[Auth] Logout ejecutado');
    router.push('/login');
  };

  const refreshUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/me`, { withCredentials: true });
      setUser(res.data);
      console.log('[Auth] refreshUser: Usuario actualizado', res.data);
    } catch (err) {
      setUser(null);
      console.log('[Auth] refreshUser: Error al refrescar usuario', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, accessToken: null, login, logout, refreshUser }}>
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