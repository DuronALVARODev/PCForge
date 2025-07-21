"use client"

import { useState, useMemo, useEffect } from "react"
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import "./pc-build.css"

// Icons (Simple SVG components)
const CpuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
  </svg>
)

const GpuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
)

const RamIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 19v-3" />
    <path d="M10 19v-3" />
    <path d="M14 19v-3" />
    <path d="M18 19v-3" />
    <path d="M8 11V9" />
    <path d="M16 11V9" />
    <path d="M12 11V9" />
    <path d="M2 15h20" />
    <path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.1a2 2 0 0 0 0 3.837V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5.063a2 2 0 0 0 0-3.837Z" />
  </svg>
)

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17,21 17,13 7,13 7,21" />
    <polyline points="7,3 7,8 15,8" />
  </svg>
)

const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16,6 12,2 8,6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
)

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
)

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const categories = [
  { id: "cpu" as ComponentCategory, name: "Procesador", icon: CpuIcon },
  { id: "gpu" as ComponentCategory, name: "Tarjeta Gráfica", icon: GpuIcon },
  { id: "motherboard" as ComponentCategory, name: "Placa Base", icon: CpuIcon },
  { id: "ram" as ComponentCategory, name: "Memoria RAM", icon: RamIcon },
  { id: "storage" as ComponentCategory, name: "Almacenamiento", icon: CpuIcon },
  { id: "psu" as ComponentCategory, name: "Fuente de Poder", icon: CpuIcon },
  { id: "case" as ComponentCategory, name: "Gabinete", icon: CpuIcon },
  { id: "cooler" as ComponentCategory, name: "Refrigeración", icon:  CpuIcon },
]

const categoryNames: Record<ComponentCategory, string> = {
  cpu: "Procesadores",
  gpu: "Tarjetas Gráficas",
  ram: "Memoria RAM",
  motherboard: "Placas Base",
  psu: "Fuentes de Poder",
  case: "Gabinetes",
  storage: "Almacenamiento",
  cooler: "Refrigeración",
}

// Types
type ComponentCategory = "cpu" | "gpu" | "ram" | "motherboard" | "psu" | "case" | "storage" | "cooler"

interface Component {
  id: string
  name: string
  brand: string
  price: number
  image: string
  specs: Record<string, string>
  compatibility?: {
    socket?: string
    formFactor?: string
    powerRequirement?: number
    maxMemorySpeed?: number
  }
  best_price?: number
}

interface PCBuild {
  cpu: Component | null
  gpu: Component | null
  ram: Component | null
  motherboard: Component | null
  psu: Component | null
  case: Component | null
  storage: Component | null
  cooler: Component | null
  totalPrice: number
}

interface CompatibilityIssue {
  type: "error" | "warning"
  message: string
  components: ComponentCategory[]
}

// Utility Functions
const checkCompatibility = (
  component: Component,
  category: ComponentCategory,
  currentBuild: PCBuild,
): { compatible: boolean; issues: CompatibilityIssue[] } => {
  const issues: CompatibilityIssue[] = []

  // Verificar compatibilidad de socket entre CPU y Motherboard
  if (category === "cpu" && currentBuild.motherboard) {
    const cpuSocket = component.compatibility?.socket
    const mbSocket = currentBuild.motherboard.compatibility?.socket

    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      issues.push({
        type: "error",
        message: `Socket incompatible: CPU requiere ${cpuSocket}, Motherboard tiene ${mbSocket}`,
        components: ["cpu", "motherboard"],
      })
    }
  }

  if (category === "motherboard" && currentBuild.cpu) {
    const cpuSocket = currentBuild.cpu.compatibility?.socket
    const mbSocket = component.compatibility?.socket

    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      issues.push({
        type: "error",
        message: `Socket incompatible: CPU requiere ${cpuSocket}, Motherboard tiene ${mbSocket}`,
        components: ["cpu", "motherboard"],
      })
    }
  }

  // Verificar compatibilidad de RAM con Motherboard
  if (category === "ram" && currentBuild.motherboard) {
    const ramSpeed = component.compatibility?.maxMemorySpeed
    const mbMaxSpeed = currentBuild.motherboard.compatibility?.maxMemorySpeed

    if (ramSpeed && mbMaxSpeed && ramSpeed > mbMaxSpeed) {
      issues.push({
        type: "warning",
        message: `La RAM funcionará a ${mbMaxSpeed}MHz en lugar de ${ramSpeed}MHz`,
        components: ["ram", "motherboard"],
      })
    }
  }

  // Verificar potencia de la PSU
  if (category === "psu") {
    const totalPowerRequired = calculateTotalPowerRequirement(currentBuild, component)
    const psuPower = component.compatibility?.powerRequirement || 0

    if (totalPowerRequired > psuPower * 0.8) {
      issues.push({
        type: "warning",
        message: `PSU podría ser insuficiente. Requerido: ~${totalPowerRequired}W, Disponible: ${psuPower}W`,
        components: ["psu"],
      })
    }
  }

  return {
    compatible: issues.filter((issue) => issue.type === "error").length === 0,
    issues,
  }
}

