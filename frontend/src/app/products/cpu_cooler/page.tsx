"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from 'next/image';
import "./cpu_cooler.css";

// Icono de Cooler
const CoolerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
);

// Tipos
interface CPUCooler {
  id: string;
  name: string;
  manufacturer?: string;
  series?: string;
  part_numbers?: string[];
  variant?: string;
  release_year?: number;
  cpu_sockets?: string[];
  height?: number;
  fan_size?: number;
  water_cooled?: boolean;
  fanless?: boolean;
  radiator_size?: number;
  fan_quantity?: number;
  min_fan_rpm?: number;
  max_fan_rpm?: number;
  min_noise_level?: number;
  max_noise_level?: number;
  color?: string[];
  max_tdp_support?: number;
  rgb_lighting?: boolean;
  pwm_control?: boolean;
  best_price?: number;
  best_price_store?: string;
  best_price_url?: string;
  image?: string;
}

// Fetch Coolers desde la API y mapea al formato CPUCooler
const fetchCoolersFromApi = async (): Promise<CPUCooler[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const imgFolder = 'CPU_COOLER_IMG';
  const res = await fetch(`${apiUrl}/api/coolers`);
  if (!res.ok) throw new Error("Error al obtener Coolers");
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
      cpu_sockets: item.cpu_sockets || [],
      height: item.height || undefined,
      fan_size: item.fan_size || undefined,
      water_cooled: item.water_cooled || undefined,
      fanless: item.fanless || undefined,
      radiator_size: item.radiator_size || undefined,
      fan_quantity: item.fan_quantity || undefined,
      min_fan_rpm: item.min_fan_rpm || undefined,
      max_fan_rpm: item.max_fan_rpm || undefined,
      min_noise_level: item.min_noise_level || undefined,
      max_noise_level: item.max_noise_level || undefined,
      color: item.color || [],
      max_tdp_support: item.max_tdp_support || undefined,
      rgb_lighting: item.rgb_lighting || undefined,
      pwm_control: item.pwm_control || undefined,
      best_price: item.best_price !== undefined && item.best_price !== null ? Number(item.best_price) : undefined,
      best_price_store: item.best_price_store || '',
      best_price_url: item.best_price_url || '',
      image: `${apiUrl}/images/${imgFolder}/${encodeURIComponent(name)}.jpg`,
    };
  });
};

const coolerFilters = [
  { key: "manufacturer", label: "Marca" },
  { key: "series", label: "Serie" },
  { key: "water_cooled", label: "Tipo de enfriamiento" },
  { key: "fan_size", label: "Tamaño de ventilador" },
  { key: "radiator_size", label: "Tamaño radiador" },
  { key: "height", label: "Altura (mm)" },
  { key: "max_tdp_support", label: "TDP máximo (W)" },
  { key: "color", label: "Color" },
  { key: "release_year", label: "Año" },
];

