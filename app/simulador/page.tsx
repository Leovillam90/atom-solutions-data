'use client';

import React from 'react';
import Pagina1 from './pagina/Pagina1';
import Pagina2 from './pagina/Pagina2';

export default function simulador() {
  return (
    <main className="min-h-screen bg-[#070B14] w-full overflow-x-hidden">
      {/* SECCIÓN 1: SIMULADOR BÁSICO PROVEEDOR / DROPSHIPPER */}
      <Pagina1 variante="hexGrid" />

      {/* ⚡ SEPARADOR NEÓN CON PUNTO LUMINOSO CENTRAL */}
      <div className="relative max-w-6xl mx-auto px-6 my-6">
  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#0DEDC0]/30 to-transparent" />
</div>

      {/* SECCIÓN 2: EDITORIAL DE VARIABLES OMITIDAS & CTA */}
      <Pagina2 variante="hexGrid" />
    </main>
  );
}