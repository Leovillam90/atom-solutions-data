'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Seccion1 from './paginas/Seccion1';
import Seccion2 from './paginas/Seccion2';

export default function CalculadoraBasicaPage() {
  const router = useRouter();

  const irAAvanzada = () => {
    // Redirige a la calculadora avanzada (/calculadora) que solicitará registro
    router.push('/calculadora'); 
  };

  return (
    <main className="min-h-screen bg-[#070B14] w-full overflow-x-hidden">
      {/* SECCIÓN 1: SIMULADOR BÁSICO DE RENTABILIDAD */}
      <Seccion1 variante="hexGrid" />

      {/* SECCIÓN 2: EDITORIAL ESTRATÉGICO & CTA DE DESBLOQUEO */}
      <Seccion2 variante="hexGrid" 
        onSolicitarAvanzada={irAAvanzada} 
      />
    </main>
  );
}