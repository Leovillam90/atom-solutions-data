'use client';

import React from 'react';
import Pagina1 from './pagina/Pagina1';
import Pagina2 from './pagina/Pagina2';

export default function SimuladorPage() {
  return (
    <main className="min-h-screen bg-[#070B14] w-full overflow-x-hidden font-sans">
      
      {/* SECCIÓN 1: SIMULADOR BÁSICO PROVEEDOR / DROPSHIPPER */}
      <Pagina1 variante="perspectiveGrid" />

      {/* ⚡ SEPARADOR NEÓN CON PUNTO LUMINOSO CENTRAL */}
      <div className="relative max-w-6xl mx-auto px-6 my-8 flex items-center justify-center pointer-events-none">
        {/* Línea en degradado neón */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#0DEDC0]/40 to-transparent" />
        
        {/* Punto luminoso central de neón ATOM */}
        <div className="absolute w-2.5 h-2.5 rounded-full bg-[#0DEDC0] shadow-[0_0_12px_#0DEDC0] border border-white/60 animate-pulse" />
      </div>

      {/* SECCIÓN 2: EDITORIAL DE VARIABLES OMITIDAS & CTA */}
      <Pagina2 variante="perspectiveGrid" />

    </main>
  );
}