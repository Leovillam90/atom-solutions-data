'use client';

import React from 'react';
import { Kicker, H2, Subtitulo, ESTILOS_TEXTO } from '@/app/complementos/Tipografia';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';

interface Material {
  id: string;
  titulo: string;
  tipo: 'PDF' | 'EXCEL' | 'WEB' | 'VIDEO';
  categoria: string;
  descripcion: string;
  metaInfo: string;
  textoBoton: string;
  urlDestino: string;
  esDescargaDirecta: boolean;
}

const MATERIALES: Material[] = [
  {
    id: '1',
    titulo: 'Calculadora de Fuga de Fletes y Devoluciones',
    tipo: 'WEB',
    categoria: 'HERRAMIENTA FINANCIERA',
    metaInfo: 'Link Web',
    descripcion: 'Matriz automatizada para simular el impacto real de las devoluciones en tu margen y detectar dinero estancado por sobrecostos logísticos.',
    textoBoton: 'ABRIR CALCULADORA ↗',
    urlDestino: '/calculadora',
    esDescargaDirecta: false,
  },
  {
    id: '2',
    titulo: 'Usabilidad de EcomScanner para Bodegas',
    tipo: 'PDF',
    categoria: 'GUÍA OPERATIVA',
    metaInfo: 'PDF - 2.4 MB',
    descripcion: 'Manual técnico para integrar el escáner a tu flujo de trabajo. Optimiza el proceso de alistamiento y reduce a cero los errores de despacho por factor humano.',
    textoBoton: '↓ DESCARGAR DOCUMENTO',
    urlDestino: '/apoyo/ecomscanner-usabilidad-bodegas.pdf',
    esDescargaDirecta: true,
  },
  {
    id: '3',
    titulo: 'Protocolo Oficial de Empaque y Despacho',
    tipo: 'PDF',
    categoria: 'SOP / PROCESOS',
    metaInfo: 'PDF - 1.8 MB',
    descripcion: 'Estructura estándar de rotulado y embalaje en bodega diseñada para reducir drásticamente la tasa de averías y rechazos por las transportadoras.',
    textoBoton: '↓ DESCARGAR PROTOCOLO',
    urlDestino: '/apoyo/protocolo-oficial-empaque.pdf',
    esDescargaDirecta: true,
  },
  {
    id: '4',
    titulo: 'Cómo reclamar evidencia de entrega (Botón Flotante)',
    tipo: 'VIDEO',
    categoria: 'TUTORIAL TÁCTICO',
    metaInfo: 'Video - 04:30',
    descripcion: 'Aprende a utilizar la herramienta flotante de ATOM para exigir pruebas reales a las transportadoras y ganar disputas por devoluciones dudosas.',
    textoBoton: '▶ REPRODUCIR VIDEO',
    urlDestino: 'https://youtube.com',
    esDescargaDirecta: false,
  },
  {
    id: '5',
    titulo: 'Liberación de Cash y Corrección de Estados',
    tipo: 'VIDEO',
    categoria: 'ESTRATEGIA FINANCIERA',
    metaInfo: 'Video - 06:15',
    descripcion: 'Táctica operativa para destrabar guías retenidas, forzar la actualización de estados y acelerar el flujo de caja hacia tu cuenta bancaria.',
    textoBoton: '▶ VER TÁCTICA',
    urlDestino: 'https://youtube.com',
    esDescargaDirecta: false,
  },
];

interface Seccion2Props {
  variante?: TipoFondo;
}

