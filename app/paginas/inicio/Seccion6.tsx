'use client';

import React from 'react';
import { Kicker, Subtitulo, ESTILOS_TEXTO } from '../../complementos/Tipografia';
import Fondos, { TipoFondo } from '../../complementos/Fondos';

interface Seccion6Props {
  variante?: TipoFondo;
}

export default function Seccion6({ variante = 'cyanSolidOnly' }: Seccion6Props) {
  return (
    <section className="relative z-10 py-10 sm:py-16 lg:py-20 px-4 sm:px-6 overflow-hidden border-b border-[#091A23]/15 text-center w-full">
      
      {/* CAPA DE FONDO VERDE CIAN SÓLIDO */}
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center w-full">
        
        {/* ETIQUETA SUPERIOR */}
        <Kicker className="!text-[#0F172A] !bg-transparent !border-transparent !p-0 text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-3 sm:mb-4">
          AUDITORÍA FINANCIERA
        </Kicker>

        {/* TÍTULO PRINCIPAL (Ajustado con salto responsivo para celular) */}
        <h2 className="w-full max-w-xs sm:max-w-3xl mx-auto mb-4 sm:mb-6 text-[#020617] text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight sm:leading-snug tracking-tight whitespace-normal break-words text-center">
          ATOM no es un gasto, <br className="sm:hidden" />
          es tu máquina de ROI.
        </h2>

        {/* SUBTÍTULO */}
        <Subtitulo className="w-full max-w-2xl mx-auto mb-8 sm:mb-10 text-xs sm:text-base md:text-lg !text-[#334155] leading-relaxed whitespace-normal break-words">
          Nuestros proveedores recuperan en promedio un{' '}
          <strong className="font-extrabold text-[#020617]">
            12% de ganancia real
          </strong>{' '}
          que tenían perdida en la calle durante sus primeros 30 días.
        </Subtitulo>

        {/* BOTÓN CTA FINAL */}
        <a 
          href="https://atomapp.com.co/register"
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full sm:w-auto inline-flex items-center justify-center bg-[#0F172A] text-white font-bold px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm rounded-lg hover:bg-slate-800 transition-all shadow-[0_10px_25px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 cursor-pointer text-center ${ESTILOS_TEXTO.boton}`}
        >
          INICIAR MI AUDITORÍA GRATUITA →
        </a>

      </div>
    </section>
  );
}