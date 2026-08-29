'use client';

import React from 'react';
import { Kicker, H2, Subtitulo, ESTILOS_TEXTO, Highlight } from '@/app/complementos/Tipografia';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { useCMS } from '@/app/context/CMSContext';

interface Seccion6Props {
  variante?: TipoFondo;
}

export default function Seccion6({ variante = 'hexGrid' }: Seccion6Props) {
  const { cms } = useCMS();

  // Mapeo de datos dinámicos desde Firestore CMS con fallbacks
  const dataCierre = cms?.landing?.seccion6_cierre;
  const kickerTexto = dataCierre?.kicker || 'AUDITORÍA FINANCIERA';
  const tituloTexto = dataCierre?.titulo || 'ATOM no te cuesta dinero, te lo multiplica.';
  const subtituloTexto = dataCierre?.subtitulo || 'Nuestros proveedores recuperan en promedio un 15% de ganancia real que tenían perdida en la calle durante sus primeros 30 días de operación.';
  const ctaTexto = dataCierre?.cta_texto || 'VER CUÁNTO DINERO PUEDO RECUPERAR →';
  const ctaLink = dataCierre?.cta_link || 'https://atomapp.com.co/register';

  return (
    <section className="relative z-10 py-20 px-6 w-full overflow-hidden">
      
      {/* 1. FONDO EXTERIOR DE LA SECCIÓN */}
      <Fondos variante={variante} modo="absolute" />

      {/* 2. CAJÓN PRINCIPAL */}
      <div className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 border border-[#0DEDC0]/40 shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
        
        {/* FONDO INTERIOR DEL CAJÓN (Corregido a variante válida 'atomGreenDots') */}
        <Fondos variante="atomGreenDots" modo="absolute" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* COLUMNA IZQUIERDA: MENSAJE & CTA */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            <Kicker varianteFondo={variante} className="mb-3">
              {kickerTexto}
            </Kicker>

            <H2 varianteFondo={variante} className="text-balance mb-4">
              {tituloTexto}
            </H2>

            <Subtitulo varianteFondo={variante} className="max-w-xl mb-8 leading-relaxed font-medium">
              {subtituloTexto}
            </Subtitulo>

            <a 
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto inline-flex items-center justify-center bg-[#091A23] hover:bg-slate-800 text-white font-black px-8 py-4 rounded-xl shadow-[0_10px_25px_rgba(9,26,35,0.4)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer text-center gap-2 ${ESTILOS_TEXTO.boton}`}
            >
              {ctaTexto}
            </a>

          </div>

          {/* COLUMNA DERECHA: WIDGET ANIMADO DE RENTABILIDAD */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="w-full max-w-md bg-[#091A23]/95 backdrop-blur-md rounded-2xl p-6 border border-[#0DEDC0]/40 shadow-[0_20px_40px_rgba(0,0,0,0.4)] text-white space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#0DEDC0] uppercase tracking-wider block">
                    RECUPERACIÓN DE CAPITAL
                  </span>
                  <span className="text-sm font-black text-white block">
                    Incremento Neto de Margen
                  </span>
                </div>
                
                <span className="bg-[#0DEDC0]/10 text-[#0DEDC0] border border-[#0DEDC0]/30 text-xs font-mono font-black px-2.5 py-1 rounded-full animate-pulse shadow-[0_0_12px_rgba(13,237,192,0.3)]">
                  +15% ROI
                </span>
              </div>

              {/* GRÁFICO DE BARRAS CON ANIMACIÓN ESCALONADA */}
              <div className="flex items-end justify-between gap-3 h-44 pt-4 px-2">
                
                <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                  <div className="w-full bg-slate-800 group-hover:bg-slate-700 rounded-t-lg h-[25%] transition-all duration-300 animate-bar-rise [animation-delay:100ms] transform-gpu" />
                  <span className="text-[9px] font-mono text-slate-400 group-hover:text-slate-200 transition-colors">Sem 1</span>
                </div>

                <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                  <div className="w-full bg-[#6884C5]/40 group-hover:bg-[#6884C5]/70 rounded-t-lg h-[40%] transition-all duration-300 animate-bar-rise [animation-delay:250ms] transform-gpu" />
                  <span className="text-[9px] font-mono text-slate-400 group-hover:text-slate-200 transition-colors">Sem 2</span>
                </div>

                <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                  <div className="w-full bg-[#6884C5] group-hover:bg-[#8B5CF6] rounded-t-lg h-[60%] transition-all duration-300 animate-bar-rise [animation-delay:400ms] transform-gpu" />
                  <span className="text-[9px] font-mono text-slate-400 group-hover:text-slate-200 transition-colors">Sem 3</span>
                </div>

                <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                  <div className="w-full bg-gradient-to-t from-[#0DEDC0]/40 via-[#0DEDC0] to-white rounded-t-lg h-[95%] shadow-[0_0_20px_rgba(13,237,192,0.5)] group-hover:shadow-[0_0_30px_rgba(13,237,192,0.8)] group-hover:scale-y-[1.03] transition-all duration-300 relative animate-bar-rise [animation-delay:550ms] transform-gpu">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-black text-[#0DEDC0] animate-bounce [animation-duration:2s]">
                      ▲ MAX
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-[#0DEDC0] font-bold">Sem 4</span>
                </div>

              </div>

              <div className="bg-[#102935] p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#0DEDC0]/20 flex items-center justify-center text-[#0DEDC0] shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
                <p className="text-[11px] font-mono text-slate-300 leading-snug">
                  Blindaje automático contra mermas y fletes no retornados.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}