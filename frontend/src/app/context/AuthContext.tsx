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

const API_BASE_URL = 'https://pcforge-backend.onrender.com/api/auth';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Validación inicial al montar la app
  // Sincroniza accessToken con localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      console.log('[Auth] Guardando accessToken en localStorage:', accessToken);
    } else {
      localStorage.removeItem('accessToken');
      console.log('[Auth] Eliminando accessToken de localStorage');
    }
  }, [accessToken]);

  // Validación inicial al montar la app
  useEffect(() => {
    const validateSession = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      console.log('[Auth] Validando sesión. Token en localStorage:', token);
      if (!token) {
        setUser(null);
        setLoading(false);
        console.log('[Auth] No hay token, usuario fuera de sesión');
        return;
      }
      setAccessToken(token);
      try {
        const res = await axios.get(`${API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        console.log('[Auth] Usuario autenticado:', res.data);
      } catch (err) {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem('accessToken');
        console.log('[Auth] Token inválido o expirado. Error:', err);
      } finally {
        setLoading(false);
      }
    };
    validateSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const loginRes = await axios.post(`${API_BASE_URL}/login`, credentials);
      console.log('[Auth] Respuesta de login:', loginRes.data);
      if (loginRes.data && loginRes.data.accessToken && loginRes.data.user) {
        setAccessToken(loginRes.data.accessToken);
        localStorage.setItem('accessToken', loginRes.data.accessToken);
        setUser(loginRes.data.user);
        console.log('[Auth] Login exitoso. Usuario:', loginRes.data.user);
      } else {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem('accessToken');
        console.log('[Auth] Login fallido. Respuesta inesperada:', loginRes.data);
        throw new Error('Login failed');
      }
    } catch (err) {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('accessToken');
      console.log('[Auth] Error en login:', err);
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    console.log('[Auth] Logout ejecutado');
    router.push('/login');
  };

  const refreshUser = async () => {
    if (!accessToken) {
      setUser(null);
      console.log('[Auth] refreshUser: No accessToken');
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setUser(res.data);
      console.log('[Auth] refreshUser: Usuario actualizado', res.data);
    } catch (err) {
      setUser(null);
      console.log('[Auth] refreshUser: Error al refrescar usuario', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, accessToken, login, logout, refreshUser }}>
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