"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AdminPage = () => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        // Obtener accessToken del contexto
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        const res = await fetch("https://pcforge-backend.onrender.com/api/auth/me", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          router.replace("/login");
          return;
        }
        const data = await res.json();
        if (data.role === "admin" || data.role === "superadmin") {
          setRole(data.role);
        } else {
          router.replace("/profile");
        }
      } catch {
        router.replace("/profile");
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
