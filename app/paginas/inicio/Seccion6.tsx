import React from 'react';
import { Kicker, H2, Subtitulo, ESTILOS_TEXTO } from '../../complementos/Tipografia';
import Fondos, { TipoFondo } from '../../complementos/Fondos';

interface Seccion6Props {
  variante?: TipoFondo;
}

export default function Seccion6({ variante = 'cyanSolidOnly' }: Seccion6Props) {
  return (
    <section className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 w-full overflow-hidden">
      
      {/* 1. FONDO EXTERIOR DE LA SECCIÓN (HEXGRID) */}
      <Fondos variante="hexGrid" modo="absolute" />

      {/* 2. CAJÓN / CONTENEDOR FLOTANTE */}
      <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 border border-[#0DEDC0]/30 shadow-[0_25px_60px_rgba(0,0,0,0.5)] text-center">
        
        {/* FONDO INTERIOR DEL CAJÓN (P. EJ. cyanSolidOnly) */}
        <Fondos variante={variante} modo="absolute" />

        {/* CONTENIDO INTERNO */}
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center w-full">
          
          <Kicker className="!text-[#0F172A] mb-3">
            AUDITORÍA FINANCIERA
          </Kicker>

          <H2 className="text-balance mb-4 max-w-2xl mx-auto !text-[#020617]">
            ATOM no es un gasto, <br className="sm:hidden" />
            es tu máquina de ROI.
          </H2>

          <Subtitulo className="max-w-xl mx-auto mb-8 !text-[#334155]">
            Nuestros proveedores recuperan en promedio un{' '}
            <strong className="font-extrabold text-[#020617]">
              15% de ganancia real
            </strong>{' '}
            que tenían perdida en la calle durante sus primeros 30 días.
          </Subtitulo>

          <a 
            href="https://atomapp.com.co/register"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full sm:w-auto inline-flex items-center justify-center bg-[#0F172A] text-white font-bold px-8 py-4 rounded-xl hover:bg-slate-800 transition-all shadow-[0_10px_25px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 cursor-pointer text-center ${ESTILOS_TEXTO.boton}`}
          >
            INICIAR MI AUDITORÍA GRATUITA →
          </a>

        </div>

      </div>
    </section>
  );
}