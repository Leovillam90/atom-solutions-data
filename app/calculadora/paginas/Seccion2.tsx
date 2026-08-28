'use client';

import React, { useState, useEffect } from 'react';
import { MonedaConfig } from '@/app/lib/moneda';
import { EscenarioTipo } from './Seccion1';

type OpcionPropuestaTipo = 'OPCION1' | 'OPCION2';

interface Seccion2Props {
  metricas: any;
  monedaSeleccionada: MonedaConfig;
  escenarioSeleccionado: EscenarioTipo;
  formatoMoneda: (monto: number) => string;
  unidadesProyectadas: number;
  setUnidadesProyectadas: (val: number) => void;
  comisionDropExtra: number;
  setComisionDropExtra: (val: number) => void;
}

export default function Seccion2({
  metricas,
  monedaSeleccionada,
  escenarioSeleccionado,
  formatoMoneda,
  unidadesProyectadas,
  setUnidadesProyectadas,
  comisionDropExtra,
  setComisionDropExtra,
}: Seccion2Props) {
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

  const cargarImagenBase64 = (url: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.drawImage(img, 0, 0);
          resolve(tempCanvas.toDataURL('image/png'));
        } else {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
    });
  };

  const descargarPDFPropuesta = async () => {
    setDescargando(true);
    try {
      const { default: jsPDF } = await import('jspdf');

      const esOp1 = opcionPropuestaSeleccionada === 'OPCION1';
      const precioElegido = esOp1 ? metricas.activo.precioCatalogo : metricas.precioCatalogoOp2;
      const bonoElegido = esOp1 ? metricas.comisionOp1 : metricas.comisionOp2;
      const bonoTotalLote = esOp1 ? metricas.totalComisionOp1 : metricas.totalComisionOp2;

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const logoBase64 = await cargarImagenBase64('/logo-color.png');

      const aplicarPlantillaPagina = (numPagina: number) => {
        // Fondo Oscuro
        doc.setFillColor(5, 10, 17);
        doc.rect(0, 0, 210, 297, 'F');

        // Marco Neón Limpio
        doc.setDrawColor(13, 237, 192);
        doc.setLineWidth(0.8);
        doc.rect(10, 10, 190, 277, 'S');

        // Pie de Página
        doc.setDrawColor(30, 41, 59);
        doc.setLineWidth(0.4);
        doc.line(14, 278, 196, 278);

        if (logoBase64) {
          doc.addImage(logoBase64, 'PNG', 14, 281, 28, 9);
        } else {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(13, 237, 192);
          doc.text('ATOM Solutions Data', 14, 286);
        }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(`Página ${numPagina} de 4`, 196, 286, { align: 'right' });
      };

      // ==========================================
      // PÁGINA 1: DATOS Y ESTRUCTURA FINANCIERA
      // ==========================================
      aplicarPlantillaPagina(1);

      // Cabecera Principal
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(13, 237, 192);
      doc.text('ACUERDO COMERCIAL B2B & LIQUIDACIÓN', 14, 22);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(226, 232, 240);
      doc.text('Documento oficial de estructuración operativa y proyecciones financieras B2B.', 14, 27);

      doc.setDrawColor(13, 237, 192);
      doc.setLineWidth(0.5);
      doc.line(14, 31, 196, 31);

      // 1. DATOS DE LA OPERACIÓN
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(13, 237, 192);
      doc.text('1. Datos de la Operación', 14, 39);

      // Tabla 1: Contenedor
      const t1X = 14;
      const t1Y = 43;
      const t1W = 182;
      const t1H = 44;

      doc.setFillColor(16, 41, 53);
      doc.setDrawColor(13, 237, 192);
      doc.setLineWidth(0.3);
      doc.roundedRect(t1X, t1Y, t1W, t1H, 2, 2, 'FD');

      // Encabezado Tabla 1 (Sintetizado sin desborde de esquinas)
      doc.setFillColor(9, 13, 22);
      doc.setDrawColor(13, 237, 192);
      doc.line(t1X, t1Y + 9, t1X + t1W, t1Y + 9);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(13, 237, 192);
      doc.text('CONCEPTO', t1X + 6, t1Y + 6);
      doc.text('DETALLE', t1X + 80, t1Y + 6);

      // Filas Tabla 1
      const filasTabla1 = [
        ['Proveedor', nombreProveedor || 'DEMO ATOM'],
        ['Producto', `${nombreProducto} ${skuProducto ? `(${skuProducto})` : ''}`],
        ['Lote Proyectado', `${metricas.qty} Unidades`],
        ['Modalidad Seleccionada', esOp1 ? 'Opción A (Precio Base)' : 'Opción B (Escalar Precio)'],
      ];

      filasTabla1.forEach((fila, idx) => {
        const yLine = t1Y + 9 + idx * 8.75;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(226, 232, 240);
        doc.text(fila[0], t1X + 6, yLine + 6);
        doc.setFont('helvetica', 'bold');
        doc.text(fila[1], t1X + 80, yLine + 6);

        if (idx < 3) {
          doc.setDrawColor(30, 41, 59);
          doc.setLineWidth(0.2);
          doc.line(t1X, yLine + 8.75, t1X + t1W, yLine + 8.75);
        }
      });

      // 2. ESTRUCTURA FINANCIERA
      const t2Y = 96;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(245, 158, 11);
      doc.text('2. Estructura Financiera', 14, t2Y);

      const t2BoxY = t2Y + 4;
      const t2H = 50;

      doc.setFillColor(9, 13, 22);
      doc.setDrawColor(245, 158, 11);
      doc.setLineWidth(0.4);
      doc.roundedRect(t1X, t2BoxY, t1W, t2H, 2, 2, 'FD');

      // Encabezado Tabla 2
      doc.setFillColor(16, 41, 53);
      doc.setDrawColor(245, 158, 11);
      doc.line(t1X, t2BoxY + 9, t1X + t1W, t2BoxY + 9);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(245, 158, 11);
      doc.text('INDICADOR FINANCIERO', t1X + 6, t2BoxY + 6);
      doc.text('MONTO ASIGNADO', t1X + 110, t2BoxY + 6);

      // Fila 1: PVP
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(226, 232, 240);
      doc.text('Precio Público Sugerido (PVP)', t1X + 6, t2BoxY + 15);
      doc.setFont('helvetica', 'bold');
      doc.text(`${formatoMoneda(precioElegido)} / ud`, t1X + 110, t2BoxY + 15);

      doc.setDrawColor(30, 41, 59);
      doc.setLineWidth(0.2);
      doc.line(t1X, t2BoxY + 19, t1X + t1W, t2BoxY + 19);

      // Fila 2: Bono Logístico
      doc.setFont('helvetica', 'normal');
      doc.text('Bono Logístico', t1X + 6, t2BoxY + 25);
      doc.setFont('helvetica', 'bold');
      doc.text(`${formatoMoneda(bonoElegido)} / ud`, t1X + 110, t2BoxY + 25);

      doc.setDrawColor(30, 41, 59);
      doc.line(t1X, t2BoxY + 29, t1X + t1W, t2BoxY + 29);

      // Fila Destacada: Fondo Total
      doc.setFillColor(11, 30, 25);
      doc.rect(t1X + 0.3, t2BoxY + 29.3, t1W - 0.6, 20.3, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(16, 185, 129);
      doc.text('FONDO TOTAL DE INCENTIVOS', t1X + 6, t2BoxY + 37);
      doc.setFontSize(7.5);
      doc.setTextColor(167, 243, 208);
      doc.text(`Proyectado a ${metricas.qty} uds`, t1X + 6, t2BoxY + 43);

      doc.setFontSize(12);
      doc.setTextColor(16, 185, 129);
      doc.text(`${formatoMoneda(bonoTotalLote)}`, t1X + 110, t2BoxY + 40);

      // ==========================================
      // PÁGINA 2: KPIS Y CONDICIÓN DE DESEMBOLSO
      // ==========================================
      doc.addPage('a4', 'portrait');
      aplicarPlantillaPagina(2);

      // 3. KPIS Y REGLAS DEL NEGOCIO
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(104, 132, 197);
      doc.text('3. KPIs y Reglas del Negocio', 14, 22);

      const t3Y = 26;
      const t3H = 36;

      doc.setFillColor(16, 41, 53);
      doc.setDrawColor(104, 132, 197);
      doc.setLineWidth(0.3);
      doc.roundedRect(t1X, t3Y, t1W, t3H, 2, 2, 'FD');

      // Encabezado Tabla 3
      doc.setFillColor(9, 13, 22);
      doc.setDrawColor(104, 132, 197);
      doc.line(t1X, t3Y + 9, t1X + t1W, t3Y + 9);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(104, 132, 197);
      doc.text('MÉTRICA / REGLA', t1X + 6, t3Y + 6);
      doc.text('OBJETIVO REQUERIDO', t1X + 110, t3Y + 6);

      const filasTabla3 = [
        ['Efectividad Mínima Requerida', `${(100 - (metricas.devActivo * 100)).toFixed(0)}%`],
        ['Provisión Devolución Estimada', `${(metricas.devActivo * 100).toFixed(0)}%`],
        ['Devolución Máxima Tolerada', `${(metricas.devActivo * 100).toFixed(0)}%`],
      ];

      filasTabla3.forEach((fila, idx) => {
        const yLine = t3Y + 9 + idx * 9;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(226, 232, 240);
        doc.text(fila[0], t1X + 6, yLine + 6);
        doc.setFont('helvetica', 'bold');
        doc.text(fila[1], t1X + 110, yLine + 6);

        if (idx < 2) {
          doc.setDrawColor(30, 41, 59);
          doc.setLineWidth(0.2);
          doc.line(t1X, yLine + 9, t1X + t1W, yLine + 9);
        }
      });

      // 4. CONDICIÓN DE DESEMBOLSO
      const t4Y = 72;
      doc.setFillColor(9, 13, 22);
      doc.setDrawColor(245, 158, 11);
      doc.setLineWidth(0.4);
      doc.roundedRect(t1X, t4Y, t1W, 35, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(245, 158, 11);
      doc.text('Condición de Desembolso:', t1X + 6, t4Y + 8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(226, 232, 240);
      const txtDesembolso = 'El incentivo logístico se desembolsará el 25 de cada mes tras confirmar la operación del mes anterior sobre guías efectivamente entregadas en la plataforma.';
      const lineasDesembolso = doc.splitTextToSize(txtDesembolso, 170);
      doc.text(lineasDesembolso, t1X + 6, t4Y + 16);

      // ==========================================
      // PÁGINA 3: PLAYBOOK ATOM (PARTE 1)
      // ==========================================
      doc.addPage('a4', 'portrait');
      aplicarPlantillaPagina(3);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(13, 237, 192);
      doc.text('PLAYBOOK ATOM: GUÍA DE EFICIENCIA', 14, 22);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(226, 232, 240);
      doc.text('Tácticas comprobadas para blindar tu flujo de caja, reducir devoluciones y mantener tu capital circulando de manera saludable.', 14, 27);

      doc.setDrawColor(13, 237, 192);
      doc.setLineWidth(0.5);
      doc.line(14, 31, 196, 31);

      // 1. COSTEO REAL DEL PRODUCTO
      doc.setFillColor(16, 41, 53);
      doc.setDrawColor(13, 237, 192);
      doc.setLineWidth(0.3);
      doc.roundedRect(14, 38, 182, 54, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(13, 237, 192);
      doc.text('1. Costeo Real del Producto (COGS Integral)', 20, 46);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(248, 113, 113);
      doc.text('El error común: Calcular tu margen únicamente sobre el costo del producto puesto en origen.', 20, 53);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(226, 232, 240);
      const txtCosteoAccion = '• La Acción: Debes incluir todos los costos ocultos en tu tarifa: alistamiento, empaque, picking, etiquetas y la reserva financiera para la absorción de devoluciones.';
      doc.text(doc.splitTextToSize(txtCosteoAccion, 170), 20, 61);

      const txtCosteoImpacto = '• El Impacto: Una tarifa sin provisión logística destruye tu flujo de caja silenciosamente. Blindar tu precio te garantiza rentabilidad desde el día cero.';
      doc.text(doc.splitTextToSize(txtCosteoImpacto, 170), 20, 74);

      // 2. BUENA CONFIRMACIÓN DE ÓRDENES
      doc.setFillColor(16, 41, 53);
      doc.setDrawColor(245, 158, 11);
      doc.setLineWidth(0.3);
      doc.roundedRect(14, 100, 182, 62, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(245, 158, 11);
      doc.text('2. Buena Confirmación de Órdenes (Filtrado)', 20, 108);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(251, 191, 36);
      doc.text('Objetivo de calidad: Cero despachos a ciegas o direcciones fantasma.', 20, 115);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(226, 232, 240);
      const txtConfAccion = '• La Acción: Filtra las órdenes sospechosas utilizando WhatsApp o mediante una llamada automatizada.';
      doc.text(doc.splitTextToSize(txtConfAccion, 170), 20, 123);

      doc.setFont('helvetica', 'bold');
      doc.text('Checklist de Validación:', 20, 134);

      doc.setFont('helvetica', 'normal');
      doc.text('• Validar dirección exacta (barrio, manzana, punto de referencia).', 24, 142);
      doc.text('• Confirmar que el cliente final cuente con el dinero en efectivo al momento de la entrega (modalidad COD).', 24, 150);

      // ==========================================
      // PÁGINA 4: PLAYBOOK ATOM (PARTE 2)
      // ==========================================
      doc.addPage('a4', 'portrait');
      aplicarPlantillaPagina(4);

      // 3. SEGUIMIENTO ACTIVO Y GESTIÓN TEMPRANA
      doc.setFillColor(16, 41, 53);
      doc.setDrawColor(96, 165, 250);
      doc.setLineWidth(0.3);
      doc.roundedRect(14, 22, 182, 54, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(96, 165, 250);
      doc.text('3. Seguimiento Activo y Gestión Temprana (<24H)', 20, 30);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(147, 197, 253);
      doc.text('Dato clave ATOM: El 70% de las guías rescatadas se salvan en la primera novedad reportada.', 20, 37);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(226, 232, 240);
      const txtSegAccion = '• La Acción: Configura alertas automáticas (SMS o WhatsApp) enviadas al comprador justo cuando el paquete entra en reparto.';
      doc.text(doc.splitTextToSize(txtSegAccion, 170), 20, 45);

      const txtSegImpacto = '• El Impacto: Reduces drásticamente los reintentos fallidos de entrega, evitas devoluciones y aceleras el recaudo real en tu billetera.';
      doc.text(doc.splitTextToSize(txtSegImpacto, 170), 20, 58);

      // 4. ELECCIÓN ESTRATÉGICA DE TRANSPORTADORA
      doc.setFillColor(16, 41, 53);
      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(0.3);
      doc.roundedRect(14, 84, 182, 54, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(16, 185, 129);
      doc.text('4. Elección Estratégica de Transportadora', 20, 92);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(167, 243, 208);
      doc.text('La regla de oro: Lo barato sale caro. No elijas solo por la tarifa del flete.', 20, 99);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(226, 232, 240);
      const txtTransAccion = '• La Acción: Evalúa y monitorea constantemente la métrica de efectividad de entrega por zona o ciudad específica.';
      doc.text(doc.splitTextToSize(txtTransAccion, 170), 20, 107);

      const txtTransImpacto = '• El Impacto: Pagar una fracción más por un aliado con alta cobertura urbana evita enormes mermas logísticas y reintentos fallidos en trayectos especiales.';
      doc.text(doc.splitTextToSize(txtTransImpacto, 170), 20, 120);

      // Guardar PDF
      doc.save(`Dossier_B2B_${(nombreProveedor || 'ATOM').replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Ocurrió un error al generar el PDF.');
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="space-y-8 pt-10 relative font-sans text-white">
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
            <div className="flex justify-between text-[11px] font-semibold text-amber-300 mb-1.5">
              <span>Comisión Drop</span>
              <span className="font-mono text-amber-400 font-bold bg-amber-500/20 px-2 py-0.5 rounded">{comisionDropExtra}%</span>
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
          <div 
            onClick={() => setOpcionPropuestaSeleccionada('OPCION1')}
            className={`p-5 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              opcionPropuestaSeleccionada === 'OPCION1' ? 'bg-[#1A160B] border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.15)]' : 'bg-[#101D28]/40 border border-slate-800'
            }`}
          >
            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase text-amber-400 m-0">Opción A: Precio Base (Asumes Comisión)</h4>
              <div className="bg-[#090D16]/60 p-4 rounded-xl border border-amber-500/10 space-y-2 font-mono text-xs">
                <div className="flex justify-between"><span>PVP:</span><span className="text-white font-bold">{formatoMoneda(metricas?.activo?.precioCatalogo ?? 0)}</span></div>
                <div className="flex justify-between text-amber-400 font-bold"><span>Bono ({comisionDropExtra}%):</span><span>+{formatoMoneda(metricas?.comisionOp1 ?? 0)} /ud</span></div>
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
                <div className="flex justify-between"><span>Nuevo PVP:</span><span className="text-[#0DEDC0] font-bold">{formatoMoneda(metricas?.precioCatalogoOp2 ?? 0)}</span></div>
                <div className="flex justify-between text-[#0DEDC0] font-bold"><span>Bono ({comisionDropExtra}%):</span><span>+{formatoMoneda(metricas?.comisionOp2 ?? 0)} /ud</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* VISTA PREVIA INTERACTIVA */}
        <div className="bg-[#090D16]/95 p-6 sm:p-8 rounded-3xl border-2 border-[#0DEDC0] shadow-[0_0_30px_rgba(13,237,192,0.2)] space-y-6 mt-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4 flex-wrap gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#0DEDC0] uppercase tracking-widest block">
                VISTA PREVIA DEL ACUERDO B2B
              </span>
              <h4 className="text-lg font-black text-white m-0">
                Estructura Oficial en 4 Páginas & Playbook ATOM
              </h4>
            </div>
            <span className="text-xs font-mono text-[#0DEDC0] bg-[#0DEDC0]/10 px-3 py-1 rounded-full border border-[#0DEDC0]/30 font-bold">
              ● A4 PORTRAIT VECTORIAL (4 PÁGS)
            </span>
          </div>

          <div className="max-w-md mx-auto bg-[#050A11] p-6 rounded-3xl border-4 border-[#0DEDC0] shadow-[0_0_40px_rgba(13,237,192,0.25)] space-y-4 text-white font-sans relative overflow-hidden">
            <div className="border-b-2 border-[#0DEDC0] pb-2">
              <span className="text-xs font-mono font-bold text-[#0DEDC0] uppercase block">
                ACUERDO COMERCIAL B2B & LIQUIDACIÓN
              </span>
            </div>

            <div className="bg-[#102935]/90 p-3 rounded-xl border border-[#0DEDC0]/30 space-y-1 text-xs">
              <span className="text-[#0DEDC0] font-mono font-bold block">1. DATOS DE OPERACIÓN</span>
              <div><span className="text-slate-400">Proveedor:</span> {nombreProveedor || 'DEMO ATOM'}</div>
              <div><span className="text-slate-400">Producto:</span> {nombreProducto}</div>
            </div>

            <div className="bg-[#090D16]/95 p-3 rounded-xl border-2 border-amber-400 space-y-1 text-xs">
              <span className="text-amber-400 font-mono font-bold block">2. ESTRUCTURA FINANCIERA</span>
              <div><span className="text-slate-300">PVP Sugerido:</span> {formatoMoneda(opcionPropuestaSeleccionada === 'OPCION1' ? (metricas?.activo?.precioCatalogo ?? 0) : (metricas?.precioCatalogoOp2 ?? 0))}</div>
              <div className="text-emerald-400 font-bold">Fondo Incentivos: {formatoMoneda(opcionPropuestaSeleccionada === 'OPCION1' ? (metricas?.totalComisionOp1 ?? 0) : (metricas?.totalComisionOp2 ?? 0))}</div>
            </div>

            <div className="pt-2 border-t-2 border-[#0DEDC0] text-center space-y-1">
              <img src="/logo-color.png" alt="ATOM Logo" className="h-7 w-auto mx-auto object-contain" />
              <span className="text-[10px] font-mono font-black text-[#0DEDC0] uppercase tracking-widest block">
                Centro logístico ATOM
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button 
          disabled={descargando}
          onClick={descargarPDFPropuesta} 
          className="w-full bg-[#0DEDC0] hover:bg-[#20fbd0] text-[#090D18] font-black py-5 px-6 rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(13,237,192,0.4)] hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{descargando ? 'Generando Dossier B2B PDF...' : 'DESCARGAR DOSSIER B2B & PLAYBOOK (PDF 4 PÁGINAS)'}</span>
        </button>
      </div>
    </div>
  );
}