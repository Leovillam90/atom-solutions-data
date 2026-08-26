'use client';

import React from 'react';
import { Kicker, H2, Subtitulo, ESTILOS_TEXTO } from '../../complementos/Tipografia';
import Fondos, { TipoFondo } from '../../complementos/Fondos';

interface Seccion6Props {
  variante?: TipoFondo;
}

export default function Seccion6({ variante = 'cyanSolidOnly' }: Seccion6Props) {
  return (
    <section className="relative z-10 py-16 lg:py-20 px-6 overflow-hidden border-b border-[#091A23]/15 text-center">
      
      {/* CAPA DE FONDO VERDE CIAN SÓLIDO */}
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        
        {/* ETIQUETA SUPERIOR */}
        <Kicker className="!text-[#0F172A] !bg-transparent !border-transparent !p-0 text-xs font-semibold tracking-widest uppercase mb-4">
          AUDITORÍA FINANCIERA
        </Kicker>

        {/* TÍTULO PRINCIPAL EN UNA SOLA LÍNEA */}
        <H2 className="whitespace-nowrap mb-6 max-w-none !text-[#020617] text-2xl sm:text-4xl lg:text-5xl font-bold">
          ATOM no es un gasto, es tu máquina de ROI.
        </H2>

        {/* SUBTÍTULO */}
        <Subtitulo className="max-w-2xl mx-auto mb-10 text-lg !text-[#334155]">
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
          className={`inline-flex items-center justify-center bg-[#0F172A] text-white font-bold px-8 py-4 rounded-lg hover:bg-slate-800 transition-all shadow-[0_10px_25px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 cursor-pointer ${ESTILOS_TEXTO.boton}`}
        >
          INICIAR MI AUDITORÍA GRATUITA →
        </a>

      </div>
    </section>
  );
}