"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import "./pc-build.css"

import Image from 'next/image';
// Icons (Simple SVG components)
// RAM Memory Icon
const RamIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

const categories = [
  { id: "cpu" as ComponentCategory, name: "Procesador", icon: CpuIcon },
  { id: "gpu" as ComponentCategory, name: "Tarjeta Gráfica", icon: GpuIcon },
  { id: "motherboard" as ComponentCategory, name: "Placa Base", icon: MotherboardIcon },
  { id: "ram" as ComponentCategory, name: "Memoria RAM", icon: RamIcon },
  { id: "storage" as ComponentCategory, name: "Almacenamiento", icon: M2SsdIcon },
  { id: "psu" as ComponentCategory, name: "Fuente de Poder", icon: PsuIcon },
  { id: "case" as ComponentCategory, name: "Gabinete", icon: CaseIcon },
  { id: "cooler" as ComponentCategory, name: "Refrigeración", icon: FanIcon },
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

// Validación backend
const validateBuildBackend = async (build: PCBuild): Promise<CompatibilityIssue[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/api/build/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(build),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.issues || [];
  } catch {
    return [];
  }
};

// Serialización del build a URL
const serializeBuildToUrl = (build: PCBuild) => {
  const params = new URLSearchParams();
  Object.keys(categoryNames).forEach((cat) => {
    const comp = build[cat as ComponentCategory];
    if (comp && comp.id) {
      params.set(cat, comp.id);
    }
  });
  return `${window.location.origin}/pc-build?${params.toString()}`;
};

