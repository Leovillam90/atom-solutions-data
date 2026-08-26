'use client';

import React from 'react';
import Seccion1 from './paginas/Seccion1';
import Seccion2 from './paginas/Seccion2';
import Seccion3 from './paginas/Seccion3';

export default function NoticiasPage() {
  return (
    <main className="min-h-screen bg-[#0B171C] text-white">
      <Seccion1 variante="darkNoise" />
      <Seccion2 variante="darkNoise" /> 
      <Seccion3 variante="darkNoise" />
    </main>
  );
}