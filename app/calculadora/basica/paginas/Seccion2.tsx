'use client';

import React from 'react';
import { ESTILOS_TEXTO } from '@/app/complementos/Tipografia';
import { TipoFondo } from '@/app/complementos/Fondos';

interface Seccion2Props {
  variante?: TipoFondo;
  onSolicitarAvanzada?: () => void;
}

export default function Seccion2({ variante = 'hexGrid', onSolicitarAvanzada }: Seccion2Props) {
  return (
    <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden w-full border-b border-[#0DEDC0]/10 text-white">
      
      {/* ESTILOS DE ANIMACIÓN DE LUZ EN EL BOTÓN */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmerSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer {
          animation: shimmerSweep 2.5s infinite ease-in-out;
        }
      ` }} />

      {/* RESPLANDOR NEÓN AMBIENTAL LOCAL */}
      <div className="absolute -inset-4 bg-gradient-to-r from-[#0DEDC0]/15 via-transparent to-[#6884C5]/15 rounded-3xl blur-3xl pointer-events-none" />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="relative z-10 max-w-6xl mx-auto space-y-10">
        
        {/* TARJETAS DE VARIABLES CRÍTICAS OMITIDAS (ENFOQUE PROVEEDOR / AVANZADO) */}
        <div className="space-y-4">
          <span className="text-white font-extrabold block text-xs sm:text-sm font-mono tracking-wider uppercase">
            Variables críticas omitidas en la versión básica:
          </span>
          
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm font-mono text-slate-200 p-0 list-none">
            
            {/* VARIABLE 1: IMPUESTOS */}
            <li className="flex items-center gap-3 bg-[#0C1824] p-4 rounded-xl border border-red-500/40 shadow-lg hover:border-red-400 transition-colors">
              <span className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-400/50 flex items-center justify-center text-red-400 shrink-0 font-bold">
                ✕
              </span>
              <span>Impacto Fiscal y Retenciones <strong className="text-white block font-bold">(IVA, ICA, 4x1000)</strong></span>
            </li>

            {/* VARIABLE 2: FLUJO DE CAJA / WALLET */}
            <li className="flex items-center gap-3 bg-[#0C1824] p-4 rounded-xl border border-red-500/40 shadow-lg hover:border-red-400 transition-colors">
              <span className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-400/50 flex items-center justify-center text-red-400 shrink-0 font-bold">
                ✕
              </span>
              <span>Capital Inmovilizado <strong className="text-white block font-bold">(Retención de Wallet)</strong></span>
            </li>

            {/* VARIABLE 3: COSTOS OCULTOS DE BODEGAJE */}
            <li className="flex items-center gap-3 bg-[#0C1824] p-4 rounded-xl border border-red-500/40 shadow-lg hover:border-red-400 transition-colors">
              <span className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-400/50 flex items-center justify-center text-red-400 shrink-0 font-bold">
                ✕
              </span>
              <span>Costos Ocultos WaaS <strong className="text-white block font-bold">(Almacenaje y Picking)</strong></span>
            </li>

            {/* VARIABLE 4: DESTRUCCIÓN TOTAL */}
            <li className="flex items-center gap-3 bg-[#0C1824] p-4 rounded-xl border border-red-500/40 shadow-lg hover:border-red-400 transition-colors">
              <span className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-400/50 flex items-center justify-center text-red-400 shrink-0 font-bold">
                ✕
              </span>
              <span>Mermas Logísticas <strong className="text-white block font-bold">(Abandono y Destrucción)</strong></span>
            </li>

          </ul>
        </div>

        {/* ========================================== */}
        {/* ÚNICO CUADRO DESTACADO: CTA TÁCTICO         */}
        {/* ========================================== */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F2D3A] via-[#0B1E28] to-[#07131B] p-6 sm:p-8 lg:p-10 border-2 border-[#0DEDC0] shadow-[0_0_50px_rgba(13,237,192,0.25)]">
          
          {/* HALO NEÓN SUPERIOR */}
          <div className="absolute -top-16 -right-16 w-60 h-50 bg-[#0DEDC0]/25 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            
            {/* TEXTO Y BADGES */}
            <div className="space-y-4 max-w-2xl">
              
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-black uppercase tracking-wider bg-[#0DEDC0]/20 text-[#0DEDC0] border border-[#0DEDC0]/60 px-3 py-1 rounded-md shadow-[0_0_12px_rgba(13,237,192,0.3)]">
                  ⚡ Acceso Inmediato
                </span>

                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-800 text-slate-200 border border-slate-600 px-3 py-1 rounded-md">
                  🔒 Sin Tarjeta de Crédito
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug m-0">
                Lleva el control de tu operación al siguiente nivel financiero.
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed m-0">
                Desbloquea el Simulador Avanzado ATOM para proyectar tu flujo de caja real, calcular retenciones fiscales y auditar el verdadero costo de tu operación B2B.
              </p>
            </div>

            {/* BOTÓN CON SHIMMER & GLOW */}
            <div className="w-full lg:w-auto shrink-0 space-y-2">
              <button
                type="button"
                onClick={onSolicitarAvanzada}
                className={`group/btn relative w-full lg:w-auto bg-[#0DEDC0] hover:bg-white text-[#061217] font-black py-4 px-8 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_30px_rgba(13,237,192,0.6)] hover:shadow-[0_0_40px_rgba(255,255,255,0.9)] cursor-pointer text-center flex items-center justify-center gap-3 overflow-hidden ${ESTILOS_TEXTO.boton}`}
              >
                <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 animate-shimmer pointer-events-none" />
                
                <span className="relative z-10 flex items-center gap-2">
                  Desbloquear Simulador Avanzado
                  <svg 
                    className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </button>

              <span className="block text-center lg:text-right text-[10px] font-mono text-slate-400 font-medium">
                Activación en 2 clics · Cero instalación
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}