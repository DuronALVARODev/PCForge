"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from 'next/image';
import "./ram.css";

// Icono RAM
const RamIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="10" rx="2" />
    <rect x="6" y="11" width="2" height="2" />
    <rect x="10" y="11" width="2" height="2" />
    <rect x="14" y="11" width="2" height="2" />
    <rect x="18" y="11" width="2" height="2" />
  </svg>
);

// Tipos
interface RAM {
  id: string;
  name: string;
  manufacturer?: string;
  series?: string;
  part_numbers?: string[];
  variant?: string;
  release_year?: number;
  total_capacity?: number;
  ram_type?: string;
  speed_mhz?: number;
  modules_quantity?: number;
  best_price?: number;
  best_price_store?: string;
  best_price_url?: string;
  image?: string;
}

// Fetch RAMs desde la API y mapea al formato RAM
const fetchRamsFromApi = async (): Promise<RAM[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const imgFolder = 'RAM_IMG';
  const res = await fetch(`${apiUrl}/api/rams`);
  if (!res.ok) throw new Error("Error al obtener RAMs");
  const data = await res.json();
  return data.map((item: Record<string, any>) => {
    const name = typeof item.name === 'string' ? item.name : '';
    const brand = typeof item.manufacturer === 'string' ? item.manufacturer : '';
    const rawData = typeof item.raw_data === 'object' && item.raw_data !== null ? item.raw_data as { price?: number } : undefined;
    const price = item.best_price !== undefined && item.best_price !== null
      ? Number(item.best_price)
      : (rawData?.price ?? 0);
    return {
      id: typeof item.id === 'string' ? item.id : '',
      name,
      manufacturer: brand,
      series: item.series || '',
      part_numbers: item.part_numbers || [],
      variant: item.variant || '',
      release_year: item.release_year || undefined,
      total_capacity: item.total_capacity || undefined,
      ram_type: item.ram_type || '',
      speed_mhz: item.speed_mhz || undefined,
      modules_quantity: item.modules_quantity || undefined,
      best_price: item.best_price !== undefined && item.best_price !== null ? Number(item.best_price) : undefined,
      best_price_store: item.best_price_store || '',
      best_price_url: item.best_price_url || '',
      image: `${apiUrl}/images/${imgFolder}/${encodeURIComponent(name)}.jpg`,
    };
  });
};

const ramFilters = [
  { key: "manufacturer", label: "Marca" },
  { key: "series", label: "Serie" },
  { key: "total_capacity", label: "Capacidad (GB)" },
  { key: "ram_type", label: "Tipo de Memoria" },
  { key: "speed_mhz", label: "Velocidad (MHz)" },
  { key: "modules_quantity", label: "Módulos" },
  { key: "release_year", label: "Año" },
];

