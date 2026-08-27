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
  impuestoDefault: number;
}

const PAISES_ATOM: PaisConfig[] = [
  { codigo: 'CO', nombre: 'Colombia', moneda: 'COP', locale: 'es-CO', simbolo: '$', impuestoDefault: 19 },
  { codigo: 'MX', nombre: 'México', moneda: 'MXN', locale: 'es-MX', simbolo: '$', impuestoDefault: 16 },
  { codigo: 'CL', nombre: 'Chile', moneda: 'CLP', locale: 'es-CL', simbolo: '$', impuestoDefault: 19 },
  { codigo: 'PE', nombre: 'Perú', moneda: 'PEN', locale: 'es-PE', simbolo: 'S/', impuestoDefault: 18 },
  { codigo: 'EC', nombre: 'Ecuador', moneda: 'USD', locale: 'en-US', simbolo: '$', impuestoDefault: 15 },
  { codigo: 'GT', nombre: 'Guatemala', moneda: 'GTQ', locale: 'es-GT', simbolo: 'Q', impuestoDefault: 12 },
];

type EscenarioTipo = 'PESIMO' | 'FAVORABLE' | 'OPTIMO' | 'OBJETIVO';
type OpcionPropuestaTipo = 'OPCION1' | 'OPCION2';

interface Seccion1Props {
  variante?: TipoFondo;
}

// HELPER DE FORMATEO GLOBAL DESACOPLADO DEL RENDER
const formatearMoneda = (monto: number, locale: string, moneda: string, simbolo: string) => {
  const num = Number(monto) || 0;
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: moneda,
      minimumFractionDigits: ['CLP', 'COP'].includes(moneda) ? 0 : 2,
      maximumFractionDigits: ['CLP', 'COP'].includes(moneda) ? 0 : 2,
    }).format(num);
  } catch {
    return `${simbolo} ${num.toLocaleString()}`;
  }
};

