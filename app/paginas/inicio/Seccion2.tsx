'use client';

import React from 'react';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';

interface Seccion2Props {
  variante?: TipoFondo;
}

const PAISES = [
  { nombre: 'Colombia', code: 'co' },
  { nombre: 'Ecuador', code: 'ec' },
  { nombre: 'México', code: 'mx' },
  { nombre: 'Paraguay', code: 'py' },
  { nombre: 'Perú', code: 'pe' },
  { nombre: 'Chile', code: 'cl' },
  { nombre: 'Panamá', code: 'pa' },
  { nombre: 'Guatemala', code: 'gt' },
  { nombre: 'Brasil', code: 'br' },
  { nombre: 'Argentina', code: 'ar' },
  { nombre: 'Venezuela', code: 've' },
];

const PAISES_DOBLES = [...PAISES, ...PAISES];

export default function Seccion2({ variante = 'gridCyber' }: Seccion2Props) {
  return (
    <section className="relative z-10 py-10 overflow-hidden bg-[#091A23]">
      <Fondos variante={variante} modo="absolute" />

      {/* BORDES LUMINOSOS SUPERIOR E INFERIOR */}
      <div className="absolute top-0 inset-x-0 h-[2px] z-20 bg-[linear-gradient(90deg,transparent_0%,#0DEDC0_50%,#6884C5_75%,transparent_100%)] bg-[length:200%_100%] animate-border-sweep" />
      <div className="absolute bottom-0 inset-x-0 h-[2px] z-20 bg-[linear-gradient(90deg,transparent_0%,#6884C5_25%,#0DEDC0_50%,transparent_100%)] bg-[length:200%_100%] animate-border-sweep" />

      {/* MARQUEE CONTINUO DE PAÍSES */}
      <div className="relative z-10 marquee-container w-full overflow-hidden whitespace-nowrap flex pointer-events-none [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-2">
        <div className="marquee-track flex gap-6 items-center">
          {PAISES_DOBLES.map((item, idx) => (
            <div 
              key={`${item.code}-${idx}`} 
              className="flex items-center gap-2.5 bg-[#091A23]/90 border border-[#0DEDC0]/30 px-4 py-2 rounded-full backdrop-blur-md shrink-0 shadow-lg"
            >
              <img 
                src={`https://flagcdn.com/w40/${item.code}.png`} 
                alt={`Bandera de ${item.nombre}`} 
                className="w-5 h-auto rounded-[3px] shadow-md block" 
                loading="lazy"
                decoding="async"
              />
              <span className="text-xs font-black text-white tracking-widest uppercase font-mono">
                {item.nombre}
              </span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}