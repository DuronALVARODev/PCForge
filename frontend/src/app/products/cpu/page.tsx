"use client";
import React, { useEffect, useState, useMemo } from "react";
import "./cpu.css";

// Iconos reutilizables
const CpuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
  </svg>
);

// Tipos
interface CPU {
  id: string;
  name: string;
  manufacturer?: string;
  series?: string;
  part_numbers?: string[];
  variant?: string;
  release_year?: number;
  socket?: string;
  cores_total?: number;
  cores_threads?: number;
  clock_base?: number;
  clock_boost?: number;
  cache_l2?: number;
  cache_l3?: number;
  tdp?: number;
  best_price?: number;
  best_price_store?: string;
  best_price_url?: string;
  image?: string;
}


// Fetch CPUs desde la API y mapea al formato CPU
const fetchCpusFromApi = async (): Promise<CPU[]> => {
  const res = await fetch("/api/cpus");
  if (!res.ok) throw new Error("Error al obtener CPUs");
  const data = await res.json();
  return data.map((cpu: any) => ({
    id: cpu.id,
    name: cpu.name,
    manufacturer: cpu.manufacturer || "",
    series: cpu.series || "",
    part_numbers: cpu.part_numbers || [],
    variant: cpu.variant || "",
    release_year: cpu.release_year || undefined,
    socket: cpu.socket || "",
    cores_total: cpu.cores_total || undefined,
    cores_threads: cpu.cores_threads || undefined,
    clock_base: cpu.clock_base || undefined,
    clock_boost: cpu.clock_boost || undefined,
    cache_l2: cpu.cache_l2 || undefined,
    cache_l3: cpu.cache_l3 || undefined,
    tdp: cpu.tdp || undefined,
    best_price: cpu.best_price !== undefined && cpu.best_price !== null ? cpu.best_price : (cpu.raw_data?.price || cpu.tdp || 0),
    best_price_store: cpu.best_price_store || "",
    best_price_url: cpu.best_price_url || "",
    image: `/api/images/CPU_IMG/${encodeURIComponent(cpu.name)}.jpg`,
    // Puedes agregar más campos si lo necesitas
  }));
};

const cpuFilters = [
  { key: "manufacturer", label: "Marca" },
  { key: "series", label: "Serie" },
  { key: "socket", label: "Socket" },
  { key: "cores_total", label: "Núcleos" },
  { key: "cores_threads", label: "Threads" },
  { key: "clock_base", label: "Frecuencia Base (GHz)" },
  { key: "clock_boost", label: "Frecuencia Boost (GHz)" },
  { key: "tdp", label: "TDP (W)" },
  { key: "release_year", label: "Año" },
];


