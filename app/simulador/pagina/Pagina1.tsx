'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  ShoppingBag, 
  ChevronDown, 
  Check, 
  HelpCircle, 
  ShieldAlert, 
  TrendingUp, 
  Sparkles, 
  Calculator, 
  AlertTriangle,
  Package,
  Truck,
  Target,
  BarChart3,
  DollarSign,
  Percent
} from 'lucide-react';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { Kicker, H1, Subtitulo, Highlight } from '@/app/complementos/Tipografia';
import { MONEDAS, MonedaConfig, formatearMonedaGlobal } from '@/app/lib/moneda';

type ModoCalculadora = 'PROVEEDOR' | 'DROPSHIPPER';

interface Pagina1Props {
  variante?: TipoFondo;
}

// COMPONENTE TOOLTIP OPTIMIZADO
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

// COMPONENTE DESPLEGABLE MODERNO PARA MONEDA
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
      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
        Moneda de Cálculo
        <Tooltip contenido="Selecciona la divisa local en la que operas tus ventas y costos para formatear las cifras." />
      </label>

      {/* Botón Gatillo */}
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

      {/* Lista Desplegable Flotante */}
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
  const [modoSeleccionado, setModoSeleccionado] = useState<ModoCalculadora>('PROVEEDOR');

  // INPUTS PROVEEDOR
  const [provCostoFabricacion, setProvCostoFabricacion] = useState<number>(12000);
  const [provGastosOperativos, setProvGastosOperativos] = useState<number>(3000);
  const [provPorcentajeDevoluciones, setProvPorcentajeDevoluciones] = useState<number>(15);
  const [provMargenDeseado, setProvMargenDeseado] = useState<number>(30);

  // INPUTS DROPSHIPPER
  const [dropUnidades, setDropUnidades] = useState<number>(1);
  const [dropCostoProducto, setDropCostoProducto] = useState<number>(25000);
  const [dropFletePromedio, setDropFletePromedio] = useState<number>(16000);
  const [dropCpaAds, setDropCpaAds] = useState<number>(22000);
  const [dropTasaDevolucion, setDropTasaDevolucion] = useState<number>(20);
  const [dropMargenDeseado, setDropMargenDeseado] = useState<number>(25);

  const formatoMoneda = (monto: number) => 
    formatearMonedaGlobal(monto, monedaSeleccionada.codigo);

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
    <section className="relative z-10 py-12 px-4 sm:px-6 overflow-hidden w-full text-white font-sans">
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-10">
        
        {/* CABECERA */}
        <div className="border-b border-slate-800 pb-6 text-center sm:text-left">
          <Kicker varianteFondo={variante}>HERRAMIENTA DE DIAGNÓSTICO</Kicker>          <H1 varianteFondo={variante} className="text-balance mb-2">
            Simulador de <Highlight varianteFondo={variante}>Rentabilidad Real.</Highlight>
          </H1>
          <Subtitulo varianteFondo={variante} className="max-w-2xl">
            Calcula tus márgenes y precios de venta exactos contemplando el castigo de fletes por devoluciones y mermas del contra entrega.
          </Subtitulo>
        </div>

        {/* SELECCIÓN DE MODO ANIMADO CON FRAMER MOTION */}
        <div className="flex bg-[#090D16] p-1.5 rounded-2xl border border-slate-800 w-full max-w-md mx-auto relative z-20 shadow-xl">
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
                className="absolute inset-0 bg-[#102935] border border-[#0DEDC0]/40 rounded-xl shadow-md z-[-1]"
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
                className="absolute inset-0 bg-[#102935] border border-[#0DEDC0]/40 rounded-xl shadow-md z-[-1]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <ShoppingBag className="w-4 h-4" />
            Soy Dropshipper
          </button>
        </div>

        {/* VISTA 1: PROVEEDOR */}
        {modoSeleccionado === 'PROVEEDOR' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            <div className="lg:col-span-5 bg-[#090D16]/90 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl backdrop-blur-md">
              <span className="text-xs font-mono font-bold text-[#0DEDC0] uppercase tracking-wider block border-b border-slate-800 pb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                1. Costos de Fabricación y Riesgo
              </span>

              <SelectorMonedaCustom
                monedaSeleccionada={monedaSeleccionada}
                setMonedaSeleccionada={setMonedaSeleccionada}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Costo Neto Fabricación/Compra ({monedaSeleccionada.codigo})
                  <Tooltip contenido="El precio directo por unidad física pagado a fábrica, laboratorio o importación." />
                </label>
                <input
                  type="number"
                  min="0"
                  value={provCostoFabricacion}
                  onChange={(e) => setProvCostoFabricacion(Number(e.target.value))}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 font-mono text-white text-sm font-bold focus:border-[#0DEDC0] focus:ring-1 focus:ring-[#0DEDC0]/50 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Gastos Fulfillment / Empaque Unitario ({monedaSeleccionada.codigo})
                  <Tooltip contenido="Costo unitario de embalaje: caja, bolsa de seguridad, etiquetas, cinta y mano de obra de empaque." />
                </label>
                <input
                  type="number"
                  min="0"
                  value={provGastosOperativos}
                  onChange={(e) => setProvGastosOperativos(Number(e.target.value))}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 font-mono text-white text-sm font-bold focus:border-[#0DEDC0] focus:ring-1 focus:ring-[#0DEDC0]/50 outline-none transition-all"
                />
              </div>

              <div className="bg-red-950/30 border border-red-900/50 p-3.5 rounded-xl">
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span className="text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Tasa Histórica de Devoluciones
                    <Tooltip contenido="Porcentaje promedio de paquetes no entregados al cliente final." />
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

              <div className="bg-[#102935]/60 border border-[#0DEDC0]/30 p-3.5 rounded-xl">
                <div className="flex justify-between text-xs font-semibold text-[#0DEDC0] mb-2">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Margen de Ganancia Neta Deseada
                    <Tooltip contenido="Porcentaje de utilidad libre limpia que deseas conservar después de absorber todos los costos." />
                  </span>
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

            <div className="lg:col-span-7 bg-[#090D16]/90 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl backdrop-blur-md">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block border-b border-slate-800 pb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#0DEDC0]" />
                2. Fijación de Precio al Dropshipper
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                <div className="bg-[#102935]/80 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold mb-1">
                    Costo Total Absorbido
                    <Tooltip contenido="Costo real por unidad: Fabricación + Empaque + Fondo de reserva por mercancía destruida o no recuperada." />
                  </span>
                  <span className="text-xl font-black text-slate-200 block">{formatoMoneda(metricasProveedor.costoTotalAbsorbido)}</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Fab + Empaque + Fugas</span>
                </div>

                <div className="bg-red-950/30 p-4 rounded-xl border border-red-900/50">
                  <span className="text-[10px] text-red-400 uppercase block font-bold mb-1">
                    Provisión por Fugas
                    <Tooltip contenido="Monto precargado a cada venta para absorber la pérdida directa de la mercancía destruida o no recuperada." />
                  </span>
                  <span className="text-xl font-black text-red-400 block">{formatoMoneda(metricasProveedor.provisionRiesgoFuga)}</span>
                  <span className="text-[10px] text-red-400/70 block mt-1">Costo de mercancía destruida o devuelta</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#102935] via-[#0D222E] to-[#0A1A24] p-6 rounded-xl border-2 border-[#0DEDC0]/50 text-center space-y-2 shadow-[0_10px_35px_rgba(13,237,192,0.2)]">
                <span className="text-xs font-mono text-slate-300 uppercase font-bold tracking-wider block">
                  Precio de Venta Sugerido en Plataforma
                  <Tooltip contenido="El precio oficial al que debes publicar este producto en Dropi para no perder dinero." />
                </span>
                <span className="text-3xl sm:text-4xl font-black font-mono text-white block my-2 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                  {formatoMoneda(metricasProveedor.precioSugeridoAlDrop)}
                </span>
                <div className="bg-[#090D16]/70 inline-block px-4 py-1.5 rounded-lg border border-[#0DEDC0]/30">
                  <span className="text-xs font-mono text-[#0DEDC0] font-bold">
                    Tu Utilidad Neta Real: {formatoMoneda(metricasProveedor.gananciaNetaUnidad)}
                  </span>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-blue-400 font-bold text-sm">Estrategia de Blindaje:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Al agregar la provisión de fuga ({provPorcentajeDevoluciones}%) directamente al precio de venta, garantizas que los pedidos exitosos <strong className="text-white">paguen las mermas de las devoluciones</strong>, manteniendo tu margen de {provMargenDeseado}% totalmente libre.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* VISTA 2: DROPSHIPPER */}
        {modoSeleccionado === 'DROPSHIPPER' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            <div className="lg:col-span-5 bg-[#090D16]/90 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl backdrop-blur-md">
              <span className="text-xs font-mono font-bold text-[#0DEDC0] uppercase tracking-wider block border-b border-slate-800 pb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                1. Costos Directos y Volumen
              </span>

              <SelectorMonedaCustom
                monedaSeleccionada={monedaSeleccionada}
                setMonedaSeleccionada={setMonedaSeleccionada}
              />

              <div className="bg-[#102935]/80 border border-[#0DEDC0]/40 p-3.5 rounded-xl">
                <label className="block text-xs font-mono font-bold text-[#0DEDC0] uppercase mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Package className="w-4 h-4" />
                    Unidades Objetivo a Vender
                  </span>
                  <Tooltip contenido="Cantidad proyectada de productos. Sirve para calcular la ganancia acumulada y el fondo acumulado de fletes." />
                </label>
                <input
                  type="number"
                  min="1"
                  value={dropUnidades}
                  onChange={(e) => setDropUnidades(Math.max(1, Number(e.target.value)))}
                  placeholder="1"
                  className="w-full bg-[#090D16] border border-[#0DEDC0]/50 rounded-lg p-2.5 font-mono text-white text-base font-black text-center focus:border-[#0DEDC0] focus:ring-1 focus:ring-[#0DEDC0]/50 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Costo del Producto en Bodega / Dropi ({monedaSeleccionada.codigo})
                  <Tooltip contenido="El precio del producto fijado por el proveedor dentro del catálogo de la plataforma." />
                </label>
                <input
                  type="number"
                  min="0"
                  value={dropCostoProducto}
                  onChange={(e) => setDropCostoProducto(Number(e.target.value))}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 font-mono text-white text-sm font-bold focus:border-[#0DEDC0] focus:ring-1 focus:ring-[#0DEDC0]/50 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  Flete Promedio de Salida ({monedaSeleccionada.codigo})
                  <Tooltip contenido="Costo promedio que cobra la transportadora por enviar un paquete exitoso." />
                </label>
                <input
                  type="number"
                  min="0"
                  value={dropFletePromedio}
                  onChange={(e) => setDropFletePromedio(Number(e.target.value))}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 font-mono text-white text-sm font-bold focus:border-[#0DEDC0] focus:ring-1 focus:ring-[#0DEDC0]/50 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-slate-400" />
                  Costo Publicitario / CPA Ads ({monedaSeleccionada.codigo})
                  <Tooltip contenido="Costo Por Adquisición: El dinero aproximado que pagas en Facebook o TikTok Ads para lograr 1 venta." />
                </label>
                <input
                  type="number"
                  min="0"
                  value={dropCpaAds}
                  onChange={(e) => setDropCpaAds(Number(e.target.value))}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 font-mono text-white text-sm font-bold focus:border-[#0DEDC0] focus:ring-1 focus:ring-[#0DEDC0]/50 outline-none transition-all"
                />
              </div>

              <div className="bg-red-950/30 border border-red-900/50 p-3.5 rounded-xl">
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span className="text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    % Devolución Estimada (Contra Entrega)
                    <Tooltip contenido="Porcentaje estimado de clientes que rechazarán el paquete al momento de la entrega." />
                  </span>
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

              <div className="bg-[#102935]/60 border border-[#0DEDC0]/30 p-3.5 rounded-xl">
                <div className="flex justify-between text-xs font-semibold text-[#0DEDC0] mb-2">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    % Ganancia Neta Libre Deseada
                    <Tooltip contenido="Tu utilidad real libre en el bolsillo después de descontar producto, fletes, anuncios y fletes devueltos." />
                  </span>
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

            <div className="lg:col-span-7 bg-[#090D16]/90 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl backdrop-blur-md">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block border-b border-slate-800 pb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#0DEDC0]" />
                2. Resultado Recomendado ({metricasDropshipper.qty} {metricasDropshipper.qty === 1 ? 'Unidad' : 'Unidades'})
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                <div className="bg-red-950/30 p-4 rounded-xl border border-red-900/50">
                  <span className="text-[10px] text-red-400 uppercase block font-bold mb-1">
                    Fondo Fletes Devolución ({metricasDropshipper.qty} uds)
                    <Tooltip contenido="Esta es la bolsa de dinero total que debes guardar de tus ventas exitosas para pagar los paquetes devueltos." />
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
                    <Tooltip contenido="Retorno Mínimo en Publicidad (Ventas ÷ Inversión Ads). Si tu ROAS en Meta/TikTok cae de este número, estarás perdiendo dinero." />
                  </span>
                  <span className="text-xl font-black text-amber-400 block drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                    {metricasDropshipper.roasObjetivoReal.toFixed(2)}x
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Exigencia en Meta / TikTok Ads
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#102935] via-[#0D222E] to-[#0A1A24] p-6 rounded-xl border-2 border-[#0DEDC0]/50 text-center space-y-2 shadow-[0_10px_35px_rgba(13,237,192,0.2)]">
                <span className="text-xs font-mono text-slate-300 uppercase font-bold tracking-wider block">
                  VALOR SUGERIDO DE VENTA AL CLIENTE FINAL (POR UNIDAD)
                  <Tooltip contenido="El precio mínimo en el que tu tienda debe vender el producto al cliente final." />
                </span>
                <span className="text-3xl sm:text-4xl font-black font-mono text-[#0DEDC0] block my-2 drop-shadow-[0_0_12px_rgba(13,237,192,0.5)]">
                  {formatoMoneda(metricasDropshipper.precioVentaSugeridoFinal)}
                </span>
                
                <div className="bg-[#090D16]/80 inline-block px-4 py-2 rounded-xl border border-[#0DEDC0]/30">
                  <span className="text-xs font-mono text-white font-bold block">
                    Ganancia Neta por Unidad: <span className="text-[#0DEDC0]">{formatoMoneda(metricasDropshipper.gananciaNetaUnidad)}</span>
                  </span>
                </div>
              </div>

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

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-amber-400 font-bold text-sm">Blindaje de Precios para Dropshippers:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Si vendes este producto por debajo de <strong className="text-white">{formatoMoneda(metricasDropshipper.precioVentaSugeridoFinal)}</strong>, estarás pagando las devoluciones de tu propio bolsillo y reduciendo tu utilidad real por debajo del {dropMargenDeseado}%.
                </p>
              </div>

            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}