'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { Kicker, H1, Highlight, ESTILOS_TEXTO, Subtitulo } from '@/app/complementos/Tipografia';

interface PaisConfig {
  codigo: string;
  nombre: string;
  moneda: string;
  locale: string;
  simbolo: string;
  ivaPorDefecto: number;
}

const PAISES_ATOM: PaisConfig[] = [
  { codigo: 'CO', nombre: 'Colombia', moneda: 'COP', locale: 'es-CO', simbolo: '$', ivaPorDefecto: 19 },
  { codigo: 'MX', nombre: 'México', moneda: 'MXN', locale: 'es-MX', simbolo: '$', ivaPorDefecto: 16 },
  { codigo: 'CL', nombre: 'Chile', moneda: 'CLP', locale: 'es-CL', simbolo: '$', ivaPorDefecto: 19 },
  { codigo: 'PE', nombre: 'Perú', moneda: 'PEN', locale: 'es-PE', simbolo: 'S/', ivaPorDefecto: 18 },
  { codigo: 'EC', nombre: 'Ecuador', moneda: 'USD', locale: 'en-US', simbolo: '$', ivaPorDefecto: 15 },
  { codigo: 'GT', nombre: 'Guatemala', moneda: 'GTQ', locale: 'es-GT', simbolo: 'Q', ivaPorDefecto: 12 },
];

interface Seccion1Props {
  variante?: TipoFondo;
}

