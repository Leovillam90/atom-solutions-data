'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Kicker } from '@/app/complementos/Tipografia';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { 
  Crown, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  ShieldCheck, 
  Hash,
  Maximize2,
  Minimize2,
  Sparkles,
  ShoppingBag,
  Eye,
  Leaf,
  Package,
  Footprints,
  Trophy,
  Watch,
  Gem,
  Droplet,
  Cpu,
  FlaskConical,
  Store,
  Shirt,
  Truck,
  HeartPulse,
  Tv,
  Dumbbell,
  Shield,
  Boxes,
  Globe,
  Flame,
  Star,
  Rocket,
  Activity,
  Terminal,
  Layers,
  Zap
} from 'lucide-react';

interface Seccion6Props {
  variante?: TipoFondo;
}

export interface PaisConfig {
  code: string;
  nombre: string;
  gradientBg: string;
}

// 🌎 CATÁLOGO GLOBAL DE PAÍSES
export const PAISES_CATALOGO: Record<string, PaisConfig> = {
  co: { code: 'co', nombre: 'Colombia', gradientBg: 'from-amber-500/30 via-blue-600/25 to-red-600/25' },
  us: { code: 'us', nombre: 'Estados Unidos', gradientBg: 'from-blue-700/30 via-slate-100/20 to-red-600/30' },
  mx: { code: 'mx', nombre: 'México', gradientBg: 'from-[#0DEDC0]/20 via-emerald-600/25 to-red-600/25' },
  gt: { code: 'gt', nombre: 'Guatemala', gradientBg: 'from-cyan-500/30 via-blue-600/25 to-slate-100/20' },
  pe: { code: 'pe', nombre: 'Perú', gradientBg: 'from-red-600/35 via-slate-100/20 to-red-600/35' },
  cl: { code: 'cl', nombre: 'Chile', gradientBg: 'from-blue-600/35 via-slate-100/10 to-red-600/35' },
  ec: { code: 'ec', nombre: 'Ecuador', gradientBg: 'from-yellow-400/30 via-blue-700/25 to-red-600/30' },
  br: { code: 'br', nombre: 'Brasil', gradientBg: 'from-emerald-500/35 via-yellow-400/25 to-blue-600/25' },
  eu: { code: 'eu', nombre: 'Europa', gradientBg: 'from-blue-600/35 via-amber-400/25 to-blue-700/35' },
  ve: { code: 've', nombre: 'Venezuela', gradientBg: 'from-yellow-400/30 via-blue-600/25 to-red-600/25' },
  py: { code: 'py', nombre: 'Paraguay', gradientBg: 'from-red-600/30 via-[#0DEDC0]/15 to-blue-600/30' }
};

export const ICONOS_MAP: Record<string, React.ElementType> = {
  Sparkles,
  ShoppingBag,
  Eye,
  Leaf,
  Package,
  Footprints,
  Trophy,
  Watch,
  Gem,
  Droplet,
  Cpu,
  FlaskConical,
  Store,
  Shirt,
  Truck,
  HeartPulse,
  Tv,
  Dumbbell,
  Shield,
  Boxes,
  Globe,
  Flame,
  Star,
  Rocket,
  Activity,
  Terminal,
  Layers,
  Zap,
  ShieldCheck,
  Building2
};

export interface ProveedorData {
  id: string;
  nombre: string;
  stand: string;
  paisesActivos: string[];
  iconoName: string;
}

