import React from 'react';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { Kicker, H2, Subtitulo, Highlight, ESTILOS_TEXTO } from '@/app/complementos/Tipografia';

interface Pagina3Props {
  whatsappGroupUrl?: string;
  variante?: TipoFondo;
}

export default function Pagina3({
  whatsappGroupUrl = 'https://chat.whatsapp.com/LseNRlRrS4zFpRKst3lPTp',
  variante = 'cyanDotsOnly',
}: Pagina3Props) {
  return (
    <section className="relative z-10 py-16 lg:py-24 px-6 overflow-hidden w-full border-t border-[#0DEDC0]/10">
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        
        <div className="w-full relative rounded-3xl p-[2px] overflow-hidden shadow-[0_0_50px_rgba(13,237,192,0.25)] group hover:shadow-[0_0_80px_rgba(13,237,192,0.45)] transition-shadow duration-500">
          
          {/* MARCO ROTATIVO USANDO CLASE GLOBAL GPU */}
          <div className="animated-border-gradient opacity-80 group-hover:opacity-100 transition-opacity" />

          <div className="w-full relative bg-[#0B151E]/90 backdrop-blur-xl rounded-[22px] p-8 sm:p-14 text-center overflow-hidden z-10">
            
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[350px] h-[150px] bg-gradient-to-r from-[#0DEDC0]/20 via-[#8B5CF6]/20 to-[#CB1FDA]/20 rounded-full blur-3xl pointer-events-none" />

            <Kicker>COMUNIDAD EXCLUSIVA</Kicker>

            <H2 className="text-balance mb-3 max-w-3xl mx-auto">
              Recibe métricas e inteligencia <Highlight>directamente en WhatsApp.</Highlight>
            </H2>

            <Subtitulo className="max-w-2xl mx-auto mb-8">
              Accede en tiempo real a reportes de efectividad, alertas de transportadoras y estrategias de escalamiento en nuestro grupo exclusivo.
            </Subtitulo>

            <a
              href={whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 bg-[#0DEDC0] hover:bg-white text-[#102935] font-black px-8 py-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(13,237,192,0.3)] hover:shadow-[0_0_40px_rgba(13,237,192,0.6)] hover:-translate-y-0.5 cursor-pointer relative z-20 ${ESTILOS_TEXTO.boton}`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.38 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.38 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Unirme al Grupo de WhatsApp →
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}