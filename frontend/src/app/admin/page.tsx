"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '../context/AuthContext';

const AdminPage = () => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/api/auth/me`, {
          credentials: 'include',
        });
        if (!res.ok) {
          await logout(); // Limpia el usuario global y redirige a /login
          return;
        }
        const data = await res.json();
        if (data.role === "admin" || data.role === "superadmin") {
          setRole(data.role);
        } else {
          router.replace("/profile");
        }
      } catch {
        await logout();
      } finally {
        setLoading(false);
      }
    };
    checkAdminAccess();
  }, [router]);

  if (loading) return <div>Cargando...</div>;
  if (!role) return null;

  return (
    <div style={{ padding: 32, textAlign: "center" }}>
      <h1>Panel de Administración</h1>
      <p>Tu rol actual es: <b>{role}</b></p>
    </div>
  );
};

export default AdminPage;