export const PROVEEDORES_INICIALES: ProveedorData[] = [
  { id: 'prov-1', nombre: 'Altahir', stand: 'Stand #161', paisesActivos: ['co'], iconoName: 'Sparkles' },
  { id: 'prov-2', nombre: 'American Natural', stand: 'Stand #213 - 214 - 223 - 224 - 233 - 234', paisesActivos: ['gt', 'co', 'ec'], iconoName: 'Leaf' },
  { id: 'prov-3', nombre: 'AZ Commerce', stand: 'Stand Pendiente', paisesActivos: ['co'], iconoName: 'Store' },
  { id: 'prov-4', nombre: 'Azoria', stand: 'Stand #254', paisesActivos: ['co', 'ec'], iconoName: 'FlaskConical' },
  { id: 'prov-5', nombre: 'Bodega Centro', stand: 'Stand Pendiente', paisesActivos: ['co'], iconoName: 'Boxes' },
  { id: 'prov-6', nombre: 'Bodega de Belleza INT', stand: 'Stand #93 - 94 - 103 - 104 - 113 - 114', paisesActivos: ['co'], iconoName: 'Star' },
  { id: 'prov-7', nombre: 'Calzado ShoesDL', stand: 'Stand #36', paisesActivos: ['co'], iconoName: 'Footprints' },
  { id: 'prov-8', nombre: 'CIT COLOMBIA', stand: 'Stand Pendiente', paisesActivos: ['co'], iconoName: 'Globe' },
  { id: 'prov-9', nombre: 'Comercializadora GGP', stand: 'Stand #138 - 148 - 158', paisesActivos: ['mx', 'co'], iconoName: 'Truck' },
  { id: 'prov-10', nombre: 'Curren Latam', stand: 'Stand #122', paisesActivos: ['co'], iconoName: 'Watch' },
  { id: 'prov-11', nombre: 'Dh Store', stand: 'Stand Pendiente', paisesActivos: ['co'], iconoName: 'ShoppingBag' },
  { id: 'prov-12', nombre: 'DIGO SHOP TV', stand: 'Stand #8', paisesActivos: ['co'], iconoName: 'Tv' },
  { id: 'prov-13', nombre: 'Digytal Colombia', stand: 'Stand Pendiente', paisesActivos: ['co'], iconoName: 'Cpu' },
  { id: 'prov-14', nombre: 'Distrishop RML SAS', stand: 'Stand #86', paisesActivos: ['co'], iconoName: 'Package' },
  { id: 'prov-15', nombre: 'Disvas', stand: 'Stand #247', paisesActivos: ['co'], iconoName: 'Droplet' },
  { id: 'prov-16', nombre: 'DTS', stand: 'Stand Pendiente', paisesActivos: ['co', 'mx'], iconoName: 'Terminal' },
  { id: 'prov-17', nombre: 'Emdel', stand: 'Stand Pendiente', paisesActivos: ['co'], iconoName: 'Shield' },
  { id: 'prov-18', nombre: 'Evolution Full Clean', stand: 'Stand #83', paisesActivos: ['co'], iconoName: 'Droplet' },
  { id: 'prov-19', nombre: 'Évora', stand: 'Stand #87', paisesActivos: ['co'], iconoName: 'Crown' },
  { id: 'prov-20', nombre: 'Fajas Simone Body Wear SAS', stand: 'Stand #208', paisesActivos: ['co'], iconoName: 'ShieldCheck' },
  { id: 'prov-21', nombre: 'Gizmo Company', stand: 'Stand #107', paisesActivos: ['co'], iconoName: 'Zap' },
  { id: 'prov-22', nombre: 'Goldbox', stand: 'Stand Pendiente', paisesActivos: ['co'], iconoName: 'Gem' },
  { id: 'prov-23', nombre: 'GOLD STONE', stand: 'Stand Pendiente', paisesActivos: ['co'], iconoName: 'Flame' },
  { id: 'prov-24', nombre: 'GWT', stand: 'Stand Pendiente', paisesActivos: ['co'], iconoName: 'Layers' },
  { id: 'prov-25', nombre: 'Hyper Moda', stand: 'Stand Pendiente', paisesActivos: ['co'], iconoName: 'Shirt' },
  { id: 'prov-26', nombre: 'Impowinner', stand: 'Stand #168 - 178', paisesActivos: ['co'], iconoName: 'Trophy' },
  { id: 'prov-27', nombre: 'Inversiones mrm y cia sas', stand: 'Stand Pendiente', paisesActivos: ['co'], iconoName: 'Activity' },
  { id: 'prov-28', nombre: 'Jeasense', stand: 'Stand Pendiente', paisesActivos: ['co'], iconoName: 'Eye' },
  { id: 'prov-29', nombre: 'JUAN ANDRES GONZALEZ', stand: 'Stand Pendiente', paisesActivos: ['co'], iconoName: 'Rocket' },
  { id: 'prov-30', nombre: 'KORVEN', stand: 'Stand #31', paisesActivos: ['co'], iconoName: 'Shield' },
  { id: 'prov-31', nombre: 'Línea Verde', stand: 'Stand #09 - 10', paisesActivos: ['co'], iconoName: 'Leaf' },
  { id: 'prov-32', nombre: 'Luxury Market', stand: 'Stand Pendiente', paisesActivos: ['co'], iconoName: 'Gem' },
  { id: 'prov-33', nombre: 'Maia Moda', stand: 'Stand #140', paisesActivos: ['co'], iconoName: 'Shirt' },
  { id: 'prov-34', nombre: 'Maxialo Group', stand: 'Stand #156 - 166', paisesActivos: ['co'], iconoName: 'Layers' },
  { id: 'prov-35', nombre: 'Merx', stand: 'Stand #243 - 244', paisesActivos: ['py', 'co'], iconoName: 'ShoppingBag' },
  { id: 'prov-36', nombre: 'MODA VIVA', stand: 'Stand #27 - 28', paisesActivos: ['co'], iconoName: 'Shirt' },
  { id: 'prov-37', nombre: 'NATURAL LABS ORGANIC', stand: 'Stand #181 - 182', paisesActivos: ['co'], iconoName: 'Activity' },
  { id: 'prov-38', nombre: 'Nibresma', stand: 'Stand Pendiente', paisesActivos: ['gt', 'co', 'ec'], iconoName: 'ShieldCheck' },
  { id: 'prov-39', nombre: 'One tech', stand: 'Stand Pendiente', paisesActivos: ['co'], iconoName: 'Cpu' },
  { id: 'prov-40', nombre: 'Quality Tienda', stand: 'Stand #5 - 6', paisesActivos: ['co'], iconoName: 'Store' },
  { id: 'prov-41', nombre: 'Seencom Fitovit', stand: 'Stand #19 - 20', paisesActivos: ['co'], iconoName: 'Dumbbell' },
  { id: 'prov-42', nombre: 'Selecto', stand: 'Stand #69', paisesActivos: ['cl'], iconoName: 'Gem' },
  { id: 'prov-43', nombre: 'Vidix', stand: 'Stand #13 - 14', paisesActivos: ['co'], iconoName: 'Eye' },
  { id: 'prov-44', nombre: 'Vital Magic', stand: 'Stand #21 - 22', paisesActivos: ['co'], iconoName: 'HeartPulse' },
  { id: 'prov-45', nombre: 'Vitalcom', stand: 'Stand Pendiente', paisesActivos: ['co'], iconoName: 'HeartPulse' },
  { id: 'prov-46', nombre: 'Zamia', stand: 'Stand Pendiente', paisesActivos: ['co'], iconoName: 'Sparkles' }
];

