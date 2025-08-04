"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
// import { useAuth } from '../context/AuthContext';
// import ProtectedRoute from '@/components/ProtectedRoute';
import './products.css';

// RAM Memory Icon
const RamIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <rect x="2" y="8" width="20" height="10" rx="1" />
    <rect x="5" y="11" width="2" height="4" />
    <rect x="8.5" y="11" width="2" height="4" />
    <rect x="12" y="11" width="2" height="4" />
    <rect x="15.5" y="11" width="2" height="4" />
    <path d="M5 8V6M8.5 8V6M12 8V6M15.5 8V6M19 8V6" />
    <path d="M2 18h20" />
  </svg>
)

// CPU/Processor Icon
const CpuIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <rect x="6" y="6" width="12" height="12" rx="1" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 2v4M12 2v4M15 2v4" />
    <path d="M9 18v4M12 18v4M15 18v4" />
    <path d="M2 9h4M2 12h4M2 15h4" />
    <path d="M18 9h4M18 12h4M18 15h4" />
  </svg>
)

// GPU/Graphics Card Icon
const GpuIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <rect x="2" y="8" width="19" height="10" rx="1" />
    <rect x="1" y="8" width="1" height="10" />
    <rect x="1" y="10" width="1" height="1.5" />
    <rect x="1" y="12.5" width="1" height="1.5" />
    <rect x="1" y="15" width="1" height="1.5" />
    <circle cx="7" r="2" cy="12" />
    <circle cx="12" r="2" cy="12" />
    <path d="M6 11h2M11 11h2" />
    <path d="M6 13h2M11 13h2" />
    <rect x="16" y="10" width="3" height="4" rx="0.5" />
    <path d="M21 16v2h-3" />
  </svg>
)

// Motherboard Icon
const MotherboardIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <rect x="2" y="2" width="20" height="20" rx="1" />
    <rect x="4" y="4" width="6" height="6" rx="0.5" />
    <rect x="5" y="12" width="1" height="4" />
    <rect x="7" y="12" width="1" height="4" />
    <rect x="9" y="12" width="1" height="4" />
    <rect x="12" y="4" width="8" height="2" />
    <rect x="12" y="7" width="8" height="2" />
    <rect x="12" y="10" width="4" height="2" />
    <circle cx="14" cy="15" r="1" />
    <circle cx="17" cy="15" r="1" />
    <circle cx="19" cy="18" r="1" />
    <rect x="4" y="18" width="6" height="2" />
  </svg>
)

// M.2 SSD Icon
const M2SsdIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <rect x="4" y="10" width="16" height="4" rx="1" transform="rotate(25 12 12)" />
    <rect x="6" y="11.2" width="2" height="1.6" rx="0.2" transform="rotate(25 12 12)" />
    <rect x="9" y="11.2" width="2" height="1.6" rx="0.2" transform="rotate(25 12 12)" />
    <rect x="12" y="11.2" width="2" height="1.6" rx="0.2" transform="rotate(25 12 12)" />
    <rect x="15" y="11.2" width="2" height="1.6" rx="0.2" transform="rotate(25 12 12)" />
    <path d="M8 7l2 2M16 15l2 2" transform="rotate(25 12 12)" />
  </svg>
)

// Power Supply (PSU) Icon
const PsuIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <rect x="2" y="6" width="20" height="14" rx="1" />
    <circle cx="18" cy="13" r="4" />
    <circle cx="18" cy="13" r="1.5" />
    <circle cx="6" cy="10" r="1" />
    <circle cx="10" cy="10" r="1" />
    <rect x="4" y="16" width="8" height="2" rx="0.5" />
    <path d="M18 9v8M15 10l6 6M21 10l-6 6" />
  </svg>
)

// Case/Tower Icon
const CaseIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <rect x="6" y="2" width="12" height="20" rx="1" />
    <circle cx="12" cy="6" r="1" />
    <rect x="8" y="9" width="8" height="6" rx="0.5" />
    <circle cx="10" cy="12" r="1.5" />
    <circle cx="14" cy="12" r="1.5" />
    <path d="M9 11h2M13 11h2" />
    <path d="M9 13h2M13 13h2" />
    <rect x="8" y="17" width="8" height="2" />
    <path d="M20 12h2M20 10h1M20 14h1" />
  </svg>
)

