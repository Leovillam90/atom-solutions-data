'use client';

import React from 'react';
import Pagina1 from './paginas/Pagina1';
import Pagina2 from './paginas/Pagina2';

export default function AcademyPage() {
  return (
    <main className="min-h-screen bg-[#070B14] text-white w-full overflow-x-hidden font-sans">
      
      {/* 1. CENTRO DE LECCIONES EN VIDEO INTERACTIVAS */}
      <Pagina1 variante="perspectiveGrid" />

      {/* 2. BIBLIOTECA DE RECURSOS, PROTOCOLOS Y DOCUMENTACIÓN */}
      <Pagina2 variante="perspectiveGrid" />

    </main>
  );
}