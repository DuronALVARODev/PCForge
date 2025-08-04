"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from 'next/image';
import "./case.css";

// Icono de Case
const CaseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="8" y="8" width="8" height="8" rx="1" />
    <circle cx="12" cy="16" r="1.5" />
  </svg>
);

// Tipos
interface PCCase {
  id: string;
  name: string;
  manufacturer?: string;
  series?: string;
  part_numbers?: string[];
  variant?: string;
  release_year?: number;
  form_factor?: string;
  supports_atx?: boolean;
  supports_matx?: boolean;
  supports_mitx?: boolean;
  supports_eatx?: boolean;
  max_gpu_length?: number;
  max_cpu_cooler_height?: number;
  psu_included?: boolean;
  psu_form_factors?: string[];
  max_psu_length?: number;
  expansion_slots?: number;
  drive_bays_3_5?: number;
  drive_bays_2_5?: number;
  drive_bays_5_25?: number;
  length?: number;
  width?: number;
  height?: number;
  volume?: number;
  weight?: number;
  side_panel_type?: string;
  has_tempered_glass?: boolean;
  color?: string[];
  best_price?: number;
  best_price_store?: string;
  best_price_url?: string;
  image?: string;
}

// Fetch Cases desde la API y mapea al formato PCCase
const fetchCasesFromApi = async (): Promise<PCCase[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const imgFolder = 'PC_CASE_IMG';
  const res = await fetch(`${apiUrl}/api/cases`);
  if (!res.ok) throw new Error("Error al obtener Cases");
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
      form_factor: item.form_factor || '',
      supports_atx: item.supports_atx || undefined,
      supports_matx: item.supports_matx || undefined,
      supports_mitx: item.supports_mitx || undefined,
      supports_eatx: item.supports_eatx || undefined,
      max_gpu_length: item.max_gpu_length || undefined,
      max_cpu_cooler_height: item.max_cpu_cooler_height || undefined,
      psu_included: item.psu_included || undefined,
      psu_form_factors: item.psu_form_factors || [],
      max_psu_length: item.max_psu_length || undefined,
      expansion_slots: item.expansion_slots || undefined,
      drive_bays_3_5: item.drive_bays_3_5 || undefined,
      drive_bays_2_5: item.drive_bays_2_5 || undefined,
      drive_bays_5_25: item.drive_bays_5_25 || undefined,
      length: item.length || undefined,
      width: item.width || undefined,
      height: item.height || undefined,
      volume: item.volume || undefined,
      weight: item.weight || undefined,
      side_panel_type: item.side_panel_type || '',
      has_tempered_glass: item.has_tempered_glass || undefined,
      color: item.color || [],
      best_price: item.best_price !== undefined && item.best_price !== null ? Number(item.best_price) : undefined,
      best_price_store: item.best_price_store || '',
      best_price_url: item.best_price_url || '',
      image: `${apiUrl}/images/${imgFolder}/${encodeURIComponent(name)}.jpg`,
    };
  });
};

const caseFilters = [
  { key: "manufacturer", label: "Marca" },
  { key: "series", label: "Serie" },
  { key: "form_factor", label: "Formato" },
  { key: "side_panel_type", label: "Panel lateral" },
  { key: "has_tempered_glass", label: "Vidrio templado" },
  { key: "release_year", label: "Año" },
];