// Fan/Cooling Icon
const FanIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <rect x="2" y="2" width="20" height="20" rx="1" />
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 4v4M20 12h-4M12 20v-4M4 12h4" />
    <path d="M17.66 6.34l-2.83 2.83M17.66 17.66l-2.83-2.83M6.34 17.66l2.83-2.83M6.34 6.34l2.83 2.83" />
    <circle cx="4" cy="4" r="1" />
    <circle cx="20" cy="4" r="1" />
    <circle cx="4" cy="20" r="1" />
    <circle cx="20" cy="20" r="1" />
  </svg>
)

const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

// Tipos para los componentes

// Tipos extendidos para incluir best_price_url
type CPU = {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  rating: number;
  cores: string;
  frequency: string;
  best_price_url?: string;
};

type GPU = {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  rating: number;
  memory: string;
  performance: string;
  best_price_url?: string;
};

type RAM = {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  rating: number;
  capacity: string;
  speed: string;
  best_price_url?: string;
};

type Storage = {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  rating: number;
  capacity: string;
  type: string;
  best_price_url?: string;
};

type Motherboard = { id: string; name: string; brand: string; price: number; image: string; rating: number; socket?: string; formFactor?: string; best_price_url?: string };
type PSU = { id: string; name: string; brand: string; price: number; image: string; rating: number; wattage?: number; best_price_url?: string };
type Case = { id: string; name: string; brand: string; price: number; image: string; rating: number; formFactor?: string; best_price_url?: string };
type Cooler = { id: string; name: string; brand: string; price: number; image: string; rating: number; type?: string; best_price_url?: string };

type ComponentType = CPU | GPU | RAM | Storage | Motherboard | PSU | Case | Cooler;


type CategoryId = 'procesadores' | 'tarjetas_graficas' | 'memoria_ram' | 'almacenamiento' | 'placas_base' | 'fuentes_poder' | 'gabinetes' | 'refrigeracion';
interface Category {
  id: CategoryId;
  name: string;
  icon: React.ComponentType;
}

const categories: Category[] = [
  { id: "procesadores", name: "Procesadores", icon: CpuIcon },
  { id: "tarjetas_graficas", name: "Tarjetas Gráficas", icon: GpuIcon },
  { id: "memoria_ram", name: "Memoria RAM", icon: RamIcon },
  { id: "almacenamiento", name: "Almacenamiento", icon: M2SsdIcon },
  { id: "placas_base", name: "Placas Base", icon: MotherboardIcon },
  { id: "fuentes_poder", name: "Fuentes de Poder", icon: PsuIcon },
  { id: "gabinetes", name: "Gabinetes", icon: CaseIcon },
  { id: "refrigeracion", name: "Refrigeración", icon: FanIcon }
];

interface ComponentCarouselProps {
  category: Category;
  components: ComponentType[];
}

