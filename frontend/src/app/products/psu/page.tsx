"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from 'next/image';
import "./psu.css";

// Icono PSU
const PsuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="7" width="18" height="10" rx="2" />
    <rect x="7" y="11" width="2" height="2" />
    <rect x="15" y="11" width="2" height="2" />
    <rect x="11" y="11" width="2" height="2" />
    <path d="M1 17v2a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-2" />
  </svg>
);

// Tipos
interface PSU {
  id: string;
  name: string;
  manufacturer?: string;
  series?: string;
  wattage?: number;
  efficiency_rating?: string;
  modular?: string;
  form_factor?: string;
  release_year?: number;
  tdp?: number;
  best_price?: number;
  best_price_store?: string;
  best_price_url?: string;
  image?: string;
}

// Fetch PSUs desde la API y mapea al formato PSU
const fetchPsusFromApi = async (): Promise<PSU[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const imgFolder = 'PSU_IMG';
  const res = await fetch(`${apiUrl}/api/psus`);
  if (!res.ok) throw new Error("Error al obtener PSUs");
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
      wattage: item.wattage || undefined,
      efficiency_rating: item.efficiency_rating || '',
      modular: item.modular || '',
      form_factor: item.form_factor || '',
      release_year: item.release_year || undefined,
      tdp: item.tdp || undefined,
      best_price: item.best_price !== undefined && item.best_price !== null ? Number(item.best_price) : undefined,
      best_price_store: item.best_price_store || '',
      best_price_url: item.best_price_url || '',
      image: `${apiUrl}/images/${imgFolder}/${encodeURIComponent(name)}.jpg`,
    };
  });
};

const psuFilters = [
  { key: "manufacturer", label: "Marca" },
  { key: "series", label: "Serie" },
  { key: "wattage", label: "Potencia (W)" },
  { key: "efficiency_rating", label: "Eficiencia" },
  { key: "modular", label: "Modularidad" },
  { key: "form_factor", label: "Factor de forma" },
  { key: "tdp", label: "TDP (W)" },
  { key: "release_year", label: "Año" },
];

const PsuPage: React.FC = () => {
  useEffect(() => {
    document.title = "Fuentes de Poder - PC Forge";
  }, []);
  const [psus, setPsus] = useState<PSU[]>([]);
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
    fetchPsusFromApi()
      .then((data) => {
        setPsus(data);
        setError(null);
      })
      .catch(() => setError("Error al cargar PSUs"))
      .finally(() => setLoading(false));
  }, []);

  // Obtener valores únicos para cada filtro y marcas
  const filterOptions = useMemo(() => {
    const options: Record<string, unknown[]> = {};
    psuFilters.forEach((f) => {
      options[f.key] = Array.from(new Set(psus.map((psu) => (psu as PSU)[f.key as keyof PSU]).filter((v) => v !== undefined && v !== null)));
    });
    return options;
  }, [psus]);

  const brands = useMemo(() => {
    return [...new Set(psus.map((psu) => psu.manufacturer).filter((b): b is string => typeof b === "string" && b.length > 0))];
  }, [psus]);

  // Filtrar PSUs
  const filteredPsus = useMemo(() => {
    let result = psus.filter((psu) => {
      if (search && typeof psu.name === 'string' && !psu.name.toLowerCase().includes(search.toLowerCase())) return false;
      for (const key in filters) {
        if (!filters[key]) continue;
        const value = psu[key as keyof PSU];
        if (typeof value === "number") {
          if (value !== Number(filters[key])) return false;
        } else {
          if (value !== filters[key]) return false;
        }
      }
      if (brandFilter.length > 0 && !brandFilter.includes(psu.manufacturer || "")) return false;
      if (onlyStock && psu.best_price === 0) return false;
      return true;
    });
    if (sortBy === "menor_precio") {
      result = result.sort((a, b) => (a.best_price ?? 0) - (b.best_price ?? 0));
    } else if (sortBy === "mayor_precio") {
      result = result.sort((a, b) => (b.best_price ?? 0) - (a.best_price ?? 0));
    }
    return result;
  }, [psus, filters, search, brandFilter, onlyStock, sortBy]);

  // Paginación
  const totalPages = Math.ceil(filteredPsus.length / componentsPerPage);
  const paginatedPsus = useMemo(() => {
    const start = (currentPage - 1) * componentsPerPage;
    return filteredPsus.slice(start, start + componentsPerPage);
  }, [filteredPsus, currentPage]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="cpu-page-wrapper">
      <header className="cpu-header">
        <div className="cpu-header-content">
          <PsuIcon />
          <h1>Fuentes de Poder</h1>
          <span className="cpu-header-count">{filteredPsus.length} Productos</span>
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
              {psuFilters.filter(f => f.key !== "manufacturer").map((filter) => (
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

        {/* Listado de PSUs */}
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
            <div className="cpu-loading">Cargando fuentes de poder...</div>
          ) : error ? (
            <div className="cpu-error">{error}</div>
          ) : paginatedPsus.length === 0 ? (
            <div className="cpu-no-results">No se encontraron fuentes de poder con los filtros seleccionados.</div>
          ) : (
            <div className="cpu-cards-grid">
              {paginatedPsus.map((psu) => (
                <div key={psu.id} className="cpu-card">
                  <div className="cpu-card-image">
                    <Image
                      src={psu.image || "/placeholder.svg"}
                      alt={psu.name}
                      width={250}
                      height={200}
                      className="cpu-image"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="cpu-card-content">
                    <h3 className="cpu-card-title">{psu.name}</h3>
                    <p className="cpu-card-brand">{psu.manufacturer}</p>
                    <div className="cpu-card-specs">
                      <span>Potencia: {psu.wattage ? `${psu.wattage} W` : "-"}</span>
                      <span>Eficiencia: {psu.efficiency_rating || "-"}</span>
                    </div>
                  </div>
                  <div className="cpu-card-footer">
                    {psu.best_price && psu.best_price > 0 ? (
                      <span className="cpu-card-price">${psu.best_price.toLocaleString()}</span>
                    ) : (
                      <span className="cpu-card-no-price">Sin precio</span>
                    )}
                    {/* Botón de compra con logo del vendedor */}
                    {psu.best_price_url && (
                      <a
                        href={psu.best_price_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="buy-btn"
                        style={{ display: 'inline-flex', alignItems: 'center', marginTop: 8 }}
                      >
                        {/* Detectar dominio y mostrar logo correspondiente */}
                        {(() => {
                          const url = psu.best_price_url || '';
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

export default PsuPage;
