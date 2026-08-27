'use client';

import React, { useState, useMemo } from 'react';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { Kicker, H1, Subtitulo, Highlight } from '@/app/complementos/Tipografia';

interface PaisConfig {
  codigo: string;
  nombre: string;
  moneda: string;
  locale: string;
  simbolo: string;
}

const PAISES_ATOM: PaisConfig[] = [
  { codigo: 'CO', nombre: 'Colombia', moneda: 'COP', locale: 'es-CO', simbolo: '$' },
  { codigo: 'MX', nombre: 'México', moneda: 'MXN', locale: 'es-MX', simbolo: '$' },
  { codigo: 'CL', nombre: 'Chile', moneda: 'CLP', locale: 'es-CL', simbolo: '$' },
  { codigo: 'PE', nombre: 'Perú', moneda: 'PEN', locale: 'es-PE', simbolo: 'S/' },
  { codigo: 'EC', nombre: 'Ecuador', moneda: 'USD', locale: 'en-US', simbolo: '$' },
  { codigo: 'GT', nombre: 'Guatemala', moneda: 'GTQ', locale: 'es-GT', simbolo: 'Q' },
];

type ModoCalculadora = 'PROVEEDOR' | 'DROPSHIPPER';

interface Seccion1Props {
  variante?: TipoFondo;
}

