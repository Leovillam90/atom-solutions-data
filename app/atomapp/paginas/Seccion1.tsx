'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Seccion1Props {
  variante?: 'gridCyber' | 'spotlightCyan' | 'hexGrid' | 'default';
}

export default function Seccion1({ variante = 'hexGrid' }: Seccion1Props) {
  const [cargando, setCargando] = useState<boolean>(true);

  // Mapeo de fondos estandarizados
  const fondos: Record<string, string> = {
    gridCyber: 'bg-[#070B14]',
    spotlightCyan: 'bg-[#091A23]',
    hexGrid: 'bg-[#070B14]',
    default: 'bg-[#091A23]',
  };

  const bgClase = fondos[variante] || fondos.default;

  return (
    <section className={`relative z-10 w-full h-screen h-[100dvh] ${bgClase} flex flex-col overflow-hidden font-sans antialiased`}>
      
      {/* KEYFRAMES PARA EL NEÓN DEL ICONO Y EL BARRIDO DE LUZ DE LA LÍNEA */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes neonGlow {
          0%, 100% {
            filter: drop-shadow(0 0 4px #0DEDC0) drop-shadow(0 0 12px rgba(13,237,192,0.6));
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 8px #0DEDC0) drop-shadow(0 0 24px rgba(13,237,192,0.9));
            transform: scale(1.08);
          }
        }
        @keyframes borderLightSweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-neon-pulse {
          animation: neonGlow 2.5s infinite ease-in-out;
        }
        .animate-border-sweep {
          animation: borderLightSweep 4s linear infinite;
        }
      ` }} />

      {/* BARRA SUPERIOR CON ICONO 2D CENTRADO */}
      <header className="relative z-30 shrink-0 bg-[#091A23] px-4 sm:px-6 py-2.5 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        
        <Link
          href="/"
          title="Volver al Inicio"
          className="group flex items-center justify-center p-2 rounded-xl bg-[#102935]/80 border border-[#0DEDC0]/30 hover:border-[#0DEDC0] transition-all hover:bg-[#0DEDC0]/10"
        >
          {/* ICONO 2D NEÓN */}
          <div className="animate-neon-pulse transition-transform duration-300 group-hover:scale-125">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#0DEDC0" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
        </Link>

        {/* LÍNEA DIVISORIA INFERIOR ANIMADA CON BARRIDO DE COLORES */}
        <div 
          className="absolute bottom-0 inset-x-0 h-[2px] z-20 bg-[linear-gradient(90deg,transparent_0%,#0DEDC0_50%,#6884C5_75%,transparent_100%)] bg-[length:200%_100%] animate-border-sweep"
        />

      </header>

      {/* CONTENEDOR DEL IFRAME */}
      <div className={`relative z-10 flex-1 w-full h-full ${bgClase} overflow-hidden`}>
        
        {/* SPINNER DE CARGA */}
        {cargando && (
          <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center ${bgClase} p-4 gap-4`}>
            <div className="w-10 h-10 border-4 border-[#0DEDC0] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono text-[#0DEDC0] tracking-widest uppercase text-center">
              Estableciendo enlace seguro con atomapp.com.co...
            </p>
          </div>
        )}

        {/* PLATAFORMA ATOM */}
        <iframe
          src="https://atomapp.com.co/login"
          title="ATOM App Portal"
          className="w-full h-full border-0 block"
          onLoad={() => setCargando(false)}
          allow="geolocation; microphone; camera; clipboard-write; encrypted-media"
        />
      </div>
      
    </section>
  );
}