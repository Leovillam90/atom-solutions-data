'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, ArrowRight } from 'lucide-react';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { Kicker, H2, Subtitulo, ESTILOS_TEXTO } from '@/app/complementos/Tipografia';

interface Pagina3Props {
  variante?: TipoFondo;
  onAbrirCancelacion?: () => void;
}

export default function Pagina3({
  variante = 'spotlightCyan',
  onAbrirCancelacion
}: Pagina3Props) {
  return (
    <section className="relative z-10 py-16 px-6 text-white w-full overflow-hidden font-sans">
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Kicker className="!text-red-400">GESTIÓN DE SUSCRIPCIÓN</Kicker>
          
          <H2 varianteFondo={variante} className="text-balance">
            ¿Necesitas pausar o gestionar la desconexión de tu cuenta?
          </H2>

          <Subtitulo varianteFondo={variante} className="max-w-2xl mx-auto text-slate-300">
            Si estás experimentando inconvenientes operativos o deseas congelar tu membresía temporalmente, nuestro equipo está listo para asistirte.
          </Subtitulo>

          <div className="pt-4">
            <button
              type="button"
              onClick={onAbrirCancelacion}
              className={`inline-flex items-center justify-center gap-2 bg-red-950/40 hover:bg-red-600 border border-red-500/50 text-red-300 hover:text-white font-black px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.25)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:-translate-y-0.5 cursor-pointer text-center ${ESTILOS_TEXTO.boton}`}
            >
              <AlertOctagon className="w-4 h-4" />
              <span>SOLICITAR DESCONEXIÓN O PAUSA DE CUENTA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}