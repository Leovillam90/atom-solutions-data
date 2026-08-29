'use client';

import React from 'react';
import Pagina1 from './pagina/Pagina1';
import Pagina2 from './pagina/Pagina2';

export default function SimuladorPage() {
  return (
    <main className="min-h-screen bg-[#070B14] w-full overflow-x-hidden font-sans">
      
      {/* SECCIÓN 1: SIMULADOR INTERACTIVO PROVEEDOR / DROPSHIPPER */}
      <Pagina1 variante="perspectiveGrid" />

      {/* SECCIÓN 2: VARIABLES OMITIDAS & CTA AVANZADO */}
      <Pagina2 variante="perspectiveGrid" />

    </main>
  );
}