const STORAGE_KEY = 'atom_proveedores_config';

const obtenerListaStands = (standTexto: string): string[] => {
  if (standTexto.toLowerCase().includes('pendiente')) {
    return ['PENDIENTE'];
  }
  const limpio = standTexto.replace(/Stand\s*#?/gi, '').trim();
  const partes = limpio.split(/[-,\/]/).map((s) => s.trim()).filter(Boolean);
  return partes.map((num) => (num.startsWith('#') ? num : `#${num}`));
};

export default function Seccion6({ variante = 'hexGrid' }: Seccion6Props) {
  const [proveedores, setProveedores] = useState<ProveedorData[]>(PROVEEDORES_INICIALES);
  const [cargado, setCargado] = useState(false);
  const [indexActivo, setIndexActivo] = useState(0);
  const [esPantallaCompleta, setEsPantallaCompleta] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const cargarDatos = useCallback(() => {
    const datosGuardados = localStorage.getItem(STORAGE_KEY);
    if (datosGuardados) {
      try {
        const parsed = JSON.parse(datosGuardados);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProveedores(parsed);
        }
      } catch (e) {
        console.error("Error al cargar proveedores en Seccion6:", e);
      }
    }
    setCargado(true);
  }, []);

  useEffect(() => {
    cargarDatos();
    const handleStorageChange = () => cargarDatos();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('atom_proveedores_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('atom_proveedores_updated', handleStorageChange);
    };
  }, [cargarDatos]);

  const proveedorActual = proveedores[indexActivo] || proveedores[0] || PROVEEDORES_INICIALES[0];

  const siguiente = useCallback(() => {
    setIndexActivo((prev) => (prev + 1) % proveedores.length);
  }, [proveedores.length]);

  const anterior = useCallback(() => {
    setIndexActivo((prev) => (prev - 1 + proveedores.length) % proveedores.length);
  }, [proveedores.length]);

  // ⏱️ ROTACIÓN AUTOMÁTICA ADAPTATIVA: 1.5s POR PAÍS SI SUPERA LOS 5s BASE
  useEffect(() => {
    const numPaises = proveedorActual.paisesActivos?.length || 1;
    const duracionProveedor = Math.max(5000, numPaises * 1500);

    const interval = setInterval(() => {
      siguiente();
    }, duracionProveedor);

    return () => clearInterval(interval);
  }, [siguiente, proveedorActual]);

  const togglePantallaCompleta = () => {
    if (!document.fullscreenElement) {
      if (sectionRef.current?.requestFullscreen) {
        sectionRef.current.requestFullscreen().catch(() => setEsPantallaCompleta(true));
      } else {
        setEsPantallaCompleta(!esPantallaCompleta);
      }
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      setEsPantallaCompleta(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setEsPantallaCompleta(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!cargado) return <div className="min-h-[820px] bg-[#050811]" />;

  const primerCode = proveedorActual.paisesActivos?.[0] || 'co';
  const configPrincipal = PAISES_CATALOGO[primerCode] || PAISES_CATALOGO.co;
  const IconoComponente = ICONOS_MAP[proveedorActual.iconoName] || Building2;

  const paisesTexto = (proveedorActual.paisesActivos || ['co'])
    .map((c) => (PAISES_CATALOGO[c] ? PAISES_CATALOGO[c].nombre : c.toUpperCase()))
    .join(' · ');

  return (
    <div 
      ref={sectionRef} 
      className={`relative w-full transition-all duration-500 bg-[#050811] text-white flex flex-col justify-center ${
        esPantallaCompleta 
          ? 'fixed inset-0 z-[99999] py-8 px-4 sm:px-12 h-screen overflow-y-auto' 
          : 'relative z-10 pt-16 pb-12 sm:py-20 px-4 sm:px-6 min-h-[820px]'
      }`}
    >
      <Fondos variante={variante} modo="absolute" />

      {esPantallaCompleta && (
        <button
          type="button"
          onClick={togglePantallaCompleta}
          className="fixed top-6 right-6 z-[100000] p-3 bg-[#09101D]/90 border border-[#0DEDC0]/60 text-[#0DEDC0] hover:bg-[#0DEDC0] hover:text-[#050811] rounded-2xl transition-all shadow-[0_0_20px_rgba(13,237,192,0.4)] cursor-pointer flex items-center gap-2"
        >
          <Minimize2 className="w-4 h-4" />
          <span className="text-xs font-mono font-black uppercase">SALIR DE PANTALLA COMPLETA</span>
        </button>
      )}

      <div className="absolute inset-0 pointer-events-none transition-all duration-1000 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={primerCode + indexActivo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`absolute inset-0 bg-gradient-to-b ${configPrincipal.gradientBg} blur-[140px] opacity-85`}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-radial from-transparent via-[#050811]/60 to-[#050811]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-4 sm:space-y-6 text-center my-auto pt-2">
        <div className="space-y-2">
          <Kicker varianteFondo={variante} className="inline-block">
            EXPOWINNERS 2026 · MARCAS ACREDITADAS
          </Kicker>
        </div>

        <div className="relative py-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={proveedorActual.id}
              initial={{ opacity: 0, scale: 0.88, y: 30, rotateX: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: -30, rotateX: -12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col xl:flex-row items-center justify-center gap-6 xl:gap-12 max-w-7xl mx-auto"
            >
              <motion.div 
                animate={{ 
                  y: [-12, 12, -12],
                  rotate: [-5, 5, -5],
                  scale: [1, 1.05, 1]
                }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="hidden xl:flex flex-col items-center justify-center shrink-0 w-52 lg:w-64 relative group cursor-pointer"
              >
                <div className="absolute -inset-4 bg-[#0DEDC0]/25 rounded-full blur-3xl group-hover:bg-[#0DEDC0]/45 transition duration-500 pointer-events-none" />
                <img 
                  src="/complementos/Insignia.png" 
                  alt="Insignia ATOM Alto Rendimiento" 
                  className="w-44 h-44 lg:w-56 lg:h-56 object-contain drop-shadow-[0_0_35px_rgba(13,237,192,0.9)] relative z-10"
                />
              </motion.div>

              <div className="relative w-full max-w-[95vw] sm:max-w-xl lg:max-w-2xl min-h-[490px] bg-[#080E18]/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 text-left border-2 border-[#0DEDC0] shadow-[0_0_60px_rgba(13,237,192,0.38)] flex flex-col justify-between">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 max-w-[90%] pointer-events-none">
                  <span className="bg-gradient-to-r from-[#0DEDC0] via-cyan-300 to-emerald-400 text-[#050811] text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-[0_0_20px_#0DEDC0] flex items-center gap-1.5 whitespace-nowrap">
                    <Crown className="w-4 h-4 fill-[#050811] shrink-0" /> PROVEEDOR DE ALTO RENDIMIENTO
                  </span>
                </div>

                <div className="absolute top-0 right-0 w-48 h-48 bg-[#0DEDC0]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="pt-2 space-y-3 border-b border-slate-800/80 pb-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span className="text-[10.5px] font-mono font-extrabold text-[#0DEDC0] uppercase tracking-widest block">
                      MARCA ACREDITADA · {paisesTexto}
                    </span>

                    <div className="flex xl:hidden items-center gap-1.5">
                      {proveedorActual.paisesActivos.map((c) => (
                        <img 
                          key={`mob-${c}`} 
                          src={`https://flagcdn.com/${c}.svg`} 
                          alt={c} 
                          className="w-5 h-3.5 object-cover rounded shadow border border-white/20" 
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-1">
                    <IconoComponente className="w-7 h-7 sm:w-8 sm:h-8 text-[#0DEDC0] drop-shadow-[0_0_12px_#0DEDC0] shrink-0 mt-0.5 animate-pulse" />

                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight break-words flex-1">
                      {proveedorActual.nombre}
                    </h3>
                  </div>
                </div>

                <div className="py-3 space-y-2">
                  <span className="text-[10.5px] font-mono font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-[#0DEDC0]" /> UBICACIÓN EXPOWINNERS 2026
                  </span>

                  <div className="flex flex-wrap gap-2.5 items-center justify-start max-h-[140px] overflow-y-auto pr-1">
                    {obtenerListaStands(proveedorActual.stand).map((num, i) => (
                      <div
                        key={`${proveedorActual.id}-stand-${i}`}
                        className="bg-[#050B14] border-2 border-[#0DEDC0] rounded-2xl px-4 py-2 shadow-[0_0_20px_rgba(13,237,192,0.25)] flex items-center justify-center gap-2 group hover:bg-[#0DEDC0]/10 transition-all"
                      >
                        <span className="text-xs font-mono font-bold text-slate-400 uppercase">STAND</span>
                        <span className="text-2xl sm:text-3xl font-black font-mono text-[#0DEDC0] drop-shadow-[0_0_12px_rgba(13,237,192,0.6)]">
                          {num}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5 py-2 border-t border-slate-800/80 text-xs font-medium text-slate-200">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1 rounded-full bg-[#0DEDC0]/15 border border-[#0DEDC0]/50 text-[#0DEDC0] shrink-0 mt-0.5 shadow-[0_0_8px_#0DEDC0]">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="font-bold text-white">Inventario y Despachos Verificados</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="p-1 rounded-full bg-[#0DEDC0]/15 border border-[#0DEDC0]/50 text-[#0DEDC0] shrink-0 mt-0.5 shadow-[0_0_8px_#0DEDC0]">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Score de Rendimiento Verificado</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="p-1 rounded-full bg-[#0DEDC0]/15 border border-[#0DEDC0]/50 text-[#0DEDC0] shrink-0 mt-0.5 shadow-[0_0_8px_#0DEDC0]">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Stock y Operación Verificada</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href=" "
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0DEDC0] via-cyan-300 to-emerald-400 hover:from-white hover:to-white text-[#050811] font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-[0_0_25px_rgba(13,237,192,0.4)] hover:shadow-[0_0_35px_rgba(255,255,255,0.7)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-center"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span>VISITA EL STAND DE NUESTRO PROVEEDOR</span>
                  </a>
                </div>
              </div>

              <EscudoBandera3D codes={proveedorActual.paisesActivos} paisTexto={paisesTexto} />
            </motion.div>
          </AnimatePresence>
        </div>

        {!esPantallaCompleta && (
          <div className="flex flex-col items-center gap-3.5 relative z-30 pt-2">
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
              <button
                type="button"
                onClick={anterior}
                aria-label="Proveedor anterior"
                className="p-3 bg-[#09101D]/90 border border-[#0DEDC0]/40 text-[#0DEDC0] hover:bg-[#0DEDC0] hover:text-[#050811] rounded-2xl transition-all shadow-[0_0_15px_rgba(13,237,192,0.2)] cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={siguiente}
                aria-label="Siguiente proveedor"
                className="p-3 bg-[#09101D]/90 border border-[#0DEDC0]/40 text-[#0DEDC0] hover:bg-[#0DEDC0] hover:text-[#050811] rounded-2xl transition-all shadow-[0_0_15px_rgba(13,237,192,0.2)] cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <button
                type="button"
                onClick={togglePantallaCompleta}
                aria-label="Pantalla completa"
                className="p-3 bg-[#0DEDC0]/10 border border-[#0DEDC0]/60 text-[#0DEDC0] hover:bg-[#0DEDC0] hover:text-[#050811] rounded-2xl transition-all shadow-[0_0_20px_rgba(13,237,192,0.3)] cursor-pointer flex items-center gap-2 px-4"
              >
                <Maximize2 className="w-4 h-4" />
                <span className="text-xs font-mono font-black uppercase">PANTALLA COMPLETA</span>
              </button>
            </div>

            <div className="text-xs font-mono font-extrabold text-slate-300 flex items-center gap-2">
              <span>PROVEEDOR</span>
              <span className="text-[#0DEDC0] text-sm font-black">{indexActivo + 1}</span>
              <span>DE</span>
              <span className="text-white font-black">{proveedores.length}</span>
            </div>

            <div className="flex items-center gap-1.5 max-w-xs overflow-x-auto py-1 scrollbar-none">
              {proveedores.map((p, idx) => (
                <button
                  key={`dot-${p.id}`}
                  type="button"
                  aria-label={`Ir al proveedor ${idx + 1}: ${p.nombre}`}
                  onClick={() => setIndexActivo(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    indexActivo === idx
                      ? 'w-6 bg-[#0DEDC0] shadow-[0_0_10px_#0DEDC0]'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 🛡️ ESCUDO 3D CON ROTACIÓN PROPORCIONAL Y PÍLDORAS ADAPTATIVAS
function EscudoBandera3D({ codes, paisTexto }: { codes: string[]; paisTexto: string }) {
  const [indexBandera, setIndexBandera] = useState(0);

  useEffect(() => {
    setIndexBandera(0);
  }, [codes]);

  useEffect(() => {
    if (codes.length <= 1) return;
    
    // ⏱️ Duración adaptativa calculada para sincronizarse con la tarjeta
    const duracionTotal = Math.max(5000, codes.length * 1500);
    const tiempoPorBandera = Math.floor(duracionTotal / codes.length);

    const timer = setInterval(() => {
      setIndexBandera((prev) => (prev + 1) % codes.length);
    }, tiempoPorBandera);

    return () => clearInterval(timer);
  }, [codes]);

  const codeActual = codes[indexBandera] || codes[0] || 'co';

  return (
    <motion.div 
      animate={{ 
        y: [12, -12, 12],
        rotateY: [-15, 15, -15],
        scale: [1, 1.05, 1]
      }}
      transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
      className="hidden xl:flex flex-col items-center justify-center shrink-0 w-52 lg:w-64 relative group [perspective:1000px]"
    >
      <div className="absolute -inset-4 bg-gradient-to-br from-[#0DEDC0] via-cyan-500 to-amber-400 opacity-50 blur-3xl group-hover:opacity-80 transition duration-500 pointer-events-none" />
      
      <div 
        className="w-32 h-40 lg:w-40 lg:h-48 p-1.5 bg-gradient-to-b from-[#0DEDC0] via-cyan-500 to-[#050811] shadow-[0_20px_40px_rgba(0,0,0,0.9)] relative z-10"
        style={{ clipPath: 'polygon(50% 0%, 100% 20%, 100% 80%, 50% 100%, 0% 80%, 0% 20%)' }}
      >
        <div 
          className="w-full h-full relative overflow-hidden bg-[#09101D]"
          style={{ clipPath: 'polygon(50% 0%, 100% 20%, 100% 80%, 50% 100%, 0% 80%, 0% 20%)' }}
        >
          <AnimatePresence mode="wait">
            <motion.img 
              key={codeActual}
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1.1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              src={`https://flagcdn.com/${codeActual}.svg`} 
              alt={paisTexto}
              className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-3 relative z-10 bg-[#09101D]/90 border border-[#0DEDC0]/50 px-3 py-1.5 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(13,237,192,0.25)]">
        {codes.map((c, i) => (
          <button
            key={`flanker-${c}-${i}`}
            type="button"
            onClick={() => setIndexBandera(i)}
            aria-label={`Seleccionar bandera de ${c}`}
            className={`p-0.5 rounded transition-all cursor-pointer ${
              indexBandera === i 
                ? 'ring-2 ring-[#0DEDC0] scale-110 shadow-[0_0_10px_#0DEDC0]' 
                : 'opacity-50 hover:opacity-100'
            }`}
          >
            <img 
              src={`https://flagcdn.com/${c}.svg`}
              alt={c}
              className="w-5 h-3.5 object-cover rounded shadow"
            />
          </button>
        ))}
      </div>
    </motion.div>
  );
}