const RamPage: React.FC = () => {
  useEffect(() => {
    document.title = "Memorias RAM - PC Forge";
  }, []);
  const [rams, setRams] = useState<RAM[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const componentsPerPage = 10;
  const [onlyStock, setOnlyStock] = useState(false);
  const [sortBy, setSortBy] = useState("menor_precio");

  useEffect(() => {
    setLoading(true);
    fetchRamsFromApi()
      .then((data) => {
        setRams(data);
        setError(null);
      })
      .catch(() => setError("Error al cargar RAMs"))
      .finally(() => setLoading(false));
  }, []);

  // Obtener valores únicos para cada filtro y marcas
  const filterOptions = useMemo(() => {
    const options: Record<string, unknown[]> = {};
    ramFilters.forEach((f) => {
      options[f.key] = Array.from(new Set(rams.map((ram) => (ram as RAM)[f.key as keyof RAM]).filter((v) => v !== undefined && v !== null)));
    });
    return options;
  }, [rams]);

  const brands = useMemo(() => {
    return [...new Set(rams.map((ram) => ram.manufacturer).filter((b): b is string => typeof b === "string" && b.length > 0))];
  }, [rams]);

  // Filtrar RAMs
  const filteredRams = useMemo(() => {
    let result = rams.filter((ram) => {
      if (search && typeof ram.name === 'string' && !ram.name.toLowerCase().includes(search.toLowerCase())) return false;
      for (const key in filters) {
        if (!filters[key]) continue;
        const value = ram[key as keyof RAM];
        if (typeof value === "number") {
          if (value !== Number(filters[key])) return false;
        } else {
          if (value !== filters[key]) return false;
        }
      }
      if (brandFilter.length > 0 && !brandFilter.includes(ram.manufacturer || "")) return false;
      if (onlyStock && ram.best_price === 0) return false;
      return true;
    });
    if (sortBy === "menor_precio") {
      result = result.sort((a, b) => (a.best_price ?? 0) - (b.best_price ?? 0));
    } else if (sortBy === "mayor_precio") {
      result = result.sort((a, b) => (b.best_price ?? 0) - (a.best_price ?? 0));
    }
    return result;
  }, [rams, filters, search, brandFilter, onlyStock, sortBy]);

  // Paginación
  const totalPages = Math.ceil(filteredRams.length / componentsPerPage);
  const paginatedRams = useMemo(() => {
    const start = (currentPage - 1) * componentsPerPage;
    return filteredRams.slice(start, start + componentsPerPage);
  }, [filteredRams, currentPage]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="cpu-page-wrapper">
      <header className="cpu-header">
        <div className="cpu-header-content">
          <RamIcon />
          <h1>Memorias RAM</h1>
          <span className="cpu-header-count">{filteredRams.length} Productos</span>
        </div>
      </header>

      <div className="cpu-main-layout">
        {/* Sidebar de filtros */}
        <aside className="cpu-sidebar">
          <div className="cpu-sidebar-section">
            <h2 className="cpu-sidebar-title">Ordena por</h2>
            <select className="cpu-sidebar-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="menor_precio">Menor precio</option>
              <option value="mayor_precio">Mayor precio</option>
            </select>
            
          </div>
          <div className="cpu-sidebar-section">
            <h2 className="cpu-sidebar-title">Filtros</h2>
            <div className="cpu-sidebar-filters">
              <button
                className="cpu-sidebar-brand-btn"
                style={{ marginBottom: '0.5rem', background: '#f3f4f6', color: '#1f2937', fontWeight: 600 }}
                onClick={() => {
                  setFilters({});
                  setBrandFilter([]);
                  setOnlyStock(false);
                  setSortBy('menor_precio');
                }}
              >
                Limpiar filtros
              </button>
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
              {ramFilters.filter(f => f.key !== "manufacturer").map((filter) => (
                <div key={filter.key} className="cpu-sidebar-filter-item">
                  <label className="cpu-sidebar-filter-label">{filter.label}</label>
                  <select
                    value={typeof filters[filter.key] === 'string' || typeof filters[filter.key] === 'number' ? String(filters[filter.key]) : ""}
                    onChange={(e) => setFilters((prev) => ({ ...prev, [filter.key]: e.target.value }))}
                    className="cpu-sidebar-filter-select"
                  >
                    <option value="">Todos</option>
                    {filterOptions[filter.key]?.map((option) => (
                      <option key={String(option)} value={String(option)}>{String(option)}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Listado de RAMs */}
        <main className="cpu-list-section">
          <div className="cpu-search-bar">
            <input
              type="text"
              placeholder="Buscar componentes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="cpu-search-input"
            />
          </div>
          {loading ? (
            <div className="cpu-loading">Cargando memorias RAM...</div>
          ) : error ? (
            <div className="cpu-error">{error}</div>
          ) : paginatedRams.length === 0 ? (
            <div className="cpu-no-results">No se encontraron memorias RAM con los filtros seleccionados.</div>
          ) : (
            <div className="cpu-cards-grid">
              {paginatedRams.map((ram) => (
                <div key={ram.id} className="cpu-card">
                  <div className="cpu-card-image">
                    <Image
                      src={ram.image || "/placeholder.svg"}
                      alt={ram.name}
                      width={250}
                      height={200}
                      className="cpu-image"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="cpu-card-content">
                    <h3 className="cpu-card-title">{ram.name}</h3>
                    <p className="cpu-card-brand">{ram.manufacturer}</p>
                    <div className="cpu-card-specs">
                      <span>Capacidad: {ram.total_capacity ? `${ram.total_capacity} GB` : "-"}</span>
                      <span>Velocidad: {ram.speed_mhz ? `${ram.speed_mhz} MHz` : "-"}</span>
                    </div>
                  </div>
                  <div className="cpu-card-footer">
                    {ram.best_price && ram.best_price > 0 ? (
                      <span className="cpu-card-price">${ram.best_price.toLocaleString()}</span>
                    ) : (
                      <span className="cpu-card-no-price">Sin precio</span>
                    )}
                    {/* Botón de compra con logo del vendedor */}
                    {ram.best_price_url && (
                      <a
                        href={ram.best_price_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="buy-btn"
                        style={{ display: 'inline-flex', alignItems: 'center', marginTop: 8 }}
                      >
                        {/* Detectar dominio y mostrar logo correspondiente */}
                        {(() => {
                          const url = ram.best_price_url || '';
                          if (url.includes('amazon.')) {
                            return (
                              <img src="/Amazon_logo.svg" alt="Amazon" width={32} height={32} style={{objectFit:'contain', background:'white', borderRadius:4}} />
                            );
                          } else if (url.includes('newegg.')) {
                            return (
                              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <ellipse cx="16" cy="16" rx="16" ry="16" fill="#fff"/>
                                <ellipse cx="20" cy="16" rx="8" ry="6" fill="#F5A623"/>
                                <ellipse cx="16" cy="16" rx="6" ry="5" fill="#0055A4"/>
                                <ellipse cx="12" cy="16" rx="4" ry="3" fill="#fff"/>
                              </svg>
                            );
                          } else if (url.includes('bestbuy.')) {
                            return (
                              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <ellipse cx="16" cy="16" rx="16" ry="16" fill="#fff"/>
                                <rect x="8" y="10" width="16" height="12" rx="2" fill="#FFE000" stroke="#000" strokeWidth="1.5"/>
                                <text x="16" y="20" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#000">BB</text>
                              </svg>
                            );
                          } else {
                            // Logo genérico
                            return (
                              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <ellipse cx="16" cy="16" rx="16" ry="16" fill="#eee"/>
                                <path d="M10 16h12M16 10v12" stroke="#888" strokeWidth="2"/>
                              </svg>
                            );
                          }
                        })()}
                        <span style={{ marginLeft: 6, fontWeight: 500, fontSize: 14 }}>Comprar</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Paginación */}
          {!loading && !error && totalPages > 1 && (
            <div className="cpu-pagination">
              <button
                className="cpu-pagination-btn"
                onClick={() => {
                  if (currentPage !== 1) {
                    setCurrentPage(1);
                  }
                  window.scrollTo({ top: 0 });
                }}
                disabled={currentPage === 1}
              >
                {'<<'}
              </button>
              <button
                className="cpu-pagination-btn"
                onClick={() => {
                  setCurrentPage((p) => {
                    const newPage = Math.max(1, p - 1);
                    if (newPage !== p) {
                      scrollToTop();
                    }
                    return newPage;
                  });
                }}
                disabled={currentPage === 1}
              >
                {'‹'}
              </button>
              <span className="cpu-pagination-info">
                {currentPage} de {totalPages}
              </span>
              <button
                className="cpu-pagination-btn"
                onClick={() => {
                  setCurrentPage((p) => {
                    const newPage = Math.min(totalPages, p + 1);
                    if (newPage !== p) {
                      scrollToTop();
                    }
                    return newPage;
                  });
                }}
                disabled={currentPage === totalPages}
              >
                {'›'}
              </button>
              <button
                className="cpu-pagination-btn"
                onClick={() => {
                  if (currentPage !== totalPages) {
                    setCurrentPage(totalPages);
                  }
                  window.scrollTo({ top: 0 });
                }}
                disabled={currentPage === totalPages}
              >
                {'>>'}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RamPage;
