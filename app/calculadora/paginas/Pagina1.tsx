'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  ChevronDown, 
  Check, 
  HelpCircle
} from 'lucide-react';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { Kicker, H1, Subtitulo, Highlight } from '@/app/complementos/Tipografia';
import { MONEDAS, MonedaConfig, formatearMonedaGlobal, obtenerTarifasImpuesto } from '@/app/lib/moneda';
import Pagina2 from './Pagina2';

export type EscenarioTipo = 'PESIMO' | 'FAVORABLE' | 'OPTIMO' | 'OBJETIVO';

interface Pagina1Props {
  variante?: TipoFondo;
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
      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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

  // REF DE DESPLAZAMIENTO HACIA EL PASO 3
  const propuestaRef = useRef<HTMLDivElement>(null);

  // INPUTS PASO 1
  const [costoFabricacion, setCostoFabricacion] = useState<number>(15000);
  const [costoEmpaque, setCostoEmpaque] = useState<number>(2000);
  const [costoLogisticaInversa, setCostoLogisticaInversa] = useState<number>(0); 
  
  const [porcentajeDevoluciones, setPorcentajeDevoluciones] = useState<number>(20); 
  const [porcentajeMermas, setPorcentajeMermas] = useState<number>(3); 
  const [impactoFiscal, setImpactoFiscal] = useState<number>(0);
  const [margenDeseado, setMargenDeseado] = useState<number>(30);

  const [mensajeAlertaMermas, setMensajeAlertaMermas] = useState<boolean>(false);
  const [escenarioSeleccionado, setEscenarioSeleccionado] = useState<EscenarioTipo>('OBJETIVO');

  // INPUTS PASO 3
  const [unidadesProyectadas, setUnidadesProyectadas] = useState<number>(170);
  const [comisionDropExtra, setComisionDropExtra] = useState<number>(5);

