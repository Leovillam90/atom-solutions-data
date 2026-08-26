'use client';

import React from 'react';
import Seccion1 from './paginas/Seccion1';
import Seccion2 from './paginas/Seccion2';

export default function AcademyPage() {
  return (
    <main className="min-h-screen bg-[#0B171C] text-white">
      <Seccion1 variante="auroraBoreal" />
      <Seccion2 variante="cyanSolidDots" />
    </main>
  );
}