export default function Seccion1({ variante = 'darkNoise' }: Seccion1Props) {
  const [paisSeleccionado, setPaisSeleccionado] = useState<PaisConfig>(PAISES_ATOM[0]);

  // INPUTS PASO 1: COSTOS BODEGA Y FRICCIÓN
  const [costoFabricacion, setCostoFabricacion] = useState<number>(15000);
  const [costoEmpaque, setCostoEmpaque] = useState<number>(2000);
  const [costoLogisticaInversa, setCostoLogisticaInversa] = useState<number>(0); 
  
  const [porcentajeDevoluciones, setPorcentajeDevoluciones] = useState<number>(20); 
  const [porcentajeMermas, setPorcentajeMermas] = useState<number>(3); 
  const [impactoFiscal, setImpactoFiscal] = useState<number>(PAISES_ATOM[0].impuestoDefault);
  const [margenDeseado, setMargenDeseado] = useState<number>(30);

  // SELECCIÓN DE ESCENARIO PASO 2 -> PASO 3
  const [escenarioSeleccionado, setEscenarioSeleccionado] = useState<EscenarioTipo>('OBJETIVO');

  // INPUTS PASO 3: PROPUESTA COMERCIAL
  const [nombreProveedor, setNombreProveedor] = useState<string>(''); 
  const [nombreProducto, setNombreProducto] = useState<string>('Producto Estrella');
  const [skuProducto, setSkuProducto] = useState<string>('SKU-1001');
  const [unidadesProyectadas, setUnidadesProyectadas] = useState<number>(100);
  const [comisionDropExtra, setComisionDropExtra] = useState<number>(5);
  const [opcionPropuestaSeleccionada, setOpcionPropuestaSeleccionada] = useState<OpcionPropuestaTipo>('OPCION2');

  const formatoMoneda = (monto: number) => 
    formatearMoneda(monto, paisSeleccionado.locale, paisSeleccionado.moneda, paisSeleccionado.simbolo);

  const metricas = useMemo(() => {
    const cFab = Math.max(0, Number(costoFabricacion));
    const cEmp = Math.max(0, Number(costoEmpaque));
    const cBase = cFab + cEmp; 
    const cRetorno = Math.max(0, Number(costoLogisticaInversa)); 
    const qty = Math.max(1, Number(unidadesProyectadas));
    
    const pctMargenBase = Math.min(80, Math.max(1, Number(margenDeseado))) / 100;
    const pctIVA = Math.min(50, Math.max(0, Number(impactoFiscal))) / 100;
    
    const pctDevBase = Math.min(0.50, Math.max(0.15, Number(porcentajeDevoluciones) / 100));
    const pctMermasBase = Math.min(0.30, Math.max(0.01, Number(porcentajeMermas) / 100));
    const pctComisionExtra = Math.min(0.30, Math.max(0, Number(comisionDropExtra) / 100));

    const calcularEscenario = (pDev: number, pMerma: number, pMargen: number) => {
      const factorDev = (1 - pDev) > 0 ? (pDev / (1 - pDev)) : 0;
      const costoDev = cRetorno * factorDev;
      
      const factorMerma = (1 - pMerma) > 0 ? (pMerma / (1 - pMerma)) : 0;
      const costoMerma = cBase * factorMerma;

      const costoAbsorbido = cBase + costoDev + costoMerma;

      const precioNeto = (1 - pMargen) > 0 ? (costoAbsorbido / (1 - pMargen)) : (costoAbsorbido * 2);
      
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
    const precioNetoOp2 = divisorOp2 > 0 ? (activo.costoAbsorbido / divisorOp2) : (activo.costoAbsorbido * 3);
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

  const enviarPorWhatsapp = () => {
    const esOp1 = opcionPropuestaSeleccionada === 'OPCION1';
    const precioElegido = esOp1 ? metricas.activo.precioCatalogo : metricas.precioCatalogoOp2;
    const bonoElegido = esOp1 ? metricas.comisionOp1 : metricas.comisionOp2;
    const bonoTotalLote = esOp1 ? metricas.totalComisionOp1 : metricas.totalComisionOp2;

    const textoMensaje = `*PROPUESTA DE META LOGÍSTICA & BONIFICACIÓN B2B* 📦🏆🚀

*Proveedor:* 🏢 ${nombreProveedor || 'Bodega Autorizada'}
*Producto:* 🏷️ ${nombreProducto} (${skuProducto})
*Lote Proyectado:* 📦 ${metricas.qty} Unidades

*Estructura de la Oferta:* 💰
• Precio Público Sugerido (PVP): 💲${formatoMoneda(precioElegido)} / ud
• Bono x Cumplimiento Logístico (${(metricas.pctComisionExtra * 100).toFixed(0)}%): 🎁 ${formatoMoneda(bonoElegido)} / unidad entregada
• Fondo Total de Incentivos (${metricas.qty} uds): 🏦 ${formatoMoneda(bonoTotalLote)}

*KPIs de Meta Logística Exigidos:* 📊
• Devoluciones Máximas Permitidas: 📉 ${(metricas.devActivo * 100).toFixed(0)}%
• Efectividad de Entrega Mínima: ✅ ${(100 - (metricas.devActivo * 100)).toFixed(0)}%

📌 _Condición:_ El incentivo logístico se desembolsará el 25 de cada mes despues de confirmar y cerrar la operacion logistica del mes anterior, y se tomara como referencia las órdenes efectivamente entregadas en plataforma bajo los parámetros de efectividad acordados. 🤝`;

    window.open(`https://wa.me/?text=${encodeURIComponent(textoMensaje)}`, '_blank');
  };

  return (
    <section className="relative z-10 py-12 px-4 sm:px-6 overflow-hidden w-full border-b border-[#0DEDC0]/10 text-white">
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        
        {/* CABECERA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-6">
          <div>
            <Kicker className="!text-[#0DEDC0]">HERRAMIENTA PARA GERENCIA B2B</Kicker>
            <H1 className="text-balance mb-2">
              Arquitectura de <Highlight>Precios & Sensibilidad.</Highlight>
            </H1>
            <Subtitulo className="max-w-2xl">
              Audita matemáticamente tus costos logísticos inversos. Analiza los 4 escenarios de sensibilidad operativa y emite la propuesta comercial definitiva.
            </Subtitulo>
          </div>

          <div className="bg-[#090D16] p-3.5 rounded-2xl border border-slate-800 shrink-0 w-full md:w-auto">
            <label className="block text-[10px] font-mono font-bold text-[#0DEDC0] uppercase mb-1">
              Moneda de Operación / País
            </label>
            <select
              value={paisSeleccionado.codigo}
              onChange={(e) => {
                const p = PAISES_ATOM.find((x) => x.codigo === e.target.value);
                if (p) {
                  setPaisSeleccionado(p);
                  setImpactoFiscal(p.impuestoDefault);
                }
              }}
              className="w-full bg-[#102935] border border-slate-700 text-white text-xs font-bold rounded-xl p-2.5 focus:border-[#0DEDC0] outline-none cursor-pointer"
            >
              {PAISES_ATOM.map((p) => (
                <option key={p.codigo} value={p.codigo}>
                  {p.nombre} ({p.moneda}) - IVA base {p.impuestoDefault}%
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SECCIÓN 1: ESTRUCTURA FINANCIERA BASE */}
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
            <div className="bg-[#090D16] p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl h-full transition-transform hover:-translate-y-1">
              <span className="text-xs font-mono font-bold text-[#0DEDC0] uppercase tracking-wider block border-b border-slate-800 pb-2">
                Costos de Producción
              </span>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Costo CIF / Fabricación</label>
                <input
                  type="number" min="0" value={costoFabricacion} onChange={(e) => setCostoFabricacion(Number(e.target.value))}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-2.5 font-mono text-white text-sm font-bold focus:border-[#0DEDC0] outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Alistamiento / WaaS / Empaque</label>
                <input
                  type="number" min="0" value={costoEmpaque} onChange={(e) => setCostoEmpaque(Number(e.target.value))}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-2.5 font-mono text-white text-sm font-bold focus:border-[#0DEDC0] outline-none"
                />
              </div>
            </div>

            <div className="bg-[#090D16] p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl h-full transition-transform hover:-translate-y-1">
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block border-b border-slate-800 pb-2">
                Provisión Fricción Logística COD
              </span>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 text-amber-300">Costo Logística Inversa (Flete Retorno)</label>
                <input
                  type="number" min="0" value={costoLogisticaInversa} onChange={(e) => setCostoLogisticaInversa(Number(e.target.value))} placeholder="0"
                  className="w-full bg-[#1A160B] border border-amber-900/50 rounded-xl p-2.5 font-mono text-amber-100 text-sm font-bold focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-900/10 border border-red-900/30 p-2.5 rounded-xl">
                  <div className="flex justify-between text-[10px] font-semibold text-red-300 mb-1.5">
                    <span>Devolución</span>
                    <span className="font-mono text-red-400 font-bold">{porcentajeDevoluciones}%</span>
                  </div>
                  <input type="range" min="15" max="50" value={porcentajeDevoluciones} onChange={(e) => setPorcentajeDevoluciones(Number(e.target.value))} className="w-full accent-red-500" />
                  <span className="text-[9px] text-slate-500 block mt-1">Piso Técnico 15%</span>
                </div>
                <div className="bg-red-950/10 border border-red-900/30 p-2.5 rounded-xl">
                  <div className="flex justify-between text-[10px] font-semibold text-red-300 mb-1.5">
                    <span>Mermas (Pérdida)</span>
                    <span className="font-mono text-red-400 font-bold">{porcentajeMermas}%</span>
                  </div>
                  <input type="range" min="1" max="30" value={porcentajeMermas} onChange={(e) => setPorcentajeMermas(Number(e.target.value))} className="w-full accent-red-400" />
                  <span className="text-[9px] text-slate-500 block mt-1">Piso Técnico 1%</span>
                </div>
              </div>
            </div>

            <div className="bg-[#090D16] p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl h-full transition-transform hover:-translate-y-1">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block border-b border-slate-800 pb-2">
                Objetivo de Rentabilidad & Fiscal
              </span>
              <div className="bg-[#102935]/40 border border-[#0DEDC0]/20 p-3 rounded-xl">
                <div className="flex justify-between text-xs font-semibold text-[#0DEDC0] mb-2">
                  <span>Margen Neto Libre</span>
                  <span className="font-mono font-bold text-white">{margenDeseado}%</span>
                </div>
                <input type="range" min="1" max="70" value={margenDeseado} onChange={(e) => setMargenDeseado(Number(e.target.value))} className="w-full accent-[#0DEDC0]" />
              </div>
              <div className="bg-slate-800/30 border border-slate-700/50 p-3 rounded-xl">
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>Impuestos (IVA / Retenciones)</span>
                  <span className="font-mono text-white">{impactoFiscal}%</span>
                </div>
                <input type="range" min="0" max="30" value={impactoFiscal} onChange={(e) => setImpactoFiscal(Number(e.target.value))} className="w-full accent-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: ANÁLISIS DE SENSIBILIDAD B2B */}
        <div className="space-y-6 pt-6 relative">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#0DEDC0]/20 to-[#0DEDC0]/5 border border-[#0DEDC0]/40 text-[#0DEDC0] font-black font-mono text-base sm:text-lg shadow-[0_0_15px_rgba(13,237,192,0.2)] shrink-0">
              2
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-sm sm:text-base md:text-lg font-black text-white uppercase tracking-widest m-0">
                Análisis de Sensibilidad B2B
              </h2>
              <span className="text-[10px] sm:text-[11px] font-mono font-normal text-slate-400">
                (Haz clic en un escenario para trasladar su precio a la propuesta comercial)
              </span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-[#0DEDC0]/40 via-slate-700 to-transparent hidden lg:block"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
            
            <div 
              onClick={() => setEscenarioSeleccionado('PESIMO')}
              className={`relative bg-[#1A0B12] rounded-2xl p-5 overflow-hidden shadow-lg flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 border-2 ${
                escenarioSeleccionado === 'PESIMO' ? 'border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.3)] ring-1 ring-red-500/50 scale-[1.02]' : 'border-red-900/40 hover:border-red-500/40'
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500" />
              <div className="space-y-2 border-b border-red-900/30 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/30">1. Pésimo</span>
                  {escenarioSeleccionado === 'PESIMO' && <span className="text-[9px] font-mono font-bold bg-red-500 text-white px-1.5 py-0.5 rounded">✓ Activo</span>}
                </div>
                <h3 className="text-sm font-bold text-slate-200 m-0 leading-tight">Estrés Logístico Máximo</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed m-0">Devolución {metricas.pctDevPes}% | Mermas {metricas.pctMermasPes}%</p>
                <div className="pt-2">
                  <span className="text-[9px] text-slate-500 uppercase font-bold block">Precio de Resguardo Requerido</span>
                  <span className="text-xl font-mono font-black text-slate-200">{formatoMoneda(metricas.pes.precioCatalogo)}</span>
                </div>
              </div>
              <div className="bg-[#090D16]/80 p-3.5 rounded-xl border border-red-900/20 font-mono text-[10px] flex-1 flex flex-col justify-between space-y-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-300"><span className="opacity-70">Ingreso Neto (Sin IVA):</span><span className="font-bold">{formatoMoneda(metricas.pes.precioNeto)}</span></div>
                  <div className="flex justify-between text-slate-400"><span>(-) Costo Base COGS:</span><span>-{formatoMoneda(metricas.cBase)}</span></div>
                  <div className="flex justify-between text-red-400"><span>(-) Prov. Mermas:</span><span>-{formatoMoneda(metricas.pes.costoMerma)}</span></div>
                  <div className="flex justify-between text-red-400"><span>(-) Prov. Devolución:</span><span>-{formatoMoneda(metricas.pes.costoDev)}</span></div>
                </div>
                <div className="flex justify-between text-red-400 font-bold border-t border-slate-800 pt-2 text-[11px] mt-2">
                  <span>Utilidad:</span><span>{formatoMoneda(metricas.pes.ganancia)} ({margenDeseado}%)</span>
                </div>
              </div>
              <div className="text-[9px] text-red-400/80 leading-tight mt-1 text-center">
                *Si vendes al precio Favorable bajo este estrés, tu ganancia se desploma a {formatoMoneda(metricas.gananciaPesRealEnFav)}.
              </div>
            </div>

            <div 
              onClick={() => setEscenarioSeleccionado('FAVORABLE')}
              className={`relative bg-[#0F2330] rounded-2xl p-5 overflow-hidden shadow-lg flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 border-2 ${
                escenarioSeleccionado === 'FAVORABLE' ? 'border-blue-400 shadow-[0_0_25px_rgba(96,165,250,0.3)] ring-1 ring-blue-400/50 scale-[1.02]' : 'border-blue-900/40 hover:border-blue-400/40'
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-400" />
              <div className="space-y-2 border-b border-blue-900/30 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">2. Favorable</span>
                  {escenarioSeleccionado === 'FAVORABLE' && <span className="text-[9px] font-mono font-bold bg-blue-400 text-[#090D16] px-1.5 py-0.5 rounded">✓ Activo</span>}
                </div>
                <h3 className="text-sm font-bold text-slate-200 m-0 leading-tight">Proyección Base Real</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed m-0">Devolución {porcentajeDevoluciones}% | Mermas {porcentajeMermas}%</p>
                <div className="pt-2">
                  <span className="text-[9px] text-slate-500 uppercase font-bold block">Precio Catálogo Base</span>
                  <span className="text-xl font-mono font-black text-white">{formatoMoneda(metricas.fav.precioCatalogo)}</span>
                </div>
              </div>
              <div className="bg-[#090D16]/80 p-3.5 rounded-xl border border-blue-900/20 font-mono text-[10px] flex-1 flex flex-col justify-between space-y-2">
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
              <div className="text-[9px] text-blue-300/60 leading-tight mt-1 text-center">
                El IVA {impactoFiscal}% es facturado al cliente y reservado intacto para declaración.
              </div>
            </div>

            <div 
              onClick={() => setEscenarioSeleccionado('OPTIMO')}
              className={`relative bg-[#0B1A14] rounded-2xl p-5 overflow-hidden shadow-lg flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 border-2 ${
                escenarioSeleccionado === 'OPTIMO' ? 'border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.3)] ring-1 ring-emerald-400/50 scale-[1.02]' : 'border-emerald-500/30 hover:border-emerald-400/40'
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-400" />
              <div className="space-y-2 border-b border-emerald-900/30 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">3. Óptimo</span>
                  {escenarioSeleccionado === 'OPTIMO' && <span className="text-[9px] font-mono font-bold bg-emerald-400 text-[#090D16] px-1.5 py-0.5 rounded">✓ Activo</span>}
                </div>
                <h3 className="text-sm font-bold text-slate-200 m-0 leading-tight">Piso Eficiencia (Control Total)</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed m-0">Devolución 15% | Mermas 1%</p>
                <div className="pt-2">
                  <span className="text-[9px] text-slate-500 uppercase font-bold block">Precio Ultra Competitivo</span>
                  <span className="text-xl font-mono font-black text-emerald-300">{formatoMoneda(metricas.opt.precioCatalogo)}</span>
                </div>
              </div>
              <div className="bg-[#090D16]/80 p-3.5 rounded-xl border border-emerald-900/20 font-mono text-[10px] flex-1 flex flex-col justify-between space-y-2">
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
              <div className="text-[9px] text-emerald-400/80 leading-tight mt-1 text-center">
                *A precio Favorable tu ganancia subiría a {formatoMoneda(metricas.gananciaOptRealEnFav)}.
              </div>
            </div>

            <div 
              onClick={() => setEscenarioSeleccionado('OBJETIVO')}
              className={`relative bg-gradient-to-b from-[#0F2633] to-[#0A1A24] rounded-2xl p-5 overflow-hidden shadow-[0_10px_40px_rgba(13,237,192,0.15)] flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 border-2 ${
                escenarioSeleccionado === 'OBJETIVO' ? 'border-[#0DEDC0] shadow-[0_0_30px_rgba(13,237,192,0.4)] ring-1 ring-[#0DEDC0]/50 scale-[1.02] z-10' : 'border-[#0DEDC0]/40 hover:border-[#0DEDC0]/80'
              }`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0DEDC0]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#0DEDC0] shadow-[0_0_15px_rgba(13,237,192,0.8)]" />
              
              <div className="space-y-2 border-b border-[#0DEDC0]/30 pb-3 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase bg-[#0DEDC0]/10 text-[#0DEDC0] px-2 py-0.5 rounded border border-[#0DEDC0]/30">4. Objetivo B2B</span>
                  {escenarioSeleccionado === 'OBJETIVO' && <span className="text-[9px] font-mono font-bold bg-[#0DEDC0] text-[#090D16] px-1.5 py-0.5 rounded">★ RECOMENDADO</span>}
                </div>
                <h3 className="text-sm font-black text-white m-0 leading-tight">Estructura Aterrizada</h3>
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
              <div className="text-[9px] text-[#0DEDC0]/60 leading-tight mt-1 text-center font-medium">
                Absorbe la iliquidez por demora de pagos Wallet.
              </div>
            </div>

          </div>
        </div>

        {/* SECCIÓN 3: CREADOR DE PROPUESTA COMERCIAL B2B */}
        <div className="space-y-8 pt-10 relative">
          
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/40 text-amber-400 font-black font-mono text-base sm:text-lg shadow-[0_0_15px_rgba(245,158,11,0.2)] shrink-0">
              3
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
              <h2 className="text-sm sm:text-base md:text-lg font-black text-white uppercase tracking-widest m-0">
                Creador de Propuesta Comercial Oficial
              </h2>
              <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-md font-bold shrink-0 shadow-inner">
                MODO: ESCENARIO {escenarioSeleccionado} ({formatoMoneda(metricas.activo.precioCatalogo)})
              </span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-500/40 via-slate-700 to-transparent hidden lg:block"></div>
          </div>

          <div className="bg-[#090D16] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block border-b border-slate-800 pb-2">
              Configuración de la Oferta
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-end">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Empresa / Proveedor</label>
                <input type="text" value={nombreProveedor} onChange={(e) => setNombreProveedor(e.target.value)} placeholder="Ej. Mi Bodega Drop" className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-amber-400 outline-none transition-colors" />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Nombre del Producto</label>
                <input type="text" value={nombreProducto} onChange={(e) => setNombreProducto(e.target.value)} className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-amber-400 outline-none transition-colors" />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Código SKU</label>
                <input type="text" value={skuProducto} onChange={(e) => setSkuProducto(e.target.value)} className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-amber-400 outline-none transition-colors" />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Lote (Unidades)</label>
                <input type="number" min="1" value={unidadesProyectadas} onChange={(e) => setUnidadesProyectadas(Number(e.target.value))} className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 font-mono text-white text-sm font-bold focus:border-amber-400 outline-none transition-colors" />
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl">
                <div className="flex justify-between text-[11px] font-semibold text-amber-300 mb-1.5">
                  <span>Comisión Drop</span>
                  <span className="font-mono text-amber-400 font-bold bg-amber-500/20 px-2 py-0.5 rounded">{comisionDropExtra}%</span>
                </div>
                <input type="range" min="0" max="30" value={comisionDropExtra} onChange={(e) => setComisionDropExtra(Number(e.target.value))} className="w-full accent-amber-500 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="bg-[#090D16] p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
            
            <div className="border-b border-slate-700 pb-5">
              <span className="text-[10px] font-mono font-black uppercase text-amber-400 tracking-widest block mb-2">
                Selecciona la Modalidad Comercial
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white m-0">
                Condiciones de Pago y Liquidación
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div 
                onClick={() => setOpcionPropuestaSeleccionada('OPCION1')}
                className={`p-5 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  opcionPropuestaSeleccionada === 'OPCION1' ? 'bg-[#1A160B] border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/50' : 'bg-[#101D28]/40 border border-slate-800 hover:border-amber-500/40'
                }`}
              >
                <div className={`absolute top-0 left-0 h-full w-1.5 transition-colors ${opcionPropuestaSeleccionada === 'OPCION1' ? 'bg-amber-400' : 'bg-transparent'}`} />
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`text-sm font-black uppercase m-0 leading-tight ${opcionPropuestaSeleccionada === 'OPCION1' ? 'text-amber-400' : 'text-slate-300'}`}>
                      Opción A: Precio Base (Asumes Comisión)
                    </h4>
                    {opcionPropuestaSeleccionada === 'OPCION1' && <span className="text-[9px] font-mono font-bold bg-amber-400 text-[#090D16] px-2 py-0.5 rounded shadow-sm">✓ ELEGIDA</span>}
                  </div>
                  
                  <div className="bg-[#090D16]/60 p-4 rounded-xl border border-amber-500/10 space-y-3 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Precio Público (Con IVA):</span>
                      <span className="text-white font-bold">{formatoMoneda(metricas.activo.precioCatalogo)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-2">
                      <span className="text-amber-400 font-bold">Bono al Drop ({comisionDropExtra}%):</span>
                      <span className="text-amber-400 font-black">+{formatoMoneda(metricas.comisionOp1)} /ud</span>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setOpcionPropuestaSeleccionada('OPCION2')}
                className={`p-5 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  opcionPropuestaSeleccionada === 'OPCION2' ? 'bg-[#0F2633] border-2 border-[#0DEDC0] shadow-[0_0_25px_rgba(13,237,192,0.15)] ring-1 ring-[#0DEDC0]/50' : 'bg-[#101D28]/40 border border-slate-800 hover:border-[#0DEDC0]/40'
                }`}
              >
                <div className={`absolute top-0 left-0 h-full w-1.5 transition-colors ${opcionPropuestaSeleccionada === 'OPCION2' ? 'bg-[#0DEDC0]' : 'bg-transparent'}`} />
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`text-sm font-black uppercase m-0 leading-tight ${opcionPropuestaSeleccionada === 'OPCION2' ? 'text-[#0DEDC0]' : 'text-slate-300'}`}>
                      Opción B: Escalar Precio (Margen Intacto)
                    </h4>
                    {opcionPropuestaSeleccionada === 'OPCION2' && <span className="text-[9px] font-mono font-bold bg-[#0DEDC0] text-[#090D16] px-2 py-0.5 rounded shadow-sm">✓ ELEGIDA</span>}
                  </div>
                  
                  <div className="bg-[#090D16]/60 p-4 rounded-xl border border-[#0DEDC0]/10 space-y-3 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Nuevo Precio Público:</span>
                      <span className="text-[#0DEDC0] font-bold">{formatoMoneda(metricas.precioCatalogoOp2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-2">
                      <span className="text-[#0DEDC0] font-bold">Bono al Drop ({comisionDropExtra}%):</span>
                      <span className="text-[#0DEDC0] font-black">+{formatoMoneda(metricas.comisionOp2)} /ud</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#0F2633] via-[#0A1A24] to-[#090D16] p-6 rounded-2xl border-2 border-[#0DEDC0]/40 shadow-2xl space-y-4 mt-6">
              <div className="flex justify-between items-center border-b border-[#0DEDC0]/20 pb-3 flex-wrap gap-2">
                <span className="text-xs font-mono font-black uppercase text-[#0DEDC0] tracking-wider">
                  LIQUIDACIÓN TOTAL DE GANANCIA BODEGA ({metricas.qty} UNIDADES)
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-black/40 px-3 py-1 rounded-full border border-slate-700">
                  MODALIDAD: {opcionPropuestaSeleccionada === 'OPCION1' ? 'Opción A (Asumida)' : 'Opción B (Escalada)'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono">
                <div className="bg-[#090D16]/80 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Ventas Brutas Lote</span>
                  <span className="text-lg font-black text-white">
                    {formatoMoneda(opcionPropuestaSeleccionada === 'OPCION1' ? metricas.totalVentasOp1 : metricas.totalVentasOp2)}
                  </span>
                </div>

                <div className="bg-[#090D16]/80 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Costo Operativo Absorbido</span>
                  <span className="text-lg font-black text-slate-300">
                    -{formatoMoneda(opcionPropuestaSeleccionada === 'OPCION1' ? metricas.totalCostosOp1 : metricas.totalCostosOp2)}
                  </span>
                </div>

                <div className="bg-[#090D16]/80 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-amber-400 uppercase font-bold block mb-1">Fondo Comisión Drop</span>
                  <span className="text-lg font-black text-amber-400">
                    -{formatoMoneda(opcionPropuestaSeleccionada === 'OPCION1' ? metricas.totalComisionOp1 : metricas.totalComisionOp2)}
                  </span>
                </div>

                <div className="bg-[#0DEDC0]/10 p-3.5 rounded-xl border border-[#0DEDC0]/40">
                  <span className="text-[10px] text-[#0DEDC0] uppercase font-bold block mb-1">UTILIDAD NETA BODEGA</span>
                  <span className="text-xl font-black text-[#0DEDC0]">
                    {formatoMoneda(opcionPropuestaSeleccionada === 'OPCION1' ? metricas.totalGananciaOp1 : metricas.totalGananciaOp2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button 
              onClick={enviarPorWhatsapp} 
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_5px_15px_rgba(22,163,74,0.3)] cursor-pointer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Enviar Propuesta por WhatsApp
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}