const CPUCoolerPage: React.FC = () => {
  useEffect(() => {
    document.title = "Coolers - PC Forge";
  }, []);
  const [coolers, setCoolers] = useState<CPUCooler[]>([]);
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
    fetchCoolersFromApi()
      .then((data) => {
        setCoolers(data);
        setError(null);
      })
      .catch(() => setError("Error al cargar Coolers"))
      .finally(() => setLoading(false));
  }, []);

  // Obtener valores únicos para cada filtro y marcas
  const filterOptions = useMemo(() => {
    const options: Record<string, unknown[]> = {};
    coolerFilters.forEach((f) => {
      options[f.key] = Array.from(new Set(coolers.map((c) => (c as CPUCooler)[f.key as keyof CPUCooler]).filter((v) => v !== undefined && v !== null)));
    });
    return options;
  }, [coolers]);

  const brands = useMemo(() => {
    return [...new Set(coolers.map((c) => c.manufacturer).filter((b): b is string => typeof b === "string" && b.length > 0))];
  }, [coolers]);

  // Filtrar Coolers
  const filteredCoolers = useMemo(() => {
    let result = coolers.filter((c) => {
      // Filtro de búsqueda
      if (search && typeof c.name === 'string' && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      // Filtros select
      for (const key in filters) {
        if (!filters[key]) continue;
        const value = c[key as keyof CPUCooler];
        if (typeof value === "number") {
          if (value !== Number(filters[key])) return false;
        } else if (typeof value === "boolean") {
          if (String(value) !== String(filters[key])) return false;
        } else if (Array.isArray(value)) {
          // Compare as string for array fields
          if (!value.map(String).includes(String(filters[key]))) return false;
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
  }, [coolers, filters, search, brandFilter, onlyStock, sortBy]);

  // Paginación
  const totalPages = Math.ceil(filteredCoolers.length / componentsPerPage);
  const paginatedCoolers = useMemo(() => {
    const start = (currentPage - 1) * componentsPerPage;
    return filteredCoolers.slice(start, start + componentsPerPage);
  }, [filteredCoolers, currentPage]);

  // Scroll suave al top global
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="cooler-page-wrapper">
      <header className="cooler-header">
        <div className="cooler-header-content">
          <CoolerIcon />
          <h1>Coolers</h1>
          <span className="cooler-header-count">{filteredCoolers.length} Productos</span>
        </div>
      </header>

      <div className="cooler-main-layout">
        {/* Sidebar de filtros */}
        <aside className="cooler-sidebar">
          <div className="cooler-sidebar-section">
            <h2 className="cooler-sidebar-title">Ordena por</h2>
            <select className="cooler-sidebar-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="menor_precio">Menor precio</option>
              <option value="mayor_precio">Mayor precio</option>
            </select>
            
          </div>
          <div className="cooler-sidebar-section">
            <h2 className="cooler-sidebar-title">Filtros</h2>
            <div className="cooler-sidebar-filters">
              <button
                className="cooler-sidebar-brand-btn"
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
              <div className="cooler-sidebar-filter-item">
                <label className="cooler-sidebar-filter-label">Marca</label>
                <div className="cooler-sidebar-brand-btns">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      className={`cooler-sidebar-brand-btn${brandFilter.includes(brand) ? " cooler-sidebar-brand-btn-selected" : ""}`}
                      onClick={() => setBrandFilter((prev) => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
              {/* Filtros select */}
              {coolerFilters.filter(f => f.key !== "manufacturer").map((filter) => (
                <div key={filter.key} className="cooler-sidebar-filter-item">
                  <label className="cooler-sidebar-filter-label">{filter.label}</label>
                  <select
                    value={typeof filters[filter.key] === 'string' || typeof filters[filter.key] === 'number' || typeof filters[filter.key] === 'boolean' ? String(filters[filter.key]) : ""}
                    onChange={(e) => setFilters((prev) => ({ ...prev, [filter.key]: e.target.value }))}
                    className="cooler-sidebar-filter-select"
                  >
                    <option value="">Todos</option>
                    {filterOptions[filter.key]?.map((option, idx) => {
                      // Si es un array, usar join para mostrar y clave única
                      const isArray = Array.isArray(option);
                      const valueStr = isArray ? option.join(",") : String(option);
                      // For uniqueness, add index to key
                      const keyStr = `${filter.key}-${valueStr}-${idx}`;
                      return (
                        <option key={keyStr} value={valueStr}>{valueStr}</option>
                      );
                    })}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Listado de Coolers */}
        <main className="cooler-list-section">
          <div className="cooler-search-bar">
            <input
              type="text"
              placeholder="Buscar coolers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="cooler-search-input"
            />
          </div>
          {loading ? (
            <div className="cooler-loading">Cargando coolers...</div>
          ) : error ? (
            <div className="cooler-error">{error}</div>
          ) : paginatedCoolers.length === 0 ? (
            <div className="cooler-no-results">No se encontraron coolers con los filtros seleccionados.</div>
          ) : (
            <div className="cooler-cards-grid">
              {paginatedCoolers.map((c) => (
                <div key={c.id} className="cooler-card">
                  <div className="cooler-card-image">
                    <Image
                      src={c.image || "/placeholder.svg"}
                      alt={c.name}
                      width={250}
                      height={200}
                      className="cooler-image"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="cooler-card-content">
                    <h3 className="cooler-card-title">{c.name}</h3>
                    <p className="cooler-card-brand">{c.manufacturer}</p>
                    <div className="cooler-card-specs">
                      <span>{c.water_cooled ? 'Líquido' : 'Aire'}</span>
                      <span>Fan: {c.fan_size ?? "-"}mm</span>
                      <span>Altura: {c.height ?? "-"}mm</span>
                    </div>
                  </div>
                  <div className="cooler-card-footer">
                    {c.best_price && c.best_price > 0 ? (
                      <span className="cooler-card-price">${c.best_price.toLocaleString()}</span>
                    ) : (
                      <span className="cooler-card-no-price">Sin precio</span>
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
            <div className="cooler-pagination">
              <button
                className="cooler-pagination-btn"
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
                className="cooler-pagination-btn"
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
              <span className="cooler-pagination-info">
                {currentPage} de {totalPages}
              </span>
              <button
                className="cooler-pagination-btn"
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
                className="cooler-pagination-btn"
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

export default CPUCoolerPage;
