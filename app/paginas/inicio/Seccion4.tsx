'use client';

import React from 'react';
import Fondos, { TipoFondo } from '../../complementos/Fondos';
import { Kicker } from '../../complementos/Tipografia';

interface Seccion4Props {
  variante?: TipoFondo;
}

// Data y listas de validación estáticas fuera del componente
const FONDOS_CLAROS: TipoFondo[] = ['pureWhite' as TipoFondo, 'light' as TipoFondo, 'greenGridLight' as TipoFondo, 'greenDotsLight' as TipoFondo];

const METRICAS = [
  {
    valor: '$4.5M+',
    kicker: 'CAPITAL PROTEGIDO',
    colorClaro: 'text-[#059669]',
    colorOscuro: 'text-[#0DEDC0]'
  },
  {
    valor: '99.9%',
    kicker: 'TRAZABILIDAD FINANCIERA',
    colorClaro: 'text-slate-900',
    colorOscuro: 'text-white'
  },
  {
    valor: '15K+',
    kicker: 'GUÍAS AUDITADAS AL DÍA',
    colorClaro: 'text-[#2563EB]',
    colorOscuro: 'text-[#6884C5]'
  }
];

export default function Seccion4({ variante = 'gridCyber' }: Seccion4Props) {
  const esClaro = FONDOS_CLAROS.includes(variante);

  return (
    <section className="relative z-10 py-16 lg:py-20 px-6 overflow-hidden border-b border-[#0DEDC0]/10">
      <Fondos variante={variante} modo="absolute" />

      {/* BORDES LUMINOSOS SUPERIOR E INFERIOR (Uso de CSS global) */}
      <div className="absolute top-0 inset-x-0 h-[2px] z-20 bg-[linear-gradient(90deg,transparent_0%,#0DEDC0_50%,#6884C5_75%,transparent_100%)] bg-[length:200%_100%] animate-border-sweep" />
      <div className="absolute bottom-0 inset-x-0 h-[2px] z-20 bg-[linear-gradient(90deg,transparent_0%,#6884C5_25%,#0DEDC0_50%,transparent_100%)] bg-[length:200%_100%] animate-border-sweep" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-around items-center gap-10 text-center">
        {METRICAS.map((metrica, idx) => (
          <div key={idx} className="flex-1 w-full max-w-[280px]">
            <div className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none ${
              esClaro ? metrica.colorClaro : metrica.colorOscuro
            }`}>
              {metrica.valor}
            </div>
            <Kicker className={`!text-xs mt-3 !mb-0 ${
              esClaro ? '!text-slate-600' : '!text-slate-400'
            }`}>
              {metrica.kicker}
            </Kicker>
          </div>
        ))}
      </div>
    </section>
  );
}