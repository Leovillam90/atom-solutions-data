'use client';

import React, { useState, useEffect } from 'react';
import { MonedaConfig } from '@/app/lib/moneda';
import { EscenarioTipo } from './Pagina1';

type OpcionPropuestaTipo = 'OPCION1' | 'OPCION2';

interface Pagina2Props {
  metricas: any;
  monedaSeleccionada: MonedaConfig;
  escenarioSeleccionado: EscenarioTipo;
  formatoMoneda: (monto: number) => string;
  unidadesProyectadas: number;
  setUnidadesProyectadas: (val: number) => void;
  comisionDropExtra: number;
  setComisionDropExtra: (val: number) => void;
}

export default function Pagina2({
  metricas,
  monedaSeleccionada,
  escenarioSeleccionado,
  formatoMoneda,
  unidadesProyectadas,
  setUnidadesProyectadas,
  comisionDropExtra,
  setComisionDropExtra,
}: Pagina2Props) {
  const [nombreProveedor, setNombreProveedor] = useState<string>('DEMO ATOM');
  const [nombreProducto, setNombreProducto] = useState<string>('Lámpara Inteligente');
  const [skuProducto, setSkuProducto] = useState<string>('SKU-1001');
  const [opcionPropuestaSeleccionada, setOpcionPropuestaSeleccionada] = useState<OpcionPropuestaTipo>('OPCION2');
  const [descargando, setDescargando] = useState<boolean>(false);

  useEffect(() => {
    const sessionData = localStorage.getItem('atom_session');
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        const nombreEncontrado = parsed.empresa || parsed.nombre || parsed.nombreCompleto || parsed.usuario || '';
        if (nombreEncontrado) {
          setNombreProveedor(nombreEncontrado);
        }
      } catch (e) {
        // Ignorar
      }
    }
  }, []);

  if (!metricas || !metricas.activo) {
    return null;
  }

  const esOp1 = opcionPropuestaSeleccionada === 'OPCION1';
  const precioElegido = esOp1 ? (metricas?.activo?.precioCatalogo ?? 0) : (metricas?.precioCatalogoOp2 ?? 0);
  const bonoElegido = esOp1 ? (metricas?.comisionOp1 ?? 0) : (metricas?.comisionOp2 ?? 0);
  const bonoTotalLote = esOp1 ? (metricas?.totalComisionOp1 ?? 0) : (metricas?.totalComisionOp2 ?? 0);

  // CÁLCULOS KPI DE DEVOLUCIÓN Y EFECTIVIDAD
  const pctProvisionDev = Math.round((metricas?.devActivo ?? 0) * 100);
  const pctDevMaxTolerada = Math.min(100, pctProvisionDev + 5); // Provisión + 5% máximo
  const pctEfectividadMin = Math.max(0, 100 - pctDevMaxTolerada);

  // FUNCIÓN PARA DESCARGAR LA VISTA PREVIA COMO IMAGEN (Ultra-segura y Optimizada)
  const descargarImagen = async () => {
    setDescargando(true);
    try {
      // 1. Importación dinámica robusta (Lazy Loading para no afectar el performance)
      const module = await import('html2canvas');
      const html2canvas = module.default || module;

      // 2. Captura del elemento
      const elemento = document.getElementById('documento-oficial');
      if (!elemento) {
        throw new Error("No se encontró el elemento a capturar");
      }

      // 3. Generación del Canvas con configuración de compatibilidad máxima
      const canvas = await html2canvas(elemento, {
        scale: 2, // Alta resolución
        backgroundColor: '#F8FAFC',
        useCORS: true,
        allowTaint: true, // Permite dibujar imágenes aunque haya temas de CORS local
        logging: false, // Evita spam en la consola
      });

      // 4. Descarga automática
      const enlace = document.createElement('a');
      enlace.download = `Acuerdo_B2B_${(nombreProveedor || 'ATOM').replace(/\s+/g, '_')}.png`;
      enlace.href = canvas.toDataURL('image/png');
      enlace.click();
    } catch (error) {
      console.error('Detalle técnico del error:', error);
      alert('Hubo un error al generar la imagen. Verifica la consola para más detalles.');
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="space-y-8 pt-10 relative font-sans text-white">
      
      {/* HEADER PASO 3 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/40 text-amber-400 font-black font-mono text-base sm:text-lg shadow-[0_0_15px_rgba(245,158,11,0.2)] shrink-0">
          3
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
          <h2 className="text-sm sm:text-base md:text-lg font-black text-white uppercase tracking-widest m-0">
            Creador de Propuesta Comercial Oficial
          </h2>
          <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-md font-bold shrink-0 shadow-inner">
            MODO: ESCENARIO {escenarioSeleccionado} ({formatoMoneda(metricas?.activo?.precioCatalogo ?? 0)})
          </span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-amber-500/40 via-slate-700 to-transparent hidden lg:block"></div>
      </div>

      {/* CONFIGURACIÓN DE LA OFERTA */}
      <div className="bg-[#090D16]/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block border-b border-slate-800 pb-2">
          Configuración de la Oferta
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-end">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Empresa / Proveedor</label>
            <input type="text" value={nombreProveedor} onChange={(e) => setNombreProveedor(e.target.value)} placeholder="DEMO ATOM" className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-white text-sm font-bold focus:border-amber-400 outline-none transition-colors" />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Nombre del Producto</label>
            <input type="text" value={nombreProducto} onChange={(e) => setNombreProducto(e.target.value)} className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-amber-400 outline-none transition-colors" />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Código SKU</label>
            <input type="text" value={skuProducto} onChange={(e) => setSkuProducto(e.target.value)} placeholder="SKU-1001" className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 font-mono text-white text-sm font-bold focus:border-amber-400 outline-none transition-colors" />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Lote (Unidades)</label>
            <input type="number" min="1" value={unidadesProyectadas} onChange={(e) => setUnidadesProyectadas(Number(e.target.value))} className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 font-mono text-white text-sm font-bold focus:border-amber-400 outline-none transition-colors" />
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl">
            <div className="flex justify-between items-center text-[11px] font-semibold text-amber-300 mb-1.5">
              <span>Comisión Drop</span>
              <div className="flex items-center gap-1 bg-amber-950/80 border border-amber-500/40 rounded px-1.5 py-0.5">
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={comisionDropExtra}
                  onChange={(e) => setComisionDropExtra(Math.min(30, Math.max(0, Number(e.target.value))))}
                  className="w-8 bg-transparent text-right font-mono text-amber-400 font-bold outline-none text-xs"
                />
                <span className="text-amber-400 font-mono text-xs">%</span>
              </div>
            </div>
            <input type="range" min="0" max="30" value={comisionDropExtra} onChange={(e) => setComisionDropExtra(Number(e.target.value))} className="w-full accent-amber-500 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* SELECCIÓN DE MODALIDAD */}
      <div className="bg-[#090D16]/90 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <div className="border-b border-slate-700 pb-5">
          <span className="text-[10px] font-mono font-black uppercase text-amber-400 tracking-widest block mb-2">
            Selecciona la Modalidad Comercial
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white m-0">
            Condiciones de Pago y Liquidación
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* OPCIÓN A */}
          <div 
            onClick={() => setOpcionPropuestaSeleccionada('OPCION1')}
            className={`p-6 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              opcionPropuestaSeleccionada === 'OPCION1' 
                ? 'bg-[#1C160B] border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.25)] scale-[1.01]' 
                : 'bg-[#101D28]/40 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="absolute top-5 right-5 flex items-center justify-center">
              <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                opcionPropuestaSeleccionada === 'OPCION1' ? 'border-amber-400 bg-amber-400/20' : 'border-slate-600'
              }`}>
                {opcionPropuestaSeleccionada === 'OPCION1' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                )}
              </div>
            </div>

            <div className="space-y-4 pr-8">
              <h4 className="text-sm font-black uppercase text-amber-400 m-0 flex items-center gap-2">
                Opción A: Precio Base
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium m-0">
                Mantienes el precio público sugerido estándar y absorbes la comisión logística acordada.
              </p>

              <div className="bg-[#090D16]/80 p-4 rounded-xl border border-amber-500/20 space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">PVP Sugerido:</span>
                  <span className="text-white font-bold">{formatoMoneda(metricas?.activo?.precioCatalogo ?? 0)}</span>
                </div>
                <div className="flex justify-between text-amber-400 font-bold border-t border-slate-800 pt-1.5">
                  <span>Bono Logístico ({comisionDropExtra}%):</span>
                  <span>+{formatoMoneda(metricas?.comisionOp1 ?? 0)} /ud</span>
                </div>
              </div>
            </div>
          </div>

          {/* OPCIÓN B */}
          <div 
            onClick={() => setOpcionPropuestaSeleccionada('OPCION2')}
            className={`p-6 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              opcionPropuestaSeleccionada === 'OPCION2' 
                ? 'bg-[#0A1D27] border-2 border-[#0DEDC0] shadow-[0_0_30px_rgba(13,237,192,0.25)] scale-[1.01]' 
                : 'bg-[#101D28]/40 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="absolute top-5 right-5 flex items-center justify-center">
              <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                opcionPropuestaSeleccionada === 'OPCION2' ? 'border-[#0DEDC0] bg-[#0DEDC0]/20' : 'border-slate-600'
              }`}>
                {opcionPropuestaSeleccionada === 'OPCION2' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0DEDC0] shadow-[0_0_8px_#0dedc0]" />
                )}
              </div>
            </div>

            <div className="space-y-4 pr-8">
              <h4 className="text-sm font-black uppercase text-[#0DEDC0] m-0 flex items-center gap-2">
                Opción B: Escalar Precio
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium m-0">
                Ajustas el precio público final para transferir la comisión sin reducir tu margen libre.
              </p>

              <div className="bg-[#090D16]/80 p-4 rounded-xl border border-[#0DEDC0]/20 space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nuevo PVP Escalado:</span>
                  <span className="text-[#0DEDC0] font-bold">{formatoMoneda(metricas?.precioCatalogoOp2 ?? 0)}</span>
                </div>
                <div className="flex justify-between text-[#0DEDC0] font-bold border-t border-slate-800 pt-1.5">
                  <span>Bono Logístico ({comisionDropExtra}%):</span>
                  <span>+{formatoMoneda(metricas?.comisionOp2 ?? 0)} /ud</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DISTRIBUCIÓN PRINCIPAL DE 2 COLUMNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 items-start">
          
          {/* COLUMNA IZQUIERDA: GUÍA DE EFICIENCIA ÚNICAMENTE */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* GUÍA DE EFICIENCIA (PLAYBOOK ATOM) */}
            <div className="bg-[#090D16]/95 p-6 rounded-2xl border border-[#0DEDC0]/30 shadow-xl space-y-5">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                <div>
                  {/* EFECTO NEÓN SUTIL EN PLAYBOOK ATOM */}
                  <span className="text-[10px] font-mono font-bold text-[#0DEDC0] uppercase tracking-widest block drop-shadow-[0_0_8px_rgba(13,237,192,0.8)] mb-1">
                    PLAYBOOK ATOM
                  </span>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider m-0">
                    Guía de Eficiencia Operativa
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-[#0DEDC0] bg-[#0DEDC0]/10 px-2 py-0.5 rounded border border-[#0DEDC0]/30 font-bold">
                  ⚡ Best Practices
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="bg-[#102935]/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5 hover:border-[#0DEDC0]/30 transition-colors">
                  <span className="font-bold text-[#0DEDC0] block text-[11px]">
                    1. Costeo Real del Producto (COGS)
                  </span>
                  <p className="text-slate-300 leading-relaxed m-0 text-[10px]">
                    Incluye costo de fábrica, empaque, picking, etiquetas y una reserva del 5% para devoluciones en tu precio final para proteger tu margen neto.
                  </p>
                </div>

                <div className="bg-[#102935]/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5 hover:border-amber-400/30 transition-colors">
                  <span className="font-bold text-amber-400 block text-[11px]">
                    2. Confirmación y Filtrado de Órdenes
                  </span>
                  <p className="text-slate-300 leading-relaxed m-0 text-[10px]">
                    Verifica dirección exacta (barrio, apto/manzana) y confirma la disponibilidad de pago en efectivo vía WhatsApp antes de despachar pedidos COD.
                  </p>
                </div>

                <div className="bg-[#102935]/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5 hover:border-blue-400/30 transition-colors">
                  <span className="font-bold text-blue-400 block text-[11px]">
                    3. Seguimiento Activo (&lt;24H)
                  </span>
                  <p className="text-slate-300 leading-relaxed m-0 text-[10px]">
                    El 70% de los paquetes retenidos se rescatan enviando una alerta automática al cliente antes del segundo intento de entrega de la transportadora.
                  </p>
                </div>

                <div className="bg-[#102935]/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5 hover:border-emerald-400/30 transition-colors">
                  <span className="font-bold text-emerald-400 block text-[11px]">
                    4. Elección de Transportadora
                  </span>
                  <p className="text-slate-300 leading-relaxed m-0 text-[10px]">
                    Asigna tus envíos según la efectividad histórica por ciudad. Usar la mejor transportadora regional reduce la tasa de devolución hasta un 30%.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* COLUMNA DERECHA: DOCUMENTO DE PAPEL FÍSICO */}
          <div className="lg:col-span-7">
            <div id="documento-oficial" className="w-full bg-[#F8FAFC] p-6 sm:p-7 rounded-2xl border border-slate-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] space-y-4 text-slate-900 font-sans relative overflow-hidden">
              
              {/* ENCABEZADO DE PAPEL */}
              <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-end">
                <div>
                  <span className="text-[11px] sm:text-[12px] font-black text-gray-950 bg-[#0DEDC0] px-2 py-0.5 uppercase tracking-wider block shadow-[0_0_10px_rgba(13,237,192,0.3)]">
                    ACUERDO COMERCIAL B2B & LIQUIDACIÓN
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 block uppercase mt-1.5">
                    DOCUMENTO TÉCNICO OFICIAL
                  </span>
                </div>
                <span className="text-[9px] font-mono font-bold bg-slate-200 text-slate-800 px-2 py-1 rounded border border-slate-300 whitespace-nowrap">
                  PÁG 1/1
                </span>
              </div>

              {/* SECCIÓN 1: DATOS DE OPERACIÓN */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-1.5 text-[11px]">
                <span className="text-[#0A1923] font-mono font-bold block text-[11px] border-b border-slate-100 pb-1 uppercase">
                  1. DATOS DE OPERACIÓN
                </span>
                <div className="flex justify-between text-slate-700">
                  <span>Proveedor:</span>
                  <span className="font-bold text-slate-900">{nombreProveedor || 'DEMO ATOM'}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Producto:</span>
                  <span className="font-bold text-slate-900">{nombreProducto} ({skuProducto})</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Lote Base:</span>
                  <span className="font-mono font-bold text-slate-900">{unidadesProyectadas} Uds</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Modalidad:</span>
                  <span className="font-bold text-slate-900">
                    {esOp1 ? 'Opción A (Precio Base)' : 'Opción B (Escalar Precio)'}
                  </span>
                </div>
              </div>

              {/* SECCIÓN 2: ESTRUCTURA FINANCIERA */}
              <div className="bg-slate-100 p-3.5 rounded-xl border-l-4 border-slate-900 space-y-1.5 text-[11px]">
                <span className="text-[#0A1923] font-mono font-bold block text-[11px] uppercase">
                  2. ESTRUCTURA FINANCIERA
                </span>
                <div className="flex justify-between text-slate-700">
                  <span>PVP Sugerido:</span>
                  <span className="font-mono font-bold text-slate-900">{formatoMoneda(precioElegido)} / ud</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Bono Logístico ({comisionDropExtra}%):</span>
                  <span className="font-mono font-bold text-amber-800">+{formatoMoneda(bonoElegido)} / ud</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-bold pt-1.5 border-t border-slate-200 text-xs mt-1">
                  <span>Fondo Total Incentivos ({unidadesProyectadas} uds):</span>
                  <span className="font-mono text-sm font-black text-emerald-700">{formatoMoneda(bonoTotalLote)}</span>
                </div>
              </div>

              {/* SECCIÓN 3: KPIS Y REGLAS DEL NEGOCIO */}
              <div className="bg-slate-100 p-3.5 rounded-xl border-l-4 border-amber-500 space-y-1.5 text-[11px]">
                <span className="text-[#0A1923] font-mono font-bold block text-[11px] uppercase">
                  3. KPIS Y REGLAS DEL NEGOCIO
                </span>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Efectividad Mínima Requerida:</span>
                  <span className="font-mono font-bold text-slate-900">{pctEfectividadMin}%</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Provisión Devolución Estimada:</span>
                  <span className="font-mono font-bold text-slate-900">{pctProvisionDev}%</span>
                </div>

                {/* DEVOLUCIÓN MÁXIMA TOLERADA (NEÓN ALERTA MEJORADO CON LED PULSANTE) */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 mt-1">
                  <span className="font-bold text-gray-800">Devolución Máxima Tolerada:</span>
                  <div className="relative group">
                    {/* Resplandor neón exterior */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-amber-500 rounded border blur opacity-40 animate-pulse"></div>
                    {/* Contenedor principal */}
                    <div className="relative flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-red-300 leading-none">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600 shadow-[0_0_5px_#dc2626]"></span>
                      </span>
                      <span className="font-mono text-red-600 font-black text-[11px]">
                        {pctDevMaxTolerada}% <span className="font-sans text-[9px] font-bold text-red-400 ml-0.5">(+5% LÍMITE)</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 4: CONDICIÓN DE DESEMBOLSO */}
              <div className="bg-slate-100 p-3.5 rounded-xl border-l-4 border-indigo-600 space-y-1.5 text-[11px]">
                <span className="text-[#0A1923] font-mono font-bold block text-[11px] uppercase">
                  4. CONDICIÓN DE DESEMBOLSO
                </span>
                <p className="text-slate-700 leading-relaxed m-0 mt-1 text-[10px]">
                  El incentivo logístico se desembolsará el <strong className="text-indigo-900 font-bold">25 de cada mes</strong> tras confirmar la operación del mes anterior sobre guías efectivamente entregadas en la plataforma.
                </p>
              </div>

              {/* PIE DE PÁGINA CON LOGO CENTRADO Y BOTÓN DE DESCARGA A LA DERECHA */}
              <div className="pt-4 border-t border-slate-300 flex items-center justify-between">
                
                {/* LADO IZQUIERDO: ESPACIADOR INVISIBLE PARA CENTRAR LOGO */}
                <div className="flex-shrink-0 w-10"></div>

                {/* CENTRO: LOGO ATOM */}
                <div className="flex flex-col items-center justify-center flex-1">
                  <img src="/LOGO_ATOM.png" alt="ATOM Logo" crossOrigin="anonymous" className="h-6 w-auto object-contain opacity-100 mb-1" />
                  <span className="text-[8px] font-mono text-gray-500 uppercase tracking-wide">
                    Certificado y emitido por Atom Solutions Data
                  </span>
                </div>

                {/* LADO DERECHO: BOTÓN DE DESCARGA (data-html2canvas-ignore evita que salga en la foto) */}
                <div className="flex-shrink-0" data-html2canvas-ignore="true">
                  <button 
                    onClick={descargarImagen}
                    disabled={descargando}
                    title="Descargar Documento como Imagen"
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-[#0DEDC0] border border-slate-600 rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center cursor-pointer group"
                  >
                    {descargando ? (
                      <div className="w-4 h-4 border-2 border-[#0DEDC0] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    )}
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}