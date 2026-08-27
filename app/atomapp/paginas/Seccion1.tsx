'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Seccion1Props {
  variante?: 'gridCyber' | 'spotlightCyan' | 'hexGrid' | 'default';
}

const FONDOS_MAP: Record<string, string> = {
  gridCyber: 'bg-[#070B14]',
  spotlightCyan: 'bg-[#091A23]',
  hexGrid: 'bg-[#070B14]',
  default: 'bg-[#091A23]',
};

const ATOM_APP_URL = 'https://atomapp.com.co/login';

export default function Seccion1({ variante = 'hexGrid' }: Seccion1Props) {
  const [cargando, setCargando] = useState<boolean>(true);
  const [mostrarBotonExterno, setMostrarBotonExterno] = useState<boolean>(false);

  const bgClase = FONDOS_MAP[variante] || FONDOS_MAP.default;

  // Temporizador de cortesía: Si el iframe no responde en 6s, ofrece el link directo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (cargando) {
        setMostrarBotonExterno(true);
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [cargando]);

  return (
    <section className={`relative z-10 w-full h-screen h-[100dvh] ${bgClase} flex flex-col overflow-hidden font-sans antialiased`}>
      
      {/* BARRA SUPERIOR DE CONTROL */}
      <header className="relative z-30 shrink-0 bg-[#091A23] px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-[#0DEDC0]/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        
        {/* RETORNO A LA LANDING */}
        <Link
          href="/"
          title="Volver a la Web Principal"
          className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#102935]/80 border border-[#0DEDC0]/30 hover:border-[#0DEDC0] transition-all hover:bg-[#0DEDC0]/10 cursor-pointer"
        >
          <div className="transition-transform duration-300 group-hover:-translate-x-0.5">
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#0DEDC0" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="text-xs font-mono font-bold text-[#0DEDC0] hidden sm:inline">
            Volver a ATOM
          </span>
        </Link>

        {/* INDICADOR DE ESTADO */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#0DEDC0] animate-pulse" />
          <span className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
            Portal Operativo ATOM
          </span>
        </div>

        {/* BOTÓN RESCATE PESTAÑA INDEPENDIENTE */}
        <a
          href={ATOM_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Abrir en ventana completa"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#102935]/60 border border-slate-700 hover:border-[#0DEDC0] text-slate-300 hover:text-white text-xs font-mono font-semibold transition-all cursor-pointer"
        >
          <span className="hidden sm:inline">Pestaña Nueva</span>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>

        {/* LÍNEA DIVISORIA CON ILUMINACIÓN */}
        <div className="absolute bottom-0 inset-x-0 h-[1.5px] z-20 bg-[linear-gradient(90deg,transparent_0%,#0DEDC0_50%,#6884C5_75%,transparent_100%)] bg-[size:200%_100%] animate-border-sweep" />
      </header>

      {/* CONTENEDOR DEL IFRAME */}
      <div className={`relative z-10 flex-1 w-full h-full ${bgClase} overflow-hidden`}>
        
        {/* PANTALLA Y SPINNER DE CARGA */}
        {cargando && (
          <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center ${bgClase} p-6 gap-4 text-center`}>
            <div className="w-11 h-11 border-4 border-[#0DEDC0] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(13,237,192,0.3)]" />
            
            <div className="space-y-1">
              <p className="text-xs font-mono text-[#0DEDC0] tracking-widest uppercase font-bold">
                Estableciendo enlace seguro con atomapp.com.co...
              </p>
              <p className="text-[11px] font-sans text-slate-400 max-w-sm">
                Conectando plataforma e inventarios en tiempo real.
              </p>
            </div>

            {mostrarBotonExterno && (
              <div className="mt-4 p-4 rounded-2xl bg-[#090D16] border border-amber-500/40 text-amber-300 text-xs space-y-2 max-w-md animate-fade-in">
                <p>¿Tu navegador restringe cookies dentro de un marco?</p>
                <a
                  href={ATOM_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-amber-500 text-[#090D16] font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-white transition-all cursor-pointer"
                >
                  Abrir App Directamente →
                </a>
              </div>
            )}
          </div>
        )}

        {/* PLATAFORMA ATOM EMBEDDED */}
        <iframe
          src={ATOM_APP_URL}
          title="ATOM App Portal"
          className="w-full h-full border-0 block"
          onLoad={() => setCargando(false)}
          allow="geolocation; microphone; camera; clipboard-write; encrypted-media; autoplay; storage-access"
          referrerPolicy="origin-when-cross-origin"
        />
      </div>
      
    </section>
  );
}