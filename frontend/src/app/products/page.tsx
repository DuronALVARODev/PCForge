"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import './products.css';

// Icons
const CpuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
  </svg>
);

const GpuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const RamIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
);

const StorageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
  </svg>
);

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
type CPU = { id: number; name: string; brand: string; price: number; image: string; rating: number; cores: string; frequency: string };
type GPU = { id: number; name: string; brand: string; price: number; image: string; rating: number; memory: string; performance: string };
type RAM = { id: number; name: string; brand: string; price: number; image: string; rating: number; capacity: string; speed: string };
type Storage = { id: number; name: string; brand: string; price: number; image: string; rating: number; capacity: string; type: string };

type ComponentType = CPU | GPU | RAM | Storage;




// Mantener los mocks de las otras categorías
const mockComponents = {
  tarjetas_graficas: [
    { id: 1, name: "RTX 4090", brand: "NVIDIA", price: 35000, image: "/api/placeholder/300/200", rating: 4.9, memory: "24GB GDDR6X", performance: "4K Gaming" },
    { id: 2, name: "RTX 4080", brand: "NVIDIA", price: 25000, image: "/api/placeholder/300/200", rating: 4.8, memory: "16GB GDDR6X", performance: "4K Gaming" },
    { id: 3, name: "RTX 4070 Ti", brand: "NVIDIA", price: 18000, image: "/api/placeholder/300/200", rating: 4.7, memory: "12GB GDDR6X", performance: "1440p Gaming" },
    { id: 4, name: "RX 7900 XTX", brand: "AMD", price: 22000, image: "/api/placeholder/300/200", rating: 4.6, memory: "24GB GDDR6", performance: "4K Gaming" },
    { id: 5, name: "RTX 4060 Ti", brand: "NVIDIA", price: 12000, image: "/api/placeholder/300/200", rating: 4.5, memory: "16GB GDDR6", performance: "1440p Gaming" },
    { id: 6, name: "RX 7700 XT", brand: "AMD", price: 10500, image: "/api/placeholder/300/200", rating: 4.4, memory: "12GB GDDR6", performance: "1440p Gaming" }
  ],
  memoria_ram: [
    { id: 1, name: "Corsair Vengeance LPX 32GB", brand: "Corsair", price: 3200, image: "/api/placeholder/300/200", rating: 4.8, capacity: "32GB", speed: "3200MHz" },
    { id: 2, name: "G.Skill Trident Z5 32GB", brand: "G.Skill", price: 3800, image: "/api/placeholder/300/200", rating: 4.9, capacity: "32GB", speed: "6000MHz" },
    { id: 3, name: "Kingston Fury Beast 16GB", brand: "Kingston", price: 1800, image: "/api/placeholder/300/200", rating: 4.7, capacity: "16GB", speed: "3200MHz" },
    { id: 4, name: "Corsair Dominator 64GB", brand: "Corsair", price: 8500, image: "/api/placeholder/300/200", rating: 4.9, capacity: "64GB", speed: "5200MHz" },
    { id: 5, name: "G.Skill Ripjaws V 16GB", brand: "G.Skill", price: 1600, image: "/api/placeholder/300/200", rating: 4.6, capacity: "16GB", speed: "3600MHz" },
    { id: 6, name: "Crucial Ballistix 32GB", brand: "Crucial", price: 2900, image: "/api/placeholder/300/200", rating: 4.5, capacity: "32GB", speed: "3200MHz" }
  ],
  almacenamiento: [
    { id: 1, name: "Samsung 990 PRO 2TB", brand: "Samsung", price: 4200, image: "/api/placeholder/300/200", rating: 4.9, capacity: "2TB", type: "NVMe SSD" },
    { id: 2, name: "WD Black SN850X 1TB", brand: "Western Digital", price: 2800, image: "/api/placeholder/300/200", rating: 4.8, capacity: "1TB", type: "NVMe SSD" },
    { id: 3, name: "Crucial MX4 4TB", brand: "Crucial", price: 8500, image: "/api/placeholder/300/200", rating: 4.7, capacity: "4TB", type: "SATA SSD" },
    { id: 4, name: "Seagate IronWolf 8TB", brand: "Seagate", price: 5500, image: "/api/placeholder/300/200", rating: 4.6, capacity: "8TB", type: "HDD" },
    { id: 5, name: "Samsung 980 500GB", brand: "Samsung", price: 1200, image: "/api/placeholder/300/200", rating: 4.5, capacity: "500GB", type: "NVMe SSD" },
    { id: 6, name: "Kingston NV2 1TB", brand: "Kingston", price: 1800, image: "/api/placeholder/300/200", rating: 4.4, capacity: "1TB", type: "NVMe SSD" }
  ]
};

type CategoryId = 'procesadores' | 'tarjetas_graficas' | 'memoria_ram' | 'almacenamiento';
interface Category {
  id: CategoryId;
  name: string;
  icon: React.ComponentType;
}

const categories: Category[] = [
  { id: "procesadores", name: "Procesadores", icon: CpuIcon },
  { id: "tarjetas_graficas", name: "Tarjetas Gráficas", icon: GpuIcon },
  { id: "memoria_ram", name: "Memoria RAM", icon: RamIcon },
  { id: "almacenamiento", name: "Almacenamiento", icon: StorageIcon }
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
          <button className="see-all-btn">
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
                <img src={component.image} alt={component.name} />
                
              </div>
              <div className="component-info">
                <h3 className="component-name">{component.name}</h3>
                <p className="component-brand">{(component as any).brand}</p>
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
  const { user } = useAuth();
  const [cpus, setCpus] = React.useState<CPU[]>([]);
  const [loadingCpus, setLoadingCpus] = React.useState(false);
  const [errorCpus, setErrorCpus] = React.useState<string | null>(null);

  React.useEffect(() => {
    document.title = 'Productos - PC Forge';
    // Fetch CPUs solo una vez
    const fetchCpus = async () => {
      setLoadingCpus(true);
      setErrorCpus(null);
      try {
        const res = await fetch("/api/cpus");
        if (!res.ok) throw new Error("Error al obtener CPUs");
        const data = await res.json();
        // Mapear los datos de la API al formato CPU
        const cpus: CPU[] = data.map((cpu: any) => ({
          id: cpu.id,
          name: cpu.name,
          brand: cpu.manufacturer || "",
          price: cpu.best_price !== undefined && cpu.best_price !== null ? cpu.best_price : (cpu.raw_data?.price || cpu.tdp || 0),
          image: `/api/images/CPU_IMG/${encodeURIComponent(cpu.name)}.jpg`,
          rating: cpu.rating || 4.5,
          cores: cpu.cores_total?.toString() || "-",
          frequency: cpu.clock_base ? `${cpu.clock_base} GHz` : "-",
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

  return (

      <div className="components-page">
        <div className="page-header">
          <h1>Productos</h1>
          <p>Descubre los mejores productos para tu Set Up  </p>
        </div>

        <div className="carousels-container">
          {categories.map((category) => {
            if (category.id === "procesadores") {
              if (loadingCpus) return <div key="procesadores">Cargando procesadores...</div>;
              if (errorCpus) return <div key="procesadores">Error: {errorCpus}</div>;
              return (
                <ComponentCarousel
                  key={category.id}
                  category={category}
                  components={cpus}
                />
              );
            }
            return (
              <ComponentCarousel
                key={category.id}
                category={category}
                components={mockComponents[category.id as keyof typeof mockComponents]}
              />
            );
          })}
        </div>
      </div>

  );
};

export default ComponentsPage;