  const notificarCondicionesMermas = useCallback(() => {
    setMensajeAlertaMermas(true);
    const timer = setTimeout(() => setMensajeAlertaMermas(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  // SELECCIÓN DE ESCENARIO CON AUTO-SCROLL SUAVE
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
    
    const pctDevBase = Math.min(0.50, Math.max(0.15, (Number(porcentajeDevoluciones) || 15) / 100));
    const pctMermasBase = Math.min(0.30, Math.max(0.01, (Number(porcentajeMermas) || 1) / 100));
    const pctComisionExtra = Math.min(0.30, Math.max(0, (Number(comisionDropExtra) || 0) / 100));

    const calcularEscenario = (pDev: number, pMerma: number, pMargen: number) => {
      const factorDev = (1 - pDev) > 0 ? (pDev / (1 - pDev)) : 0;
      const costoDev = cRetorno * factorDev;
      
      const factorMerma = (1 - pMerma) > 0 ? (pMerma / (1 - pMerma)) : 0;
      const costoMerma = cBase * factorMerma;

      const costoAbsorbido = cBase + costoDev + costoMerma;

      const denomMargen = 1 - pMargen;
      const precioNeto = denomMargen > 0.01 ? (costoAbsorbido / denomMargen) : (costoAbsorbido * 2);
      
      const impuestoIVA = precioNeto * pctIVA;
      const precioCatalogo = precioNeto + impuestoIVA;
      const ganancia = precioNeto * pMargen;

      return { costoDev, costoMerma, costoAbsorbido, precioNeto, impuestoIVA, precioCatalogo, ganancia };
    };

    const fav = calcularEscenario(pctDevBase, pctMermasBase, pctMargenBase);

    const pctDevPes = Math.min(0.50, pctDevBase * 1.5);
    const pctMermasPes = Math.min(0.30, pctMermasBase * 2.0);
    const pes = calcularEscenario(pctDevPes, pctMermasPes, pctMargenBase);
    
    const gananciaPesRealEnFav = fav.precioNeto - pes.costoAbsorbido;
    const margenPesRealEnFav = fav.precioNeto > 0 ? (gananciaPesRealEnFav / fav.precioNeto) * 100 : 0;

    const opt = calcularEscenario(0.15, 0.01, pctMargenBase);
    const gananciaOptRealEnFav = fav.precioNeto - opt.costoAbsorbido;
    const margenOptRealEnFav = fav.precioNeto > 0 ? (gananciaOptRealEnFav / fav.precioNeto) * 100 : 0;

    const pctMargenObj = Math.min(0.70, pctMargenBase + 0.05);
    const obj = calcularEscenario(pctDevBase, pctMermasBase, pctMargenObj);

    let activo = fav;
    let margenActivo = pctMargenBase;
    let devActivo = pctDevBase;
    
    if (escenarioSeleccionado === 'PESIMO') { activo = pes; devActivo = pctDevPes; }
    if (escenarioSeleccionado === 'OPTIMO') { activo = opt; devActivo = 0.15; }
    if (escenarioSeleccionado === 'OBJETIVO') { activo = obj; margenActivo = pctMargenObj; }

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
      pctDevFav: (pctDevBase * 100).toFixed(0), pctMermasFav: (pctMermasBase * 100).toFixed(1), fav,
      pctDevPes: (pctDevPes * 100).toFixed(0), pctMermasPes: (pctMermasPes * 100).toFixed(1), pes, gananciaPesRealEnFav, margenPesRealEnFav,
      pctDevOpt: '15', pctMermasOpt: '1.0', opt, gananciaOptRealEnFav, margenOptRealEnFav,
      obj, pctMargenObjetivo: (pctMargenObj * 100).toFixed(0),
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
                Nota: Este valor solo se puede entregar si se cumple strictly con las condiciones especificadas en la tarjeta de propuesta.
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

                <div 
                  onClick={notificarCondicionesMermas}
                  className="bg-red-950/20 border border-red-900/40 p-2.5 rounded-xl hover:border-red-500/50 transition-colors"
                >
                  <div className="flex justify-between items-center text-[10px] font-semibold text-red-300 mb-1.5">
                    <span className="flex items-center">
                      Mermas
                      <Tooltip contenido="Porcentaje de inventario que no llega a bodega o es devuelto pero llega destruido o robado." />
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
                      setPorcentajeMermas(Number(e.target.value));
                      notificarCondicionesMermas();
                    }} 
                    className="w-full accent-red-400 cursor-pointer" 
                  />
                  <span className="text-[9px] text-slate-500 block mt-1">Piso Técnico 1%</span>
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

        {/* PASO 2: ANÁLISIS DE SENSIBILIDAD CON AUTO-SCROLL */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#0DEDC0]/20 to-[#0DEDC0]/5 border border-[#0DEDC0]/40 text-[#0DEDC0] font-black font-mono text-base sm:text-lg shadow-[0_0_15px_rgba(13,237,192,0.2)] shrink-0">
              2
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-sm sm:text-base md:text-lg font-black text-white uppercase tracking-widest m-0 flex items-center">
                Análisis de Sensibilidad
                <Tooltip contenido="Proyección matemática de 4 escenarios para analizar la salud financiera según la efectividad logística." />
              </h2>
              <span className="text-[10px] sm:text-[11px] font-mono font-normal text-slate-400">
                (Haz clic en un escenario para trasladar su precio a la propuesta comercial)
              </span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-[#0DEDC0]/40 via-slate-700 to-transparent hidden lg:block"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
            
            {/* ESCENARIO 1 */}
            <div 
              onClick={() => seleccionarEscenarioConScroll('PESIMO')}
              className={`relative bg-[#1E1118]/95 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 border-2 ${
                escenarioSeleccionado === 'PESIMO' 
                  ? 'border-[#FF6B6B] shadow-[0_0_25px_rgba(255,107,107,0.35)] ring-1 ring-[#FF6B6B]/60 scale-[1.02] z-10' 
                  : 'border-[#FF6B6B]/30 hover:border-[#FF6B6B]/60'
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FF6B6B]" />
              <div className="space-y-2 border-b border-[#FF6B6B]/30 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase bg-[#FF6B6B]/20 text-[#FF6B6B] px-2 py-0.5 rounded border border-[#FF6B6B]/40">
                    1. Pésimo
                  </span>
                  {escenarioSeleccionado === 'PESIMO' && (
                    <span className="text-[9px] font-mono font-bold bg-[#FF6B6B] text-[#090D16] px-1.5 py-0.5 rounded">
                      ✓ Activo
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white m-0 leading-tight flex items-center justify-between">
                  Estrés Logístico Máximo
                  <Tooltip contenido="Simula un rebote crítico de guías (+50%) y mermas dobles para calcular el precio blindado de supervivencia." />
                </h3>
                <p className="text-[10px] text-slate-300 leading-relaxed m-0">Devolución {metricas.pctDevPes}% | Mermas {metricas.pctMermasPes}%</p>
                <div className="pt-2">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Precio de Resguardo Requerido</span>
                  <span className="text-xl font-mono font-black text-[#FF6B6B] drop-shadow-sm">{formatoMoneda(metricas.pes.precioCatalogo)}</span>
                </div>
              </div>
              <div className="bg-[#090D16]/90 p-3.5 rounded-xl border border-[#FF6B6B]/30 font-mono text-[10px] flex-1 flex flex-col justify-between space-y-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-200"><span className="opacity-80">Ingreso Neto (Sin IVA):</span><span className="font-bold">{formatoMoneda(metricas.pes.precioNeto)}</span></div>
                  <div className="flex justify-between text-slate-400"><span>(-) Costo Base COGS:</span><span>-{formatoMoneda(metricas.cBase)}</span></div>
                  <div className="flex justify-between text-[#FF6B6B]"><span>(-) Prov. Mermas:</span><span>-{formatoMoneda(metricas.pes.costoMerma)}</span></div>
                  <div className="flex justify-between text-[#FF6B6B]"><span>(-) Prov. Devolución:</span><span>-{formatoMoneda(metricas.pes.costoDev)}</span></div>
                </div>
                <div className="flex justify-between text-[#FF6B6B] font-bold border-t border-slate-800 pt-2 text-[11px] mt-2">
                  <span>Utilidad:</span><span>{formatoMoneda(metricas.pes.ganancia)} ({margenDeseado}%)</span>
                </div>
              </div>
            </div>

            {/* ESCENARIO 2 */}
            <div 
              onClick={() => seleccionarEscenarioConScroll('FAVORABLE')}
              className={`relative bg-[#0F2330]/95 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 border-2 ${
                escenarioSeleccionado === 'FAVORABLE' ? 'border-blue-400 shadow-[0_0_25px_rgba(96,165,250,0.3)] ring-1 ring-blue-400/50 scale-[1.02] z-10' : 'border-blue-900/40 hover:border-blue-400/40'
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-400" />
              <div className="space-y-2 border-b border-blue-900/30 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">2. Favorable</span>
                  {escenarioSeleccionado === 'FAVORABLE' && <span className="text-[9px] font-mono font-bold bg-blue-400 text-[#090D16] px-1.5 py-0.5 rounded">✓ Activo</span>}
                </div>
                <h3 className="text-sm font-bold text-slate-200 m-0 leading-tight flex items-center justify-between">
                  Proyección Base Real
                  <Tooltip contenido="Punto de equilibrio estándar basado en tus porcentajes reales ingresados en la sección anterior." />
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed m-0">Devolución {porcentajeDevoluciones}% | Mermas {porcentajeMermas}%</p>
                <div className="pt-2">
                  <span className="text-[9px] text-slate-500 uppercase font-bold block">Precio Catálogo Base</span>
                  <span className="text-xl font-mono font-black text-white">{formatoMoneda(metricas.fav.precioCatalogo)}</span>
                </div>
              </div>
              <div className="bg-[#090D16]/90 p-3.5 rounded-xl border border-blue-900/20 font-mono text-[10px] flex-1 flex flex-col justify-between space-y-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-300"><span className="opacity-70">Ingreso Neto (Sin IVA):</span><span className="font-bold">{formatoMoneda(metricas.fav.precioNeto)}</span></div>
                  <div className="flex justify-between text-slate-400"><span>(-) Costo Base COGS:</span><span>-{formatoMoneda(metricas.cBase)}</span></div>
                  <div className="flex justify-between text-slate-400"><span>(-) Prov. Mermas:</span><span>-{formatoMoneda(metricas.fav.costoMerma)}</span></div>
                  <div className="flex justify-between text-slate-400"><span>(-) Prov. Devolución:</span><span>-{formatoMoneda(metricas.fav.costoDev)}</span></div>
                </div>
                <div className="flex justify-between text-blue-300 font-bold border-t border-slate-800 pt-2 text-[11px] mt-2">
                  <span>Utilidad Libre:</span><span>{formatoMoneda(metricas.fav.ganancia)} ({margenDeseado}%)</span>
                </div>
              </div>
            </div>

            {/* ESCENARIO 3 */}
            <div 
              onClick={() => seleccionarEscenarioConScroll('OPTIMO')}
              className={`relative bg-[#0B1A14]/95 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 border-2 ${
                escenarioSeleccionado === 'OPTIMO' ? 'border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.3)] ring-1 ring-emerald-400/50 scale-[1.02] z-10' : 'border-emerald-500/30 hover:border-emerald-400/40'
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-400" />
              <div className="space-y-2 border-b border-emerald-900/30 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">3. Óptimo</span>
                  {escenarioSeleccionado === 'OPTIMO' && <span className="text-[9px] font-mono font-bold bg-emerald-400 text-[#090D16] px-1.5 py-0.5 rounded">✓ Activo</span>}
                </div>
                <h3 className="text-sm font-bold text-slate-200 m-0 leading-tight flex items-center justify-between">
                  Piso Eficiencia (Control Total)
                  <Tooltip contenido="Representa la máxima eficiencia con entregas sobre el 85% y cero merma física." />
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed m-0">Devolución 15% | Mermas 1%</p>
                <div className="pt-2">
                  <span className="text-[9px] text-slate-500 uppercase font-bold block">Precio Ultra Competitivo</span>
                  <span className="text-xl font-mono font-black text-emerald-300">{formatoMoneda(metricas.opt.precioCatalogo)}</span>
                </div>
              </div>
              <div className="bg-[#090D16]/90 p-3.5 rounded-xl border border-emerald-900/20 font-mono text-[10px] flex-1 flex flex-col justify-between space-y-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-300"><span className="opacity-70">Ingreso Neto (Sin IVA):</span><span className="font-bold">{formatoMoneda(metricas.opt.precioNeto)}</span></div>
                  <div className="flex justify-between text-slate-400"><span>(-) Costo Base COGS:</span><span>-{formatoMoneda(metricas.cBase)}</span></div>
                  <div className="flex justify-between text-emerald-400/80"><span>(-) Mermas (Piso 1%):</span><span>-{formatoMoneda(metricas.opt.costoMerma)}</span></div>
                  <div className="flex justify-between text-emerald-400/80"><span>(-) Devolución (Piso 15%):</span><span>-{formatoMoneda(metricas.opt.costoDev)}</span></div>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-2 text-[11px] mt-2">
                  <span>Utilidad Libre:</span><span>{formatoMoneda(metricas.opt.ganancia)} ({margenDeseado}%)</span>
                </div>
              </div>
            </div>

            {/* ESCENARIO 4 */}
            <div 
              onClick={() => seleccionarEscenarioConScroll('OBJETIVO')}
              className={`relative bg-gradient-to-b from-[#0F2633] to-[#0A1A24] rounded-2xl p-5 shadow-[0_10px_40px_rgba(13,237,192,0.15)] flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 border-2 ${
                escenarioSeleccionado === 'OBJETIVO' ? 'border-[#0DEDC0] shadow-[0_0_30px_rgba(13,237,192,0.4)] ring-1 ring-[#0DEDC0]/50 scale-[1.02] z-10' : 'border-[#0DEDC0]/40 hover:border-[#0DEDC0]/80'
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#0DEDC0] shadow-[0_0_15px_rgba(13,237,192,0.8)]" />
              
              <div className="space-y-2 border-b border-[#0DEDC0]/30 pb-3 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase bg-[#0DEDC0]/10 text-[#0DEDC0] px-2 py-0.5 rounded border border-[#0DEDC0]/30">4. Objetivo B2B</span>
                  {escenarioSeleccionado === 'OBJETIVO' && <span className="text-[9px] font-mono font-bold bg-[#0DEDC0] text-[#090D16] px-1.5 py-0.5 rounded">★ RECOMENDADO</span>}
                </div>
                <h3 className="text-sm font-black text-white m-0 leading-tight flex items-center justify-between">
                  Estructura Aterrizada
                  <Tooltip contenido="Añade un buffer (+5%) al margen libre para amortiguar el tiempo de espera hasta que la plataforma libere la billetera." />
                </h3>
                <p className="text-[10px] text-[#0DEDC0]/80 leading-relaxed m-0">Margen protegido +5% Buffer Caja Mínima.</p>
                <div className="pt-2">
                  <span className="text-[9px] text-[#0DEDC0]/70 uppercase font-bold block">Precio Catálogo Ideal</span>
                  <span className="text-2xl font-mono font-black text-[#0DEDC0] drop-shadow-md">{formatoMoneda(metricas.obj.precioCatalogo)}</span>
                </div>
              </div>

              <div className="bg-[#090D16]/95 p-3.5 rounded-xl border border-[#0DEDC0]/30 font-mono text-[10px] relative z-10 flex-1 flex flex-col justify-between space-y-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-300"><span className="opacity-70">Ingreso Neto (Sin IVA):</span><span className="font-bold">{formatoMoneda(metricas.obj.precioNeto)}</span></div>
                  <div className="flex justify-between text-slate-400"><span>(-) Costo Base COGS:</span><span>-{formatoMoneda(metricas.cBase)}</span></div>
                  <div className="flex justify-between text-slate-400"><span>(-) Prov. Mermas:</span><span>-{formatoMoneda(metricas.obj.costoMerma)}</span></div>
                  <div className="flex justify-between text-slate-400"><span>(-) Prov. Devolución:</span><span>-{formatoMoneda(metricas.obj.costoDev)}</span></div>
                </div>
                <div className="flex justify-between items-center text-[#0DEDC0] font-black border-t border-slate-700 pt-2 text-[11px] mt-2">
                  <span>Utilidad + Buffer:</span><span>{formatoMoneda(metricas.obj.ganancia)} ({metricas.pctMargenObjetivo}%)</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* CONTENEDOR DEL PASO 3 CON REF DE SCROLL */}
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