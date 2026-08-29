'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  FileText, 
  FileSpreadsheet, 
  Play, 
  Download, 
  ExternalLink, 
  Sparkles 
} from 'lucide-react';
// ⚡ Agregamos Highlight en los imports
import { Kicker, H2, Subtitulo, Highlight, ESTILOS_TEXTO } from '@/app/complementos/Tipografia';
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
    textoBoton: 'ABRIR CALCULADORA',
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
    textoBoton: 'DESCARGAR DOCUMENTO',
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
    textoBoton: 'DESCARGAR PROTOCOLO',
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
    textoBoton: 'REPRODUCIR VIDEO',
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
    textoBoton: 'VER TÁCTICA',
    urlDestino: 'https://youtube.com',
    esDescargaDirecta: false,
  },
];

const renderIconoTipo = (tipo: Material['tipo']) => {
  switch (tipo) {
    case 'WEB':
      return <Globe className="w-5 h-5 text-[#0DEDC0]" />;
    case 'VIDEO':
      return <Play className="w-5 h-5 text-[#0DEDC0] fill-current" />;
    case 'EXCEL':
      return <FileSpreadsheet className="w-5 h-5 text-[#0DEDC0]" />;
    case 'PDF':
    default:
      return <FileText className="w-5 h-5 text-[#0DEDC0]" />;
  }
};

interface Pagina2Props {
  variante?: TipoFondo;
}

export default function Pagina2({ variante = 'perspectiveGrid' }: Pagina2Props) {
  return (
    <section className="relative z-10 py-16 lg:py-24 px-6 overflow-hidden w-full border-t border-[#0DEDC0]/10 font-sans text-white">
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* CABECERA */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Kicker varianteFondo={variante}>BIBLIOTECA & RECURSOS TÁCTICOS</Kicker>

          <H2 varianteFondo={variante} className="text-balance mb-4 max-w-4xl mx-auto">
            Material de apoyo <Highlight varianteFondo={variante}>táctico.</Highlight>
          </H2>

          <Subtitulo varianteFondo={variante} className="max-w-3xl mx-auto">
            Accede a la documentación técnica, guías de operación en PDF, simuladores web y tutoriales tácticos para tu bodega.
          </Subtitulo>
        </motion.div>

        {/* GRILLA DE RECURSOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {MATERIALES.map((doc, idx) => (
            <motion.div 
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col justify-between p-7 rounded-2xl bg-[#090D16]/90 border border-slate-800 shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:border-[#0DEDC0] hover:shadow-[0_20px_40px_rgba(13,237,192,0.2)] transition-all duration-300 backdrop-blur-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#0DEDC0]/10 border border-[#0DEDC0]/30 flex items-center justify-center text-[#0DEDC0] group-hover:bg-[#0DEDC0] group-hover:text-[#091A23] transition-all duration-300 shrink-0 shadow-[0_4px_12px_rgba(13,237,192,0.15)]">
                      {renderIconoTipo(doc.tipo)}
                    </div>
                    <span className="text-slate-400 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#0DEDC0]" /> {doc.categoria}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-[#0DEDC0] bg-[#0DEDC0]/10 px-2.5 py-1 rounded-full border border-[#0DEDC0]/30 shrink-0">
                    {doc.metaInfo}
                  </span>
                </div>

                <h3 className="text-white font-black text-lg mb-2 group-hover:text-[#0DEDC0] transition-colors leading-snug tracking-tight">
                  {doc.titulo}
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                  {doc.descripcion}
                </p>
              </div>

              <a 
                href={doc.urlDestino}
                download={doc.esDescargaDirecta ? true : undefined}
                target={doc.esDescargaDirecta ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className={`w-full py-3.5 rounded-xl bg-[#0DEDC0] text-[#091A23] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.7)] transition-all duration-300 cursor-pointer ${ESTILOS_TEXTO.boton}`}
              >
                {doc.esDescargaDirecta ? (
                  <Download className="w-4 h-4" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
                <span>{doc.textoBoton}</span>
              </a>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}