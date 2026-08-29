'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { Kicker, H2, Subtitulo, Highlight, ESTILOS_TEXTO } from '@/app/complementos/Tipografia';

interface Pagina3Props {
  whatsappGroupUrl?: string;
  variante?: TipoFondo;
}

export default function Pagina3({
  whatsappGroupUrl = 'https://chat.whatsapp.com/LseNRlRrS4zFpRKst3lPTp',
  variante = 'spotlightCyan',
}: Pagina3Props) {
  return (
    <section className="relative z-10 py-16 lg:py-24 px-6 overflow-hidden w-full border-t border-[#0DEDC0]/10 font-sans">
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full relative rounded-3xl p-[2px] overflow-hidden shadow-[0_0_50px_rgba(13,237,192,0.25)] group hover:shadow-[0_0_80px_rgba(13,237,192,0.45)] transition-shadow duration-500"
        >
          {/* MARCO ANIMADO MULTICOLOR */}
          <div className="animated-border-gradient opacity-80 group-hover:opacity-100 transition-opacity" />

          <div className="w-full relative bg-[#090D16]/95 backdrop-blur-xl rounded-[22px] p-8 sm:p-14 text-center overflow-hidden z-10">
            
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[350px] h-[150px] bg-gradient-to-r from-[#0DEDC0]/20 via-[#8B5CF6]/20 to-[#CB1FDA]/20 rounded-full blur-3xl pointer-events-none" />

            <Kicker varianteFondo={variante}>COMUNIDAD EXCLUSIVA</Kicker>

            <H2 varianteFondo={variante} className="text-balance mb-3 max-w-3xl mx-auto">
              Recibe métricas e inteligencia <Highlight varianteFondo={variante}>directamente en WhatsApp.</Highlight>
            </H2>

            <Subtitulo varianteFondo={variante} className="max-w-2xl mx-auto mb-8">
              Accede en tiempo real a reportes de efectividad, alertas de transportadoras y estrategias de escalamiento en nuestro grupo exclusivo.
            </Subtitulo>

            <a
              href={whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2.5 bg-[#0DEDC0] hover:bg-white text-[#102935] font-black px-8 py-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(13,237,192,0.3)] hover:shadow-[0_0_40px_rgba(13,237,192,0.6)] hover:-translate-y-0.5 cursor-pointer relative z-20 ${ESTILOS_TEXTO.boton}`}
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>UNIRME AL GRUPO DE WHATSAPP</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </motion.div>

      </div>
    </section>
  );
}