'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
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
import { MONEDAS, MonedaConfig, formatearMonedaGlobal, obtenerTarifasImpuesto } from '@/app/lib/moneda';
import Pagina2 from './Pagina2';

export type EscenarioTipo = 'OPTIMISTA' | 'IDEAL' | 'MARGEN_ALTO' | 'ESTRES';

interface Pagina1Props {
  variante?: TipoFondo;
}

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

export function Tooltip({ contenido }: { contenido: string }) {
  return (
    <div className="relative inline-flex items-center group ml-1.5 align-middle z-10 hover:z-50">
      <span className="w-4 h-4 rounded-full bg-[#102935] border border-[#0DEDC0]/60 text-[#0DEDC0] text-[10px] font-mono font-bold flex items-center justify-center cursor-help transition-all duration-200 group-hover:bg-[#0DEDC0] group-hover:text-[#090D16] group-hover:scale-110 shrink-0 shadow-[0_0_8px_rgba(13,237,192,0.3)]">
        ?
      </span>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center w-64 p-3 bg-[#080C14] border border-[#0DEDC0]/50 rounded-xl text-[11px] font-sans text-slate-200 font-normal leading-relaxed text-center shadow-[0_15px_30px_rgba(0,0,0,0.9)] z-50">
        {contenido}
        <div className="w-2.5 h-2.5 bg-[#080C14] border-r border-b border-[#0DEDC0]/50 rotate-45 -mb-4 mt-1" />
      </div>
    </div>
  );
}

function SelectorMonedaCustom({
  monedaSeleccionada,
  onSeleccionarMoneda,
}: {
  monedaSeleccionada: MonedaConfig;
  onSeleccionarMoneda: (m: MonedaConfig) => void;
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
    <div className="relative z-20" ref={contenedorRef}>
      <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase tracking-wider">
        Moneda de Operación
        <Tooltip contenido="Selecciona la divisa oficial para formatear valores y cargar impuestos por defecto de la región." />
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
          <span className="truncate">{monedaSeleccionada.nombre} ({monedaSeleccionada.simbolo})</span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-[#0DEDC0] transition-transform duration-300 ${abierto ? 'rotate-180' : ''}`}
        />
      </button>

      {abierto && (
        <div className="absolute top-full left-0 w-full mt-2 bg-[#090D16]/95 backdrop-blur-xl border border-[#0DEDC0]/40 rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.9)] z-50 overflow-hidden">
          <div className="max-h-56 overflow-y-auto py-1 divide-y divide-slate-800/60 custom-scrollbar">
            {MONEDAS.map((m) => {
              const esSeleccionada = m.codigo === monedaSeleccionada.codigo;
              return (
                <button
                  key={m.codigo}
                  type="button"
                  onClick={() => {
                    onSeleccionarMoneda(m);
                    setAbierto(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs font-bold transition-all duration-150 flex items-center justify-between cursor-pointer ${
                    esSeleccionada ? 'bg-[#102935] text-[#0DEDC0]' : 'text-slate-300 hover:bg-[#102935]/60 hover:text-[#0DEDC0]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      esSeleccionada ? 'bg-[#0DEDC0]/20 text-[#0DEDC0] border border-[#0DEDC0]/40' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {m.codigo}
                    </span>
                    <span>{m.nombre}</span>
                  </div>
                  {esSeleccionada && <Check className="w-4 h-4 text-[#0DEDC0]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Pagina1({ variante = 'hexGrid' }: Pagina1Props) {
  const [monedaSeleccionada, setMonedaSeleccionada] = useState<MonedaConfig>(MONEDAS[0]);

  const propuestaRef = useRef<HTMLDivElement>(null);

  // INPUTS PASO 1
  const [costoFabricacion, setCostoFabricacion] = useState<number>(15000);
  const [costoEmpaque, setCostoEmpaque] = useState<number>(2000);
  const [costoLogisticaInversa, setCostoLogisticaInversa] = useState<number>(0); 
  
  const [porcentajeDevoluciones, setPorcentajeDevoluciones] = useState<number>(20); 
  
  // 📌 1. MERMA MÍNIMA FIJADA EN 1% POR DEFECTO (NO PUEDE SER 0)
  const [porcentajeMermas, setPorcentajeMermas] = useState<number>(10); 
  
  const [impactoFiscal, setImpactoFiscal] = useState<number>(0);
  const [margenDeseado, setMargenDeseado] = useState<number>(30);

  const [mensajeAlertaMermas, setMensajeAlertaMermas] = useState<boolean>(false);
  const [escenarioSeleccionado, setEscenarioSeleccionado] = useState<EscenarioTipo>('IDEAL');

  // INPUTS PASO 3
  const [unidadesProyectadas, setUnidadesProyectadas] = useState<number>(170);
  const [comisionDropExtra, setComisionDropExtra] = useState<number>(5);

  const notificarCondicionesMermas = useCallback(() => {
    setMensajeAlertaMermas(true);
    const timer = setTimeout(() => setMensajeAlertaMermas(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  const seleccionarEscenarioConScroll = (escenario: EscenarioTipo) => {
    setEscenarioSeleccionado(escenario);
    setTimeout(() => {
      if (propuestaRef.current) {
        propuestaRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const formatoMoneda = useCallback(
    (monto: number) => formatearMonedaGlobal(monto, monedaSeleccionada.codigo),
    [monedaSeleccionada.codigo]
  );

  const cambiarMoneda = (m: MonedaConfig) => {
    setMonedaSeleccionada(m);
    const tarifas = obtenerTarifasImpuesto(m.codigo);
    if (tarifas && tarifas.length > 0) {
      setImpactoFiscal(tarifas[0].valor);
    }
  };

  const metricas = useMemo(() => {
    const cFab = Math.max(0, Number(costoFabricacion) || 0);
    const cEmp = Math.max(0, Number(costoEmpaque) || 0);
    const cBase = cFab + cEmp; 
    const cRetorno = Math.max(0, Number(costoLogisticaInversa) || 0); 
    const qty = Math.max(1, Number(unidadesProyectadas) || 1);
    
    const pctMargenBase = Math.min(0.80, Math.max(0.01, (Number(margenDeseado) || 1) / 100));
    const pctIVA = Math.min(0.50, Math.max(0, (Number(impactoFiscal) || 0) / 100));
    
    const pctDevBase = Math.min(0.80, Math.max(0.01, (Number(porcentajeDevoluciones) || 0) / 100));
    
    // 📌 2. REGLA ESTRICTA: Mínimo 1% de merma (0.01)
    const pctMermasBase = Math.min(0.50, Math.max(0.01, (Number(porcentajeMermas) || 1) / 100));
    const pctComisionExtra = Math.min(0.30, Math.max(0, (Number(comisionDropExtra) || 0) / 100));

    const calcularEscenario = (pDev: number, pMerma: number, pMargen: number) => {
      // Garantizar estrictamente mínimo 1% (0.01) en merma
      const mermaReal = Math.max(0.01, pMerma);
      const factorDev = (1 - pDev) > 0 ? (pDev / (1 - pDev)) : 0;
      const costoDev = cRetorno * factorDev;
      const costoMerma = cBase * factorDev * mermaReal;

      const costoAbsorbido = cBase + costoDev + costoMerma;

      const denomMargen = 1 - pMargen;
      const precioNeto = denomMargen > 0.01 ? (costoAbsorbido / denomMargen) : (costoAbsorbido * 2);
      
      const impuestoIVA = precioNeto * pctIVA;
      const precioCatalogo = precioNeto + impuestoIVA;
      const ganancia = precioNeto * pMargen;

      return { 
        pDevPct: (pDev * 100).toFixed(1),
        pMermaPct: (mermaReal * 100).toFixed(1),
        pMargenPct: (pMargen * 100).toFixed(1),
        costoDev, 
        costoMerma, 
        costoAbsorbido, 
        precioNeto, 
        impuestoIVA, 
        precioCatalogo, 
        ganancia 
      };
    };

    // 1. ESCENARIO IDEAL (DATOS CLIENTE)
    const ideal = calcularEscenario(pctDevBase, pctMermasBase, pctMargenBase);

    // 2. ESCENARIO ESTRÉS (+7% DEVOLUCIÓN, +2% PÉRDIDA)
    const pctDevEstres = Math.min(0.85, pctDevBase + 0.07);
    const pctMermasEstres = Math.min(0.50, pctMermasBase + 0.02);
    const estres = calcularEscenario(pctDevEstres, pctMermasEstres, pctMargenBase);

    // 3. ESCENARIO OPTIMISTA (-5% DEVOLUCIÓN, -3% PÉRDIDA - CON PISO MÍNIMO DEL 1%)
    const pctDevOpt = Math.max(0.01, pctDevBase - 0.05);
    const pctMermasOpt = Math.max(0.01, pctMermasBase - 0.03); // 📌 Nunca menor a 1%
    const optimista = calcularEscenario(pctDevOpt, pctMermasOpt, pctMargenBase);

    // 4. ESCENARIO MARGEN ELEVADO (+5% MARGEN)
    const pctMargenAlto = Math.min(0.85, pctMargenBase + 0.05);
    const margenAlto = calcularEscenario(pctDevBase, pctMermasBase, pctMargenAlto);

    let activo = ideal;
    let margenActivo = pctMargenBase;
    let devActivo = pctDevBase;
    
    if (escenarioSeleccionado === 'OPTIMISTA') { activo = optimista; devActivo = pctDevOpt; }
    if (escenarioSeleccionado === 'IDEAL') { activo = ideal; devActivo = pctDevBase; }
    if (escenarioSeleccionado === 'MARGEN_ALTO') { activo = margenAlto; margenActivo = pctMargenAlto; }
    if (escenarioSeleccionado === 'ESTRES') { activo = estres; devActivo = pctDevEstres; }

    const comisionOp1 = activo.precioNeto * pctComisionExtra;
    const gananciaNetaOp1 = activo.ganancia - comisionOp1;
    const margenNetaOp1 = activo.precioNeto > 0 ? (gananciaNetaOp1 / activo.precioNeto) * 100 : 0;

    const divisorOp2 = 1 - margenActivo - pctComisionExtra;
    const precioNetoOp2 = divisorOp2 > 0.01 ? (activo.costoAbsorbido / divisorOp2) : (activo.costoAbsorbido * 2.5);
    const impuestoOp2 = precioNetoOp2 * pctIVA;
    const precioCatalogoOp2 = precioNetoOp2 + impuestoOp2;
    const comisionOp2 = precioNetoOp2 * pctComisionExtra;
    const gananciaNetaOp2 = precioNetoOp2 * margenActivo;

    const totalVentasOp1 = activo.precioCatalogo * qty;
    const totalComisionOp1 = comisionOp1 * qty;
    const totalGananciaOp1 = gananciaNetaOp1 * qty;
    const totalCostosOp1 = activo.costoAbsorbido * qty;

    const totalVentasOp2 = precioCatalogoOp2 * qty;
    const totalComisionOp2 = comisionOp2 * qty;
    const totalGananciaOp2 = gananciaNetaOp2 * qty;
    const totalCostosOp2 = activo.costoAbsorbido * qty;

    return {
      cBase, cRetorno, qty, pctDevBase, pctComisionExtra, pctIVA, pctMargenBase,
      ideal, estres, optimista, margenAlto,
      fav: ideal,
      pes: estres,
      opt: optimista,
      obj: margenAlto,
      activo, devActivo, margenActivo,
      comisionOp1, gananciaNetaOp1, margenNetaOp1, totalVentasOp1, totalComisionOp1, totalGananciaOp1, totalCostosOp1,
      precioCatalogoOp2, impuestoOp2, comisionOp2, gananciaNetaOp2, totalVentasOp2, totalComisionOp2, totalGananciaOp2, totalCostosOp2,
    };
  }, [
    costoFabricacion, costoEmpaque, costoLogisticaInversa, margenDeseado, impactoFiscal, 
    porcentajeDevoluciones, porcentajeMermas, unidadesProyectadas, comisionDropExtra, escenarioSeleccionado
  ]);

  return (
    <section className="relative z-10 py-12 px-4 sm:px-6 overflow-hidden w-full border-b border-[#0DEDC0]/10 text-white font-sans">
      <Fondos variante={variante} modo="absolute" />

      {mensajeAlertaMermas && (
        <div className="fixed top-6 right-6 z-50 max-w-md bg-[#090D16]/95 border-2 border-amber-400 p-4 rounded-2xl shadow-[0_10px_40px_rgba(245,158,11,0.4)] text-white">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
              i
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase block mb-1">
                Condición de Entrega Operativa
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                Nota: Este valor solo se puede entregar si se cumple estrictamente con las condiciones especificadas en la tarjeta de propuesta.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto space-y-10">
        
        <div className="border-b border-slate-800 pb-6">
          <Kicker varianteFondo={variante}>HERRAMIENTA PARA GERENCIA B2B</Kicker>
          <H1 varianteFondo={variante} className="text-balance mb-2">
            Arquitectura de <Highlight varianteFondo={variante}>Precios & Sensibilidad.</Highlight>
          </H1>
          <Subtitulo varianteFondo={variante} className="max-w-2xl">
            Audita matemáticamente tus costos logísticos inversos. Analiza los 4 escenarios de sensibilidad operativa y emite la propuesta comercial definitiva.
          </Subtitulo>
        </div>

        <div className="bg-[#090D16]/90 p-4 sm:p-5 rounded-2xl border border-slate-800 max-w-md">
          <SelectorMonedaCustom
            monedaSeleccionada={monedaSeleccionada}
            onSeleccionarMoneda={cambiarMoneda}
          />
        </div>

        {/* PASO 1 */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#0DEDC0]/20 to-[#0DEDC0]/5 border border-[#0DEDC0]/40 text-[#0DEDC0] font-black font-mono text-base sm:text-lg shadow-[0_0_15px_rgba(13,237,192,0.2)] shrink-0">
              1
            </div>
            <h2 className="text-sm sm:text-base md:text-lg font-black text-white uppercase tracking-widest m-0">
              Costo Operativo <span className="text-slate-400 font-medium tracking-wide">y Estructura Fiscal</span>
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[#0DEDC0]/40 via-slate-700 to-transparent hidden sm:block"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            <div className="bg-[#090D16]/90 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl h-full">
              <span className="text-xs font-mono font-bold text-[#0DEDC0] uppercase tracking-wider block border-b border-slate-800 pb-2 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#0DEDC0]" /> Costos de Producción
              </span>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Costo CIF / Fabricación
                  <Tooltip contenido="Costo del producto puesto en bodega, incluyendo compra, flete marítimo/terrestre y aranceles de importación." />
                </label>
                <input
                  type="number" min="0" value={costoFabricacion} onChange={(e) => setCostoFabricacion(Number(e.target.value))}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-2.5 font-mono text-white text-sm font-bold focus:border-[#0DEDC0] outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Alistamiento / Empaque
                  <Tooltip contenido="Gasto unitario por alistamiento, picking, packing, insumos de embalaje, etiquetas y días promedio de almacenamiento en bodega." />
                </label>
                <input
                  type="number" min="0" value={costoEmpaque} onChange={(e) => setCostoEmpaque(Number(e.target.value))}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-2.5 font-mono text-white text-sm font-bold focus:border-[#0DEDC0] outline-none"
                />
              </div>
            </div>

            <div className="bg-[#090D16]/90 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl h-full">
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block border-b border-slate-800 pb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" /> Provisión Fricción Logística COD
                <Tooltip contenido="Reserva financiera calculada para absorber las devoluciones y los productos no recuperados." />
              </span>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 text-amber-300">
                  Costo Logística Inversa (Retorno)
                  <Tooltip contenido="Costos adicionales cuando el paquete es rechazado y regresa a la bodega de origen." />
                </label>
                <input
                  type="number" min="0" value={costoLogisticaInversa} onChange={(e) => setCostoLogisticaInversa(Number(e.target.value))} placeholder="0"
                  className="w-full bg-[#1A160B] border border-amber-900/50 rounded-xl p-2.5 font-mono text-amber-100 text-sm font-bold focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div 
                  onClick={notificarCondicionesMermas}
                  className="bg-red-950/20 border border-red-900/40 p-2.5 rounded-xl hover:border-red-500/50 transition-colors"
                >
                  <div className="flex justify-between items-center text-[10px] font-semibold text-red-300 mb-1.5">
                    <span className="flex items-center">
                      Devolución
                      <Tooltip contenido="Porcentaje estimado de guías que no logran entregarse y deben ser retornadas." />
                    </span>
                    <div className="flex items-center gap-1 bg-red-950/80 border border-red-800/60 rounded px-1.5 py-0.5">
                      <input
                        type="number"
                        min="15"
                        max="50"
                        value={porcentajeDevoluciones}
                        onChange={(e) => {
                          const val = Math.min(50, Math.max(15, Number(e.target.value)));
                          setPorcentajeDevoluciones(val);
                          notificarCondicionesMermas();
                        }}
                        className="w-8 bg-transparent text-right font-mono text-red-400 font-bold outline-none text-[11px]"
                      />
                      <span className="text-red-400 font-mono text-[10px]">%</span>
                    </div>
                  </div>
                  <input 
                    type="range" min="15" max="50" 
                    value={porcentajeDevoluciones} 
                    onChange={(e) => {
                      setPorcentajeDevoluciones(Number(e.target.value));
                      notificarCondicionesMermas();
                    }} 
                    className="w-full accent-red-500 cursor-pointer" 
                  />
                  <span className="text-[9px] text-slate-500 block mt-1">Piso Técnico 15%</span>
                </div>

                {/* 📌 MÍNIMO DE MERMA = 1% */}
                <div 
                  onClick={notificarCondicionesMermas}
                  className="bg-red-950/20 border border-red-900/40 p-2.5 rounded-xl hover:border-red-500/50 transition-colors"
                >
                  <div className="flex justify-between items-center text-[10px] font-semibold text-red-300 mb-1.5">
                    <span className="flex items-center">
                      Mermas
                      <Tooltip contenido="Porcentaje de mercancía perdida o destruida sobre devoluciones. Mínimo 1%." />
                    </span>
                    <div className="flex items-center gap-1 bg-red-950/80 border border-red-800/60 rounded px-1.5 py-0.5">
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={porcentajeMermas}
                        onChange={(e) => {
                          const val = Math.min(30, Math.max(1, Number(e.target.value)));
                          setPorcentajeMermas(val);
                          notificarCondicionesMermas();
                        }}
                        className="w-8 bg-transparent text-right font-mono text-red-400 font-bold outline-none text-[11px]"
                      />
                      <span className="text-red-400 font-mono text-[10px]">%</span>
                    </div>
                  </div>
                  <input 
                    type="range" min="1" max="30" 
                    value={porcentajeMermas} 
                    onChange={(e) => {
                      const val = Math.max(1, Number(e.target.value));
                      setPorcentajeMermas(val);
                      notificarCondicionesMermas();
                    }} 
                    className="w-full accent-red-400 cursor-pointer" 
                  />
                  <span className="text-[9px] text-slate-500 block mt-1">Mínimo obligatorio 1%</span>
                </div>
              </div>
            </div>

            <div className="bg-[#090D16]/90 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl h-full">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block border-b border-slate-800 pb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#0DEDC0]" /> Objetivo de Rentabilidad & Fiscal
              </span>

              <div className="bg-[#102935]/40 border border-[#0DEDC0]/20 p-3 rounded-xl">
                <div className="flex justify-between items-center text-xs font-semibold text-[#0DEDC0] mb-2">
                  <span>
                    Margen Neto Libre
                    <Tooltip contenido="Porcentaje de utilidad limpia objetivo para la bodega tras saldar costos y provisiones." />
                  </span>
                  <div className="flex items-center gap-1 bg-[#090D16] border border-[#0DEDC0]/40 rounded px-2 py-0.5">
                    <input
                      type="number"
                      min="1"
                      max="70"
                      value={margenDeseado}
                      onChange={(e) => setMargenDeseado(Math.min(70, Math.max(1, Number(e.target.value))))}
                      className="w-9 bg-transparent text-right font-mono text-white font-bold outline-none text-xs"
                    />
                    <span className="text-[#0DEDC0] font-mono text-xs">%</span>
                  </div>
                </div>
                <input type="range" min="1" max="70" value={margenDeseado} onChange={(e) => setMargenDeseado(Number(e.target.value))} className="w-full accent-[#0DEDC0] cursor-pointer" />
              </div>

              <div className="bg-slate-800/30 border border-slate-700/50 p-3 rounded-xl">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
                  <span>
                    Impuestos (IVA / Retenciones)
                    <Tooltip contenido="Impuesto al valor agregado e impacto tributario aplicable que debe reservarse para declaración." />
                  </span>
                  <div className="flex items-center gap-1 bg-[#090D16] border border-slate-600 rounded px-2 py-0.5">
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={impactoFiscal}
                      onChange={(e) => setImpactoFiscal(Math.min(30, Math.max(0, Number(e.target.value))))}
                      className="w-9 bg-transparent text-right font-mono text-white font-bold outline-none text-xs"
                    />
                    <span className="text-slate-400 font-mono text-xs">%</span>
                  </div>
                </div>
                <input type="range" min="0" max="30" value={impactoFiscal} onChange={(e) => setImpactoFiscal(Number(e.target.value))} className="w-full accent-slate-400 cursor-pointer" />
              </div>
            </div>

          </div>
        </div>

        {/* 📌 PASO 2: ORGANIZACIÓN CRONOLÓGICA Y CROMÁTICA DE LOS 4 ESCENARIOS */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#0DEDC0]/20 to-[#0DEDC0]/5 border border-[#0DEDC0]/40 text-[#0DEDC0] font-black font-mono text-base sm:text-lg shadow-[0_0_15px_rgba(13,237,192,0.2)] shrink-0">
              2
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-sm sm:text-base md:text-lg font-black text-white uppercase tracking-widest m-0 flex items-center">
                Análisis de Sensibilidad
                <Tooltip contenido="Proyección matemática de 4 escenarios organizados de menor a mayor exigencia/riesgo." />
              </h2>
              <span className="text-[10px] sm:text-[11px] font-mono font-normal text-slate-400">
                (Haz clic en un escenario para trasladar su precio a la propuesta comercial)
              </span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-[#0DEDC0]/40 via-slate-700 to-transparent hidden lg:block"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
            
            {/* 🟢 ESCENARIO 1: ÓPTIMO (-5% DEV / -3% PÉRDIDA) -> VERDE ESMERALDA */}
            <div 
              onClick={() => seleccionarEscenarioConScroll('OPTIMISTA')}
              className={`relative bg-[#0B1A14]/95 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 border-2 ${
                escenarioSeleccionado === 'OPTIMISTA' 
                  ? 'border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.35)] ring-1 ring-emerald-400/60 scale-[1.02] z-10' 
                  : 'border-emerald-500/30 hover:border-emerald-400/50'
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-400" />
              <div className="space-y-2 border-b border-emerald-900/30 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                    1. Óptimo (-5% / -3%)
                  </span>
                  {escenarioSeleccionado === 'OPTIMISTA' && (
                    <span className="text-[9px] font-mono font-bold bg-emerald-400 text-[#090D16] px-1.5 py-0.5 rounded">
                      ✓ Activo
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-200 m-0 leading-tight">
                  Máxima Eficiencia
                </h3>
                {/* 📌 ESTRUCTURA UNIFORME: Devolución % | Mermas % */}
                <p className="text-[10px] text-emerald-300 font-mono font-bold m-0">
                  Devolución {metricas.optimista.pDevPct}% | Mermas {metricas.optimista.pMermaPct}%
                </p>
                <div className="pt-2">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Precio Competitivo Ajustado</span>
                  <span className="text-xl font-mono font-black text-emerald-300">{formatoMoneda(metricas.optimista.precioCatalogo)}</span>
                </div>
              </div>
              <div className="bg-[#090D16]/90 p-3.5 rounded-xl border border-emerald-900/30 font-mono text-[10px] flex-1 flex flex-col justify-between space-y-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-300"><span className="opacity-70">Ingreso Neto (Sin IVA):</span><span className="font-bold">{formatoMoneda(metricas.optimista.precioNeto)}</span></div>
                  <div className="flex justify-between text-slate-400"><span>(-) Costo Base COGS:</span><span>-{formatoMoneda(metricas.cBase)}</span></div>
                  <div className="flex justify-between text-emerald-400/80"><span>(-) Prov. Mermas:</span><span>-{formatoMoneda(metricas.optimista.costoMerma)}</span></div>
                  <div className="flex justify-between text-emerald-400/80"><span>(-) Prov. Devolución:</span><span>-{formatoMoneda(metricas.optimista.costoDev)}</span></div>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-2 text-[11px] mt-2">
                  <span>Utilidad Libre:</span><span>{formatoMoneda(metricas.optimista.ganancia)} ({margenDeseado}%)</span>
                </div>
              </div>
            </div>

            {/* 🩵 ESCENARIO 2: IDEAL / BASE CLIENTE -> CYAN NEÓN ATOM */}
            <div 
              onClick={() => seleccionarEscenarioConScroll('IDEAL')}
              className={`relative bg-[#0F2330]/95 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 border-2 ${
                escenarioSeleccionado === 'IDEAL' 
                  ? 'border-[#0DEDC0] shadow-[0_0_25px_rgba(13,237,192,0.35)] ring-1 ring-[#0DEDC0]/60 scale-[1.02] z-10' 
                  : 'border-slate-800 hover:border-[#0DEDC0]/50'
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#0DEDC0]" />
              <div className="space-y-2 border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase bg-[#0DEDC0]/10 text-[#0DEDC0] px-2 py-0.5 rounded border border-[#0DEDC0]/30">
                    2. Ideal (Cliente)
                  </span>
                  {escenarioSeleccionado === 'IDEAL' && (
                    <span className="text-[9px] font-mono font-bold bg-[#0DEDC0] text-[#090D16] px-1.5 py-0.5 rounded">
                      ✓ Activo
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white m-0 leading-tight">
                  Base Original Cliente
                </h3>
                {/* 📌 ESTRUCTURA UNIFORME: Devolución % | Mermas % */}
                <p className="text-[10px] text-[#0DEDC0] font-mono font-bold m-0">
                  Devolución {metricas.ideal.pDevPct}% | Mermas {metricas.ideal.pMermaPct}%
                </p>
                <div className="pt-2">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Precio Catálogo Base</span>
                  <span className="text-xl font-mono font-black text-[#0DEDC0] drop-shadow-sm">{formatoMoneda(metricas.ideal.precioCatalogo)}</span>
                </div>
              </div>
              <div className="bg-[#090D16]/90 p-3.5 rounded-xl border border-slate-800 font-mono text-[10px] flex-1 flex flex-col justify-between space-y-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-200"><span className="opacity-80">Ingreso Neto (Sin IVA):</span><span className="font-bold">{formatoMoneda(metricas.ideal.precioNeto)}</span></div>
                  <div className="flex justify-between text-slate-400"><span>(-) Costo Base COGS:</span><span>-{formatoMoneda(metricas.cBase)}</span></div>
                  <div className="flex justify-between text-slate-400"><span>(-) Prov. Mermas:</span><span>-{formatoMoneda(metricas.ideal.costoMerma)}</span></div>
                  <div className="flex justify-between text-slate-400"><span>(-) Prov. Devolución:</span><span>-{formatoMoneda(metricas.ideal.costoDev)}</span></div>
                </div>
                <div className="flex justify-between text-[#0DEDC0] font-bold border-t border-slate-800 pt-2 text-[11px] mt-2">
                  <span>Utilidad Libre:</span><span>{formatoMoneda(metricas.ideal.ganancia)} ({margenDeseado}%)</span>
                </div>
              </div>
            </div>

            {/* 🟡 ESCENARIO 3: MARGEN ELEVADO (+5% MARGEN) -> ÁMBAR NEÓN */}
            <div 
              onClick={() => seleccionarEscenarioConScroll('MARGEN_ALTO')}
              className={`relative bg-gradient-to-b from-[#0F2633] to-[#0A1A24] rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 border-2 ${
                escenarioSeleccionado === 'MARGEN_ALTO' 
                  ? 'border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.35)] ring-1 ring-amber-400/60 scale-[1.02] z-10' 
                  : 'border-amber-900/40 hover:border-amber-400/50'
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-400" />
              <div className="space-y-2 border-b border-amber-900/30 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    3. +5% Margen
                  </span>
                  {escenarioSeleccionado === 'MARGEN_ALTO' && (
                    <span className="text-[9px] font-mono font-bold bg-amber-400 text-[#090D16] px-1.5 py-0.5 rounded">
                      ★ RECOMENDADO
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white m-0 leading-tight">
                  Rentabilidad Recargada
                </h3>
                {/* 📌 ESTRUCTURA UNIFORME: Devolución % | Mermas % */}
                <p className="text-[10px] text-amber-300 font-mono font-bold m-0">
                  Devolución {metricas.margenAlto.pDevPct}% | Mermas {metricas.margenAlto.pMermaPct}%
                </p>
                <div className="pt-2">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Precio Catálogo Recargado</span>
                  <span className="text-xl font-mono font-black text-amber-300">{formatoMoneda(metricas.margenAlto.precioCatalogo)}</span>
                </div>
              </div>
              <div className="bg-[#090D16]/90 p-3.5 rounded-xl border border-amber-900/30 font-mono text-[10px] flex-1 flex flex-col justify-between space-y-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-300"><span className="opacity-70">Ingreso Neto (Sin IVA):</span><span className="font-bold">{formatoMoneda(metricas.margenAlto.precioNeto)}</span></div>
                  <div className="flex justify-between text-slate-400"><span>(-) Costo Base COGS:</span><span>-{formatoMoneda(metricas.cBase)}</span></div>
                  <div className="flex justify-between text-slate-400"><span>(-) Prov. Mermas:</span><span>-{formatoMoneda(metricas.margenAlto.costoMerma)}</span></div>
                  <div className="flex justify-between text-slate-400"><span>(-) Prov. Devolución:</span><span>-{formatoMoneda(metricas.margenAlto.costoDev)}</span></div>
                </div>
                <div className="flex justify-between items-center text-amber-300 font-black border-t border-slate-700 pt-2 text-[11px] mt-2">
                  <span>Utilidad Libre:</span><span>{formatoMoneda(metricas.margenAlto.ganancia)} ({metricas.margenAlto.pMargenPct}%)</span>
                </div>
              </div>
            </div>

            {/* 🔴 ESCENARIO 4: ESTRÉS (+7% DEV / +2% PÉRDIDA) -> ROJO NEÓN */}
            <div 
              onClick={() => seleccionarEscenarioConScroll('ESTRES')}
              className={`relative bg-[#1E1118]/95 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 border-2 ${
                escenarioSeleccionado === 'ESTRES' 
                  ? 'border-[#FF6B6B] shadow-[0_0_25px_rgba(255,107,107,0.35)] ring-1 ring-[#FF6B6B]/60 scale-[1.02] z-10' 
                  : 'border-red-900/40 hover:border-[#FF6B6B]/60'
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FF6B6B]" />
              <div className="space-y-2 border-b border-[#FF6B6B]/30 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase bg-[#FF6B6B]/20 text-[#FF6B6B] px-2 py-0.5 rounded border border-[#FF6B6B]/40">
                    4. Estrés (+7% / +2%)
                  </span>
                  {escenarioSeleccionado === 'ESTRES' && (
                    <span className="text-[9px] font-mono font-bold bg-[#FF6B6B] text-[#090D16] px-1.5 py-0.5 rounded">
                      ✓ Activo
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white m-0 leading-tight">
                  Incremento de Fugas
                </h3>
                {/* 📌 ESTRUCTURA UNIFORME: Devolución % | Mermas % */}
                <p className="text-[10px] text-[#FF6B6B] font-mono font-bold m-0">
                  Devolución {metricas.estres.pDevPct}% | Mermas {metricas.estres.pMermaPct}%
                </p>
                <div className="pt-2">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Precio Protegido Requerido</span>
                  <span className="text-xl font-mono font-black text-[#FF6B6B]">{formatoMoneda(metricas.estres.precioCatalogo)}</span>
                </div>
              </div>
              <div className="bg-[#090D16]/90 p-3.5 rounded-xl border border-red-900/30 font-mono text-[10px] flex-1 flex flex-col justify-between space-y-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-200"><span className="opacity-80">Ingreso Neto (Sin IVA):</span><span className="font-bold">{formatoMoneda(metricas.estres.precioNeto)}</span></div>
                  <div className="flex justify-between text-slate-400"><span>(-) Costo Base COGS:</span><span>-{formatoMoneda(metricas.cBase)}</span></div>
                  <div className="flex justify-between text-[#FF6B6B]"><span>(-) Prov. Mermas:</span><span>-{formatoMoneda(metricas.estres.costoMerma)}</span></div>
                  <div className="flex justify-between text-[#FF6B6B]"><span>(-) Prov. Devolución:</span><span>-{formatoMoneda(metricas.estres.costoDev)}</span></div>
                </div>
                <div className="flex justify-between text-[#FF6B6B] font-bold border-t border-slate-800 pt-2 text-[11px] mt-2">
                  <span>Utilidad:</span><span>{formatoMoneda(metricas.estres.ganancia)} ({margenDeseado}%)</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* CONTENEDOR DEL PASO 3 CON REF DE SCROLL HACIA PAGINA2 */}
        <div ref={propuestaRef}>
          <Pagina2 
            metricas={metricas}
            monedaSeleccionada={monedaSeleccionada}
            escenarioSeleccionado={escenarioSeleccionado}
            formatoMoneda={formatoMoneda}
            unidadesProyectadas={unidadesProyectadas}
            setUnidadesProyectadas={setUnidadesProyectadas}
            comisionDropExtra={comisionDropExtra}
            setComisionDropExtra={setComisionDropExtra}
          />
        </div>

      </div>
    </section>
  );
}