const ComponentCarousel: React.FC<ComponentCarouselProps> = ({ category, components }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const itemsPerView = 4;
  const maxIndex = Math.max(0, components.length - itemsPerView);

  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, isPaused, maxIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  const handleMouseEnter = () => {
    setIsPaused(true);
  };
  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const Icon = category.icon;

  return (
    <div className="carousel-section" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="carousel-header">
        <div className="carousel-title">
          <Icon />
          <h2>{category.name}</h2>
          <span className="component-count">{components.length} Productos</span>
        </div>
        <div className="carousel-controls">
          <button className="control-btn" onClick={togglePlayPause}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="control-btn" onClick={prevSlide}>
            <ChevronLeftIcon />
          </button>
          <button className="control-btn" onClick={nextSlide}>
            <ChevronRightIcon />
          </button>
          <button
            className="see-all-btn"
            onClick={() => {
              // Mapeo de categoría a ruta
              const categoryToRoute: Record<string, string> = {
                procesadores: "/products/cpu",
                tarjetas_graficas: "/products/gpu",
                memoria_ram: "/products/ram",
                almacenamiento: "/products/storage",
                placas_base: "/products/motherboard",
                fuentes_poder: "/products/psu",
                gabinetes: "/products/case",
                refrigeracion: "/products/cpu_cooler",
              };
              const route = categoryToRoute[category.id] || "/products";
              window.location.href = route;
            }}
          >
            Ver Todo
          </button>
        </div>
      </div>

      <div className="carousel-container">
        <div 
          className="carousel-track"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {components.map((component: ComponentType) => (
            <div key={component.id} className="component-card">
              <div className="component-image">
                <Image src={component.image} alt={component.name} width={200} height={150} style={{objectFit: 'cover'}} />
              </div>
              <div className="component-info">
                <h3 className="component-name">{component.name}</h3>
                <p className="component-brand">{'brand' in component ? component.brand : ''}</p>
                <div className="component-specs">
                  {'cores' in component && <span className="spec-badge">Núcleos: {(component as CPU).cores}</span>}
                  {'frequency' in component && <span className="spec-badge">Frecuencia: {(component as CPU).frequency}</span>}
                  {'memory' in component && <span className="spec-badge">Memoria: {(component as GPU).memory}</span>}
                  {'performance' in component && <span className="spec-badge">{(component as GPU).performance}</span>}
                  {'capacity' in component && <span className="spec-badge">Capacidad: {(component as RAM | Storage).capacity}</span>}
                  {'speed' in component && <span className="spec-badge">Velocidad: {(component as RAM).speed}</span>}
                  {'type' in component && <span className="spec-badge">Tipo: {(component as Storage).type}</span>}
                </div>
                <div className="component-price">
                  <span className="price-amount">${component.price.toLocaleString()}</span>
                  {/* Botón de compra con logo del vendedor si existe best_price_url */}
                  {component.best_price_url && (
                    <a
                      href={component.best_price_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="buy-btn"
                      style={{ display: 'inline-flex', alignItems: 'center', marginTop: 8 }}
                    >
                      {/* Detectar dominio y mostrar logo correspondiente */}
                      {(() => {
                        const url = component.best_price_url || '';
                        if (url.includes('amazon.')) {
                          return (
                            <img src="/Amazon_logo.svg" alt="Amazon" width={32} height={32} style={{objectFit:'contain'}} />
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
            </div>
          ))}
        </div>
      </div>

      <div className="carousel-indicators">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};


const ComponentsPage = () => {
  // const { user } = useAuth();
  const [cpus, setCpus] = React.useState<CPU[]>([]);
  const [gpus, setGpus] = React.useState<GPU[]>([]);
  const [rams, setRams] = React.useState<RAM[]>([]);
  const [storages, setStorages] = React.useState<Storage[]>([]);
  const [motherboards, setMotherboards] = React.useState<Motherboard[]>([]);
  const [psus, setPsus] = React.useState<PSU[]>([]);
  const [cases, setCases] = React.useState<Case[]>([]);
  const [coolers, setCoolers] = React.useState<Cooler[]>([]);

  const [loadingCpus, setLoadingCpus] = React.useState(false);
  const [errorCpus, setErrorCpus] = React.useState<string | null>(null);
  const [loadingGpus, setLoadingGpus] = React.useState(false);
  const [errorGpus, setErrorGpus] = React.useState<string | null>(null);
  const [loadingRams, setLoadingRams] = React.useState(false);
  const [errorRams, setErrorRams] = React.useState<string | null>(null);
  const [loadingStorages, setLoadingStorages] = React.useState(false);
  const [errorStorages, setErrorStorages] = React.useState<string | null>(null);
  const [loadingMotherboards, setLoadingMotherboards] = React.useState(false);
  const [errorMotherboards, setErrorMotherboards] = React.useState<string | null>(null);
  const [loadingPsus, setLoadingPsus] = React.useState(false);
  const [errorPsus, setErrorPsus] = React.useState<string | null>(null);
  const [loadingCases, setLoadingCases] = React.useState(false);
  const [errorCases, setErrorCases] = React.useState<string | null>(null);
  const [loadingCoolers, setLoadingCoolers] = React.useState(false);
  const [errorCoolers, setErrorCoolers] = React.useState<string | null>(null);

  useEffect(() => {
    document.title = 'Productos - PC Forge';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    // CPUs
    setLoadingCpus(true);
    fetch(`${apiUrl}/api/cpus`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        const cpus: CPU[] = data.map((cpu: any) => ({
          id: cpu.id,
          name: cpu.name,
          brand: cpu.manufacturer || "",
          price: cpu.best_price !== undefined && cpu.best_price !== null ? cpu.best_price : (cpu.raw_data?.price || cpu.tdp || 0),
          image: `${apiUrl}/images/CPU_IMG/${encodeURIComponent(cpu.name)}.jpg`,
          rating: cpu.rating || 4.5,
          cores: cpu.cores_total?.toString() || "-",
          frequency: cpu.clock_base ? `${cpu.clock_base} GHz` : "-",
          best_price_url: cpu.best_price_url || "",
        }));
        setCpus(cpus);
      })
      .catch(() => setErrorCpus('Error al obtener CPUs'))
      .finally(() => setLoadingCpus(false));

    // GPUs
    setLoadingGpus(true);
    fetch(`${apiUrl}/api/gpus`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        const gpus: GPU[] = data.map((gpu: any) => ({
          id: gpu.id,
          name: gpu.name,
          brand: gpu.manufacturer || "",
          price: gpu.best_price !== undefined && gpu.best_price !== null ? gpu.best_price : (gpu.raw_data?.price || gpu.tdp || 0),
          image: `${apiUrl}/images/GPU_IMG/${encodeURIComponent(gpu.name)}.jpg`,
          rating: gpu.rating || 4.5,
          memory: gpu.memory || "-",
          performance: gpu.performance || "-",
          best_price_url: gpu.best_price_url || "",
        }));
        setGpus(gpus);
      })
      .catch(() => setErrorGpus('Error al obtener GPUs'))
      .finally(() => setLoadingGpus(false));

    // RAMs
    setLoadingRams(true);
    fetch(`${apiUrl}/api/rams`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        const rams: RAM[] = data.map((ram: any) => ({
          id: ram.id,
          name: ram.name,
          brand: ram.manufacturer || "",
          price: ram.best_price !== undefined && ram.best_price !== null ? ram.best_price : (ram.raw_data?.price || ram.tdp || 0),
          image: `${apiUrl}/images/RAM_IMG/${encodeURIComponent(ram.name)}.jpg`,
          rating: ram.rating || 4.5,
          capacity: ram.capacity || "-",
          speed: ram.maxMemorySpeed ? `${ram.maxMemorySpeed} MHz` : "-",
          best_price_url: ram.best_price_url || "",
        }));
        setRams(rams);
      })
      .catch(() => setErrorRams('Error al obtener RAMs'))
      .finally(() => setLoadingRams(false));

    // Storages
    setLoadingStorages(true);
    fetch(`${apiUrl}/api/storages`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        const storages: Storage[] = data.map((storage: any) => ({
          id: storage.id,
          name: storage.name,
          brand: storage.manufacturer || "",
          price: storage.best_price !== undefined && storage.best_price !== null ? storage.best_price : (storage.raw_data?.price || storage.tdp || 0),
          image: `${apiUrl}/images/STORAGE_IMG/${encodeURIComponent(storage.name)}.jpg`,
          rating: storage.rating || 4.5,
          capacity: storage.capacity || "-",
          type: storage.type || "-",
          best_price_url: storage.best_price_url || "",
        }));
        setStorages(storages);
      })
      .catch(() => setErrorStorages('Error al obtener almacenamiento'))
      .finally(() => setLoadingStorages(false));

    // Motherboards
    setLoadingMotherboards(true);
    fetch(`${apiUrl}/api/motherboards`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        const motherboards: Motherboard[] = data.map((mb: any) => ({
          id: mb.id,
          name: mb.name,
          brand: mb.manufacturer || "",
          price: mb.best_price !== undefined && mb.best_price !== null ? mb.best_price : (mb.raw_data?.price || mb.tdp || 0),
          image: `${apiUrl}/images/MOTHERBOARD_IMG/${encodeURIComponent(mb.name)}.jpg`,
          rating: mb.rating || 4.5,
          socket: mb.socket || "-",
          formFactor: mb.formFactor || "-",
          best_price_url: mb.best_price_url ? mb.best_price_url : undefined,
        }));
        setMotherboards(motherboards);
      })
      .catch(() => setErrorMotherboards('Error al obtener placas base'))
      .finally(() => setLoadingMotherboards(false));

    // PSUs
    setLoadingPsus(true);
    fetch(`${apiUrl}/api/psus`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        const psus: PSU[] = data.map((psu: any) => ({
          id: psu.id,
          name: psu.name,
          brand: psu.manufacturer || "",
          price: psu.best_price !== undefined && psu.best_price !== null ? psu.best_price : (psu.raw_data?.price || psu.tdp || 0),
          image: `${apiUrl}/images/PSU_IMG/${encodeURIComponent(psu.name)}.jpg`,
          rating: psu.rating || 4.5,
          wattage: psu.wattage || psu.tdp || 0,
          best_price_url: psu.best_price_url ? psu.best_price_url : undefined,
        }));
        setPsus(psus);
      })
      .catch(() => setErrorPsus('Error al obtener fuentes de poder'))
      .finally(() => setLoadingPsus(false));

    // Cases
    setLoadingCases(true);
    fetch(`${apiUrl}/api/cases`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        const cases: Case[] = data.map((c: any) => ({
          id: c.id,
          name: c.name,
          brand: c.manufacturer || "",
          price: c.best_price !== undefined && c.best_price !== null ? c.best_price : (c.raw_data?.price || c.tdp || 0),
          image: `${apiUrl}/images/PC_CASE_IMG/${encodeURIComponent(c.name)}.jpg`,
          rating: c.rating || 4.5,
          formFactor: c.formFactor || "-",
          best_price_url: c.best_price_url ? c.best_price_url : undefined,
        }));
        setCases(cases);
      })
      .catch(() => setErrorCases('Error al obtener gabinetes'))
      .finally(() => setLoadingCases(false));

    // Coolers
    setLoadingCoolers(true);
    fetch(`${apiUrl}/api/coolers`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        const coolers: Cooler[] = data.map((cooler: any) => ({
          id: cooler.id,
          name: cooler.name,
          brand: cooler.manufacturer || "",
          price: cooler.best_price !== undefined && cooler.best_price !== null ? cooler.best_price : (cooler.raw_data?.price || cooler.tdp || 0),
          image: `${apiUrl}/images/CPU_COOLER_IMG/${encodeURIComponent(cooler.name)}.jpg`,
          rating: cooler.rating || 4.5,
          type: cooler.type || "-",
          best_price_url: cooler.best_price_url ? cooler.best_price_url : undefined,
        }));
        setCoolers(coolers);
      })
      .catch(() => setErrorCoolers('Error al obtener refrigeración'))
      .finally(() => setLoadingCoolers(false));
  }, []);

  return (

      <div className="components-page">
        <div className="page-header">
          <h1>Productos</h1>
          <p>Descubre los mejores productos para tu Set Up  </p>
        </div>

        <div className="carousels-container">
          {/* Procesadores */}
          <ComponentCarousel
            key="procesadores"
            category={categories.find(c => c.id === "procesadores")!}
            components={cpus}
          />
          {/* Tarjetas Gráficas */}
          <ComponentCarousel
            key="tarjetas_graficas"
            category={categories.find(c => c.id === "tarjetas_graficas")!}
            components={gpus}
          />
          {/* Memoria RAM */}
          <ComponentCarousel
            key="memoria_ram"
            category={categories.find(c => c.id === "memoria_ram")!}
            components={rams}
          />
          {/* Almacenamiento */}
          <ComponentCarousel
            key="almacenamiento"
            category={categories.find(c => c.id === "almacenamiento")!}
            components={storages}
          />
          {/* Placas Base */}
          <ComponentCarousel
            key="placas_base"
            category={categories.find(c => c.id === "placas_base")!}
            components={motherboards}
          />
          {/* Fuentes de Poder */}
          <ComponentCarousel
            key="fuentes_poder"
            category={categories.find(c => c.id === "fuentes_poder")!}
            components={psus}
          />
          {/* Gabinetes */}
          <ComponentCarousel
            key="gabinetes"
            category={categories.find(c => c.id === "gabinetes")!}
            components={cases}
          />
          {/* Refrigeración */}
          <ComponentCarousel
            key="refrigeracion"
            category={categories.find(c => c.id === "refrigeracion")!}
            components={coolers}
          />
        </div>
      </div>
  );
};

export default ComponentsPage;
