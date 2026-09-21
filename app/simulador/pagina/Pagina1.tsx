'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  ShoppingBag, 
  ChevronDown, 
  Check, 
  ShieldAlert, 
  TrendingUp, 
  Calculator, 
  AlertTriangle,
  Package,
  Truck,
  Target,
  BarChart3,
  DollarSign,
  TrendingDown,
  Layers,
  Sparkles,
  Percent
} from 'lucide-react';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { Kicker, H1, Subtitulo, Highlight } from '@/app/complementos/Tipografia';
import { MONEDAS, MonedaConfig, formatearMonedaGlobal } from '@/app/lib/moneda';

type ModoCalculadora = 'PROVEEDOR' | 'DROPSHIPPER';

interface Pagina1Props {
  variante?: TipoFondo;
}

{/* ANIMACIÓN DE NÚMEROS (COUNT-UP) */}
function AnimatedNumber({ value, formatter }: { value: number; formatter?: (v: number) => string }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 350;
    const initialValue = displayValue;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const current = initialValue + (value - initialValue) * easeProgress;
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value]);

  return <>{formatter ? formatter(displayValue) : Math.round(displayValue)}</>;
}

{/* TOOLTIP INSTITUCIONAL ATOM */}
function Tooltip({ contenido }: { contenido: string }) {
  return (
    <div className="relative inline-flex items-center group ml-1.5 align-middle z-10 hover:z-50">
      <span className="w-4 h-4 rounded-full bg-[#102935] border border-[#0DEDC0]/50 text-[#0DEDC0] text-[10px] font-mono font-bold flex items-center justify-center cursor-help transition-all duration-200 group-hover:bg-[#0DEDC0] group-hover:text-[#090D16] group-hover:scale-110 shrink-0 shadow-[0_0_8px_rgba(13,237,192,0.2)]">
        ?
      </span>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center w-64 p-3 bg-[#090D16] border border-[#0DEDC0]/50 rounded-xl text-[11px] font-sans text-slate-200 font-normal normal-case tracking-normal shadow-[0_15px_30px_rgba(0,0,0,0.9)] z-50 leading-relaxed text-center">
        {contenido}
        <div className="w-2.5 h-2.5 bg-[#090D16] border-r border-b border-[#0DEDC0]/50 rotate-45 -mb-4 mt-1" />
      </div>
    </div>
  );
}

{/* SELECTOR DESPLEGABLE DE MONEDA */}
function SelectorMonedaCustom({
  monedaSeleccionada,
  setMonedaSeleccionada,
}: {
  monedaSeleccionada: MonedaConfig;
  setMonedaSeleccionada: (m: MonedaConfig) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-30" ref={contenedorRef}>
      <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase tracking-wider">
        Moneda de Cálculo
        <Tooltip contenido="Divisa local utilizada para calcular conversiones y fijación de precios en el simulador." />
      </label>

      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className={`w-full bg-[#102935] border text-white text-xs font-bold rounded-xl p-3 flex items-center justify-between cursor-pointer outline-none transition-all duration-200 ${
          abierto
            ? 'border-[#0DEDC0] shadow-[0_0_20px_rgba(13,237,192,0.3)] ring-1 ring-[#0DEDC0]/50'
            : 'border-slate-700 hover:border-[#0DEDC0]/60'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#0DEDC0] shadow-[0_0_8px_#0DEDC0]" />
          <span className="font-mono text-[10px] bg-[#0DEDC0]/15 text-[#0DEDC0] px-1.5 py-0.5 rounded border border-[#0DEDC0]/30 font-bold">
            {monedaSeleccionada.codigo}
          </span>
          <span className="truncate">{monedaSeleccionada.nombre}</span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-[#0DEDC0] transition-transform duration-300 ${
            abierto ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 w-full mt-2 bg-[#090D16]/95 backdrop-blur-xl border border-[#0DEDC0]/40 rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.9)] z-50 overflow-hidden"
          >
            <div className="max-h-56 overflow-y-auto py-1 divide-y divide-slate-800/60 custom-scrollbar">
              {MONEDAS.map((m) => {
                const esSeleccionada = m.codigo === monedaSeleccionada.codigo;
                return (
                  <button
                    key={m.codigo}
                    type="button"
                    onClick={() => {
                      setMonedaSeleccionada(m);
                      setAbierto(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs font-bold transition-all duration-150 flex items-center justify-between cursor-pointer ${
                      esSeleccionada
                        ? 'bg-[#102935] text-[#0DEDC0]'
                        : 'text-slate-300 hover:bg-[#102935]/60 hover:text-[#0DEDC0]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          esSeleccionada
                            ? 'bg-[#0DEDC0]/20 text-[#0DEDC0] border border-[#0DEDC0]/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {m.codigo}
                      </span>
                      <span>{m.nombre}</span>
                    </div>
                    {esSeleccionada && (
                      <Check className="w-4 h-4 text-[#0DEDC0]" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Pagina1({ variante = 'perspectiveGrid' }: Pagina1Props) {
  const [monedaSeleccionada, setMonedaSeleccionada] = useState<MonedaConfig>(MONEDAS[0]);
  
  // 📌 1. PROVEEDOR ES AHORA LA OPCIÓN PREDETERMINADA
  const [modoSeleccionado, setModoSeleccionado] = useState<ModoCalculadora>('PROVEEDOR');

  // ---------------------------------------------------------------------------
  // ESTADOS PROVEEDOR (BODEGA/FABRICANTE)
  // ---------------------------------------------------------------------------
  const [provUnidades, setProvUnidades] = useState<number>(100);
  const [provCostoFabricacion, setProvCostoFabricacion] = useState<number>(12000);
  const [provGastosOperativos, setProvGastosOperativos] = useState<number>(3000);
  const [provPorcentajeDevoluciones, setProvPorcentajeDevoluciones] = useState<number>(15);
  const [provMargenDeseado, setProvMargenDeseado] = useState<number>(30);

  // ---------------------------------------------------------------------------
  // ESTADOS DROPSHIPPER
  // ---------------------------------------------------------------------------
  const [dropUnidades, setDropUnidades] = useState<number>(100);
  const [dropCostoProducto, setDropCostoProducto] = useState<number>(25000);
  const [dropFletePromedio, setDropFletePromedio] = useState<number>(14000);
  const [dropCpaAds, setDropCpaAds] = useState<number>(18000);
  const [dropTasaDevolucion, setDropTasaDevolucion] = useState<number>(15);
  const [dropMargenDeseado, setDropMargenDeseado] = useState<number>(25);

  // Ajustes de predeterminados según divisa seleccionada
  useEffect(() => {
    if (monedaSeleccionada.codigo === 'COP') {
      setProvCostoFabricacion(12000);
      setProvGastosOperativos(3000);

      setDropCostoProducto(25000);
      setDropFletePromedio(14000);
      setDropCpaAds(18000);
    } else {
      setProvCostoFabricacion(18);
      setProvGastosOperativos(5);

      setDropCostoProducto(45);
      setDropFletePromedio(25);
      setDropCpaAds(30);
    }
  }, [monedaSeleccionada.codigo]);

  const formatoMoneda = (monto: number) => 
    formatearMonedaGlobal(monto, monedaSeleccionada.codigo);

  // =================================--------------------------------==========
  // MATEMÁTICA Y LÓGICA DE PROVEEDOR (BODEGA) CON DESGLOSES COMPLETOS
  // =================================--------------------------------==========
  const metricasProveedor = useMemo(() => {
    const totalGenerados = Math.max(1, Number(provUnidades) || 1);
    const cFabricacion = Math.max(0, Number(provCostoFabricacion) || 0);
    const gOperativos = Math.max(0, Number(provGastosOperativos) || 0);
    const pctDevoluciones = Math.min(80, Math.max(0, Number(provPorcentajeDevoluciones) || 0)) / 100;
    const pctMargen = Math.min(80, Math.max(1, Number(provMargenDeseado) || 0)) / 100;

    const costoBaseUnitario = cFabricacion + gOperativos;
    
    // Provisión por pérdidas físicas / merma de garantía en devoluciones
    const factorRiesgo = (1 - pctDevoluciones) > 0 ? (pctDevoluciones / (1 - pctDevoluciones)) : 0;
    const provisionRiesgoFugaUnitario = costoBaseUnitario * factorRiesgo;
    const costoTotalAbsorbidoUnitario = costoBaseUnitario + provisionRiesgoFugaUnitario;

    const denominador = 1 - pctMargen;
    const precioSugeridoAlDrop = denominador > 0 ? (costoTotalAbsorbidoUnitario / denominador) : (costoTotalAbsorbidoUnitario * 2);
    
    const gananciaNetaUnidad = precioSugeridoAlDrop * pctMargen;
    
    // Totales globales para el desglose del lote
    const costoTotalFabricacionLote = cFabricacion * totalGenerados;
    const costoTotalFulfillmentLote = gOperativos * totalGenerados;
    const fondoReservaMermasTotal = provisionRiesgoFugaUnitario * totalGenerados;
    const ventaTotalProyectada = precioSugeridoAlDrop * totalGenerados;
    const gananciaNetaTotal = gananciaNetaUnidad * totalGenerados;

    return {
      qtyTotal: totalGenerados,
      costoBaseUnitario,
      provisionRiesgoFugaUnitario,
      costoTotalAbsorbidoUnitario,
      precioSugeridoAlDrop,
      gananciaNetaUnidad,
      costoTotalFabricacionLote,
      costoTotalFulfillmentLote,
      fondoReservaMermasTotal,
      ventaTotalProyectada,
      gananciaNetaTotal
    };
  }, [provUnidades, provCostoFabricacion, provGastosOperativos, provPorcentajeDevoluciones, provMargenDeseado]);

  // =================================--------------------------------==========
  // MATEMÁTICA Y LÓGICA DE DROPSHIPPER
  // =================================--------------------------------==========
  const metricasDropshipper = useMemo(() => {
    const totalGenerados = Math.max(1, Number(dropUnidades) || 1);
    const cProducto = Math.max(0, Number(dropCostoProducto) || 0);
    const fIda = Math.max(0, Number(dropFletePromedio) || 0);
    const cpaPorPedido = Math.max(0, Number(dropCpaAds) || 0);
    const pctDev = Math.min(90, Math.max(0, Number(dropTasaDevolucion) || 0)) / 100;
    const mDeseado = Math.min(80, Math.max(1, Number(dropMargenDeseado) || 0)) / 100;

    const udsDevueltas = totalGenerados * pctDev;
    const udsEntregadas = totalGenerados - udsDevueltas;

    // Desglose Unitario de Devolución
    const fleteDevolucionUnidad = fIda * 1.8;
    const cpaPerdidoUnidad = cpaPorPedido;

    // Desglose Global de Devolución
    const costoTotalFletesDevueltos = udsDevueltas * fleteDevolucionUnidad;
    const cpaTotalPerdidoDevoluciones = udsDevueltas * cpaPerdidoUnidad;
    const perdidaTotalDevoluciones = costoTotalFletesDevueltos + cpaTotalPerdidoDevoluciones;

    // Absorción
    const gastoTotalAds = totalGenerados * cpaPorPedido;
    const cpaEfectivoPorEntregado = udsEntregadas > 0 ? (gastoTotalAds / udsEntregadas) : 0;
    const castigoFletesUnitarioEfectivo = udsEntregadas > 0 ? (costoTotalFletesDevueltos / udsEntregadas) : 0;

    const costoBasePorEntregado = cProducto + fIda + cpaEfectivoPorEntregado + castigoFletesUnitarioEfectivo;

    const denominador = 1 - mDeseado;
    const precioVentaSugeridoFinal = denominador > 0 ? (costoBasePorEntregado / denominador) : (costoBasePorEntregado * 2);

    const gananciaNetaUnidad = precioVentaSugeridoFinal * mDeseado;
    const ventaTotalProyectada = precioVentaSugeridoFinal * udsEntregadas;
    const gananciaNetaTotal = gananciaNetaUnidad * udsEntregadas;

    const roasObjetivoReal = cpaEfectivoPorEntregado > 0 ? (precioVentaSugeridoFinal / cpaEfectivoPorEntregado) : 0;

    // Métricas Globales Operaciones
    const costoTotalProductosEntregados = cProducto * udsEntregadas;
    const costoTotalFletesEntregados = fIda * udsEntregadas;

    return {
      qtyTotal: totalGenerados,
      qtyEntregadas: Math.round(udsEntregadas),
      qtyDevueltas: Math.round(udsDevueltas),
      fleteIda: fIda,
      cpaEfectivoPorEntregado,
      castigoFletesUnitarioEfectivo,
      costoTotalFletesDevueltos,
      cpaTotalPerdidoDevoluciones,
      perdidaTotalDevoluciones,
      precioVentaSugeridoFinal,
      gananciaNetaUnidad,
      ventaTotalProyectada,
      gananciaNetaTotal,
      roasObjetivoReal,
      costoTotalProductosEntregados,
      costoTotalFletesEntregados,
      gastoTotalAds
    };
  }, [dropUnidades, dropCostoProducto, dropFletePromedio, dropCpaAds, dropTasaDevolucion, dropMargenDeseado]);

  return (
    <section className="relative z-10 py-12 px-4 sm:px-6 overflow-hidden w-full text-white font-sans">
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-10">
        
        {/* CABECERA GENERAL */}
        <div className="border-b border-slate-800 pb-6 text-center sm:text-left">
          <Kicker varianteFondo={variante}>SIMULADOR DE RENTABILIDAD ATOM</Kicker>
          <H1 varianteFondo={variante} className="text-balance mb-2">
            Calculadora de Absorción <Highlight varianteFondo={variante}>Financiera Real.</Highlight>
          </H1>
          <Subtitulo varianteFondo={variante} className="max-w-2xl">
            Calcula tus márgenes libres y precios de venta sugeridos absorbiendo el impacto real de mermas, fletes devueltos y pauta publicitaria.
          </Subtitulo>
        </div>

        {/* 📌 1. CAMBIO DE ORDEN: PROVEEDOR PRIMERO, DROPSHIPPER DESPUÉS */}
        <div className="flex bg-[#090D16] p-1.5 rounded-2xl border border-slate-800 w-full max-w-md mx-auto relative z-20 shadow-2xl">
          <button
            type="button"
            onClick={() => setModoSeleccionado('PROVEEDOR')}
            className={`relative flex-1 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer z-10 ${
              modoSeleccionado === 'PROVEEDOR' ? 'text-[#0DEDC0]' : 'text-slate-400 hover:text-white'
            }`}
          >
            {modoSeleccionado === 'PROVEEDOR' && (
              <motion.div
                layoutId="pildoraCalculadora"
                className="absolute inset-0 bg-[#102935] border border-[#0DEDC0]/40 rounded-xl shadow-[0_0_15px_rgba(13,237,192,0.2)] z-[-1]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Building2 className="w-4 h-4" />
            Soy Proveedor
          </button>

          <button
            type="button"
            onClick={() => setModoSeleccionado('DROPSHIPPER')}
            className={`relative flex-1 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer z-10 ${
              modoSeleccionado === 'DROPSHIPPER' ? 'text-[#0DEDC0]' : 'text-slate-400 hover:text-white'
            }`}
          >
            {modoSeleccionado === 'DROPSHIPPER' && (
              <motion.div
                layoutId="pildoraCalculadora"
                className="absolute inset-0 bg-[#102935] border border-[#0DEDC0]/40 rounded-xl shadow-[0_0_15px_rgba(13,237,192,0.2)] z-[-1]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <ShoppingBag className="w-4 h-4" />
            Soy Dropshipper
          </button>
        </div>

        {/* =================================================================== */}
        {/* VISTA 1: CALCULADORA PROVEEDOR (CON DESGLOSES COMPLETOS)            */}
        {/* =================================================================== */}
        {modoSeleccionado === 'PROVEEDOR' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* PANEL DE INPUTS PROVEEDOR */}
            <div className="lg:col-span-5 bg-[#090D16]/90 p-6 sm:p-7 rounded-2xl border border-slate-800 space-y-5 shadow-2xl backdrop-blur-md">
              <span className="text-xs font-mono font-bold text-[#0DEDC0] uppercase tracking-wider block border-b border-slate-800 pb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0DEDC0]" />
                1. Costos de Fabricación y Lote
              </span>

              <SelectorMonedaCustom
                monedaSeleccionada={monedaSeleccionada}
                setMonedaSeleccionada={setMonedaSeleccionada}
              />

              {/* LOTE TOTAL DE PRODUCCIÓN */}
              <div className="bg-[#102935]/80 border border-[#0DEDC0]/30 p-4 rounded-xl">
                <label className="block text-xs font-mono font-bold text-white uppercase mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#0DEDC0]" />
                    Lote Proyectado de Ventas (Unidades)
                  </span>
                  <Tooltip contenido="Volumen total de productos que proyectas vender a los dropshippers." />
                </label>
                <input
                  type="number"
                  min="1"
                  value={provUnidades}
                  onChange={(e) => setProvUnidades(Math.max(1, Number(e.target.value)))}
                  placeholder="100"
                  className="w-full bg-[#090D16] border border-[#0DEDC0]/40 rounded-lg p-3 font-mono text-white text-lg font-black text-center focus:border-[#0DEDC0] focus:ring-1 focus:ring-[#0DEDC0] outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Costo Neto Fabricación/Compra Unitario ({monedaSeleccionada.codigo})
                  <Tooltip contenido="El precio directo por unidad física pagado a fábrica, laboratorio o costo de importación." />
                </label>
                <input
                  type="number"
                  min="0"
                  value={provCostoFabricacion}
                  onChange={(e) => setProvCostoFabricacion(Number(e.target.value))}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 font-mono text-white text-sm font-bold focus:border-[#0DEDC0] outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Gastos Fulfillment / Empaque Unitario ({monedaSeleccionada.codigo})
                  <Tooltip contenido="Costo unitario de embalaje: caja, bolsa de seguridad, etiquetas, cinta y mano de obra de bodega." />
                </label>
                <input
                  type="number"
                  min="0"
                  value={provGastosOperativos}
                  onChange={(e) => setProvGastosOperativos(Number(e.target.value))}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 font-mono text-white text-sm font-bold focus:border-[#0DEDC0] outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div className="bg-red-950/30 border border-red-900/50 p-4 rounded-xl space-y-3">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    % Tasa de Merma / Fuga por Devoluciones
                    <Tooltip contenido="Porcentaje de mercancía destruida, robada o no recuperable tras el retorno de transportadora." />
                  </span>
                  <span className="font-mono text-red-400 font-bold">{provPorcentajeDevoluciones}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={provPorcentajeDevoluciones}
                  onChange={(e) => setProvPorcentajeDevoluciones(Number(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
              </div>

              <div className="bg-[#102935]/60 border border-[#0DEDC0]/30 p-4 rounded-xl space-y-3">
                <div className="flex justify-between text-xs font-semibold text-white">
                  <span className="flex items-center gap-1 text-[#0DEDC0]">
                    <TrendingUp className="w-3.5 h-3.5" />
                    % Margen de Ganancia Neta Deseada
                    <Tooltip contenido="Porcentaje de utilidad libre limpia que deseas conservar después de absorber todos los costos." />
                  </span>
                  <span className="font-mono text-[#0DEDC0] font-bold">{provMargenDeseado}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="80"
                  value={provMargenDeseado}
                  onChange={(e) => setProvMargenDeseado(Number(e.target.value))}
                  className="w-full accent-[#0DEDC0] cursor-pointer"
                />
              </div>
            </div>

            {/* PANEL DE RESULTADOS PROVEEDOR (RICO EN DESGLOSES Y VISUALMENTE ACORDE) */}
            <div className="lg:col-span-7 bg-[#090D16]/90 p-6 sm:p-7 rounded-2xl border border-slate-800 space-y-6 shadow-2xl backdrop-blur-md">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block border-b border-slate-800 pb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#0DEDC0]" />
                2. Resultado y Fijación de Precio Mayorista
              </span>

              {/* TARJETA PRINCIPAL PRECIO MAYORISTA SUGERIDO */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-gradient-to-br from-[#102935] via-[#0D222E] to-[#0A1A24] p-6 sm:p-8 rounded-2xl border-2 border-[#0DEDC0] text-center space-y-4 shadow-[0_0_40px_rgba(13,237,192,0.2)] relative overflow-hidden"
              >
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest block flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#0DEDC0]" />
                  PRECIO SUGERIDO DE VENTA EN DROPI (AL DROPSHIPPER)
                  <Tooltip contenido="Precio mayorista oficial al que debes publicar este producto para garantizar tu utilidad." />
                </span>
                
                <span className="text-4xl sm:text-6xl font-black font-mono text-[#0DEDC0] block my-2 drop-shadow-[0_0_15px_rgba(13,237,192,0.5)]">
                  <AnimatedNumber 
                    value={metricasProveedor.precioSugeridoAlDrop} 
                    formatter={(v) => formatoMoneda(v)} 
                  />
                </span>
                
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div className="bg-[#090D16]/80 px-4 py-2 rounded-xl border border-[#0DEDC0]/30">
                    <span className="text-xs text-white font-mono font-semibold">
                      Ganancia Neta por Ud.:{" "}
                      <span className="text-[#0DEDC0] font-bold text-sm">
                        <AnimatedNumber 
                          value={metricasProveedor.gananciaNetaUnidad} 
                          formatter={(v) => formatoMoneda(v)} 
                        />
                      </span>
                    </span>
                  </div>

                  <div className="bg-[#0DEDC0]/10 px-4 py-2 rounded-xl border border-[#0DEDC0]/40 flex items-center gap-2">
                    <Percent className="w-4 h-4 text-[#0DEDC0]" />
                    <span className="text-xs text-white font-mono font-semibold">
                      Margen Libre Real:{" "}
                      <span className="text-[#0DEDC0] font-bold text-sm">
                        {provMargenDeseado}%
                      </span>
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* 📌 DESGLOSE UNITARIO COMPLETO PROVEEDOR */}
              <div className="bg-[#102935]/40 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1 flex items-center gap-1">
                  <Calculator className="w-3.5 h-3.5 text-[#0DEDC0]" />
                  Desglose Unitario por Unidad Vendida ({formatoMoneda(metricasProveedor.precioSugeridoAlDrop)}):
                </span>
                <div className="flex justify-between text-slate-300">
                  <span>• Costo Fabricación / Compra:</span>
                  <span>{formatoMoneda(provCostoFabricacion)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>• Gastos Fulfillment / Empaque:</span>
                  <span>{formatoMoneda(provGastosOperativos)}</span>
                </div>
                <div className="flex justify-between text-red-400 font-bold">
                  <span>• Provisión Fuga / Merma Devolución ({provPorcentajeDevoluciones}%):</span>
                  <span>{formatoMoneda(metricasProveedor.provisionRiesgoFugaUnitario)}</span>
                </div>
                <div className="flex justify-between text-[#0DEDC0] font-bold border-t border-slate-800 pt-2 text-sm">
                  <span>(=) Ganancia Neta Libre Proveedor ({provMargenDeseado}%):</span>
                  <span>{formatoMoneda(metricasProveedor.gananciaNetaUnidad)}</span>
                </div>
              </div>

              {/* 📌 DESGLOSE GLOBAL DE LA OPERACIÓN DE BODEGA */}
              <div className="bg-[#090D16] border border-slate-800 p-5 rounded-2xl space-y-3 font-mono shadow-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block border-b border-slate-800 pb-2">
                  Desglose Global del Lote ({metricasProveedor.qtyTotal} Unidades Vendidas a Dropshippers)
                </span>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 uppercase font-bold">(+) Facturación Total Bruta ({metricasProveedor.qtyTotal} uds):</span>
                  <span className="text-white font-black text-base">{formatoMoneda(metricasProveedor.ventaTotalProyectada)}</span>
                </div>

                <div className="space-y-1 text-[11px] text-slate-400 border-t border-b border-slate-800 py-2">
                  <div className="flex justify-between">
                    <span>(-) Costo Total de Fabricación ({metricasProveedor.qtyTotal} uds):</span>
                    <span>{formatoMoneda(metricasProveedor.costoTotalFabricacionLote)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>(-) Costo Total Fulfillment / Empaque ({metricasProveedor.qtyTotal} uds):</span>
                    <span>{formatoMoneda(metricasProveedor.costoTotalFulfillmentLote)}</span>
                  </div>
                  <div className="flex justify-between text-red-400 font-semibold">
                    <span>(-) Fondo Total Provisión Mermas ({provPorcentajeDevoluciones}% mermas):</span>
                    <span>{formatoMoneda(metricasProveedor.fondoReservaMermasTotal)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
                  <span className="text-[#0DEDC0] uppercase font-extrabold tracking-wider">Ganancia Neta Acumulada Libre:</span>
                  <span className="text-[#0DEDC0] font-black text-base bg-[#0DEDC0]/10 px-3 py-1 rounded-lg border border-[#0DEDC0]/30">
                    {formatoMoneda(metricasProveedor.gananciaNetaTotal)}
                  </span>
                </div>
              </div>

              {/* CRITERIO DE BLINDAJE PROVEEDOR */}
              <div className="bg-[#102935]/40 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#0DEDC0]" />
                  <span className="text-[#0DEDC0] font-bold text-xs font-mono uppercase tracking-wider">Estrategia de Blindaje de Bodega</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Al precargar la provisión de riesgo ({provPorcentajeDevoluciones}%) equivalente a <strong className="text-white">{formatoMoneda(metricasProveedor.fondoReservaMermasTotal)}</strong> en el lote, aseguras que las ventas completadas <strong className="text-white">financien la reposición de unidades averiadas o no recuperadas</strong>, protegiendo intacto tu margen neto del {provMargenDeseado}% ({formatoMoneda(metricasProveedor.gananciaNetaTotal)}).
                </p>
              </div>

            </div>
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* VISTA 2: CALCULADORA DROPSHIPPER                                    */}
        {/* =================================================================== */}
        {modoSeleccionado === 'DROPSHIPPER' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* PANEL DE PARÁMETROS DROPSHIPPER */}
            <div className="lg:col-span-5 bg-[#090D16]/90 p-6 sm:p-7 rounded-2xl border border-slate-800 space-y-5 shadow-2xl backdrop-blur-md">
              <span className="text-xs font-mono font-bold text-[#0DEDC0] uppercase tracking-wider block border-b border-slate-800 pb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#0DEDC0]" />
                1. Datos de Operación y Pauta
              </span>

              <SelectorMonedaCustom
                monedaSeleccionada={monedaSeleccionada}
                setMonedaSeleccionada={setMonedaSeleccionada}
              />

              {/* UNIDADES GENERADAS */}
              <div className="bg-[#102935]/80 border border-[#0DEDC0]/30 p-4 rounded-xl">
                <label className="block text-xs font-mono font-bold text-white uppercase mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-[#0DEDC0]" />
                    Pedidos Totales Generados
                  </span>
                  <Tooltip contenido="Volumen total de pedidos conseguidos en tu pauta publicitaria." />
                </label>
                <input
                  type="number"
                  min="1"
                  value={dropUnidades}
                  onChange={(e) => setDropUnidades(Math.max(1, Number(e.target.value)))}
                  placeholder="100"
                  className="w-full bg-[#090D16] border border-[#0DEDC0]/40 rounded-lg p-3 font-mono text-white text-lg font-black text-center focus:border-[#0DEDC0] focus:ring-1 focus:ring-[#0DEDC0] outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              {/* COSTO BODEGA */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Costo del Producto ({monedaSeleccionada.codigo})
                  <Tooltip contenido="Precio del producto ofrecido por el proveedor en Dropi." />
                </label>
                <input
                  type="number"
                  min="0"
                  value={dropCostoProducto}
                  onChange={(e) => setDropCostoProducto(Number(e.target.value))}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 font-mono text-white text-sm font-bold focus:border-[#0DEDC0] outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              {/* FLETE SALIDA */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  Flete Promedio de Salida ({monedaSeleccionada.codigo})
                  <Tooltip contenido="Costo cobrado por la transportadora para llevar el pedido." />
                </label>
                <input
                  type="number"
                  min="0"
                  value={dropFletePromedio}
                  onChange={(e) => setDropFletePromedio(Number(e.target.value))}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 font-mono text-white text-sm font-bold focus:border-[#0DEDC0] outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              {/* CPA ADS */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-slate-400" />
                  CPA Deseado en Anuncios ({monedaSeleccionada.codigo})
                  <Tooltip contenido="Costo por adquisición cobrado por Meta o TikTok por cada pedido registrado." />
                </label>
                <input
                  type="number"
                  min="0"
                  value={dropCpaAds}
                  onChange={(e) => setDropCpaAds(Number(e.target.value))}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 font-mono text-white text-sm font-bold focus:border-[#0DEDC0] outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              {/* SLIDER DEVOLUCIONES */}
              <div className="bg-red-950/30 border border-red-900/50 p-4 rounded-xl space-y-3">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    % Devoluciones Estimadas
                    <Tooltip contenido="Tasa estimada de pedidos no entregados en pago contra entrega." />
                  </span>
                  <span className="font-mono text-red-400 font-bold">{dropTasaDevolucion}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={dropTasaDevolucion}
                  onChange={(e) => setDropTasaDevolucion(Number(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
              </div>

              {/* SLIDER MARGEN DESEADO */}
              <div className="bg-[#102935]/60 border border-[#0DEDC0]/30 p-4 rounded-xl space-y-3">
                <div className="flex justify-between text-xs font-semibold text-white">
                  <span className="flex items-center gap-1 text-[#0DEDC0]">
                    <TrendingUp className="w-3.5 h-3.5" />
                    % Ganancia Neta Libre Deseada
                    <Tooltip contenido="Margen de utilidad limpia que deseas obtener sobre las ventas entregadas." />
                  </span>
                  <span className="font-mono text-[#0DEDC0] font-bold">{dropMargenDeseado}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={dropMargenDeseado}
                  onChange={(e) => setDropMargenDeseado(Number(e.target.value))}
                  className="w-full accent-[#0DEDC0] cursor-pointer"
                />
              </div>
            </div>

            {/* PANEL DE RESULTADOS ANIMADO DROPSHIPPER */}
            <div className="lg:col-span-7 bg-[#090D16]/90 p-6 sm:p-7 rounded-2xl border border-slate-800 space-y-6 shadow-2xl backdrop-blur-md">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block border-b border-slate-800 pb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#0DEDC0]" />
                2. Resultado y Métricas Objetivo
              </span>

              {/* TARJETA PRINCIPAL PRECIO SUGERIDO */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-gradient-to-br from-[#102935] via-[#0D222E] to-[#0A1A24] p-6 sm:p-8 rounded-2xl border-2 border-[#0DEDC0] text-center space-y-4 shadow-[0_0_40px_rgba(13,237,192,0.2)] relative overflow-hidden"
              >
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest block flex items-center justify-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#0DEDC0]" />
                  PRECIO SUGERIDO DE VENTA AL CLIENTE FINAL
                  <Tooltip contenido="Precio recomendado para proteger tu margen neto absorbiendo cancelaciones y pauta total." />
                </span>
                
                <span className="text-4xl sm:text-6xl font-black font-mono text-[#0DEDC0] block my-2 drop-shadow-[0_0_15px_rgba(13,237,192,0.5)]">
                  <AnimatedNumber 
                    value={metricasDropshipper.precioVentaSugeridoFinal} 
                    formatter={(v) => formatoMoneda(v)} 
                  />
                </span>
                
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div className="bg-[#090D16]/80 px-4 py-2 rounded-xl border border-[#0DEDC0]/30">
                    <span className="text-xs text-white font-mono font-semibold">
                      Ganancia Neta por Ud.:{" "}
                      <span className="text-[#0DEDC0] font-bold text-sm">
                        <AnimatedNumber 
                          value={metricasDropshipper.gananciaNetaUnidad} 
                          formatter={(v) => formatoMoneda(v)} 
                        />
                      </span>
                    </span>
                  </div>

                  <div className="bg-[#0DEDC0]/10 px-4 py-2 rounded-xl border border-[#0DEDC0]/40 flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#0DEDC0]" />
                    <span className="text-xs text-white font-mono font-semibold">
                      ROAS Mínimo Objetivo:{" "}
                      <span className="text-[#0DEDC0] font-bold text-sm">
                        <AnimatedNumber 
                          value={metricasDropshipper.roasObjetivoReal} 
                          formatter={(v) => `${v.toFixed(2)}x`} 
                        />
                      </span>
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* DESGLOSE UNITARIO COMPLETO */}
              <div className="bg-[#102935]/40 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1 flex items-center gap-1">
                  <Calculator className="w-3.5 h-3.5 text-[#0DEDC0]" />
                  Desglose Unitario por Orden Entregada ({formatoMoneda(metricasDropshipper.precioVentaSugeridoFinal)}):
                </span>
                <div className="flex justify-between text-slate-300">
                  <span>• Costo Producto (Bodega):</span>
                  <span>{formatoMoneda(dropCostoProducto)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>• Flete Envío Exitoso:</span>
                  <span>{formatoMoneda(metricasDropshipper.fleteIda)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>• CPA Absorbiendo Cancelaciones:</span>
                  <span>{formatoMoneda(metricasDropshipper.cpaEfectivoPorEntregado)}</span>
                </div>
                <div className="flex justify-between text-red-400 font-bold">
                  <span>• Absorción Fletes Devueltos (180%):</span>
                  <span>{formatoMoneda(metricasDropshipper.castigoFletesUnitarioEfectivo)}</span>
                </div>
                <div className="flex justify-between text-white font-bold border-t border-slate-800 pt-2 text-sm">
                  <span>(=) Ganancia Neta Libre ({dropMargenDeseado}%):</span>
                  <span className="text-[#0DEDC0]">{formatoMoneda(metricasDropshipper.gananciaNetaUnidad)}</span>
                </div>
              </div>

              {/* DESGLOSE GLOBAL DE OPERACIÓN */}
              <div className="bg-[#090D16] border border-slate-800 p-5 rounded-2xl space-y-3 font-mono shadow-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block border-b border-slate-800 pb-2">
                  Desglose Global de la Operación ({metricasDropshipper.qtyTotal} Órdenes Totales)
                </span>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 uppercase font-bold">(+) Venta Total Real ({metricasDropshipper.qtyEntregadas} entregadas):</span>
                  <span className="text-white font-black text-base">{formatoMoneda(metricasDropshipper.ventaTotalProyectada)}</span>
                </div>

                <div className="space-y-1 text-[11px] text-slate-400 border-t border-b border-slate-800 py-2">
                  <div className="flex justify-between">
                    <span>(-) Costo de Productos ({metricasDropshipper.qtyEntregadas} uds):</span>
                    <span>{formatoMoneda(metricasDropshipper.costoTotalProductosEntregados)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>(-) Fletes de Envíos Entregados ({metricasDropshipper.qtyEntregadas} uds):</span>
                    <span>{formatoMoneda(metricasDropshipper.costoTotalFletesEntregados)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>(-) Inversión Publicitaria Total ({metricasDropshipper.qtyTotal} ads):</span>
                    <span>{formatoMoneda(metricasDropshipper.gastoTotalAds)}</span>
                  </div>
                  <div className="flex justify-between text-red-400">
                    <span>(-) Fletes Devoluciones ({metricasDropshipper.qtyDevueltas} devueltas x 1.8):</span>
                    <span>{formatoMoneda(metricasDropshipper.costoTotalFletesDevueltos)}</span>
                  </div>
                  <div className="flex justify-between text-red-400">
                    <span>(-) Publicidad "Quemada" ({metricasDropshipper.qtyDevueltas} devueltas x CPA):</span>
                    <span>{formatoMoneda(metricasDropshipper.cpaTotalPerdidoDevoluciones)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-red-400 font-semibold">
                  <span className="flex items-center gap-1 uppercase">
                    <TrendingDown className="w-3.5 h-3.5" />
                    (-) Impacto Total Devoluciones ({metricasDropshipper.qtyDevueltas} canceladas):
                  </span>
                  <span className="font-bold">{formatoMoneda(metricasDropshipper.perdidaTotalDevoluciones)}</span>
                </div>

                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
                  <span className="text-[#0DEDC0] uppercase font-extrabold tracking-wider">Ganancia Neta Acumulada Libre:</span>
                  <span className="text-[#0DEDC0] font-black text-base bg-[#0DEDC0]/10 px-3 py-1 rounded-lg border border-[#0DEDC0]/30">
                    {formatoMoneda(metricasDropshipper.gananciaNetaTotal)}
                  </span>
                </div>
              </div>

              {/* CRITERIO FINANCIERO */}
              <div className="bg-[#102935]/40 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#0DEDC0]" />
                  <span className="text-[#0DEDC0] font-bold text-xs font-mono uppercase tracking-wider">Criterio Financiero de Absorción</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  De las <strong className="text-white">{metricasDropshipper.qtyTotal} órdenes</strong>, estimamos que <strong className="text-white">{metricasDropshipper.qtyEntregadas} serán entregadas</strong> y <strong className="text-white">{metricasDropshipper.qtyDevueltas} devueltas</strong>. La inversión publicitaria de los pedidos cancelados ({formatoMoneda(metricasDropshipper.cpaTotalPerdidoDevoluciones)}) y la penalización por retorno de fletes ({formatoMoneda(metricasDropshipper.costoTotalFletesDevueltos)}) se transfieren al precio sugerido para proteger tu margen neto.
                </p>
              </div>

            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}