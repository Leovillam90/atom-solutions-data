'use client';

import React from 'react';
import Seccion1 from './landing/Seccion1';
import Seccion2 from './landing/Seccion2';
import Seccion3 from './landing/Seccion3';
import Seccion4 from './landing/Seccion4';
import Seccion5 from './landing/Seccion5';
import Seccion6 from './landing/Seccion6';
import ExitIntentModal from '@/app/complementos/ExitIntentModal'; // 👈 Importación del modal

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070B14] w-full overflow-x-hidden">
      
      {/* RECEPTOR DE INTENTO DE SALIDA DE TRÁFICO (META ADS) */}
      <ExitIntentModal />

      {/* SECCIÓN 1: HERO PRINCIPAL */}
      <Seccion1 variante="atomDynamicGradient" />

      {/* SECCIÓN 2: MARQUEE PAÍSES LATAM */}
      <Seccion2 variante="circuitBoard" />

      {/* SECCIÓN 3: DIAGNÓSTICO OPERATIVO */}
      <Seccion3 variante="perspectiveGrid" />

      {/* SECCIÓN 4: MÉTRICAS DE CAPITAL PROTEGIDO */}
      <Seccion4 variante="vignetteDark" />

      {/* SECCIÓN 5: TABLA DE PRECIOS E INVERSIÓN */}
      <Seccion5 variante="spotlightCyan" />

      {/* SECCIÓN 6: CIERRE ESTRATÉGICO & WIDGET DE ROI */}
      <Seccion6 variante="hexGrid" />

    </div>
  );
}