const CasePage: React.FC = () => {
  useEffect(() => {
    document.title = "Gabinetes - PC Forge";
  }, []);
  const [cases, setCases] = useState<PCCase[]>([]);
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
    fetchCasesFromApi()
      .then((data) => {
        setCases(data);
        setError(null);
      })
      .catch(() => setError("Error al cargar Cases"))
      .finally(() => setLoading(false));
  }, []);

  // Obtener valores únicos para cada filtro y marcas
  const filterOptions = useMemo(() => {
    const options: Record<string, unknown[]> = {};
    caseFilters.forEach((f) => {
      options[f.key] = Array.from(new Set(cases.map((c) => (c as PCCase)[f.key as keyof PCCase]).filter((v) => v !== undefined && v !== null)));
    });
    return options;
  }, [cases]);

  const brands = useMemo(() => {
    return [...new Set(cases.map((c) => c.manufacturer).filter((b): b is string => typeof b === "string" && b.length > 0))];
  }, [cases]);

  // Filtrar Cases
  const filteredCases = useMemo(() => {
    let result = cases.filter((c) => {
      // Filtro de búsqueda
      if (search && typeof c.name === 'string' && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      // Filtros select
      for (const key in filters) {
        if (!filters[key]) continue;
        const value = c[key as keyof PCCase];
        if (typeof value === "number") {
          if (value !== Number(filters[key])) return false;
        } else if (typeof value === "boolean") {
          if (String(value) !== String(filters[key])) return false;
        } else {
          if (value !== filters[key]) return false;
        }
      }
      // Filtro de marca
      if (brandFilter.length > 0 && !brandFilter.includes(c.manufacturer || "")) return false;
      // Filtro de existencia
      if (onlyStock && c.best_price === 0) return false;
      return true;
    });
    // Ordenar
    if (sortBy === "menor_precio") {
      result = result.sort((a, b) => (a.best_price ?? 0) - (b.best_price ?? 0));
    } else if (sortBy === "mayor_precio") {
      result = result.sort((a, b) => (b.best_price ?? 0) - (a.best_price ?? 0));
    }
    return result;
  }, [cases, filters, search, brandFilter, onlyStock, sortBy]);

  // Paginación
  const totalPages = Math.ceil(filteredCases.length / componentsPerPage);
  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * componentsPerPage;
    return filteredCases.slice(start, start + componentsPerPage);
  }, [filteredCases, currentPage]);

  // Scroll suave al top global
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="case-page-wrapper">
      <header className="case-header">
        <div className="case-header-content">
          <CaseIcon />
          <h1>Gabinetes</h1>
          <span className="case-header-count">{filteredCases.length} Productos</span>
        </div>
      </header>

      <div className="case-main-layout">
        {/* Sidebar de filtros */}
        <aside className="case-sidebar">
          <div className="case-sidebar-section">
            <h2 className="case-sidebar-title">Ordena por</h2>
            <select className="case-sidebar-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="menor_precio">Menor precio</option>
              <option value="mayor_precio">Mayor precio</option>
            </select>
          </div>
          <div className="case-sidebar-section">
            <h2 className="case-sidebar-title">Filtros</h2>
            <div className="case-sidebar-filters">
              <button
                className="case-sidebar-brand-btn"
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
              <div className="case-sidebar-filter-item">
                <label className="case-sidebar-filter-label">Marca</label>
                <div className="case-sidebar-brand-btns">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      className={`case-sidebar-brand-btn${brandFilter.includes(brand) ? " case-sidebar-brand-btn-selected" : ""}`}
                      onClick={() => setBrandFilter((prev) => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
              {/* Filtros select */}
              {caseFilters.filter(f => f.key !== "manufacturer").map((filter) => (
                <div key={filter.key} className="case-sidebar-filter-item">
                  <label className="case-sidebar-filter-label">{filter.label}</label>
                  <select
                    value={typeof filters[filter.key] === 'string' || typeof filters[filter.key] === 'number' || typeof filters[filter.key] === 'boolean' ? String(filters[filter.key]) : ""}
                    onChange={(e) => setFilters((prev) => ({ ...prev, [filter.key]: e.target.value }))}
                    className="case-sidebar-filter-select"
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

        {/* Listado de Cases */}
        <main className="case-list-section">
          <div className="case-search-bar">
            <input
              type="text"
              placeholder="Buscar gabinetes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="case-search-input"
            />
          </div>
          {loading ? (
            <div className="case-loading">Cargando gabinetes...</div>
          ) : error ? (
            <div className="case-error">{error}</div>
          ) : paginatedCases.length === 0 ? (
            <div className="case-no-results">No se encontraron gabinetes con los filtros seleccionados.</div>
          ) : (
            <div className="case-cards-grid">
              {paginatedCases.map((c) => (
                <div key={c.id} className="case-card">
                  <div className="case-card-image">
                    <Image
                      src={c.image || "/placeholder.svg"}
                      alt={c.name}
                      width={250}
                      height={200}
                      className="case-image"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="case-card-content">
                    <h3 className="case-card-title">{c.name}</h3>
                    <p className="case-card-brand">{c.manufacturer}</p>
                    <div className="case-card-specs">
                      <span>Formato: {c.form_factor ?? "-"}</span>
                      <span>Slots: {c.expansion_slots ?? "-"}</span>
                    </div>
                  </div>
                  <div className="case-card-footer">
                    {c.best_price && c.best_price > 0 ? (
                      <span className="case-card-price">${c.best_price.toLocaleString()}</span>
                    ) : (
                      <span className="case-card-no-price">Sin precio</span>
                    )}
                    {/* Botón de compra con logo del vendedor */}
                    {c.best_price_url && (
                      <a
                        href={c.best_price_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="buy-btn"
                        style={{ display: 'inline-flex', alignItems: 'center', marginTop: 8 }}
                      >
                        {/* Detectar dominio y mostrar logo correspondiente */}
                        {(() => {
                          const url = c.best_price_url || '';
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
            <div className="case-pagination">
              <button
                className="case-pagination-btn"
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
                className="case-pagination-btn"
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
              <span className="case-pagination-info">
                {currentPage} de {totalPages}
              </span>
              <button
                className="case-pagination-btn"
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
                className="case-pagination-btn"
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

export default CasePage;
