import React from 'react';
import Link from 'next/link';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { Kicker, H2, Subtitulo, ESTILOS_TEXTO } from '@/app/complementos/Tipografia';

interface Seccion2Props {
  variante?: TipoFondo;
}

export default function Seccion2({ variante = 'darkNoise' }: Seccion2Props) {
  return (
    <section className="relative z-10 py-12 px-6 overflow-hidden w-full border-b border-[#0DEDC0]/10 text-white no-print">
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="w-full relative bg-[#102935]/50 backdrop-blur-xl border border-[#0DEDC0]/30 rounded-3xl p-8 sm:p-12 text-center overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <Kicker>INTELIGENCIA Y ESTUDIOS DE MERCADO</Kicker>
          
          <H2 className="text-xl sm:text-3xl font-black text-white tracking-tight mb-3 mt-2">
            ¿Quieres comparar tus métricas con los promedios reales de LATAM?
          </H2>

          <Subtitulo className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto mb-8 font-medium">
            Accede a nuestros reportes del ecosistema E-Commerce, tendencias de fletes y tasas de devolución actualizadas.
          </Subtitulo>

          <Link
            href="/noticias"
            className={`inline-flex items-center justify-center gap-2 bg-[#0DEDC0] hover:bg-white text-[#102935] font-black px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(13,237,192,0.2)] ${ESTILOS_TEXTO.boton}`}
          >
            Explorar Noticias & Reportes
          </Link>
        </div>
      </div>
    </section>
  );
}