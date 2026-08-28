// app/calculadora/basica/page.tsx

'use client';

import React from 'react';
import Seccion1 from './paginas/Seccion1';
import Seccion2 from './paginas/Seccion2';

export default function CalculadoraBasicaPage() {
  return (
    <main className="min-h-screen bg-[#070B14] w-full overflow-x-hidden">
      {/* SECCIÓN 1: SIMULADOR BÁSICO DE RENTABILIDAD (PROVEEDOR / DROPSHIPPER) */}
      <Seccion1 variante="hexGrid" />

      {/* SECCIÓN 2: EDITORIAL ESTRATÉGICO & CTA DE DESBLOQUEO */}
      <Seccion2 variante="hexGrid" />
    </main>
  );
}