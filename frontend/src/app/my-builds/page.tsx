"use client";
import { useEffect, useState } from "react";
import './my-builds.css';

type Component = {
  id: string;
  name: string;
  manufacturer?: string;
};

type Build = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  cpu?: Component;
  gpu?: Component;
  ram?: Component;
  motherboard?: Component;
  psu?: Component;
  case?: Component;
  storage?: Component;
  cooler?: Component;
};

export default function MyBuildsPage() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Validar sesión al cargar la página
  useEffect(() => {
    const checkSession = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/api/auth/me`, { credentials: 'include' });
        if (!res.ok) throw new Error('No session');
        const data = await res.json();
        // Permitir si data.user existe o si el backend retorna el usuario directamente
        if (!(data && (data.user || data.email))) throw new Error('No user');
      } catch {
        window.location.href = '/login';
      }
    };
    checkSession();
  }, []);

  const fetchBuilds = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/user-builds`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("No se pudieron cargar los builds");
      const data = await res.json();
      setBuilds(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuilds();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este armado?")) return;
    setDeletingId(id);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/user-builds/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("No se pudo eliminar el build");
      setBuilds((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (build: Build) => {
    localStorage.setItem('pcforge_edit_build', JSON.stringify(build));
    window.location.href = `/pc-build?buildId=${build.id}`;
  };

  return (
    <div className="my-builds-container">
      <h1>Mis Armados</h1>
      {loading && <div className="my-builds-loading">Cargando builds...</div>}
      {error && <div className="my-builds-error">{error}</div>}
      {!loading && !error && (
        <div className="my-builds-list">
          {builds.length === 0 ? (
            <div className="my-builds-empty">No tienes builds guardados.</div>
          ) : (
            builds.map((build) => (
              <div className="my-build-card" key={build.id}>
                <div className="my-build-header">
                  <h2>{build.name}</h2>
                  <span className="my-build-date">{new Date(build.createdAt).toLocaleDateString()}</span>
                </div>
                {build.description && <p className="my-build-desc">{build.description}</p>}
                <ul className="my-build-components">
                  {build.cpu && <li><b>CPU:</b> {build.cpu.name}</li>}
                  {build.gpu && <li><b>GPU:</b> {build.gpu.name}</li>}
                  {build.ram && <li><b>RAM:</b> {build.ram.name}</li>}
                  {build.motherboard && <li><b>Motherboard:</b> {build.motherboard.name}</li>}
                  {build.psu && <li><b>PSU:</b> {build.psu.name}</li>}
                  {build.case && <li><b>Case:</b> {build.case.name}</li>}
                  {build.storage && <li><b>Storage:</b> {build.storage.name}</li>}
                  {build.cooler && <li><b>Cooler:</b> {build.cooler.name}</li>}
                </ul>
                <div className="my-build-actions">
                  <button
                    className="my-build-btn my-build-edit"
                    onClick={() => handleEdit(build)}
                  >
                    Editar
                  </button>
                  <button
                    className="my-build-btn my-build-delete"
                    onClick={() => handleDelete(build.id)}
                    disabled={deletingId === build.id}
                  >
                    {deletingId === build.id ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}