'use client';

import React from 'react';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';

interface Seccion2Props {
  variante?: TipoFondo;
}

export default function Seccion2({ variante = 'gridCyber' }: Seccion2Props) {
  const paises = [
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
  const paisesDobles = [...paises, ...paises];

  return (
    <section className="relative z-10 py-9 overflow-hidden">
      
      {/* CAPA DE FONDO DINÁMICO */}
      <Fondos variante={variante} modo="absolute" />

      {/* KEYFRAMES DE ANIMACIÓN */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes borderLightSweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marqueeScroll 30s linear infinite;
        }
        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }
      ` }} />

      {/* BORDES LUMINOSOS SUPERIOR E INFERIOR */}
      <div 
        className="absolute top-0 inset-x-0 h-[1.5px] z-20 bg-[linear-gradient(90deg,transparent_0%,#0DEDC0_50%,#6884C5_75%,transparent_100%)] bg-[length:200%_100%]"
        style={{ animation: 'borderLightSweep 5s linear infinite' }} 
      />
      <div 
        className="absolute bottom-0 inset-x-0 h-[1.5px] z-20 bg-[linear-gradient(90deg,transparent_0%,#6884C5_25%,#0DEDC0_50%,transparent_100%)] bg-[length:200%_100%]"
        style={{ animation: 'borderLightSweep 5s linear infinite' }} 
      />

      {/* MARQUEE CONTINUO DE PAÍSES */}
      <div className="relative z-10 marquee-container w-full overflow-hidden whitespace-nowrap flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="marquee-track flex gap-6 items-center will-change-transform">
          {paisesDobles.map((item, idx) => (
            <div 
              key={`${item.code}-${idx}`} 
              className="flex items-center gap-2.5 bg-[#091A23]/80 border border-[#0DEDC0]/30 px-4.5 py-2 rounded-full backdrop-blur-md shrink-0 transition-all duration-300 hover:border-[#0DEDC0] hover:shadow-[0_0_15px_rgba(13,237,192,0.4)] hover:-translate-y-0.5"
            >
              <img 
                src={`https://flagcdn.com/w40/${item.code}.png`} 
                alt={`Bandera de ${item.nombre}`} 
                className="w-5 h-auto rounded-[3px] shadow-md block" 
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