const calculateTotalPowerRequirement = (build: PCBuild, newComponent?: Component): number => {
  let total = 0

  if (build.cpu) total += build.cpu.compatibility?.powerRequirement || 0
  if (build.gpu) total += build.gpu.compatibility?.powerRequirement || 0
  total += 50 // RAM, storage, fans, etc.

  if (newComponent && newComponent.compatibility?.powerRequirement) {
    const isPSU = "powerRequirement" in (newComponent.compatibility || {})
    if (!isPSU) {
      total += newComponent.compatibility.powerRequirement
    }
  }

  return total
}

// Main Component
const PCConfigurator = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Configurador PC';
  }, []);

  const initialBuild: PCBuild = {
    cpu: null,
    gpu: null,
    ram: null,
    motherboard: null,
    psu: null,
    case: null,
    storage: null,
    cooler: null,
    totalPrice: 0,
  }

  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory>("cpu")
  const [currentBuild, setCurrentBuild] = useState<PCBuild>(initialBuild)
  const [searchTerm, setSearchTerm] = useState("")
  const [brandFilter, setBrandFilter] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Estado para CPUs desde la base de datos
  const [cpus, setCpus] = useState<Component[]>([]);
  const [loadingCpus, setLoadingCpus] = useState(false);
  const [errorCpus, setErrorCpus] = useState<string | null>(null);

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const componentsPerPage = 4;

  useEffect(() => {
    const fetchCpus = async () => {
      setLoadingCpus(true);
      setErrorCpus(null);
      try {
        const res = await fetch("/api/cpus");
        if (!res.ok) throw new Error("Error al obtener CPUs");
        const data = await res.json();
        // Mapear los datos de la API al formato Component
        const cpus: Component[] = data.map((cpu: any) => ({
          id: cpu.id,
          name: cpu.name,
          brand: cpu.manufacturer || "",
          price: cpu.best_price !== undefined && cpu.best_price !== null ? cpu.best_price : (cpu.raw_data?.price || cpu.tdp || 0), 
          best_price: cpu.best_price !== undefined && cpu.best_price !== null ? cpu.best_price : undefined,
          image: `/api/images/CPU_IMG/${encodeURIComponent(cpu.name)}.jpg`,
          specs: {
            Núcleos: cpu.cores_total?.toString() || "-",
            Hilos: cpu.cores_threads?.toString() || "-",
            "Frecuencia Base": cpu.clock_base ? `${cpu.clock_base} GHz` : "-",
            Socket: cpu.socket || "-",
            TDP: cpu.tdp ? `${cpu.tdp}W` : "-",
          },
          compatibility: {
            socket: cpu.socket,
            powerRequirement: cpu.tdp || undefined,
          },
        }));
        setCpus(cpus);
      } catch (err: any) {
        setErrorCpus(err.message);
      } finally {
        setLoadingCpus(false);
      }
    };

    fetchCpus();
  }, []);

  const updateComponent = (category: ComponentCategory, component: Component | null) => {
    const newBuild = { ...currentBuild, [category]: component }

    // Usar best_price si existe, sino price
    const totalPrice = Object.values(newBuild)
      .filter((comp): comp is Component => comp !== null && typeof comp === "object")
      .reduce((sum, comp) => sum + (comp.best_price !== undefined ? comp.best_price : comp.price), 0)

    newBuild.totalPrice = totalPrice
    setCurrentBuild(newBuild)
  }

  const clearBuild = () => {
    setCurrentBuild(initialBuild)
  }

  const saveBuild = () => {
    console.log("Guardando configuración:", currentBuild)
  }

  const shareBuild = () => {
    console.log("Compartiendo configuración:", currentBuild)
  }

  // Solo mostrar CPUs reales si la categoría es cpu
  const components = useMemo(() => {
    if (selectedCategory === "cpu") return cpus;
    return [];
  }, [selectedCategory, cpus])

  const filteredComponents = useMemo(() => {
    return components.filter((component) => {
      const matchesSearch =
        component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.brand.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesBrand = brandFilter.length === 0 || brandFilter.includes(component.brand)

      return matchesSearch && matchesBrand
    })
  }, [components, searchTerm, brandFilter])

  // Calcular paginación
  const totalPages = Math.ceil(filteredComponents.length / componentsPerPage);
  const paginatedComponents = useMemo(() => {
    const start = (currentPage - 1) * componentsPerPage;
    return filteredComponents.slice(start, start + componentsPerPage);
  }, [filteredComponents, currentPage]);

  const brands = useMemo(() => {
    return [...new Set(components.map((c) => c.brand))]
  }, [components])

  const selectedComponents = Object.entries(currentBuild)
    .filter(([key, component]) => key !== "totalPrice" && component !== null)
    .map(([category, component]) => ({
      category: category as ComponentCategory,
      component: component!,
    }))

  const hasComponents = Object.values(currentBuild).some(
    (component) => component !== null && typeof component === "object",
  )

  // Volver arriba al cambiar de página SOLO si hay paginación
  useEffect(() => {
    if (totalPages > 1) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [currentPage, totalPages]);

  return (
    <ProtectedRoute>
      <div className="pc-configurator-app-wrapper">
        <div className="pc-configurator-main-layout-container">
          {/* Sidebar */}
          <aside
            className={`pc-configurator-navigation-sidebar ${sidebarOpen ? "pc-configurator-sidebar-expanded" : "pc-configurator-sidebar-collapsed"}`}
          >
            <div className="pc-configurator-sidebar-content-wrapper">
              <div className="pc-configurator-sidebar-header-section">
                <h2>Configurador PC</h2>
              </div>

              <nav className="pc-configurator-sidebar-navigation-menu">
                {categories.map((category) => {
                  const isSelected = selectedCategory === category.id
                  const hasComponent = currentBuild[category.id] !== null
                  const Icon = category.icon

                  return (
                    <button
                      key={category.id}
                      className={`pc-configurator-nav-menu-item ${isSelected ? "pc-configurator-nav-item-selected" : ""}`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <Icon />
                      <span className="pc-configurator-nav-item-label">{category.name}</span>
                      {hasComponent && <span className="pc-configurator-nav-item-status-badge">✓</span>}
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>

          <div className="pc-configurator-content-area-wrapper">
            {/* Main Content */}
            <main className="pc-configurator-main-content-section">
              <div className="pc-configurator-component-selector-container">
                <div className="pc-configurator-selector-header-section">
                  <h2>{categoryNames[selectedCategory]}</h2>
                  <p>Selecciona el componente que mejor se adapte a tus necesidades</p>
                </div>

                {/* Filters */}
                <div className="pc-configurator-filters-container">
                  <div className="pc-configurator-search-input-container">
                    <SearchIcon />
                    <input
                      type="text"
                      placeholder="Buscar componentes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pc-configurator-search-text-input"
                    />
                  </div>

                  <div className="pc-configurator-brand-filters-wrapper">
                    {brands.map((brand) => (
                      <button
                        key={brand}
                        className={`pc-configurator-filter-brand-btn ${brandFilter.includes(brand) ? "pc-configurator-filter-btn-selected" : ""}`}
                        onClick={() => {
                          setBrandFilter((prev) =>
                            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
                          )
                        }}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Components List */}
                <div className="pc-configurator-components-list-container">
                  {loadingCpus && (
                    <div className="pc-configurator-loading-message">Cargando procesadores...</div>
                  )}
                  {errorCpus && (
                    <div className="pc-configurator-error-message">{errorCpus}</div>
                  )}
                  {!loadingCpus && !errorCpus && paginatedComponents.length === 0 && (
                    <div className="pc-configurator-no-results-container">
                      <p>No se encontraron procesadores en la base de datos.</p>
                      <button
                        className="pc-configurator-btn pc-configurator-btn-outline"
                        onClick={() => {
                          setSearchTerm("");
                          setBrandFilter([]);
                        }}
                      >
                        Limpiar filtros
                      </button>
                    </div>
                  )}
                  {!loadingCpus && !errorCpus && paginatedComponents.map((component) => {
                    const isSelected = currentBuild[selectedCategory]?.id === component.id;
                    const compatibility = checkCompatibility(component, selectedCategory, currentBuild);
                    // Obtener el mejor precio si existe
                    const bestPrice = component.best_price !== undefined ? component.best_price : component.price;
                    return (
                      <div
                        key={component.id}
                        className={`pc-configurator-component-card ${isSelected ? "pc-configurator-component-card-selected" : ""} ${
                          compatibility.issues.length > 0 ? "pc-configurator-component-card-warning" : ""
                        }`}
                        onClick={() => updateComponent(selectedCategory, isSelected ? null : component)}
                      >
                        <div className="pc-configurator-component-card-content">
                          <img
                            src={component.image || "/placeholder.svg"}
                            alt={component.name}
                            className="pc-configurator-component-thumbnail-image"
                          />
                          <div className="pc-configurator-component-info-section">
                            <div className="pc-configurator-component-header-row">
                              <div>
                                <h3 className="pc-configurator-component-name-title">{component.name}</h3>
                                <p className="pc-configurator-component-brand-label">{component.brand}</p>
                              </div>
                              <div className="pc-configurator-component-price-section">
                                <p className="pc-configurator-component-price-amount">
                                  ${bestPrice.toLocaleString()} {component.best_price !== undefined}
                                </p>
                                {isSelected && (
                                  <span className="pc-configurator-selected-status-badge">Seleccionado</span>
                                )}
                              </div>
                            </div>
                            <div className="pc-configurator-component-specs-list">
                              {Object.entries(component.specs)
                                .slice(0, 3)
                                .map(([key, value]) => (
                                  <span key={key} className="pc-configurator-spec-info-badge">
                                    {key}: {value}
                                  </span>
                                ))}
                            </div>
                            {compatibility.issues.length > 0 && (
                              <div className="pc-configurator-compatibility-issues-container">
                                {compatibility.issues.map((issue, index) => (
                                  <div
                                    key={index}
                                    className={`pc-configurator-compatibility-issue-alert ${issue.type === "error" ? "pc-configurator-issue-error-type" : "pc-configurator-issue-warning-type"}`}
                                  >
                                    {issue.message}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {/* Paginación */}
                  {!loadingCpus && !errorCpus && totalPages > 1 && (
                    <div className="pc-configurator-pagination-container">
                      <button
                        className="pc-configurator-pagination-btn"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Anterior
                      </button>
                      <span className="pc-configurator-pagination-info">
                        Página {currentPage} de {totalPages}
                      </span>
                      <button
                        className="pc-configurator-pagination-btn"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Siguiente
                      </button>
                    </div>
                  )}
                </div>

                {filteredComponents.length === 0 && (
                  <div className="pc-configurator-no-results-container">
                    <p>No se encontraron componentes que coincidan con los filtros</p>
                    <button
                      className="pc-configurator-btn pc-configurator-btn-outline"
                      onClick={() => {
                        setSearchTerm("")
                        setBrandFilter([])
                      }}
                    >
                      Limpiar filtros
                    </button>
                  </div>
                )}
              </div>
            </main>

            {/* Right Panel */}
            <aside className="pc-configurator-right-panel-sidebar">
              {/* Build Summary */}
              <div className="pc-configurator-build-summary-section">
                <div className="pc-configurator-summary-header-wrapper">
                  <h3>Resumen de Build</h3>
                  <div className="pc-configurator-summary-stats-display">
                    <p>{selectedComponents.length} de 8 componentes</p>
                    <div className="pc-configurator-total-price-display">
                      <p className="pc-configurator-price-amount-large">${currentBuild.totalPrice.toLocaleString()}</p>
                      <p className="pc-configurator-price-label-text">Total</p>
                    </div>
                  </div>
                </div>

                <div className="pc-configurator-summary-components-list">
                  {Object.entries(categoryNames).map(([category, name]) => {
                    const component = currentBuild[category as ComponentCategory]

                    return (
                      <div key={category} className="pc-configurator-summary-item-wrapper">
                        <div className="pc-configurator-summary-item-header-row">
                          <h4>{name}</h4>
                          {component && (
                            <div className="pc-configurator-summary-actions-group">
                              <button
                                className="pc-configurator-action-btn-small"
                                onClick={() => setSelectedCategory(category as ComponentCategory)}
                              >
                                <EditIcon />
                              </button>
                              <button
                                className="pc-configurator-action-btn-small pc-configurator-action-btn-danger"
                                onClick={() => updateComponent(category as ComponentCategory, null)}
                              >
                                <XIcon />
                              </button>
                            </div>
                          )}
                        </div>

                        {component ? (
                          <div className="pc-configurator-summary-component-details">
                            <p className="pc-configurator-component-name-text">{component.name}</p>
                            <div className="pc-configurator-component-details-row">
                              <p className="pc-configurator-component-brand-text">{component.brand}</p>
                              <p className="pc-configurator-component-price-text">
                                ${ (component.best_price !== undefined ? component.best_price : component.price).toLocaleString() }
                                {component.best_price !== undefined && <span style={{fontSize: '0.85em', color: '#28a745', marginLeft: 4}}>(Best Price)</span>}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="pc-configurator-summary-empty-state"
                            onClick={() => setSelectedCategory(category as ComponentCategory)}
                          >
                            Seleccionar {name.toLowerCase()}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {selectedComponents.length > 0 && (
                  <div className="pc-configurator-summary-total-section">
                    <div className="pc-configurator-total-breakdown-list">
                      <div className="pc-configurator-total-line-item">
                        <span>Subtotal:</span>
                        <span>${currentBuild.totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="pc-configurator-total-line-item">
                        <span>Envío estimado:</span>
                        <span>$50</span>
                      </div>
                      <div className="pc-configurator-total-line-item pc-configurator-total-final-amount">
                        <span>Total:</span>
                        <span>${(currentBuild.totalPrice + 50).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Build Preview */}
              <div className="pc-configurator-build-preview-section">
                <h3>Vista Previa</h3>

                <div className="pc-configurator-preview-card-container">
                  <div className="pc-configurator-preview-image-wrapper">
                    <img src="/placeholder.svg?height=200&width=200" alt="PC Build Preview" />
                  </div>

                  <div className="pc-configurator-preview-info-section">
                    <p className="pc-configurator-preview-title-text">
                      {hasComponents ? "Tu Build Personalizada" : "Build Vacía"}
                    </p>
                    <p className="pc-configurator-preview-subtitle-text">
                      {hasComponents
                        ? `${Object.values(currentBuild).filter((c) => c !== null && typeof c === "object").length} componentes seleccionados`
                        : "Comienza seleccionando componentes"}
                    </p>
                  </div>
                </div>

                <div className="pc-configurator-preview-actions-container">
                  {hasComponents && (
                    <button className="pc-configurator-btn pc-configurator-btn-success pc-configurator-btn-full-width">
                      Agregar al Carrito
                    </button>
                  )}

                  <div className="pc-configurator-action-buttons-grid">
                    <button
                      className="pc-configurator-btn pc-configurator-btn-outline"
                      onClick={saveBuild}
                      disabled={!user || !hasComponents}
                    >
                      <SaveIcon />
                      Guardar
                    </button>

                    <button
                      className="pc-configurator-btn pc-configurator-btn-outline"
                      onClick={shareBuild}
                      disabled={!hasComponents}
                    >
                      <ShareIcon />
                      Compartir
                    </button>
                  </div>

                  {hasComponents && (
                    <button
                      className="pc-configurator-btn pc-configurator-btn-danger pc-configurator-btn-full-width"
                      onClick={clearBuild}
                    >
                      <TrashIcon />
                      Limpiar Build
                    </button>
                  )}
                </div>

                {!user && (
                  <div className="pc-configurator-auth-notice-container">
                    <p>Inicia sesión para guardar tus configuraciones</p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default PCConfigurator;