export default function Seccion2({ variante = 'cyanSolidDots' }: Seccion2Props) {

  const renderIconoTipo = (tipo: Material['tipo']) => {
    switch (tipo) {
      case 'WEB':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0DEDC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        );
      case 'VIDEO':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0DEDC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        );
      case 'EXCEL':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0DEDC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <path d="M8 13h8"></path>
            <path d="M8 17h8"></path>
            <path d="M10 9h4"></path>
          </svg>
        );
      case 'PDF':
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0DEDC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        );
    }
  };

  return (
    <section className="relative z-10 py-16 lg:py-24 px-6 overflow-hidden w-full border-t border-[#091A23]/20">
      
      {/* CAPA DE FONDO VERDE CIAN CON PUNTOS */}
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* CABECERA (Textos en #091A23 sobre fondo brillante) */}
        <div className="text-center mb-12">
          {/* ETIQUETA SUPERIOR */}
          <Kicker className="!text-[#091A23] !bg-transparent !border-transparent !p-0 text-xs font-semibold tracking-widest uppercase mb-3">
            BIBLIOTECA & RECURSOS TÁCTICOS
          </Kicker>

          {/* TÍTULO PRINCIPAL: Verde Oscuro ATOM (#091A23) */}
          <H2 className="text-balance mb-4 max-w-4xl mx-auto !text-[#091A23] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Material de apoyo táctico.
          </H2>

          {/* SUBTÍTULO */}
          <Subtitulo className="max-w-3xl mx-auto !text-[#091A23] text-base sm:text-lg font-medium">
            Accede a la documentación técnica, guías de operación en PDF, simuladores web y tutoriales tácticos para tu bodega.
          </Subtitulo>
        </div>

        {/* GRILLA DE RECURSOS (Cards oscuras con base verde ATOM #091A23) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {MATERIALES.map((doc) => (
            <div 
              key={doc.id}
              /* FONDO BASE DE TARJETA: #091A23 */
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#091A23] border border-[#0DEDC0]/20 shadow-[0_15px_35px_rgba(9,26,35,0.4)] hover:border-[#0DEDC0] hover:shadow-[0_20px_40px_rgba(13,237,192,0.2)] hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                {/* ENCABEZADO TARJETA */}
                <div className="flex items-center justify-between mb-4 gap-2">
                  <div className="flex items-center gap-2.5">
                    {/* ICONO CON VERDE NEÓN ATOM (#0DEDC0) */}
                    <div className="w-9 h-9 rounded-lg bg-[#0DEDC0]/10 border border-[#0DEDC0]/30 flex items-center justify-center text-[#0DEDC0] group-hover:scale-105 group-hover:bg-[#0DEDC0] group-hover:text-[#091A23] transition-all duration-300 shrink-0">
                      {renderIconoTipo(doc.tipo)}
                    </div>
                    <span className="text-[#94A3B8] text-[11px] font-mono font-bold uppercase tracking-wider">
                      {doc.categoria}
                    </span>
                  </div>

                  {/* BADGE SUPERIOR EN VERDE NEÓN ATOM (#0DEDC0) */}
                  <span className="text-[10px] font-mono font-bold text-[#0DEDC0] bg-[#0DEDC0]/10 px-2.5 py-1 rounded border border-[#0DEDC0]/30 shrink-0">
                    {doc.metaInfo}
                  </span>
                </div>

                {/* TÍTULO DENTRO DE TARJETA: Blanco Puro (#FFFFFF) */}
                <h3 className="text-[#FFFFFF] font-bold text-base mb-2 group-hover:text-[#0DEDC0] transition-colors leading-snug">
                  {doc.titulo}
                </h3>

                {/* DESCRIPCIÓN: Gris Claro Neutro (#94A3B8) */}
                <p className="text-[#94A3B8] text-xs leading-relaxed mb-6 font-medium">
                  {doc.descripcion}
                </p>
              </div>

              {/* BOTÓN CTA: Fondo Verde Neón ATOM (#0DEDC0), Texto Oscuro (#091A23) en Negrilla */}
              <a 
                href={doc.urlDestino}
                download={doc.esDescargaDirecta ? true : undefined}
                target={doc.esDescargaDirecta ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className={`w-full py-3.5 rounded-xl bg-[#0DEDC0] text-[#091A23] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#25ffd3] hover:shadow-[0_0_20px_rgba(13,237,192,0.5)] transition-all duration-300 cursor-pointer ${ESTILOS_TEXTO.boton}`}
              >
                {doc.textoBoton}
              </a>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}