const CpuPage: React.FC = () => {
  const [cpus, setCpus] = useState<CPU[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const componentsPerPage = 6;
  const [onlyStock, setOnlyStock] = useState(false);
  const [sortBy, setSortBy] = useState("existencia");

  useEffect(() => {
    setLoading(true);
    fetchCpusFromApi()
      .then((data) => setCpus(data))
      .catch(() => setError("Error al cargar CPUs"))
      .finally(() => setLoading(false));
  }, []);


  // Obtener valores únicos para cada filtro y marcas
  const filterOptions = useMemo(() => {
    const options: Record<string, any[]> = {};
    cpuFilters.forEach((f) => {
      options[f.key] = Array.from(new Set(cpus.map((cpu) => (cpu as Record<string, any>)[f.key]).filter((v) => v !== undefined && v !== null)));
    });
    return options;
  }, [cpus]);

  const brands = useMemo(() => {
    return [...new Set(cpus.map((cpu) => cpu.manufacturer).filter((b): b is string => typeof b === "string" && b.length > 0))];
  }, [cpus]);


  // Filtrar CPUs
  const filteredCpus = useMemo(() => {
    let result = cpus.filter((cpu) => {
      // Filtro de búsqueda
      if (search && !cpu.name?.toLowerCase().includes(search.toLowerCase())) return false;
      // Filtros select
      for (const key in filters) {
        if (!filters[key]) continue;
        const value = (cpu as Record<string, any>)[key];
        if (typeof value === "number") {
          if (value !== Number(filters[key])) return false;
        } else {
          if (value !== filters[key]) return false;
        }
      }
      // Filtro de marca
      if (brandFilter.length > 0 && !brandFilter.includes(cpu.manufacturer || "")) return false;
      // Filtro de existencia
      if (onlyStock && cpu.best_price === 0) return false;
      return true;
    });
    // Ordenar
    if (sortBy === "precio") {
      result = result.sort((a, b) => (a.best_price ?? 0) - (b.best_price ?? 0));
    } else if (sortBy === "mayor_precio") {
      result = result.sort((a, b) => (b.best_price ?? 0) - (a.best_price ?? 0));
    } else if (sortBy === "existencia") {
      result = result.sort((a, b) => (b.best_price !== 0 ? 1 : -1) - (a.best_price !== 0 ? 1 : -1));
    }
    return result;
  }, [cpus, filters, search, brandFilter, onlyStock, sortBy]);

  // Paginación
  const totalPages = Math.ceil(filteredCpus.length / componentsPerPage);
  const paginatedCpus = useMemo(() => {
    const start = (currentPage - 1) * componentsPerPage;
    return filteredCpus.slice(start, start + componentsPerPage);
  }, [filteredCpus, currentPage]);

  return (
    <div className="cpu-page-wrapper">
      <header className="cpu-header">
        <div className="cpu-header-content">
          <CpuIcon />
          <h1>Procesadores</h1>
          <span className="cpu-header-count">{filteredCpus.length} CPUs</span>
        </div>
        <p className="cpu-header-subtitle">Explora todos los procesadores disponibles y filtra por las características que necesitas.</p>
      </header>

      <div className="cpu-main-layout">
        {/* Sidebar de filtros */}
        <aside className="cpu-sidebar">
          <div className="cpu-sidebar-section">
            <h2 className="cpu-sidebar-title">Ordena por</h2>
            <select className="cpu-sidebar-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="existencia">Primero con existencia</option>
              <option value="precio">Menor precio</option>
              <option value="mayor_precio">Mayor precio</option>
            </select>
            <div className="cpu-sidebar-checkbox-row">
              <input type="checkbox" id="existence" checked={onlyStock} onChange={e => setOnlyStock(e.target.checked)} />
              <label htmlFor="existence">Solo productos con existencia</label>
            </div>
          </div>
          <div className="cpu-sidebar-section">
            <h2 className="cpu-sidebar-title">Filtros</h2>
            <div className="cpu-sidebar-filters">
              {/* Filtro de marca tipo botón */}
              <div className="cpu-sidebar-filter-item">
                <label className="cpu-sidebar-filter-label">Marca</label>
                <div className="cpu-sidebar-brand-btns">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      className={`cpu-sidebar-brand-btn${brandFilter.includes(brand) ? " cpu-sidebar-brand-btn-selected" : ""}`}
                      onClick={() => setBrandFilter((prev) => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
              {/* Filtros select */}
              {cpuFilters.filter(f => f.key !== "manufacturer").map((filter) => (
                <div key={filter.key} className="cpu-sidebar-filter-item">
                  <label className="cpu-sidebar-filter-label">{filter.label}</label>
                  <select
                    value={filters[filter.key] || ""}
                    onChange={(e) => setFilters((prev) => ({ ...prev, [filter.key]: e.target.value }))}
                    className="cpu-sidebar-filter-select"
                  >
                    <option value="">Todos</option>
                    {filterOptions[filter.key]?.map((option: any) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Listado de CPUs */}
        <main className="cpu-list-section cpu-list-fullwidth">
          <div className="cpu-search-bar">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="cpu-search-input"
            />
          </div>
          {loading ? (
            <div className="cpu-loading">Cargando CPUs...</div>
          ) : error ? (
            <div className="cpu-error">{error}</div>
          ) : paginatedCpus.length === 0 ? (
            <div className="cpu-no-results">No se encontraron CPUs con los filtros seleccionados.</div>
          ) : (
            <div className="cpu-cards-grid cpu-cards-wide">
              {paginatedCpus.map((cpu) => (
                <div key={cpu.id} className="cpu-card cpu-card-large">
                  <div className="cpu-card-image-row">
                    <img
                      src={cpu.image || "/placeholder.svg"}
                      alt={cpu.name}
                      className="cpu-card-image"
                      loading="lazy"
                      // TODO: Cambiar por <Image /> de next/image para optimización
                    />
                  </div>
                  <div className="cpu-card-header">
                    <div className="cpu-card-title-row">
                      
                      <h2 className="cpu-card-title">{cpu.name}</h2>
                    </div>
                    <span className="cpu-card-brand">{cpu.manufacturer}</span>
                  </div>
                  <div className="cpu-card-specs">
                    <ul>
                      <li><strong>Socket:</strong> {cpu.socket || "-"}</li>
                      <li><strong>Núcleos:</strong> {cpu.cores_total ?? "-"}</li>
                      <li><strong>Threads:</strong> {cpu.cores_threads ?? "-"}</li>
                      <li><strong>Base:</strong> {cpu.clock_base ? `${cpu.clock_base} GHz` : "-"}</li>
                      <li><strong>Boost:</strong> {cpu.clock_boost ? `${cpu.clock_boost} GHz` : "-"}</li>
                      <li><strong>TDP:</strong> {cpu.tdp ? `${cpu.tdp} W` : "-"}</li>
                      <li><strong>Año:</strong> {cpu.release_year ?? "-"}</li>
                    </ul>
                  </div>
                  
                  <div className="cpu-card-footer">
                    {cpu.best_price ? (
                      <a href={cpu.best_price_url || "#"} target="_blank" rel="noopener" className="cpu-card-price">
                        ${cpu.best_price} 
                      </a>
                    ) : (
                      <span className="cpu-card-price">Sin precio</span>
                    )}
                    {cpu.best_price !== 0 && (
                      <span className="cpu-card-stock-badge">✔ CON EXISTENCIA</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Paginación */}
          {!loading && !error && totalPages > 1 && (
            <div className="cpu-pagination-container">
              <button
                className="cpu-pagination-btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span className="cpu-pagination-info">
                Página {currentPage} de {totalPages}
              </span>
              <button
                className="cpu-pagination-btn"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CpuPage;