export default function Seccion1({ variante = 'darkNoise' }: Seccion1Props) {
  // CONFIGURACIÓN GEOGRÁFICA Y MODO (PRIMERO PROVEEDOR POR DEFECTO)
  const [paisSeleccionado, setPaisSeleccionado] = useState<PaisConfig>(PAISES_ATOM[0]);
  const [modoSeleccionado, setModoSeleccionado] = useState<ModoCalculadora>('PROVEEDOR');

  // ==========================================
  // INPUTS MODO 1: PROVEEDOR (Venta a Dropshippers)
  // ==========================================
  const [provCostoFabricacion, setProvCostoFabricacion] = useState<number>(12000);
  const [provGastosOperativos, setProvGastosOperativos] = useState<number>(3000);
  const [provPorcentajeDevoluciones, setProvPorcentajeDevoluciones] = useState<number>(15);
  const [provMargenDeseado, setProvMargenDeseado] = useState<number>(30);

  // ==========================================
  // INPUTS MODO 2: DROPSHIPPER (Venta al cliente final)
  // ==========================================
  const [dropUnidades, setDropUnidades] = useState<number>(1);
  const [dropCostoProducto, setDropCostoProducto] = useState<number>(25000);
  const [dropFletePromedio, setDropFletePromedio] = useState<number>(16000);
  const [dropCpaAds, setDropCpaAds] = useState<number>(22000);
  const [dropTasaDevolucion, setDropTasaDevolucion] = useState<number>(20);
  const [dropMargenDeseado, setDropMargenDeseado] = useState<number>(25);

  // FORMATO DE MONEDA
  const formatoMoneda = (monto: number) => {
    const num = Number(monto) || 0;
    try {
      return new Intl.NumberFormat(paisSeleccionado.locale, {
        style: 'currency',
        currency: paisSeleccionado.moneda,
        minimumFractionDigits: ['CLP', 'COP'].includes(paisSeleccionado.moneda) ? 0 : 2,
        maximumFractionDigits: ['CLP', 'COP'].includes(paisSeleccionado.moneda) ? 0 : 2,
      }).format(num);
    } catch {
      return `${paisSeleccionado.simbolo} ${num.toLocaleString()}`;
    }
  };

  // ==========================================
  // MATEMÁTICA PROVEEDOR
  // ==========================================
  const metricasProveedor = useMemo(() => {
    const cFabricacion = Math.max(0, Number(provCostoFabricacion) || 0);
    const gOperativos = Math.max(0, Number(provGastosOperativos) || 0);
    const pctDevoluciones = (Math.max(0, Number(provPorcentajeDevoluciones) || 0)) / 100;
    const pctMargen = (Math.max(0, Number(provMargenDeseado) || 0)) / 100;

    const costoBaseUnitario = cFabricacion + gOperativos;
    const provisionRiesgoFuga = costoBaseUnitario * pctDevoluciones;
    const costoTotalAbsorbido = costoBaseUnitario + provisionRiesgoFuga;

    const denominador = 1 - pctMargen;
    const precioSugeridoAlDrop = denominador > 0 ? (costoTotalAbsorbido / denominador) : (costoTotalAbsorbido * 2);
    const gananciaNetaUnidad = precioSugeridoAlDrop * pctMargen;

    return {
      costoBaseUnitario,
      provisionRiesgoFuga,
      costoTotalAbsorbido,
      precioSugeridoAlDrop,
      gananciaNetaUnidad,
    };
  }, [provCostoFabricacion, provGastosOperativos, provPorcentajeDevoluciones, provMargenDeseado]);

  // ==========================================
  // MATEMÁTICA DROPSHIPPER
  // ==========================================
  const metricasDropshipper = useMemo(() => {
    const qty = Math.max(1, Number(dropUnidades) || 1);
    const cProducto = Math.max(0, Number(dropCostoProducto) || 0);
    const fleteIda = Math.max(0, Number(dropFletePromedio) || 0);
    const cpa = Math.max(0, Number(dropCpaAds) || 0);
    const pctDev = Math.min(90, Math.max(0, Number(dropTasaDevolucion) || 0)) / 100;
    const pctMargen = Math.min(80, Math.max(1, Number(dropMargenDeseado) || 0)) / 100;

    const costoFleteRetorno = fleteIda * 1.8;
    const costoPerdidoPorPaqueteDevuelto = costoFleteRetorno + cpa;

    const factorCaida = (1 - pctDev) > 0 ? (pctDev / (1 - pctDev)) : 0;
    const castigoFletesDevolucionUnitario = costoPerdidoPorPaqueteDevuelto * factorCaida;

    const costoRealAbsorbidoUnitario = cProducto + fleteIda + cpa + castigoFletesDevolucionUnitario;

    const denominador = 1 - pctMargen;
    const precioVentaSugeridoFinal = denominador > 0 ? (costoRealAbsorbidoUnitario / denominador) : (costoRealAbsorbidoUnitario * 2);

    const gananciaNetaUnidad = precioVentaSugeridoFinal * pctMargen;
    const roasObjetivoReal = cpa > 0 ? (precioVentaSugeridoFinal / cpa) : 0;

    const ventaTotalProyectada = precioVentaSugeridoFinal * qty;
    const fondoDevolucionTotal = castigoFletesDevolucionUnitario * qty;
    const gananciaNetaTotal = gananciaNetaUnidad * qty;

    return {
      qty,
      fleteIda,
      cpa,
      castigoFletesDevolucionUnitario,
      costoRealAbsorbidoUnitario,
      precioVentaSugeridoFinal,
      gananciaNetaUnidad,
      roasObjetivoReal,
      ventaTotalProyectada,
      fondoDevolucionTotal,
      gananciaNetaTotal,
    };
  }, [dropUnidades, dropCostoProducto, dropFletePromedio, dropCpaAds, dropTasaDevolucion, dropMargenDeseado]);

  return (
    <section className="relative z-10 py-12 px-4 sm:px-6 overflow-hidden w-full border-b border-[#0DEDC0]/10 text-white">
      
      {/* OCULTAR FLECHAS DE TODOS LOS CAMPOS NUMÉRICOS (SPINNERS) */}
      <style dangerouslySetInnerHTML={{ __html: `
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none !important; 
          margin: 0 !important; 
        }
        input[type=number] { 
          -moz-appearance: textfield !important; 
        }
      ` }} />

      {/* CAPA DE FONDO DINÁMICO */}
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-10">
        
        {/* CABECERA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-6">
          <div>
            <Kicker className="!text-[#0DEDC0]">HERRAMIENTA DE DIAGNÓSTICO</Kicker>
            <H1 className="text-balance mb-2">
              Simulador de <Highlight>Rentabilidad Real.</Highlight>
            </H1>
            <Subtitulo className="max-w-2xl">
              Calcula tus márgenes y precios de venta exactos contemplando el castigo de fletes por devoluciones y mermas del contra entrega.
            </Subtitulo>
          </div>

          {/* PAÍS / MONEDA */}
          <div className="bg-[#090D16] p-3.5 rounded-2xl border border-slate-800 shrink-0 w-full md:w-auto">
            <label className="block text-[10px] font-mono font-bold text-[#0DEDC0] uppercase mb-1">
              Moneda de Cálculo
            </label>
            <select
              value={paisSeleccionado.codigo}
              onChange={(e) => {
                const p = PAISES_ATOM.find((x) => x.codigo === e.target.value);
                if (p) setPaisSeleccionado(p);
              }}
              className="w-full bg-[#102935] border border-slate-700 text-white text-xs font-bold rounded-xl p-2.5 focus:border-[#0DEDC0] outline-none cursor-pointer"
            >
              {PAISES_ATOM.map((p) => (
                <option key={p.codigo} value={p.codigo}>
                  {p.nombre} ({p.moneda})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TABS DE SELECCIÓN DE MODO: PRIMERO PROVEEDOR, LUEGO DROPSHIPPER */}
        <div className="flex bg-[#090D16] p-1.5 rounded-2xl border border-slate-800 w-full max-w-md mx-auto relative z-20">
          <button
            type="button"
            onClick={() => setModoSeleccionado('PROVEEDOR')}
            className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              modoSeleccionado === 'PROVEEDOR'
                ? 'bg-[#102935] text-[#0DEDC0] shadow-md border border-[#0DEDC0]/40'
                : 'text-slate-500 hover:text-slate-300 border border-transparent'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-16 0H3m4 0h10M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5" />
            </svg>
            Soy Proveedor
          </button>

          <button
            type="button"
            onClick={() => setModoSeleccionado('DROPSHIPPER')}
            className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              modoSeleccionado === 'DROPSHIPPER'
                ? 'bg-[#102935] text-[#0DEDC0] shadow-md border border-[#0DEDC0]/40'
                : 'text-slate-500 hover:text-slate-300 border border-transparent'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Soy Dropshipper
          </button>
        </div>

        {/* ========================================================================= */}
        {/* VISTA 1: PROVEEDOR                                                        */}
        {/* ========================================================================= */}
        {modoSeleccionado === 'PROVEEDOR' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in-up">
            
            {/* INPUTS PROVEEDOR */}
            <div className="lg:col-span-5 bg-[#090D16] p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              <span className="text-xs font-mono font-bold text-[#0DEDC0] uppercase tracking-wider block border-b border-slate-800 pb-3">
                1. Costos de Fabricación y Riesgo
              </span>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Costo Neto de Fabricación/Compra ({paisSeleccionado.moneda})
                </label>
                <input
                  type="number"
                  min="0"
                  value={provCostoFabricacion}
                  onChange={(e) => setProvCostoFabricacion(Number(e.target.value))}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 font-mono text-white text-sm font-bold focus:border-[#0DEDC0] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Gastos Fulfillment / Empaque Unitario ({paisSeleccionado.moneda})
                </label>
                <input
                  type="number"
                  min="0"
                  value={provGastosOperativos}
                  onChange={(e) => setProvGastosOperativos(Number(e.target.value))}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 font-mono text-white text-sm font-bold focus:border-[#0DEDC0] outline-none"
                />
              </div>

              <div className="bg-red-900/20 border border-red-900/40 p-3.5 rounded-xl">
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span className="text-red-400">Tasa Histórica de Devoluciones</span>
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

              <div className="bg-[#102935]/60 border border-[#0DEDC0]/30 p-3.5 rounded-xl">
                <div className="flex justify-between text-xs font-semibold text-[#0DEDC0] mb-2">
                  <span>Margen de Ganancia Neta Deseada</span>
                  <span className="font-mono text-white font-bold">{provMargenDeseado}%</span>
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

            {/* DIAGNÓSTICO FINANCIERO PROVEEDOR */}
            <div className="lg:col-span-7 bg-[#090D16] p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block border-b border-slate-800 pb-3">
                2. Fijación de Precio al Dropshipper
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                <div className="bg-[#102935]/80 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold mb-1">Costo Total Absorbido</span>
                  <span className="text-xl font-black text-slate-200 block">{formatoMoneda(metricasProveedor.costoTotalAbsorbido)}</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Fab + Empaque + Fugas</span>
                </div>

                <div className="bg-red-900/20 p-4 rounded-xl border border-red-900/40">
                  <span className="text-[10px] text-red-400 uppercase block font-bold mb-1">Provisión por Fugas</span>
                  <span className="text-xl font-black text-red-400 block">{formatoMoneda(metricasProveedor.provisionRiesgoFuga)}</span>
                  <span className="text-[10px] text-red-400/60 block mt-1">Costo de mercancía destruida o devuelta</span>
                </div>
              </div>

              {/* PRECIO SUGERIDO PLATAFORMA */}
              <div className="bg-gradient-to-br from-[#102935] to-[#0A1A24] p-5 rounded-xl border-2 border-[#0DEDC0]/40 text-center space-y-1 shadow-[0_10px_30px_rgba(13,237,192,0.15)]">
                <span className="text-xs font-mono text-slate-400 uppercase font-bold block">
                  Precio de Venta Sugerido en Plataforma
                </span>
                <span className="text-3xl font-black font-mono text-white block my-2">
                  {formatoMoneda(metricasProveedor.precioSugeridoAlDrop)}
                </span>
                <div className="bg-[#090D16]/50 inline-block px-4 py-1.5 rounded-lg border border-[#0DEDC0]/20">
                  <span className="text-xs font-mono text-[#0DEDC0] font-bold">
                    Tu Utilidad Neta Real: {formatoMoneda(metricasProveedor.gananciaNetaUnidad)}
                  </span>
                </div>
              </div>

              {/* ALERTA FINANCIERA CON ICONO 2D */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-blue-400 font-bold text-sm">Estrategia de Blindaje:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Al agregar la provisión de fuga ({provPorcentajeDevoluciones}%) directamente al precio de venta, garantizas que los pedidos exitosos <strong className="text-white">paguen las mermas de las devoluciones</strong>, manteniendo tu margen de {provMargenDeseado}% totalmente libre.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VISTA 2: DROPSHIPPER                                                      */}
        {/* ========================================================================= */}
        {modoSeleccionado === 'DROPSHIPPER' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in-up">
            
            {/* INPUTS DROPSHIPPER */}
            <div className="lg:col-span-5 bg-[#090D16] p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              <span className="text-xs font-mono font-bold text-[#0DEDC0] uppercase tracking-wider block border-b border-slate-800 pb-3">
                1. Costos Directos y Volumen
              </span>

              {/* UNIDADES A VENDER */}
              <div className="bg-[#102935]/80 border border-[#0DEDC0]/40 p-3.5 rounded-xl">
                <label className="block text-xs font-mono font-bold text-[#0DEDC0] uppercase mb-1 flex items-center">
                  <svg className="w-4 h-4 mr-1.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Unidades Objetivo a Vender
                </label>
                <input
                  type="number"
                  min="1"
                  value={dropUnidades}
                  onChange={(e) => setDropUnidades(Math.max(1, Number(e.target.value)))}
                  placeholder="1"
                  className="w-full bg-[#090D16] border border-[#0DEDC0]/50 rounded-lg p-2.5 font-mono text-white text-base font-black text-center focus:border-[#0DEDC0] outline-none"
                />
                <span className="text-[10px] text-slate-400 block mt-1 text-center">
                  (Si no ingresas nada, el cálculo se realiza por 1 unidad)
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Costo del Producto en Bodega / Dropi ({paisSeleccionado.moneda})
                </label>
                <input
                  type="number"
                  min="0"
                  value={dropCostoProducto}
                  onChange={(e) => setDropCostoProducto(Number(e.target.value))}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 font-mono text-white text-sm font-bold focus:border-[#0DEDC0] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Flete Promedio de Salida ({paisSeleccionado.moneda})
                </label>
                <input
                  type="number"
                  min="0"
                  value={dropFletePromedio}
                  onChange={(e) => setDropFletePromedio(Number(e.target.value))}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 font-mono text-white text-sm font-bold focus:border-[#0DEDC0] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Costo Publicitario / CPA Pauta ({paisSeleccionado.moneda})
                </label>
                <input
                  type="number"
                  min="0"
                  value={dropCpaAds}
                  onChange={(e) => setDropCpaAds(Number(e.target.value))}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 font-mono text-white text-sm font-bold focus:border-[#0DEDC0] outline-none"
                />
              </div>

              {/* TASA DE DEVOLUCIÓN ESTIMADA */}
              <div className="bg-red-900/20 border border-red-900/40 p-3.5 rounded-xl">
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span className="text-red-400">% Devolución Estimada (Contra Entrega)</span>
                  <span className="font-mono text-red-400 font-bold">{dropTasaDevolucion}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="45"
                  value={dropTasaDevolucion}
                  onChange={(e) => setDropTasaDevolucion(Number(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
              </div>

              {/* MARGEN DESEADO */}
              <div className="bg-[#102935]/60 border border-[#0DEDC0]/30 p-3.5 rounded-xl">
                <div className="flex justify-between text-xs font-semibold text-[#0DEDC0] mb-2">
                  <span>% Ganancia Neta Libre Deseada</span>
                  <span className="font-mono text-white font-bold">{dropMargenDeseado}%</span>
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

            {/* DIAGNÓSTICO FINANCIERO DROPSHIPPER */}
            <div className="lg:col-span-7 bg-[#090D16] p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block border-b border-slate-800 pb-3">
                2. Resultado Recomendado ({metricasDropshipper.qty} {metricasDropshipper.qty === 1 ? 'Unidad' : 'Unidades'})
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                <div className="bg-red-900/20 p-4 rounded-xl border border-red-900/40">
                  <span className="text-[10px] text-red-400 uppercase block font-bold mb-1">
                    Fondo Fletes Devolución ({metricasDropshipper.qty} uds)
                  </span>
                  <span className="text-xl font-black text-red-400 block">
                    {formatoMoneda(metricasDropshipper.fondoDevolucionTotal)}
                  </span>
                  <span className="text-[10px] text-red-400/80 block mt-1">
                    Provisión: {formatoMoneda(metricasDropshipper.castigoFletesDevolucionUnitario)} / ud.
                  </span>
                </div>

                <div className="bg-[#102935]/80 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold mb-1">
                    ROAS Mínimo Objetivo
                  </span>
                  <span className="text-xl font-black text-amber-400 block">
                    {metricasDropshipper.roasObjetivoReal.toFixed(2)}x
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Exigencia en Meta / TikTok Ads
                  </span>
                </div>
              </div>

              {/* PRECIO SUGERIDO AL CLIENTE FINAL */}
              <div className="bg-gradient-to-br from-[#102935] to-[#0A1A24] p-6 rounded-xl border-2 border-[#0DEDC0]/50 text-center space-y-2 shadow-[0_10px_30px_rgba(13,237,192,0.15)]">
                <span className="text-xs font-mono text-slate-300 uppercase font-bold tracking-wider block">
                  VALOR SUGERIDO DE VENTA AL CLIENTE FINAL (POR UNIDAD)
                </span>
                <span className="text-3xl sm:text-4xl font-black font-mono text-[#0DEDC0] block my-2">
                  {formatoMoneda(metricasDropshipper.precioVentaSugeridoFinal)}
                </span>
                
                <div className="bg-[#090D16]/80 inline-block px-4 py-2 rounded-xl border border-[#0DEDC0]/30">
                  <span className="text-xs font-mono text-white font-bold block">
                    Ganancia Neta por Unidad: <span className="text-[#0DEDC0]">{formatoMoneda(metricasDropshipper.gananciaNetaUnidad)}</span>
                  </span>
                </div>
              </div>

              {/* RESUMEN DE PROYECCIÓN EN VOLUMEN (SI QTY > 1) */}
              {metricasDropshipper.qty > 1 && (
                <div className="bg-[#0DEDC0]/10 border border-[#0DEDC0]/30 p-4 rounded-xl space-y-2 font-mono">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 uppercase font-bold">Venta Total Proyectada ({metricasDropshipper.qty} uds):</span>
                    <span className="text-white font-black text-sm">{formatoMoneda(metricasDropshipper.ventaTotalProyectada)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#0DEDC0] uppercase font-bold">Ganancia Neta Acumulada Libre:</span>
                    <span className="text-[#0DEDC0] font-black text-sm">{formatoMoneda(metricasDropshipper.gananciaNetaTotal)}</span>
                  </div>
                </div>
              )}

              {/* DESGLOSE MATEMÁTICO */}
              <div className="bg-[#102935]/40 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                  Desglose por unidad vendida ({formatoMoneda(metricasDropshipper.precioVentaSugeridoFinal)}):
                </span>
                <div className="flex justify-between text-slate-300">
                  <span>• Producto (Bodega):</span>
                  <span>{formatoMoneda(dropCostoProducto)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>• Flete Envío Exitoso:</span>
                  <span>{formatoMoneda(metricasDropshipper.fleteIda)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>• Publicidad (CPA Ads):</span>
                  <span>{formatoMoneda(metricasDropshipper.cpa)}</span>
                </div>
                <div className="flex justify-between text-red-400 font-bold">
                  <span>• Fondo Fletes de Devolución ({dropTasaDevolucion}%):</span>
                  <span>{formatoMoneda(metricasDropshipper.castigoFletesDevolucionUnitario)}</span>
                </div>
                <div className="flex justify-between text-[#0DEDC0] font-bold border-t border-slate-800 pt-2">
                  <span>(=) Ganancia Neta Libre ({dropMargenDeseado}%):</span>
                  <span>{formatoMoneda(metricasDropshipper.gananciaNetaUnidad)}</span>
                </div>
              </div>

              {/* ALERTA FINANCIERA CON ICONO 2D */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-amber-400 font-bold text-sm">Blindaje de Precios para Dropshippers:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Si vendes este producto por debajo de <strong className="text-white">{formatoMoneda(metricasDropshipper.precioVentaSugeridoFinal)}</strong>, estarás pagando las devoluciones de tu propio bolsillo y reduciendo tu utilidad real por debajo del {dropMargenDeseado}%.
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}