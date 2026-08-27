'use client';

import React from 'react';
import { Kicker, H2, H3, Subtitulo, Texto, Highlight } from '@/app/complementos/Tipografia';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';

interface Seccion3Props {
  variante?: TipoFondo;
}

export default function Seccion3({ variante = 'gridCyber' }: Seccion3Props) {
  return (
    <section className="relative z-10 py-20 px-6 overflow-hidden">
      
      {/* CAPA DE FONDO DINÁMICO */}
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="text-center mb-16">
          <Kicker>DIAGNÓSTICO OPERATIVO</Kicker>

          <H2 className="text-balance">
            ¿Cuánto capital <Highlight>dejaste estancado</Highlight> este mes?
          </H2>

          <Subtitulo className="max-w-[720px] mx-auto mt-3">
            El descontrol logístico no es un error de cálculo, es la pérdida directa de tu dinero.
          </Subtitulo>
        </div>

        {/* PARRILLA DE DOLORES (3 COLUMNAS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* TARJETA 1 */}
          <div className="bg-[#102935]/50 border border-[#0DEDC0]/20 rounded-2xl p-8 backdrop-blur-md transition-all duration-300 hover:border-[#0DEDC0]/60 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(13,237,192,0.15)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 mb-5 border border-red-500/20">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <H3 className="mb-3">Descontrol de Guías</H3>
              <Texto className="mb-6">
                Dejas de rastrear el estado real de tus envíos y las devoluciones que jamás reingresan a tus estantes. Al no auditar en tiempo real, tu bodega asume pérdidas netas mes a mes en silencio.
              </Texto>
            </div>
            
            <a 
              href="https://atomapp.com.co/register" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="border-t border-white/10 pt-3.5 text-[#0DEDC0] text-xs sm:text-sm font-bold block hover:underline"
            >
              Radar de auditoría en tiempo real → 
            </a>
          </div>

          {/* TARJETA 2 */}
          <div className="bg-[#102935]/50 border border-[#0DEDC0]/20 rounded-2xl p-8 backdrop-blur-md transition-all duration-300 hover:border-[#0DEDC0]/60 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(13,237,192,0.15)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 mb-5 border border-red-500/20">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <H3 className="mb-3">Novedades Manuales</H3>
              <Texto className="mb-6">
                Pierdes horas al día chateando con soporte Dropi y transportadoras para destrabar envíos uno por uno. Sin una automatización que tome el control en tiempo real, las soluciones llegan tarde, las guías se marcan como devueltas y tu bodega absorbe el costo de la ineficiencia.
              </Texto>
            </div>
            
            <a 
              href="https://atomapp.com.co/register" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="border-t border-white/10 pt-3.5 text-[#0DEDC0] text-xs sm:text-sm font-bold block hover:underline"
            >
              Sistema de resolución automatizado → 
            </a>
          </div>

          {/* TARJETA 3 */}
          <div className="bg-[#102935]/50 border border-[#0DEDC0]/20 rounded-2xl p-8 backdrop-blur-md transition-all duration-300 hover:border-[#0DEDC0]/60 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(13,237,192,0.15)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 mb-5 border border-red-500/20">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <H3 className="mb-3">Márgenes a Ciegas</H3>
              <Texto className="mb-6">
                Adivinas tu ganancia real sin conocer el costo exacto de la mercancía no devuelta. Al calcular tu utilidad sobre el precio de lista y no sobre despachos efectivos, absorbes mermas invisibles que devoran tu margen neto mes a mes.
              </Texto>
            </div>
            
            <a 
              href="https://atomapp.com.co/register" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="border-t border-white/10 pt-3.5 text-[#0DEDC0] text-xs sm:text-sm font-bold block hover:underline"
            >
              Tablero exacto de ROI operativo → 
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}