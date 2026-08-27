'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { Kicker, H1, Subtitulo, Highlight } from '@/app/complementos/Tipografia';
import { MONEDAS, MonedaConfig, formatearMonedaGlobal, obtenerTarifasImpuesto } from '@/app/lib/moneda';

type EscenarioTipo = 'PESIMO' | 'FAVORABLE' | 'OPTIMO' | 'OBJETIVO';
type OpcionPropuestaTipo = 'OPCION1' | 'OPCION2';

interface Seccion1Props {
  variante?: TipoFondo;
}

// Tooltip con posicionamiento fijo y z-index alto para evitar recortes
function Tooltip({ contenido }: { contenido: string }) {
  return (
    <div className="relative inline-flex items-center group ml-1.5 align-middle z-30">
      <span className="w-4 h-4 rounded-full bg-[#102935] border border-[#0DEDC0]/60 text-[#0DEDC0] text-[10px] font-mono font-bold flex items-center justify-center cursor-help transition-all duration-200 group-hover:bg-[#0DEDC0] group-hover:text-[#090D16] group-hover:scale-110 shrink-0 shadow-[0_0_8px_rgba(13,237,192,0.3)]">
        ?
      </span>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 hidden group-hover:flex flex-col items-center w-64 p-3 bg-[#080C14] border border-[#0DEDC0]/50 rounded-xl text-[11px] font-sans text-slate-200 font-normal normal-case tracking-normal shadow-[0_15px_30px_rgba(0,0,0,0.9)] z-50 pointer-events-none leading-relaxed text-center">
        {contenido}
        <div className="w-2.5 h-2.5 bg-[#080C14] border-r border-b border-[#0DEDC0]/50 rotate-45 -mb-4 mt-1" />
      </div>
    </div>
  );
}

export default function Seccion1({ variante = 'hexGrid' }: Seccion1Props) {
  const [monedaSeleccionada, setMonedaSeleccionada] = useState<MonedaConfig>(MONEDAS[0]);

  // INPUTS PASO 1
  const [costoFabricacion, setCostoFabricacion] = useState<number>(15000);
  const [costoEmpaque, setCostoEmpaque] = useState<number>(2000);
  const [costoLogisticaInversa, setCostoLogisticaInversa] = useState<number>(0); 
  
  const [porcentajeDevoluciones, setPorcentajeDevoluciones] = useState<number>(20); 
  const [porcentajeMermas, setPorcentajeMermas] = useState<number>(3); 
  const [impactoFiscal, setImpactoFiscal] = useState<number>(19);
  const [margenDeseado, setMargenDeseado] = useState<number>(30);

  // NOTIFICACIÓN EN CLIC DE MERMAS/DEVOLUCIÓN
  const [mensajeAlertaMermas, setMensajeAlertaMermas] = useState<boolean>(false);

  // SELECCIÓN DE ESCENARIO PASO 2
  const [escenarioSeleccionado, setEscenarioSeleccionado] = useState<EscenarioTipo>('OBJETIVO');

  // INPUTS PASO 3
  const [nombreProveedor, setNombreProveedor] = useState<string>('DEMO ATOM'); 
  const [nombreProducto, setNombreProducto] = useState<string>('Lámpara Inteligente');
  const [skuProducto, setSkuProducto] = useState<string>('SKU-1001');
  const [unidadesProyectadas, setUnidadesProyectadas] = useState<number>(170);
  const [comisionDropExtra, setComisionDropExtra] = useState<number>(5);
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

  const notificarCondicionesMermas = useCallback(() => {
    setMensajeAlertaMermas(true);
    const timer = setTimeout(() => setMensajeAlertaMermas(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  const formatoMoneda = (monto: number) => 
    formatearMonedaGlobal(monto, monedaSeleccionada.codigo);

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

  const wrapText = (
    ctx: CanvasRenderingContext2D, 
    text: string, 
    x: number, 
    y: number, 
    maxWidth: number, 
    lineHeight: number
  ) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  };

  // DIBUJAR PATRÓN HEXAGONAL EN CANVAS (hexGrid 2D)
  const dibujarHexGridCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(13, 237, 192, 0.07)';
    ctx.lineWidth = 1;
    const size = 35;
    const h = size * Math.sqrt(3);
    for (let y = 0; y < height + h; y += h) {
      for (let x = 0; x < width + size * 3; x += size * 3) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const hx = x + size * Math.cos(angle);
          const hy = y + size * Math.sin(angle);
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const hx = (x + size * 1.5) + size * Math.cos(angle);
          const hy = (y + h / 2) + size * Math.sin(angle);
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  };

  const descargarImagenPropuesta = async () => {
    setDescargando(true);
    const esOp1 = opcionPropuestaSeleccionada === 'OPCION1';
    const precioElegido = esOp1 ? metricas.activo.precioCatalogo : metricas.precioCatalogoOp2;
    const bonoElegido = esOp1 ? metricas.comisionOp1 : metricas.comisionOp2;
    const bonoTotalLote = esOp1 ? metricas.totalComisionOp1 : metricas.totalComisionOp2;

    const width = 1080;
    const height = 1600;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setDescargando(false);
      return;
    }

    // FONDO CIBERNÉTICO
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#040812');
    grad.addColorStop(0.5, '#07151E');
    grad.addColorStop(1, '#050A11');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // PATRÓN HEXAGONAL 2D
    dibujarHexGridCanvas(ctx, width, height);

    // MARCO EXTERIOR NEÓN 2D
    ctx.strokeStyle = '#0DEDC0';
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.strokeStyle = 'rgba(104, 132, 197, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, width - 90, height - 90);

    // CABECERA OFICIAL
    ctx.fillStyle = '#0DEDC0';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('PROPUESTA DE META LOGÍSTICA & BONIFICACIÓN B2B', 80, 110);

    ctx.strokeStyle = '#0DEDC0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(80, 135);
    ctx.lineTo(width - 80, 135);
    ctx.stroke();

    // DATOS DE BODEGA Y PRODUCTO
    ctx.fillStyle = 'rgba(16, 41, 53, 0.9)';
    ctx.fillRect(80, 165, width - 160, 210);
    ctx.strokeStyle = '#0DEDC0';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(80, 165, width - 160, 210);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(`Proveedor: ${nombreProveedor || 'DEMO ATOM'}`, 110, 220);

    const textoSku = skuProducto ? ` (${skuProducto})` : '';
    ctx.fillText(`Producto: ${nombreProducto}${textoSku}`, 110, 280);
    
    ctx.fillStyle = '#0DEDC0';
    ctx.fillText(`Lote Proyectado: ${metricas.qty} Unidades`, 110, 340);

    // ESTRUCTURA DE LA OFERTA
    ctx.fillStyle = 'rgba(9, 13, 22, 0.95)';
    ctx.fillRect(80, 410, width - 160, 380);
    ctx.strokeStyle = '#0DEDC0';
    ctx.lineWidth = 2;
    ctx.strokeRect(80, 410, width - 160, 380);

    ctx.fillStyle = '#0DEDC0';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('Estructura Financiera de la Oferta', 110, 465);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '22px sans-serif';
    ctx.fillText('• Precio Público Sugerido (PVP):', 110, 530);
    ctx.fillStyle = '#0DEDC0';
    ctx.font = 'bold 26px monospace';
    ctx.fillText(`${formatoMoneda(precioElegido)} / ud`, 550, 530);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '22px sans-serif';
    ctx.fillText(`• Bono x Cumplimiento Logístico (${(metricas.pctComisionExtra * 100).toFixed(0)}%):`, 110, 610);
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 26px monospace';
    ctx.fillText(`${formatoMoneda(bonoElegido)} / unidad entregada`, 110, 655);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '22px sans-serif';
    ctx.fillText(`• Fondo Total de Incentivos (${metricas.qty} uds):`, 110, 730);
    ctx.fillStyle = '#0DEDC0';
    ctx.font = 'bold 28px monospace';
    ctx.fillText(`${formatoMoneda(bonoTotalLote)}`, 620, 730);

    // METAS Y KPIS
    ctx.fillStyle = 'rgba(16, 41, 53, 0.9)';
    ctx.fillRect(80, 830, width - 160, 250);
    ctx.strokeStyle = '#6884C5';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(80, 830, width - 160, 250);

    ctx.fillStyle = '#6884C5';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('KPIs de Meta Logística Exigidos:', 110, 880);

    // CAJA DEVOLUCIÓN MÁX
    ctx.fillStyle = 'rgba(31, 18, 27, 0.9)';
    ctx.fillRect(110, 915, 420, 130);
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(110, 915, 420, 130);

    ctx.fillStyle = '#FCA5A5';
    ctx.font = '18px sans-serif';
    ctx.fillText('• Devolución Máxima Tolerada:', 130, 955);
    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 36px monospace';
    ctx.fillText(`${(metricas.devActivo * 100).toFixed(0)}%`, 130, 1010);

    // CAJA EFECTIVIDAD MÍN
    ctx.fillStyle = 'rgba(11, 30, 25, 0.9)';
    ctx.fillRect(550, 915, 420, 130);
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(550, 915, 420, 130);

    ctx.fillStyle = '#A7F3D0';
    ctx.font = '18px sans-serif';
    ctx.fillText('• Efectividad Mínima Requerida:', 570, 955);
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 36px monospace';
    ctx.fillText(`${(100 - (metricas.devActivo * 100)).toFixed(0)}%`, 570, 1010);

    // CONDICIONES COMERCIALES
    ctx.fillStyle = 'rgba(9, 13, 22, 0.95)';
    ctx.fillRect(80, 1110, width - 160, 260);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(80, 1110, width - 160, 260);

    ctx.fillStyle = '#FBBF24';
    ctx.font = '19px sans-serif';
    const textoCondicion = 'Condición: El incentivo logístico se desembolsará el 25 de cada mes después de confirmar y cerrar la operación logística del mes anterior, tomando como referencia las órdenes efectivamente entregadas en plataforma bajo los parámetros de efectividad acordados.';
    wrapText(ctx, textoCondicion, 110, 1160, width - 220, 36);

    ctx.strokeStyle = '#0DEDC0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 1410);
    ctx.lineTo(width - 80, 1410);
    ctx.stroke();

    // PIE DE PÁGINA CON LOGO ATOM DESDE PUBLIC (/logo-color.png)
    const cargarLogoYFinalizar = () => {
      const imgLogo = new Image();
      imgLogo.src = '/logo-color.png';
      imgLogo.onload = () => {
        const logoWidth = 180;
        const logoHeight = (imgLogo.height / imgLogo.width) * logoWidth;
        const logoX = (width - logoWidth) / 2;
        const logoY = 1440;
        ctx.drawImage(imgLogo, logoX, logoY, logoWidth, logoHeight);

        ctx.fillStyle = '#0DEDC0';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CENTRO LOGÍSTICO ATOM', width / 2, logoY + logoHeight + 35);
        ctx.textAlign = 'left';

        const link = document.createElement('a');
        link.download = `Propuesta_B2B_${(nombreProveedor || 'ATOM').replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setDescargando(false);
      };
      imgLogo.onerror = () => {
        // Fallback si la imagen no carga
        ctx.fillStyle = '#0DEDC0';
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CENTRO LOGÍSTICO ATOM', width / 2, 1480);
        ctx.textAlign = 'left';

        const link = document.createElement('a');
        link.download = `Propuesta_B2B_${(nombreProveedor || 'ATOM').replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setDescargando(false);
      };
    };

    cargarLogoYFinalizar();
  };

  return (
    <section className="relative z-10 py-12 px-4 sm:px-6 overflow-hidden w-full border-b border-[#0DEDC0]/10 text-white font-sans">
      <Fondos variante={variante} modo="absolute" />

      {/* FLOATING TOAST ADVERTENCIA EN CLIC DE MERMAS / DEVOLUCIÓN */}
      {mensajeAlertaMermas && (
        <div className="fixed top-6 right-6 z-50 max-w-md bg-[#090D16]/95 border-2 border-amber-400 p-4 rounded-2xl shadow-[0_10px_40px_rgba(245,158,11,0.4)] text-white animate-bounce">
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

          <div className="bg-[#090D16]/90 p-3.5 rounded-2xl border border-slate-800 shrink-0 w-full md:w-auto z-20">
            <label className="block text-[10px] font-mono font-bold text-[#0DEDC0] uppercase mb-1">
              Moneda de Operación
              <Tooltip contenido="Selecciona la divisa oficial para formatear valores y cargar impuestos por defecto de la región." />
            </label>
            <select
              value={monedaSeleccionada.codigo}
              onChange={(e) => {
                const m = MONEDAS.find((x) => x.codigo === e.target.value);
                if (m) {
                  setMonedaSeleccionada(m);
                  const tarifas = obtenerTarifasImpuesto(m.codigo);
                  if (tarifas && tarifas.length > 0) {
                    setImpactoFiscal(tarifas[0].valor);
                  }
                }
              }}
              className="w-full bg-[#102935] border border-slate-700 text-white text-xs font-bold rounded-xl p-2.5 focus:border-[#0DEDC0] outline-none cursor-pointer"
            >
              {MONEDAS.map((m) => (
                <option key={m.codigo} value={m.codigo}>
                  {m.nombre} ({m.simbolo})
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
            <div className="bg-[#090D16]/90 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl h-full">
              <span className="text-xs font-mono font-bold text-[#0DEDC0] uppercase tracking-wider block border-b border-slate-800 pb-2">
                Costos de Producción
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
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block border-b border-slate-800 pb-2">
                Provisión Fricción Logística COD
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

              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={notificarCondicionesMermas}
                  className="bg-red-900/10 border border-red-900/30 p-2.5 rounded-xl cursor-pointer hover:border-red-500/50 transition-colors"
                >
                  <div className="flex justify-between text-[10px] font-semibold text-red-300 mb-1.5">
                    <span className="flex items-center">
                      Devolución
                      <Tooltip contenido="Porcentaje estimado de guías que no logran entregarse y deben ser retornadas." />
                    </span>
                    <span className="font-mono text-red-400 font-bold">{porcentajeDevoluciones}%</span>
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
                  className="bg-red-950/10 border border-red-900/30 p-2.5 rounded-xl cursor-pointer hover:border-red-500/50 transition-colors"
                >
                  <div className="flex justify-between text-[10px] font-semibold text-red-300 mb-1.5">
                    <span className="flex items-center">
                      Mermas (Pérdida)
                      <Tooltip contenido="Porcentaje de inventario que no llega a bodega o es devuelto pero llega destruido, averiado o saqueado en el trayecto." />
                    </span>
                    <span className="font-mono text-red-400 font-bold">{porcentajeMermas}%</span>
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
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block border-b border-slate-800 pb-2">
                Objetivo de Rentabilidad & Fiscal
              </span>
              <div className="bg-[#102935]/40 border border-[#0DEDC0]/20 p-3 rounded-xl">
                <div className="flex justify-between text-xs font-semibold text-[#0DEDC0] mb-2">
                  <span>
                    Margen Neto Libre
                    <Tooltip contenido="Porcentaje de utilidad limpia objetivo para la bodega tras saldar costos y provisiones." />
                  </span>
                  <span className="font-mono font-bold text-white">{margenDeseado}%</span>
                </div>
                <input type="range" min="1" max="70" value={margenDeseado} onChange={(e) => setMargenDeseado(Number(e.target.value))} className="w-full accent-[#0DEDC0] cursor-pointer" />
              </div>
              <div className="bg-slate-800/30 border border-slate-700/50 p-3 rounded-xl">
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>
                    Impuestos (IVA / Retenciones)
                    <Tooltip contenido="Impuesto al valor agregado e impacto tributario aplicable que debe reservarse para declaración." />
                  </span>
                  <span className="font-mono text-white">{impactoFiscal}%</span>
                </div>
                <input type="range" min="0" max="30" value={impactoFiscal} onChange={(e) => setImpactoFiscal(Number(e.target.value))} className="w-full accent-slate-400 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: ANÁLISIS DE SENSIBILIDAD B2B */}
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
              onClick={() => setEscenarioSeleccionado('PESIMO')}
              className={`relative bg-[#1A0B12]/95 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 border-2 ${
                escenarioSeleccionado === 'PESIMO' ? 'border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.3)] ring-1 ring-red-500/50 scale-[1.02]' : 'border-red-900/40 hover:border-red-500/40'
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500" />
              <div className="space-y-2 border-b border-red-900/30 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/30">1. Pésimo</span>
                  {escenarioSeleccionado === 'PESIMO' && <span className="text-[9px] font-mono font-bold bg-red-500 text-white px-1.5 py-0.5 rounded">✓ Activo</span>}
                </div>
                <h3 className="text-sm font-bold text-slate-200 m-0 leading-tight flex items-center justify-between">
                  Estrés Logístico Máximo
                  <Tooltip contenido="Simula un rebote crítico de guías (+50%) y mermas dobles para calcular el precio blindado de supervivencia." />
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed m-0">Devolución {metricas.pctDevPes}% | Mermas {metricas.pctMermasPes}%</p>
                <div className="pt-2">
                  <span className="text-[9px] text-slate-500 uppercase font-bold block">Precio de Resguardo Requerido</span>
                  <span className="text-xl font-mono font-black text-slate-200">{formatoMoneda(metricas.pes.precioCatalogo)}</span>
                </div>
              </div>
              <div className="bg-[#090D16]/90 p-3.5 rounded-xl border border-red-900/20 font-mono text-[10px] flex-1 flex flex-col justify-between space-y-2">
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
            </div>

            {/* ESCENARIO 2 */}
            <div 
              onClick={() => setEscenarioSeleccionado('FAVORABLE')}
              className={`relative bg-[#0F2330]/95 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 border-2 ${
                escenarioSeleccionado === 'FAVORABLE' ? 'border-blue-400 shadow-[0_0_25px_rgba(96,165,250,0.3)] ring-1 ring-blue-400/50 scale-[1.02]' : 'border-blue-900/40 hover:border-blue-400/40'
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
              onClick={() => setEscenarioSeleccionado('OPTIMO')}
              className={`relative bg-[#0B1A14]/95 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 border-2 ${
                escenarioSeleccionado === 'OPTIMO' ? 'border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.3)] ring-1 ring-emerald-400/50 scale-[1.02]' : 'border-emerald-500/30 hover:border-emerald-400/40'
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
              onClick={() => setEscenarioSeleccionado('OBJETIVO')}
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
                <div className="flex justify-between text-[11px] font-semibold text-amber-300 mb-1.5">
                  <span>Comisión Drop</span>
                  <span className="font-mono text-amber-400 font-bold bg-amber-500/20 px-2 py-0.5 rounded">{comisionDropExtra}%</span>
                </div>
                <input type="range" min="0" max="30" value={comisionDropExtra} onChange={(e) => setComisionDropExtra(Number(e.target.value))} className="w-full accent-amber-500 cursor-pointer" />
              </div>
            </div>
          </div>

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
              <div 
                onClick={() => setOpcionPropuestaSeleccionada('OPCION1')}
                className={`p-5 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  opcionPropuestaSeleccionada === 'OPCION1' ? 'bg-[#1A160B] border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.15)]' : 'bg-[#101D28]/40 border border-slate-800'
                }`}
              >
                <div className="space-y-4">
                  <h4 className="text-sm font-black uppercase text-amber-400 m-0">Opción A: Precio Base (Asumes Comisión)</h4>
                  <div className="bg-[#090D16]/60 p-4 rounded-xl border border-amber-500/10 space-y-2 font-mono text-xs">
                    <div className="flex justify-between"><span>PVP:</span><span className="text-white font-bold">{formatoMoneda(metricas.activo.precioCatalogo)}</span></div>
                    <div className="flex justify-between text-amber-400 font-bold"><span>Bono ({comisionDropExtra}%):</span><span>+{formatoMoneda(metricas.comisionOp1)} /ud</span></div>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setOpcionPropuestaSeleccionada('OPCION2')}
                className={`p-5 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  opcionPropuestaSeleccionada === 'OPCION2' ? 'bg-[#0F2633] border-2 border-[#0DEDC0] shadow-[0_0_25px_rgba(13,237,192,0.15)]' : 'bg-[#101D28]/40 border border-slate-800'
                }`}
              >
                <div className="space-y-4">
                  <h4 className="text-sm font-black uppercase text-[#0DEDC0] m-0">Opción B: Escalar Precio (Margen Intacto)</h4>
                  <div className="bg-[#090D16]/60 p-4 rounded-xl border border-[#0DEDC0]/10 space-y-2 font-mono text-xs">
                    <div className="flex justify-between"><span>Nuevo PVP:</span><span className="text-[#0DEDC0] font-bold">{formatoMoneda(metricas.precioCatalogoOp2)}</span></div>
                    <div className="flex justify-between text-[#0DEDC0] font-bold"><span>Bono ({comisionDropExtra}%):</span><span>+{formatoMoneda(metricas.comisionOp2)} /ud</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* VISTA PREVIA TARJETA VERTICAL OFICIAL 2D + hexGrid + LOGO ATOM */}
            <div className="bg-[#090D16]/95 p-6 sm:p-8 rounded-3xl border-2 border-[#0DEDC0] shadow-[0_0_30px_rgba(13,237,192,0.2)] space-y-6 mt-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4 flex-wrap gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#0DEDC0] uppercase tracking-widest block">
                    VISTA PREVIA TARJETA EJECUTIVA B2B
                  </span>
                  <h4 className="text-lg font-black text-white m-0">
                    Diseño Oficial Formato Vertical 2D
                  </h4>
                </div>
                <span className="text-xs font-mono text-[#0DEDC0] bg-[#0DEDC0]/10 px-3 py-1 rounded-full border border-[#0DEDC0]/30 font-bold">
                  ● 1080 x 1600 PX PNG
                </span>
              </div>

              {/* CONTENEDOR VERTICAL PREVIEW */}
              <div className="max-w-md mx-auto bg-[#050A11] p-6 sm:p-8 rounded-3xl border-4 border-[#0DEDC0] shadow-[0_0_40px_rgba(13,237,192,0.25)] space-y-6 text-white font-sans relative overflow-hidden bg-grid-pattern">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0DEDC0]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="border-b-2 border-[#0DEDC0] pb-3 text-center sm:text-left">
                  <span className="text-xs sm:text-sm font-mono font-bold text-[#0DEDC0] uppercase block leading-tight tracking-wider">
                    PROPUESTA DE META LOGÍSTICA & BONIFICACIÓN B2B
                  </span>
                </div>

                <div className="bg-[#102935]/90 p-4 rounded-2xl border border-[#0DEDC0]/40 space-y-2 text-sm">
                  <div className="text-white font-semibold">
                    <span className="text-slate-400">Proveedor:</span> <strong className="text-[#0DEDC0]">{nombreProveedor || 'DEMO ATOM'}</strong>
                  </div>
                  <div className="text-white font-semibold">
                    <span className="text-slate-400">Producto:</span> {nombreProducto} {skuProducto ? `(${skuProducto})` : ''}
                  </div>
                  <div className="text-[#0DEDC0] font-bold">
                    <span className="text-slate-400">Lote Proyectado:</span> {metricas.qty} Unidades
                  </div>
                </div>

                <div className="bg-[#090D16]/95 p-5 rounded-2xl border-2 border-[#0DEDC0] space-y-3">
                  <h4 className="text-base font-bold text-[#0DEDC0] m-0 border-b border-slate-800 pb-2 font-mono">
                    Estructura Financiera de la Oferta
                  </h4>
                  <div className="space-y-2 text-xs sm:text-sm font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">• Precio Público Sugerido (PVP):</span>
                      <span className="text-[#0DEDC0] font-black">
                        {formatoMoneda(opcionPropuestaSeleccionada === 'OPCION1' ? metricas.activo.precioCatalogo : metricas.precioCatalogoOp2)} / ud
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-amber-400">
                      <span className="text-slate-300">• Bono Logístico ({comisionDropExtra}%):</span>
                      <span className="font-black">
                        {formatoMoneda(opcionPropuestaSeleccionada === 'OPCION1' ? metricas.comisionOp1 : metricas.comisionOp2)} / ud
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                      <span className="text-slate-300">• Fondo Total Incentivos ({metricas.qty} uds):</span>
                      <span className="text-[#0DEDC0] font-black text-base">
                        {formatoMoneda(opcionPropuestaSeleccionada === 'OPCION1' ? metricas.totalComisionOp1 : metricas.totalComisionOp2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#102935]/90 p-4 rounded-2xl border border-[#6884C5]/50 space-y-3">
                  <h4 className="text-xs sm:text-sm font-bold text-[#6884C5] m-0 font-mono">
                    KPIs de Meta Logística Exigidos:
                  </h4>
                  <div className="grid grid-cols-2 gap-3 font-mono text-center">
                    <div className="bg-[#1F121B] p-2.5 rounded-xl border border-red-500/50">
                      <span className="text-[10px] text-red-300 block">Devolución Máx:</span>
                      <span className="text-lg font-black text-red-400">{(metricas.devActivo * 100).toFixed(0)}%</span>
                    </div>
                    <div className="bg-[#0B1E19] p-2.5 rounded-xl border border-emerald-500/50">
                      <span className="text-[10px] text-emerald-300 block">Efectividad Mín:</span>
                      <span className="text-lg font-black text-emerald-400">{(100 - (metricas.devActivo * 100)).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#090D16]/95 p-4 rounded-2xl border border-amber-500/40 text-[11px] text-amber-300 leading-relaxed font-sans">
                  <strong>Condición:</strong> El incentivo logístico se desembolsará el 25 de cada mes después de confirmar y cerrar la operación logística del mes anterior, tomando como referencia las órdenes efectivamente entregadas en plataforma bajo los parámetros de efectividad acordados.
                </div>

                {/* CENTRO LOGÍSTICO ATOM CON LOGO DE PUBLIC */}
                <div className="pt-4 border-t-2 border-[#0DEDC0] text-center space-y-2">
                  <img 
                    src="/logo-color.png" 
                    alt="ATOM Logo" 
                    className="h-9 w-auto mx-auto object-contain drop-shadow-[0_0_12px_rgba(13,237,192,0.4)]"
                  />
                  <span className="text-xs sm:text-sm font-mono font-black text-[#0DEDC0] uppercase tracking-widest block">
                    Centro logístico ATOM
                  </span>
                </div>

              </div>
            </div>
          </div>

          <div className="pt-2">
            <button 
              disabled={descargando}
              onClick={descargarImagenPropuesta} 
              className="w-full bg-[#0DEDC0] hover:bg-[#20fbd0] text-[#090D18] font-black py-5 px-6 rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(13,237,192,0.4)] hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{descargando ? 'Generando PNG Oficial 2D...' : 'DESCARGAR TARJETA B2B OFICIAL (PNG VERTICAL)'}</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}