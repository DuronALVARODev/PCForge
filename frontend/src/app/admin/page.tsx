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
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          // Si la sesión no existe, ir a login
          router.replace("/login");
          return;
        }
        const data = await res.json();
        if (data.role === "admin" || data.role === "superadmin") {
          setRole(data.role);
        } else {
          // Si hay sesión pero no es admin, ir a perfil
          router.replace("/profile");
        }
      } catch (error) {
        // Si el error es 401, ir a login. Si es otro, ir a perfil.
        try {
          const res = await fetch("/api/auth/me", { credentials: "include" });
          if (res.status === 401) {
            router.replace("/login");
          } else {
            router.replace("/profile");
          }
        } catch (err) {
          router.replace("/profile");
        }
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
