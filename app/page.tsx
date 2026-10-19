// src/app/page.tsx
import React from 'react';
import dynamic from 'next/dynamic';
import Seccion1 from './landing/Seccion1'; // Hero principal: carga inmediata (Above the fold)

// =========================================================================
// CARGA DIFERIDA (CODE-SPLITTING): NO BLOQUEAN EL RENDER INICIAL EN CELULARES
// =========================================================================
const ExitIntentModal = dynamic(() => import('@/app/complementos/ExitIntentModal'));
const Seccion2 = dynamic(() => import('./landing/Seccion2'));
const Seccion3 = dynamic(() => import('./landing/Seccion3'));
const Seccion4 = dynamic(() => import('./landing/Seccion4'));
const Seccion5 = dynamic(() => import('./landing/Seccion5'));
const Seccion6 = dynamic(() => import('./landing/Seccion6'));

export const metadata = {
  title: 'ATOM PRO · E-commerce Intelligence',
  description: 'Control de logística, rentabilidad y auditoría de capital en tiempo real.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070B14] w-full overflow-x-hidden">
      
      {/* RECEPTOR DE INTENTO DE SALIDA DE TRÁFICO (ASÍNCRONO) */}
      <ExitIntentModal />

      {/* SECCIÓN 1: HERO PRINCIPAL (MÁXIMA PRIORIDAD VISUAL EN MÓVILES) */}
      <Seccion1 variante="perspectiveGrid" />

      {/* SECCIÓN 2: MARQUEE PAÍSES LATAM */}
      <Seccion2 variante="spotlightCyan" />

      {/* SECCIÓN 3: DIAGNÓSTICO OPERATIVO */}
      <Seccion3 variante="perspectiveGrid" />

      {/* SECCIÓN 4: MÉTRICAS DE CAPITAL PROTEGIDO */}
      <Seccion4 variante="spotlightCyan" />

      {/* SECCIÓN 5: TABLA DE PRECIOS E INVERSIÓN */}
      <Seccion5 variante="perspectiveGrid" />

      {/* SECCIÓN 6: CIERRE ESTRATÉGICO & WIDGET DE ROI */}
      <Seccion6 variante="perspectiveGrid" />

    </div>
  );
}