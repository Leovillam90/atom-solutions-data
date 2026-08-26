'use client';

import React from 'react';
// Importaciones relativas directas
import Fondos, { TipoFondo } from '../../complementos/Fondos';
import { Kicker } from '../../complementos/Tipografia';

interface Seccion4Props {
  variante?: TipoFondo;
}

export default function Seccion4({ variante = 'gridCyber' }: Seccion4Props) {
  // Detecta automáticamente si el fondo seleccionado es de tonalidad clara
  const esClaro = ['pureWhite', 'light', 'greenGridLight', 'greenDotsLight'].includes(variante);

  return (
    <section className="relative z-10 py-16 lg:py-20 px-6 overflow-hidden border-b border-[#0DEDC0]/10">
      
      {/* KEYFRAMES DE ANIMACIÓN DE BORDES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes borderLightSweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      ` }} />

      {/* CAPA DE FONDO DINÁMICO */}
      <Fondos variante={variante} modo="absolute" />

      {/* BORDES CON BARRIDO DE LUZ (SUPERIOR E INFERIOR) */}
      <div 
        className="absolute top-0 inset-x-0 h-[2px] z-20 bg-[linear-gradient(90deg,transparent_0%,#0DEDC0_50%,#6884C5_75%,transparent_100%)] bg-[length:200%_100%]"
        style={{ animation: 'borderLightSweep 4s linear infinite' }} 
      />
      <div 
        className="absolute bottom-0 inset-x-0 h-[2px] z-20 bg-[linear-gradient(90deg,transparent_0%,#6884C5_25%,#0DEDC0_50%,transparent_100%)] bg-[length:200%_100%]"
        style={{ animation: 'borderLightSweep 4s linear infinite' }} 
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-around items-center gap-10 text-center">
        
        {/* MÉTRICA 1 */}
        <div className="flex-1 w-full max-w-[280px]">
          <div className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none ${
            esClaro ? 'text-[#059669]' : 'text-[#0DEDC0]'
          }`}>
            $4.5M+
          </div>
          <Kicker className={`!text-xs mt-3 !mb-0 ${
            esClaro ? '!text-slate-600' : '!text-slate-400'
          }`}>
            CAPITAL PROTEGIDO
          </Kicker>
        </div>

        {/* MÉTRICA 2 */}
        <div className="flex-1 w-full max-w-[280px]">
          <div className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none ${
            esClaro ? 'text-slate-900' : 'text-white'
          }`}>
            99.9%
          </div>
          <Kicker className={`!text-xs mt-3 !mb-0 ${
            esClaro ? '!text-slate-600' : '!text-slate-400'
          }`}>
            TRAZABILIDAD FINANCIERA
          </Kicker>
        </div>

        {/* MÉTRICA 3 */}
        <div className="flex-1 w-full max-w-[280px]">
          <div className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none ${
            esClaro ? 'text-[#2563EB]' : 'text-[#6884C5]'
          }`}>
            15K+
          </div>
          <Kicker className={`!text-xs mt-3 !mb-0 ${
            esClaro ? '!text-slate-600' : '!text-slate-400'
          }`}>
            GUÍAS AUDITADAS AL DÍA
          </Kicker>
        </div>

      </div>
    </section>
  );
}