// Main Component
const PCConfigurator = () => {
  const { user } = useAuth();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const router = typeof window !== 'undefined' ? { push: (url: string) => window.location.href = url } : { push: () => {} };

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
  useEffect(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, [selectedCategory]);
  const [currentBuild, setCurrentBuild] = useState<PCBuild>(initialBuild)
  const [searchTerm, setSearchTerm] = useState("")
  const [sidebarOpen] = useState(true)
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [backendIssues, setBackendIssues] = useState<CompatibilityIssue[]>([])
  const [editingBuildId, setEditingBuildId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  // ...existing useState hooks...
const [showBuildModal, setShowBuildModal] = useState(false);
const [buildName, setBuildName] = useState("");
const [buildDescription, setBuildDescription] = useState("");
const [buildModalError, setBuildModalError] = useState<string | null>(null);

  // Estado para CPUs desde la base de datos

  // ...existing useState hooks...
  const [cpus, setCpus] = useState<Component[]>([]);
  const [gpus, setGpus] = useState<Component[]>([]);
  const [rams, setRams] = useState<Component[]>([]);
  const [motherboards, setMotherboards] = useState<Component[]>([]);
  const [psus, setPsus] = useState<Component[]>([]);
  const [cases, setCases] = useState<Component[]>([]);
  const [storages, setStorages] = useState<Component[]>([]);
  const [coolers, setCoolers] = useState<Component[]>([]);
  const [loadingComponents, setLoadingComponents] = useState<{[key in ComponentCategory]: boolean}>({
    cpu: false,
    gpu: false,
    ram: false,
    motherboard: false,
    psu: false,
    case: false,
    storage: false,
    cooler: false,
  });

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const componentsPerPage = 4;

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const fetchers: {[key in ComponentCategory]: { endpoint: string, set: React.Dispatch<React.SetStateAction<Component[]>>, imgFolder: string }} = {
      cpu: { endpoint: '/api/cpus', set: setCpus, imgFolder: 'CPU_IMG' },
      gpu: { endpoint: '/api/gpus', set: setGpus, imgFolder: 'GPU_IMG' },
      ram: { endpoint: '/api/rams', set: setRams, imgFolder: 'RAM_IMG' },
      motherboard: { endpoint: '/api/motherboards', set: setMotherboards, imgFolder: 'MOTHERBOARD_IMG' },
      psu: { endpoint: '/api/psus', set: setPsus, imgFolder: 'PSU_IMG' },
      case: { endpoint: '/api/cases', set: setCases, imgFolder: 'PC_CASE_IMG' },
      storage: { endpoint: '/api/storages', set: setStorages, imgFolder: 'STORAGE_IMG' },
      cooler: { endpoint: '/api/coolers', set: setCoolers, imgFolder: 'CPU_COOLER_IMG' },
    };

    Object.entries(fetchers).forEach(([category, { endpoint, set, imgFolder }]) => {
      setLoadingComponents(prev => ({ ...prev, [category]: true }));
      fetch(`${apiUrl}${endpoint}`)
        .then(res => res.ok ? res.json() : Promise.reject())
        .then((data: any[]) => {
          const mapped: Component[] = data.map((item: Record<string, unknown>) => {
            const name = typeof item.name === 'string' ? item.name : '';
            const brand = typeof item.manufacturer === 'string' ? item.manufacturer : '';
            const rawData = typeof item.raw_data === 'object' && item.raw_data !== null ? item.raw_data as { price?: number } : undefined;
            // Precios
            const price = item.best_price !== undefined && item.best_price !== null
              ? Number(item.best_price)
              : (rawData?.price ?? 0);
            // Imagen
            const image = `${apiUrl}/images/${imgFolder}/${encodeURIComponent(name)}.jpg`;
            // Specs (simplificado, puedes personalizar por tipo)
            const specs: Record<string, string> = {
              Marca: brand,
              Modelo: name,
              Precio: price ? `$${price}` : '-',
            };
            // Compatibilidad básica (puedes expandir por tipo)
            const compatibility: Component['compatibility'] = {};
            if ('socket' in item && typeof item.socket === 'string') compatibility.socket = item.socket;
            if ('tdp' in item && typeof item.tdp === 'number') compatibility.powerRequirement = item.tdp;
            if ('maxMemorySpeed' in item && typeof item.maxMemorySpeed === 'number') compatibility.maxMemorySpeed = item.maxMemorySpeed;
            // En compatibilidad, agregar wattage
            if ('wattage' in item && typeof item.wattage === 'number') compatibility.powerRequirement = item.wattage;
            return {
              id: typeof item.id === 'string' ? item.id : '',
              name,
              brand,
              price,
              best_price: item.best_price !== undefined && item.best_price !== null ? Number(item.best_price) : undefined,
              image,
              specs,
              compatibility,
            };
          });
          set(mapped);
        })
        .catch(() => set([]))
        .finally(() => setLoadingComponents(prev => ({ ...prev, [category]: false })));
    });
  }, []);

  // Cargar build para edición si hay buildId en la URL
  useEffect(() => {
    const buildId = searchParams?.get('buildId');
    if (buildId) {
      setEditingBuildId(buildId);
      // Cargar build desde backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      fetch(`${apiUrl}/api/user-builds/${buildId}`, { credentials: 'include' })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then((data) => {
          // Mapear los componentes a los del builder
          const build: PCBuild = {
            cpu: data.cpu || null,
            gpu: data.gpu || null,
            ram: data.ram || null,
            motherboard: data.motherboard || null,
            psu: data.psu || null,
            case: data.case || null,
            storage: data.storage || null,
            cooler: data.cooler || null,
            totalPrice: 0,
          };
          // Calcular total
          build.totalPrice = Object.values(build)
            .filter((comp): comp is Component => comp !== null && typeof comp === "object")
            .reduce((sum, comp) => sum + (comp.best_price !== undefined ? comp.best_price : comp.price), 0);
          setCurrentBuild(build);
          validateBuildBackend(build).then(setBackendIssues);
        })
        .catch(() => {
          setEditingBuildId(null);
        });
    } else {
      // Si no hay buildId, limpiar builder
      setEditingBuildId(null);
      setCurrentBuild(initialBuild);
      setBackendIssues([]);
    }
    // eslint-disable-next-line
  }, [cpus, gpus, rams, motherboards, psus, cases, storages, coolers]);

  const updateComponent = async (category: ComponentCategory, component: Component | null) => {
    const newBuild = { ...currentBuild, [category]: component }
    // Usar best_price si existe, sino price
    const totalPrice = Object.values(newBuild)
      .filter((comp): comp is Component => comp !== null && typeof comp === "object")
      .reduce((sum, comp) => sum + (comp.best_price !== undefined ? comp.best_price : comp.price), 0)
    newBuild.totalPrice = totalPrice
    setCurrentBuild(newBuild)
    // Validar en backend
    const issues = await validateBuildBackend(newBuild);
    setBackendIssues(issues);
  }

  const clearBuild = () => {
    setCurrentBuild(initialBuild)
    setBackendIssues([])
  }

  const saveBuild = () => {
  setBuildModalError(null);
  setShowBuildModal(true);
};
const handleConfirmSave = async () => {
  if (!buildName.trim()) {
    setBuildModalError("El nombre es obligatorio");
    return;
  }
  setSaving(true);
  setSaveError(null);
  setBuildModalError(null);
  const payload: any = {
    name: buildName.trim(),
    description: buildDescription.trim(),
    cpuId: currentBuild.cpu?.id,
    gpuId: currentBuild.gpu?.id,
    ramId: currentBuild.ram?.id,
    motherboardId: currentBuild.motherboard?.id,
    psuId: currentBuild.psu?.id,
    caseId: currentBuild.case?.id,
    storageId: currentBuild.storage?.id,
    coolerId: currentBuild.cooler?.id,
    extra: {},
  };
  try {
    let res;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    if (editingBuildId) {
      res = await fetch(`${apiUrl}/api/user-builds/${editingBuildId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch(`${apiUrl}/api/user-builds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
    }
    if (!res.ok) throw new Error('Error al guardar el build');
    setShowBuildModal(false);
    setBuildName("");
    setBuildDescription("");
    router.push('/my-builds');
  } catch (err: any) {
    setSaveError(err.message || 'Error al guardar');
  } finally {
    setSaving(false);
  }
};

  const shareBuild = () => {
    const url = serializeBuildToUrl(currentBuild);
    setShareUrl(url);
    setShowShareModal(true);
    setCopied(false);
  }

  // Solo mostrar CPUs reales si la categoría es cpu
  const components = useMemo(() => {
    switch (selectedCategory) {
      case "cpu": return cpus;
      case "gpu": return gpus;
      case "ram": return rams;
      case "motherboard": return motherboards;
      case "psu": return psus;
      case "case": return cases;
      case "storage": return storages;
      case "cooler": return coolers;
      default: return [];
    }
  }, [selectedCategory, cpus, gpus, rams, motherboards, psus, cases, storages, coolers]);

  const filteredComponents = useMemo(() => {
    return components.filter((component) => {
      const matchesSearch =
        component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.brand.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    })
  }, [components, searchTerm])

  // Calcular paginación
  const totalPages = Math.ceil(filteredComponents.length / componentsPerPage);
  const paginatedComponents = useMemo(() => {
    const start = (currentPage - 1) * componentsPerPage;
    return filteredComponents.slice(start, start + componentsPerPage);
  }, [filteredComponents, currentPage]);

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
                      onClick={() => {
                        setSelectedCategory(category.id);
                      }}
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
                {/* Search Bar Only */}
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
                </div>
                {/* Components List */}
                <div className="pc-configurator-components-list-container">
                  {loadingComponents[selectedCategory] && (
                    <div className="pc-configurator-loading-message">Cargando {categoryNames[selectedCategory].toLowerCase()}...</div>
                  )}
                  {!loadingComponents[selectedCategory] && paginatedComponents.length === 0 && (
                    <div className="pc-configurator-no-results-container">
                      <p>No se encontraron {categoryNames[selectedCategory].toLowerCase()} en la base de datos.</p>
                      <button
                        className="pc-configurator-btn pc-configurator-btn-outline"
                        onClick={() => {
                          setSearchTerm("");
                        }}
                      >
                        Limpiar búsqueda
                      </button>
                    </div>
                  )}
                  {!loadingComponents[selectedCategory] && paginatedComponents.map((component: Component) => {
                    const isSelected = currentBuild[selectedCategory]?.id === component.id;
                    const compatibility = checkCompatibility(component, selectedCategory, currentBuild);
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
                          <Image
                            src={component.image || "/placeholder.svg"}
                            alt={component.name}
                            width={80}
                            height={80}
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
                  {!loadingComponents[selectedCategory] && totalPages > 1 && (
                    <div className="pc-configurator-pagination-container">
                      <button
                        className="pc-configurator-pagination-btn"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        aria-label="Primera página"
                      >
                        <span style={{fontSize: '1.2em', fontWeight: 'bold'}}>&laquo;</span>
                      </button>
                      <button
                        className="pc-configurator-pagination-btn"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        aria-label="Anterior"
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
                        aria-label="Siguiente"
                      >
                        Siguiente
                      </button>
                      <button
                        className="pc-configurator-pagination-btn"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        aria-label="Última página"
                      >
                        <span style={{fontSize: '1.2em', fontWeight: 'bold'}}>&raquo;</span>
                      </button>
                    </div>
                  )}
                </div>
                {filteredComponents.length === 0 && (
                  <div className="pc-configurator-no-results-container">
                    <p>No se encontraron componentes que coincidan con la búsqueda</p>
                    <button
                      className="pc-configurator-btn pc-configurator-btn-outline"
                      onClick={() => {
                        setSearchTerm("");
                      }}
                    >
                      Limpiar búsqueda
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
                      <div className="pc-configurator-total-line-item pc-configurator-total-final-amount">
                        <span>Total:</span>
                        <span>${(currentBuild.totalPrice).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Build Preview */}
              <div className="pc-configurator-build-preview-section">
                <div className="pc-configurator-preview-actions-container">
                  <div className="pc-configurator-action-buttons-grid">
                    <button
                      className="pc-configurator-btn pc-configurator-btn-outline"
                      onClick={saveBuild}
                      disabled={!user || !hasComponents || saving}
                    >
                      <SaveIcon />
                      {editingBuildId ? "Actualizar" : "Guardar"}
                    </button>
                    {saveError && (
                      <div className="pc-configurator-save-error-message">{saveError}</div>
                    )}
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
                {/* Mostrar validaciones del backend */}
                {backendIssues.length > 0 && (
                  <div className="pc-configurator-backend-issues-container">
                    {backendIssues.map((issue, idx) => (
                      <div
                        key={idx}
                        className={`pc-configurator-compatibility-issue-alert ${issue.type === "error" ? "pc-configurator-issue-error-type" : "pc-configurator-issue-warning-type"}`}
                      >
                        {issue.message}
                      </div>
                    ))}
                  </div>
                )}
                {!user && (
                  <div className="pc-configurator-auth-notice-container">
                    <p>Inicia sesión para guardar tus configuraciones</p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
{showBuildModal && (
  <div className="pc-configurator-share-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowBuildModal(false); }}>
    <div className="pc-configurator-share-modal">
      <button
        className="pc-configurator-share-modal-close"
        onClick={() => setShowBuildModal(false)}
        aria-label="Cerrar"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
      <h3 className="pc-configurator-share-modal-title">{editingBuildId ? "Actualizar Build" : "Guardar Nuevo Build"}</h3>
      <form onSubmit={e => { e.preventDefault(); handleConfirmSave(); }}>
        <div className="pc-configurator-share-modal-link-row" style={{flexDirection: 'column', alignItems: 'stretch', gap: '1rem'}}>
          <label htmlFor="buildName" style={{fontWeight: 600, marginBottom: 4}}>Nombre del Build <span style={{color: 'red'}}>*</span></label>
          <input
            id="buildName"
            type="text"
            value={buildName}
            onChange={e => setBuildName(e.target.value)}
            maxLength={60}
            required
            className="pc-configurator-share-modal-link-input"
            autoFocus
            style={{marginBottom: 8}}
          />
          <label htmlFor="buildDescription" style={{fontWeight: 600, marginBottom: 4}}>Descripción (opcional)</label>
          <textarea
            id="buildDescription"
            value={buildDescription}
            onChange={e => setBuildDescription(e.target.value)}
            maxLength={300}
            className="pc-configurator-share-modal-link-input"
            rows={3}
            style={{resize: 'vertical', marginBottom: 8}}
          />
          {buildModalError && <div className="pc-configurator-modal-error-message" style={{color: 'var(--pc-config-danger)', marginBottom: 8}}>{buildModalError}</div>}
          <div style={{display: 'flex', gap: '0.75rem', marginTop: 8}}>
            <button type="submit" className="pc-configurator-btn pc-configurator-btn-primary" disabled={saving}>
              {saving ? "Guardando..." : (editingBuildId ? "Actualizar" : "Guardar")}
            </button>
            <button type="button" className="pc-configurator-btn pc-configurator-btn-outline" onClick={() => setShowBuildModal(false)} disabled={saving}>
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
)}
        {/* Share Modal (overlay, does not block main layout) */}
        {showShareModal && (
          <div
            className="pc-configurator-share-modal-overlay"
            onClick={e => {
              if (e.target === e.currentTarget) setShowShareModal(false);
            }}
          >
            <div className="pc-configurator-share-modal">
              <button
                className="pc-configurator-share-modal-close"
                onClick={() => setShowShareModal(false)}
                aria-label="Cerrar"
              >
                {/* X icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
              <h3 className="pc-configurator-share-modal-title">Comparte este build con tus amigos</h3>
              <div className="pc-configurator-share-modal-link-row">
                <input
                  type="text"
                  className="pc-configurator-share-modal-link-input"
                  value={shareUrl}
                  readOnly
                  onFocus={e => e.target.select()}
                />
                <button
                  className="pc-configurator-share-modal-copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  aria-label="Copiar al portapapeles"
                >
                  {/* Clipboard icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="6" height="6" rx="1" />
                    <path d="M4 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
                    <rect x="4" y="7" width="16" height="13" rx="2" />
                  </svg>
                </button>
                {copied && <span className="pc-configurator-share-modal-copied">Copiado!</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}

export default PCConfigurator;
