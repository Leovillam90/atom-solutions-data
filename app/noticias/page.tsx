'use client';

import React from 'react';
import Pagina1 from './paginas/Pagina1';
import Pagina2 from './paginas/Pagina2';
import Pagina3 from './paginas/Pagina3';

// SEPARADOR DE NEÓN ENTRE PÁGINAS DE NOTICIAS
function SeparadorNeon() {
  return (
    <div className="relative max-w-6xl mx-auto px-6 my-6 pointer-events-none">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#0DEDC0]/30 to-transparent" />
      <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rounded-full bg-[#0DEDC0] shadow-[0_0_10px_#0DEDC0] animate-pulse" />
    </div>
  );
}

export default function NoticiasPage() {
  return (
    <main className="min-h-screen bg-[#070B14] text-white w-full overflow-x-hidden font-sans">
      {/* 1. NOTICIA DESTACADA Y VISOR DE STORIES */}
      <Pagina1 variante="perspectiveGrid" />

      {/* 2. REJILLA DE ARTÍCULOS SECUNDARIOS Y CASOS DE ÉXITO */}
      <Pagina2 variante="perspectiveGrid" />

      {/* 3. CALL TO ACTION COMUNIDAD VIP DE WHATSAPP */}
      <Pagina3 variante="perspectiveGrid" />
    </main>
  );
}