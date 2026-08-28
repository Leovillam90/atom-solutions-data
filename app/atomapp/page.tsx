'use client';

import React from 'react';
import Pagina1 from './paginas/Pagina1';

export default function AtomAppPage() {
  return (
    <div className="fixed inset-0 w-screen h-screen h-[100dvh] bg-[#070B14] overflow-hidden z-[99999]">
      <Pagina1 variante="hexGrid" />
    </div>
  );
}