export default function Seccion1({ variante = 'darkNoise' }: Seccion1Props) {
  // CONFIGURACIÓN GEOGRÁFICA Y MONEDA
  const [paisSeleccionado, setPaisSeleccionado] = useState<PaisConfig>(PAISES_ATOM[0]);
  const [aplicaIva, setAplicaIva] = useState<boolean>(false);
  const [tarifaIvaPersonalizada, setTarifaIvaPersonalizada] = useState<number>(PAISES_ATOM[0].ivaPorDefecto);

  // CANAL DE VENTA
  const [canalSeleccionado, setSimCanal] = useState<'MAYOR' | 'ECOM' | 'DROKO'>('ECOM');

  // INPUTS BASE DE COSTO (PREDETERMINADOS)
  const [cogs, setCogs] = useState<number>(12500);
  const [fleteYEmpaque, setFleteYEmpaque] = useState<number>(2500);
  const [gastosOperativos, setGastosOperativos] = useState<number>(500);
  const [margenDeseado, setSimMargenDeseado] = useState<number>(20);

  // VARIABLES EN EL DESGLOSE DE RENTABILIDAD MASIVA
  const [unidadesVendidas, setUnidadesVendidas] = useState<number>(100);
  const [simBonifVendedor, setSimBonifVendedor] = useState<number>(5);

  // ESCENARIO SELECCIONADO PARA EVALUACIÓN MASIVA (POR DEFECTO 'RIESGO')
  const [escenarioElegido, setEscenarioElegido] = useState<'OPTIMO' | 'ESTABLE' | 'RIESGO'>('RIESGO');

  // FACTORES DE FUGA (E-COMMERCE)
  const [simDevRate, setSimDevRate] = useState<number>(18);
  const [simLossRate, setSimLossRate] = useState<number>(5);

  // FACTORES DROKO (COMISIÓN AL 3% PREDETERMINADA)
  const [simPlatFee, setSimPlatFee] = useState<number>(3);
  const [modalidadDroko, setModalidadDroko] = useState<'TRANSITO' | 'BODEGA'>('TRANSITO');
  const [margenDrokoTransito, setMargenDrokoTransito] = useState<number>(18);
  const [margenDrokoBodega, setMargenDrokoBodega] = useState<number>(28);

  useEffect(() => {
    setTarifaIvaPersonalizada(paisSeleccionado.ivaPorDefecto);
  }, [paisSeleccionado]);

  // Ajustes por canal al cambiar
  useEffect(() => {
    if (canalSeleccionado === 'MAYOR') {
      setSimDevRate(0);
      setSimLossRate(0);
      setSimPlatFee(0);
      setSimBonifVendedor(0);
      setSimMargenDeseado(20);
      setFleteYEmpaque(0);
    } else if (canalSeleccionado === 'ECOM') {
      setSimDevRate(18);
      setSimLossRate(5);
      setSimPlatFee(0);
      setSimBonifVendedor(5);
      setSimMargenDeseado(25);
      setFleteYEmpaque(2500);
    } else if (canalSeleccionado === 'DROKO') {
      setSimDevRate(0);
      setSimLossRate(0);
      setSimPlatFee(3);
      setSimBonifVendedor(0);
      setFleteYEmpaque(0);
    }
  }, [canalSeleccionado]);

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
  // CÁLCULO FINANCIERO BASE (TARJETAS INTACTAS)
  // ==========================================
  const escenariosCalculados = useMemo(() => {
    const costoProducto = Number(cogs) || 0;
    const costoOps = canalSeleccionado === 'ECOM' ? (Number(fleteYEmpaque) || 0) : 0;
    const otros = Number(gastosOperativos) || 0;

    const devPct = canalSeleccionado === 'ECOM' ? ((Number(simDevRate) || 0) / 100) : 0;
    const lossPct = canalSeleccionado === 'ECOM' ? ((Number(simLossRate) || 0) / 100) : 0;
    const platFeePct = canalSeleccionado === 'DROKO' ? ((Number(simPlatFee) || 0) / 100) : 0;

    const costoDirectoUnit = costoProducto + costoOps + otros;
    const provDevolucion = (costoOps * 2) * devPct;
    const provMerma = (costoProducto + costoOps) * lossPct;
    const totalProvisionFuga = provDevolucion + provMerma;

    const costoRealUnit = costoDirectoUnit + totalProvisionFuga;

    let margenBaseActual = margenDeseado;
    if (canalSeleccionado === 'DROKO') {
      margenBaseActual = modalidadDroko === 'TRANSITO' ? margenDrokoTransito : margenDrokoBodega;
    }

    let recomendacionBaseOptimo = 'Ideal para reinversión masiva. Absorbe imprevistos comerciales y permite financiar ofertas por volumen sin comprometer la caja.';
    let recomendacionBaseEstable = 'Punto de equilibrio saludable. Mantiene la operación sostenible para pedidos frecuentes, cubriendo gastos fijos y la comisión de venta.';
    
    if (canalSeleccionado === 'DROKO') {
      recomendacionBaseOptimo = 'Margen de seguridad alto. Este nivel te protege contra pérdidas de inventario, depreciación y riesgos operativos que impactan directamente a las empresas dueñas del producto.';
      recomendacionBaseEstable = 'Nivel de rentabilidad sostenible. Asegura la recuperación de costos indirectos como almacenamiento o gestión administrativa.';
    }

    const niveles = [
      {
        clave: 'OPTIMO' as const,
        etiqueta: 'Escenario Óptimo',
        deltaMargen: 5,
        colorClass: 'text-[#0DEDC0]',
        borderClass: 'border-[#0DEDC0]',
        recomendacion: recomendacionBaseOptimo
      },
      {
        clave: 'ESTABLE' as const,
        etiqueta: 'Escenario Estable',
        deltaMargen: 0,
        colorClass: 'text-blue-400',
        borderClass: 'border-blue-500',
        recomendacion: recomendacionBaseEstable
      },
      {
        clave: 'RIESGO' as const,
        etiqueta: 'Escenario En Riesgo',
        deltaMargen: -7,
        colorClass: 'text-red-400',
        borderClass: 'border-red-500',
        recomendacion: 'Zona de peligro operativo. Cualquier incremento en devoluciones - perdida de producto o demoras en pagos dejará la utilidad neta en terreno negativo. Revisa tus precios.'
      },
    ];

    return niveles.map((esc) => {
      const margenTargetPct = Math.max(1, margenBaseActual + esc.deltaMargen) / 100;
      const denominador = 1 - margenTargetPct - platFeePct;
      const precioBaseSinIva = denominador > 0 ? (costoRealUnit / denominador) : (costoRealUnit * 2);

      const comisionPlatMonto = precioBaseSinIva * platFeePct;
      const utilidadNetaUnit = precioBaseSinIva * margenTargetPct;

      const pctIva = aplicaIva ? ((Number(tarifaIvaPersonalizada) || 0) / 100) : 0;
      const montoIvaUnit = precioBaseSinIva * pctIva;
      const precioFinalConIva = precioBaseSinIva + montoIvaUnit;

      return {
        ...esc,
        margenRealPct: margenTargetPct * 100,
        costoRealUnit,
        totalProvisionFuga,
        precioBaseSinIva,
        montoIvaUnit,
        precioFinalConIva,
        comisionPlatMonto,
        utilidadNetaUnit,
      };
    });
  }, [
    cogs, fleteYEmpaque, gastosOperativos, margenDeseado, simDevRate,
    simLossRate, simPlatFee, modalidadDroko, margenDrokoTransito, 
    margenDrokoBodega, canalSeleccionado, aplicaIva, tarifaIvaPersonalizada
  ]);

  // ==========================================
  // DISCRIMINACIÓN Y LIQUIDACIÓN (MAYOR / ECOM / DROKO)
  // ==========================================
  const discriminacionMasiva = useMemo(() => {
    const escObj = escenariosCalculados.find(e => e.clave === escenarioElegido) || escenariosCalculados[2];
    const qty = Math.max(1, Number(unidadesVendidas) || 1);

    // Totales Brutos Base
    const ingresoBrutoTotal = escObj.precioBaseSinIva * qty;
    const cogsTotal = (Number(cogs) || 0) * qty;
    const fleteTotal = (canalSeleccionado === 'ECOM' ? (Number(fleteYEmpaque) || 0) : 0) * qty;
    const gastosOpsTotal = (Number(gastosOperativos) || 0) * qty;
    const provisionFugaTotal = escObj.totalProvisionFuga * qty;
    
    // Identificación del porcentaje de comisión según el canal activo
    const esDroko = canalSeleccionado === 'DROKO';
    const esMayor = canalSeleccionado === 'MAYOR';
    const porcentajeComisionAplicada = esMayor ? 0 : (esDroko ? simPlatFee : simBonifVendedor);
    const nombreComision = esDroko ? 'Comisión Plataforma Droko' : 'Comisión Vendedor';
    const comisionPct = (Number(porcentajeComisionAplicada) || 0) / 100;

    const comisionPlataformaTotal = escObj.comisionPlatMonto * qty;
    const utilidadNetaTotal = escObj.utilidadNetaUnit * qty;

    // LIQUIDACIÓN OPCIÓN 1: Asumir la comisión
    const comisionOp1Unit = escObj.precioBaseSinIva * comisionPct;
    const comisionOp1Total = comisionOp1Unit * qty;
    const gananciaReducidaOp1Unit = Math.max(0, escObj.utilidadNetaUnit - comisionOp1Unit);
    const gananciaReducidaOp1Total = gananciaReducidaOp1Unit * qty;
    const porcentajeUtilidadOp1 = escObj.precioBaseSinIva > 0 ? (gananciaReducidaOp1Unit / escObj.precioBaseSinIva) * 100 : 0;

    // LIQUIDACIÓN OPCIÓN 2: Proteger la ganancia aumentando el precio de venta
    const margenPct = escObj.margenRealPct / 100;
    const platFeePct = esDroko ? comisionPct : 0;
    const vendedorFeePct = (!esDroko && !esMayor) ? comisionPct : 0;
    
    const denModificado = 1 - margenPct - platFeePct - vendedorFeePct;
    const precioSugeridoConComision = denModificado > 0 ? (escObj.costoRealUnit / denModificado) : (escObj.costoRealUnit * 2);
    const incrementoPrecioUnit = Math.max(0, precioSugeridoConComision - escObj.precioBaseSinIva);

    const ventaBrutaAjustadaTotal = precioSugeridoConComision * qty;
    const comisionAjustadaUnit = precioSugeridoConComision * comisionPct;
    const comisionAjustadaTotal = comisionAjustadaUnit * qty;
    const utilidadNetaAjustadaUnit = precioSugeridoConComision * margenPct;
    const utilidadNetaAjustadaTotal = utilidadNetaAjustadaUnit * qty;

    return {
      qty,
      escObj,
      ingresoBrutoTotal,
      cogsTotal,
      fleteTotal,
      gastosOpsTotal,
      provisionFugaTotal,
      comisionPlataformaTotal,
      utilidadNetaTotal,
      porcentajeComisionAplicada,
      nombreComision,
      esDroko,
      esMayor,
      // Liquidación Opción 1
      comisionOp1Unit,
      comisionOp1Total,
      gananciaReducidaOp1Unit,
      gananciaReducidaOp1Total,
      porcentajeUtilidadOp1,
      // Liquidación Opción 2
      precioSugeridoConComision,
      incrementoPrecioUnit,
      ventaBrutaAjustadaTotal,
      comisionAjustadaUnit,
      comisionAjustadaTotal,
      utilidadNetaAjustadaUnit,
      utilidadNetaAjustadaTotal,
    };
  }, [escenariosCalculados, escenarioElegido, unidadesVendidas, cogs, fleteYEmpaque, gastosOperativos, canalSeleccionado, simBonifVendedor, simPlatFee]);

  return (
    <section className="relative z-10 py-12 px-6 overflow-hidden w-full border-b border-[#0DEDC0]/10 text-white">
      {/* CAPA DE FONDO DINÁMICO */}
      <Fondos variante={variante} modo="absolute" />

      {/* ESTILOS DE IMPRESIÓN */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background-color: #ffffff !important; color: #000000 !important; }
          .no-print { display: none !important; }
          .print-container { width: 100% !important; max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
          .print-card { border: 1px solid #000000 !important; background-color: #f8fafc !important; color: #000000 !important; page-break-inside: avoid; }
          .print-text-dark { color: #000000 !important; }
        }
      ` }} />

      <div className="relative z-10 max-w-7xl mx-auto space-y-10 print-container">
        
        {/* CABECERA */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-[#0DEDC0]/15 pb-8 no-print">
          <div>
            <Kicker>INTELIGENCIA FINANCIERA ATOM ({paisSeleccionado.moneda})</Kicker>
            <H1 className="text-balance mb-2">
              SIMULADOR & BLINDAJE DE <Highlight>PRECIOS.</Highlight>
            </H1>
            <Subtitulo className="max-w-3xl">
              Calcula tus precios absorbiendo mermas, logística inversa y comisiones. Evalúa tus opciones en 3 escenarios financieros según el canal de venta.
            </Subtitulo>
          </div>

          {/* SELECTOR DE PAÍS */}
          <div className="bg-[#090D16] p-4 rounded-2xl border border-slate-800 space-y-2 shrink-0 w-full sm:w-auto">
            <label className="block text-[10px] font-mono font-bold text-[#0DEDC0] uppercase">
              País de Operación ATOM
            </label>
            <select
              value={paisSeleccionado.codigo}
              onChange={(e) => {
                const p = PAISES_ATOM.find(x => x.codigo === e.target.value);
                if (p) setPaisSeleccionado(p);
              }}
              className="w-full bg-[#102935] border border-slate-700 text-white text-xs font-bold rounded-xl p-2.5 focus:border-[#0DEDC0] focus:outline-none cursor-pointer"
            >
              {PAISES_ATOM.map((p) => (
                <option key={p.codigo} value={p.codigo}>
                  {p.nombre} ({p.moneda}) - IVA sugerido {p.ivaPorDefecto}%
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PANEL PRINCIPAL DE CONFIGURACIÓN */}
        <div className="bg-[#090D16] rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-[0_15px_35px_rgba(9,13,22,0.6)] space-y-6 max-w-4xl mx-auto no-print">
          
          {/* TABS DE CANAL DE VENTA */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
            <span className="text-xs font-mono font-bold text-[#0DEDC0] uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-[#0DEDC0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Selecciona el Canal de Comercialización
            </span>

            <div className="flex gap-1 bg-[#102935] p-1 rounded-xl border border-slate-800 w-full sm:w-auto justify-between sm:justify-start">
              <button
                type="button"
                onClick={() => setSimCanal('MAYOR')}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase transition cursor-pointer ${
                  canalSeleccionado === 'MAYOR' ? 'bg-[#0DEDC0] text-[#090D16]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Venta Al Por Mayor
              </button>
              
              <button
                type="button"
                onClick={() => setSimCanal('ECOM')}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase transition cursor-pointer ${
                  canalSeleccionado === 'ECOM' ? 'bg-[#0DEDC0] text-[#090D16]' : 'text-slate-400 hover:text-white'
                }`}
              >
                E-Commerce
              </button>

              <div className="relative group">
                <button
                  type="button"
                  onClick={() => setSimCanal('DROKO')}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase transition cursor-pointer flex items-center gap-1.5 ${
                    canalSeleccionado === 'DROKO' ? 'bg-[#0DEDC0] text-[#090D16]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Droko
                  <span className="w-2 h-2 rounded-full bg-[#0DEDC0] animate-ping" />
                </button>

                <div className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-2 w-72 p-3.5 bg-[#050B0E] border border-[#0DEDC0]/40 rounded-xl shadow-2xl z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 text-left">
                  <div className="text-[11px] font-mono text-[#0DEDC0] font-bold uppercase mb-1">
                    🚀 LÍNEA ESPECIAL DROKO
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium normal-case">
                    Droko es una nueva línea pensada en comprar al por mayor con precios únicos. Si eres importador, te permite vender directamente desde que el contenedor viene en tránsito por el océano.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* INPUTS GENERALES DE COSTOS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                Costo Producto (COGS)
              </label>
              <input
                type="number"
                min="0"
                value={cogs}
                onChange={(e) => setCogs(Number(e.target.value))}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-2.5 font-mono text-white focus:border-[#0DEDC0] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            {canalSeleccionado === 'ECOM' && (
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                  Picking / Empaque ({paisSeleccionado.moneda})
                </label>
                <input
                  type="number"
                  min="0"
                  value={fleteYEmpaque}
                  onChange={(e) => setFleteYEmpaque(Number(e.target.value))}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-2.5 font-mono text-white focus:border-[#0DEDC0] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                Otros Gastos Directos
              </label>
              <input
                type="number"
                min="0"
                value={gastosOperativos}
                onChange={(e) => setGastosOperativos(Number(e.target.value))}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-2.5 font-mono text-white focus:border-[#0DEDC0] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            {canalSeleccionado !== 'DROKO' && (
              <div>
                <label className="block text-[10px] font-mono font-bold text-[#0DEDC0] uppercase mb-1">
                  % Margen Objetivo Base
                </label>
                <input
                  type="number"
                  min="1"
                  max="80"
                  value={margenDeseado}
                  onChange={(e) => setSimMargenDeseado(Number(e.target.value))}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-2.5 font-mono text-white focus:border-[#0DEDC0] focus:outline-none text-right font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            )}
          </div>

          {/* MÓDULO EXCLUSIVO E-COMMERCE */}
          {canalSeleccionado === 'ECOM' && (
            <div className="bg-[#102935]/50 p-4.5 rounded-xl border border-slate-800 space-y-4">
              <span className="block text-[11px] font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Variables de Fuga (E-Commerce)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">% Devolución Logística:</span>
                    <span className="font-mono text-red-400 font-bold">{simDevRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={simDevRate}
                    onChange={(e) => setSimDevRate(Number(e.target.value))}
                    className="w-full accent-[#0DEDC0] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">% Pérdida / Merma Producto:</span>
                    <span className="font-mono text-red-400 font-bold">{simLossRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={simLossRate}
                    onChange={(e) => setSimLossRate(Number(e.target.value))}
                    className="w-full accent-[#0DEDC0] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* MÓDULO EXCLUSIVO DROKO */}
          {canalSeleccionado === 'DROKO' && (
            <div className="bg-[#102935]/50 p-4.5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-700/60 pb-2 flex-wrap gap-2">
                <span className="block text-[11px] font-mono font-bold text-[#0DEDC0] uppercase tracking-wider">
                  Configuración Droko (Precios Mayoristas)
                </span>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModalidadDroko('TRANSITO')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      modalidadDroko === 'TRANSITO' ? 'bg-[#0DEDC0] text-[#090D16]' : 'bg-[#090D16] text-slate-400'
                    }`}
                  >
                    En Tránsito (Contenedor)
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalidadDroko('BODEGA')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      modalidadDroko === 'BODEGA' ? 'bg-[#0DEDC0] text-[#090D16]' : 'bg-[#090D16] text-slate-400'
                    }`}
                  >
                    En Bodega
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-3 rounded-xl border ${modalidadDroko === 'TRANSITO' ? 'border-[#0DEDC0] bg-[#090D16]' : 'border-slate-800 opacity-50'}`}>
                  <label className="block text-[10px] font-mono font-bold text-slate-300 uppercase mb-1">
                    % Ganancia "En Tránsito"
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="80"
                    value={margenDrokoTransito}
                    onChange={(e) => setMargenDrokoTransito(Number(e.target.value))}
                    className="w-full bg-[#102935] border border-slate-700 rounded-lg p-2 font-mono text-white text-xs text-right font-bold focus:border-[#0DEDC0] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                <div className={`p-3 rounded-xl border ${modalidadDroko === 'BODEGA' ? 'border-[#0DEDC0] bg-[#090D16]' : 'border-slate-800 opacity-50'}`}>
                  <label className="block text-[10px] font-mono font-bold text-slate-300 uppercase mb-1">
                    % Ganancia "En Bodega"
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="80"
                    value={margenDrokoBodega}
                    onChange={(e) => setMargenDrokoBodega(Number(e.target.value))}
                    className="w-full bg-[#102935] border border-slate-700 rounded-lg p-2 font-mono text-white text-xs text-right font-bold focus:border-[#0DEDC0] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">% Comisión Plataforma:</span>
                    <span className="font-mono text-[#0DEDC0] font-bold">{simPlatFee}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={simPlatFee}
                    onChange={(e) => setSimPlatFee(Number(e.target.value))}
                    className="w-full accent-[#0DEDC0] cursor-pointer mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* OPCIÓN IVA */}
          <div className="bg-[#102935]/40 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="checkboxIvaGlobal"
                checked={aplicaIva}
                onChange={(e) => setAplicaIva(e.target.checked)}
                className="w-4 h-4 rounded text-[#0DEDC0] focus:ring-0 cursor-pointer accent-[#0DEDC0]"
              />
              <label htmlFor="checkboxIvaGlobal" className="text-xs font-bold text-white cursor-pointer">
                ¿Aplicar IVA al precio de venta final?
              </label>
            </div>

            {aplicaIva && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300">Tarifa IVA ({paisSeleccionado.nombre}):</span>
                <input
                  type="number"
                  value={tarifaIvaPersonalizada}
                  onChange={(e) => setTarifaIvaPersonalizada(Number(e.target.value))}
                  className="w-16 bg-[#090D16] border border-slate-700 text-[#0DEDC0] font-mono text-xs font-bold rounded-lg p-1 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-xs font-bold text-[#0DEDC0]">%</span>
              </div>
            )}
          </div>

        </div>

        {/* EVALUACIÓN DE 3 ESCENARIOS FINANCIEROS */}
        <div className="space-y-4">
          <div className="flex justify-between items-center no-print">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Evaluación de 3 Escenarios Financieros ({canalSeleccionado})
            </span>
            <button
              type="button"
              onClick={() => window.print()}
              className={`bg-[#0DEDC0] hover:bg-white text-[#090D16] font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(13,237,192,0.2)] cursor-pointer ${ESTILOS_TEXTO.boton}`}
            >
              Imprimir Resultado Completo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {escenariosCalculados.map((esc) => (
              <div
                key={esc.clave}
                onClick={() => setEscenarioElegido(esc.clave)}
                className={`bg-[#090D16] border-2 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 cursor-pointer transition-all ${
                  escenarioElegido === esc.clave
                    ? `${esc.borderClass} bg-[#102935]/90 shadow-[0_0_25px_rgba(13,237,192,0.2)] scale-[1.02]`
                    : 'border-slate-800 opacity-70 hover:opacity-100'
                } print-card`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-xs font-mono font-bold uppercase ${esc.colorClass} print-text-dark`}>
                      {esc.etiqueta}
                    </span>
                    <div className="flex items-center gap-2">
                      {escenarioElegido === esc.clave && (
                        <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded bg-[#0DEDC0] text-[#090D16]">
                          Seleccionado
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded font-bold">
                        Margen: {esc.margenRealPct.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* PRECIO SUGERIDO FINAL */}
                  <div className="text-center py-4 my-2 bg-[#102935]/50 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">
                      Precio de Venta Sugerido
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono print-text-dark">
                      {formatoMoneda(esc.precioFinalConIva)}
                    </span>
                    {aplicaIva && (
                      <span className="text-[9px] text-slate-400 block mt-1">
                        Incluye IVA ({tarifaIvaPersonalizada}%): {formatoMoneda(esc.montoIvaUnit)}
                      </span>
                    )}
                  </div>

                  {/* DESGLOSE MATEMÁTICO */}
                  <div className="space-y-2 text-xs font-mono border-t border-slate-800 pt-3 text-slate-300 print-text-dark">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Precio Base (Sin IVA):</span>
                      <span className="font-bold">{formatoMoneda(esc.precioBaseSinIva)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Costo Real Absorbiendo Fuga:</span>
                      <span className="font-bold text-red-400">{formatoMoneda(esc.costoRealUnit)}</span>
                    </div>

                    {canalSeleccionado === 'ECOM' && (
                      <div className="flex justify-between text-[11px] text-red-400/80">
                        <span>• Provisión Devolución/Merma:</span>
                        <span>{formatoMoneda(esc.totalProvisionFuga)}</span>
                      </div>
                    )}

                    {esc.comisionPlatMonto > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Comisión Plataforma Droko:</span>
                        <span>{formatoMoneda(esc.comisionPlatMonto)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* BLOQUE RECOMENDACIÓN FINANCIERA ESTRATÉGICA */}
                <div className="bg-[#102935]/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#0DEDC0] uppercase block">
                    💡 Recomendación Financiera
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    {esc.recomendacion}
                  </p>
                </div>

                {/* UTILIDAD NETA REAL */}
                <div className="bg-[#102935] p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                    Utilidad Neta Libre / Unidad
                  </span>
                  <span className={`text-lg font-black font-mono ${esc.colorClass} print-text-dark`}>
                    {formatoMoneda(esc.utilidadNetaUnit)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================== */}
        {/* MÓDULO: DISCRIMINACIÓN DETALLADA Y ANÁLISIS DE COMISIÓN */}
        {/* ========================================== */}
        <div className="bg-[#090D16] border-2 border-[#0DEDC0]/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
            <div>
              <Kicker className="!text-[#0DEDC0]">ANÁLISIS DE RENTABILIDAD Y COMISIÓN ({discriminacionMasiva.qty} UNIDADES)</Kicker>
              <h3 className="text-xl font-black text-white font-mono">
                Desglose Detallado de Rentabilidad: <span className="text-[#0DEDC0]">{discriminacionMasiva.escObj.etiqueta}</span>
              </h3>
            </div>
            
            {/* BLOQUE DE CONTROLES ASIMÉTRICO */}
            <div className="bg-[#102935]/90 border border-slate-700/80 rounded-2xl p-2.5 sm:p-3 shadow-xl flex items-center divide-x divide-slate-700/80 gap-3 sm:gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
              
              {/* COLUMNA 1: UNIDADES A VENDER */}
              <div className="flex flex-col pr-1">
                <label className="text-[10px] text-[#0DEDC0] font-mono font-black uppercase tracking-wider block mb-1">
                  UNIDADES A VENDER
                </label>
                <div className="bg-[#090D16] border border-[#0DEDC0]/50 rounded-xl px-3 py-1 text-center font-mono text-white text-base font-black min-w-[90px]">
                  <input
                    type="number"
                    min="1"
                    value={unidadesVendidas}
                    onChange={(e) => setUnidadesVendidas(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-transparent text-center text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              {/* COLUMNA 2: % COMISIÓN VENDEDOR (SOLO EN ECOM) */}
              {canalSeleccionado === 'ECOM' && (
                <div className="flex items-center gap-2 pl-3 sm:pl-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-amber-400 font-mono font-black uppercase tracking-wider leading-none">
                      % COMISIÓN
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono font-semibold tracking-wide">
                      Vendedor
                    </span>
                  </div>

                  <div className="bg-[#090D16] border border-amber-500/60 rounded-xl px-3 py-1 flex items-center gap-1 font-mono text-amber-400 text-base font-black">
                    <input
                      type="number"
                      min="0"
                      max="50"
                      step="0.5"
                      value={simBonifVendedor}
                      onChange={(e) => setSimBonifVendedor(Number(e.target.value))}
                      className="w-10 bg-transparent text-center text-amber-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-amber-400 font-black text-xs">%</span>
                  </div>
                </div>
              )}

              {/* COLUMNA 2 (DROKO): % COMISIÓN PLATAFORMA DROKO */}
              {canalSeleccionado === 'DROKO' && (
                <div className="flex items-center gap-2 pl-3 sm:pl-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-amber-400 font-mono font-black uppercase tracking-wider leading-none">
                      % COMISIÓN
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono font-semibold tracking-wide">
                      Droko
                    </span>
                  </div>

                  <div className="bg-[#090D16] border border-amber-500/60 rounded-xl px-3 py-1 flex items-center gap-1 font-mono text-amber-400 text-base font-black">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      value={simPlatFee}
                      onChange={(e) => setSimPlatFee(Number(e.target.value))}
                      className="w-10 bg-transparent text-center text-amber-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-amber-400 font-black text-xs">%</span>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* TABLA DE DISCRIMINACIÓN DE COSTOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="bg-[#102935]/60 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 uppercase text-[10px] block">Venta Bruta Total</span>
              <span className="text-lg font-bold text-white block">{formatoMoneda(discriminacionMasiva.ingresoBrutoTotal)}</span>
              <span className="text-[10px] text-slate-400 block">{discriminacionMasiva.qty} uds. × {formatoMoneda(discriminacionMasiva.escObj.precioBaseSinIva)}</span>
            </div>

            <div className="bg-[#102935]/60 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 uppercase text-[10px] block">Costo Producto (COGS)</span>
              <span className="text-lg font-bold text-slate-200 block">{formatoMoneda(discriminacionMasiva.cogsTotal)}</span>
              <span className="text-[10px] text-slate-400 block">{discriminacionMasiva.qty} uds. × {formatoMoneda(cogs)}</span>
            </div>

            {canalSeleccionado === 'ECOM' && (
              <div className="bg-[#102935]/60 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block">Flete & Empaque (Picking)</span>
                <span className="text-lg font-bold text-slate-200 block">{formatoMoneda(discriminacionMasiva.fleteTotal)}</span>
                <span className="text-[10px] text-slate-400 block">{discriminacionMasiva.qty} uds. × {formatoMoneda(fleteYEmpaque)}</span>
              </div>
            )}

            <div className="bg-[#102935]/60 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 uppercase text-[10px] block">Gastos Directos Operativos</span>
              <span className="text-lg font-bold text-slate-200 block">{formatoMoneda(discriminacionMasiva.gastosOpsTotal)}</span>
              <span className="text-[10px] text-slate-400 block">{discriminacionMasiva.qty} uds. × {formatoMoneda(gastosOperativos)}</span>
            </div>

            {canalSeleccionado === 'ECOM' && (
              <div className="bg-[#102935]/60 p-4 rounded-xl border border-red-900/40 space-y-1">
                <span className="text-red-400 uppercase text-[10px] block font-bold">Provisión Retenida de Fuga</span>
                <span className="text-lg font-bold text-red-400 block">{formatoMoneda(discriminacionMasiva.provisionFugaTotal)}</span>
                <span className="text-[10px] text-slate-400 block">Devolución logistica ({simDevRate}%) + Mermas ({simLossRate}%)</span>
              </div>
            )}

            {canalSeleccionado === 'ECOM' && (
              <div className="bg-[#102935]/60 p-4 rounded-xl border border-amber-500/40 space-y-1">
                <span className="text-amber-400 uppercase text-[10px] block font-bold">Comisión Total Vendedor ({simBonifVendedor}%)</span>
                <span className="text-lg font-bold text-amber-400 block">{formatoMoneda(discriminacionMasiva.comisionOp1Total)}</span>
                <span className="text-[10px] text-slate-400 block">{discriminacionMasiva.qty} uds. × {formatoMoneda(discriminacionMasiva.comisionOp1Unit)}</span>
              </div>
            )}

            {canalSeleccionado === 'DROKO' && (
              <div className="bg-[#102935]/60 p-4 rounded-xl border border-amber-500/40 space-y-1">
                <span className="text-amber-400 uppercase text-[10px] block font-bold">Comisión Plataforma Droko ({simPlatFee}%)</span>
                <span className="text-lg font-bold text-amber-400 block">{formatoMoneda(discriminacionMasiva.comisionOp1Total)}</span>
                <span className="text-[10px] text-slate-400 block">{discriminacionMasiva.qty} uds. × {formatoMoneda(discriminacionMasiva.comisionOp1Unit)}</span>
              </div>
            )}
          </div>

          {/* DOS OPCIONES EXPLICADAS CON LIQUIDACIÓN DETALLADA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
            
            {/* OPCIÓN 1: ASUMIR LA COMISIÓN CON LIQUIDACIÓN PASO A PASO */}
            <div className="bg-[#102935]/40 p-5 rounded-xl border border-amber-500/40 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase block">
                    🔴 Opción 1: Asumir la {discriminacionMasiva.nombreComision}
                  </span>
                  <span className="text-[10px] text-slate-400">Mantienes el mismo precio de venta al público pero la comisión se descuenta de tu ganancia.</span>
                </div>
              </div>

              {/* LIQUIDACIÓN PASO A PASO OPCIÓN 1 */}
              <div className="bg-[#090D16] p-3.5 rounded-lg space-y-2 font-mono text-xs border border-amber-500/30">
                <div className="flex justify-between items-center text-slate-300 pb-1 border-b border-slate-800">
                  <span className="font-bold text-slate-200">PRECIO DE VENTA BASE AL PÚBLICO:</span>
                  <span className="text-sm font-black text-white">{formatoMoneda(discriminacionMasiva.escObj.precioBaseSinIva)}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>(+) Venta Bruta Total Proyectada:</span>
                  <span className="font-bold text-white">{formatoMoneda(discriminacionMasiva.ingresoBrutoTotal)}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>(-) COGS + Gastos Operativos:</span>
                  <span className="text-slate-300">{formatoMoneda(discriminacionMasiva.cogsTotal + discriminacionMasiva.fleteTotal + discriminacionMasiva.gastosOpsTotal)}</span>
                </div>

                {canalSeleccionado === 'ECOM' && (
                  <div className="flex justify-between text-red-400">
                    <span>(-) Provisión Retenida por Fugas ({simDevRate + simLossRate}%):</span>
                    <span>{formatoMoneda(discriminacionMasiva.provisionFugaTotal)}</span>
                  </div>
                )}

                {/* CONDICIONAL: Solo mostrar comisiones si NO es venta al por mayor o si el porcentaje es mayor a 0 */}
                {!discriminacionMasiva.esMayor && discriminacionMasiva.porcentajeComisionAplicada > 0 && (
                  <div className="flex justify-between text-amber-400 font-bold">
                    <span>(-) Pago de {discriminacionMasiva.nombreComision} ({discriminacionMasiva.porcentajeComisionAplicada}%):</span>
                    <span>-{formatoMoneda(discriminacionMasiva.comisionOp1Total)}</span>
                  </div>
                )}

                <div className="flex justify-between text-amber-400 pt-1.5 border-t border-slate-800 font-bold">
                  <span>(=) Tu Utilidad Neta Reducida ({discriminacionMasiva.porcentajeUtilidadOp1.toFixed(1)}%):</span>
                  <span className="text-sm font-black">{formatoMoneda(discriminacionMasiva.gananciaReducidaOp1Total)}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-950/20 rounded-lg border border-amber-900/30 text-[11px] text-slate-300 leading-relaxed">
                <strong className="text-amber-400 block mb-1">🏛️ Dictamen del Experto Financiero:</strong>
                {!discriminacionMasiva.esMayor && discriminacionMasiva.porcentajeComisionAplicada > 0 ? (
                  <>
                    Si decides asumir el costo comercial sin subir el precio al público, estás pagando <span className="font-bold text-amber-400">{formatoMoneda(discriminacionMasiva.comisionOp1Unit)}</span> por unidad en concepto de {discriminacionMasiva.nombreComision.toLowerCase()}. Tu ganancia neta por producto disminuye de <span className="font-bold text-slate-200">{formatoMoneda(discriminacionMasiva.escObj.utilidadNetaUnit)}</span> a <span className="font-bold text-amber-400">{formatoMoneda(discriminacionMasiva.gananciaReducidaOp1Unit)}</span>. Es recomendable solo si tu margen de la tarjeta base es alto y buscas acelerar rotación.
                  </>
                ) : (
                  <>
                    En el canal de Venta Al Por Mayor no se aplican comisiones comerciales ni retenciones por fuga. Tu utilidad neta total se mantiene libre e intacta en <span className="font-bold text-[#0DEDC0]">{formatoMoneda(discriminacionMasiva.utilidadNetaTotal)}</span>.
                  </>
                )}
              </div>
            </div>

            {/* OPCIÓN 2: SUBIR EL PRECIO DEL PRODUCTO CON LIQUIDACIÓN COMPLETA RECOMENDADA */}
            <div className="bg-[#102935]/40 p-5 rounded-xl border border-[#0DEDC0]/40 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono font-bold text-[#0DEDC0] uppercase block">
                    🟢 Opción 2: Proteger tu Ganancia (Aumentar Precio de Venta)
                  </span>
                  <span className="text-[10px] text-slate-400">Sugerencia y liquidación completa ajustando el precio para cubrir la comisión al 100%.</span>
                </div>
              </div>

              {/* LIQUIDACIÓN COMPLETA PASO A PASO OPCIÓN 2 */}
              <div className="bg-[#090D16] p-3.5 rounded-lg space-y-2 font-mono text-xs border border-[#0DEDC0]/30">
                <div className="flex justify-between items-center text-slate-300 pb-1 border-b border-slate-800">
                  <span className="font-bold text-[#0DEDC0]">NUEVO PRECIO SUGERIDO / UNIDAD:</span>
                  <span className="text-sm font-black text-[#0DEDC0]">{formatoMoneda(discriminacionMasiva.precioSugeridoConComision)}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>(+) Venta Bruta Total Proyectada:</span>
                  <span className="font-bold text-white">{formatoMoneda(discriminacionMasiva.ventaBrutaAjustadaTotal)}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>(-) COGS + Gastos Operativos:</span>
                  <span className="text-slate-300">{formatoMoneda(discriminacionMasiva.cogsTotal + discriminacionMasiva.fleteTotal + discriminacionMasiva.gastosOpsTotal)}</span>
                </div>

                {canalSeleccionado === 'ECOM' && (
                  <div className="flex justify-between text-red-400">
                    <span>(-) Provisión Retenida por Fugas ({simDevRate + simLossRate}%):</span>
                    <span>{formatoMoneda(discriminacionMasiva.provisionFugaTotal)}</span>
                  </div>
                )}

                {/* CONDICIONAL: Solo mostrar comisiones si NO es venta al por mayor o si el porcentaje es mayor a 0 */}
                {!discriminacionMasiva.esMayor && discriminacionMasiva.porcentajeComisionAplicada > 0 && (
                  <div className="flex justify-between text-amber-400 font-bold">
                    <span>(-) Pago de {discriminacionMasiva.nombreComision} ({discriminacionMasiva.porcentajeComisionAplicada}%):</span>
                    <span>{formatoMoneda(discriminacionMasiva.comisionAjustadaTotal)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#0DEDC0] pt-1.5 border-t border-slate-800 font-bold">
                  <span>(=) Tu Utilidad Neta Intacta ({discriminacionMasiva.escObj.margenRealPct.toFixed(0)}%):</span>
                  <span className="text-sm font-black">{formatoMoneda(discriminacionMasiva.utilidadNetaAjustadaTotal)}</span>
                </div>
              </div>

              <div className="p-3 bg-[#0DEDC0]/5 rounded-lg border border-[#0DEDC0]/20 text-[11px] text-slate-300 leading-relaxed">
                <strong className="text-[#0DEDC0] block mb-1">🏛️ Dictamen del Experto Financiero:</strong>
                {!discriminacionMasiva.esMayor && discriminacionMasiva.porcentajeComisionAplicada > 0 ? (
                  <>
                    Con esta liquidación ajustada, incrementas tu precio por unidad de <span className="font-bold text-slate-200">{formatoMoneda(discriminacionMasiva.escObj.precioBaseSinIva)}</span> a <span className="font-bold text-[#0DEDC0]">{formatoMoneda(discriminacionMasiva.precioSugeridoConComision)}</span> (+{formatoMoneda(discriminacionMasiva.incrementoPrecioUnit)}/ud). Como puedes ver en la liquidación de arriba, esto te permite **cubrir {formatoMoneda(discriminacionMasiva.comisionAjustadaTotal)} en concepto de {discriminacionMasiva.nombreComision.toLowerCase()}** mientras tu utilidad neta libre se mantiene intacta en <span className="font-bold text-[#0DEDC0]">{formatoMoneda(discriminacionMasiva.utilidadNetaAjustadaTotal)}</span>. Las 3 tarjetas de escenarios de la sección superior permanecen en su valor base original.
                  </>
                ) : (
                  <>
                    Tu estructura de precios en Venta Al Por Mayor no requiere sobrecosto de comisiones. El precio sugerido por unidad es <span className="font-bold text-[#0DEDC0]">{formatoMoneda(discriminacionMasiva.escObj.precioBaseSinIva)}</span> y garantiza tu margen intacto.
                  </>
                )}
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}