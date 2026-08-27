'use client';

import React from 'react';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { Kicker, H2, Subtitulo, ESTILOS_TEXTO } from '@/app/complementos/Tipografia';

interface Seccion3Props {
  variante?: TipoFondo;
  onAbrirCancelacion?: () => void;
}

export default function Seccion3({
  variante = 'darkNoise',
  onAbrirCancelacion
}: Seccion3Props) {
  return (
    <section className="relative z-10 py-16 px-6 text-white w-full overflow-hidden">
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        <Kicker className="!text-red-400">GESTIÓN DE SUSCRIPCIÓN</Kicker>
        
        <H2 className="text-balance">
          ¿Necesitas pausar o gestionar la desconexión de tu cuenta?
        </H2>

        <Subtitulo className="max-w-2xl mx-auto text-slate-300">
          Si estás experimentando inconvenientes operativos o deseas congelar tu membresía temporalmente, nuestro equipo está listo para asistirte.
        </Subtitulo>

        <div className="pt-4">
          <button
            type="button"
            onClick={onAbrirCancelacion}
            className={`inline-flex items-center justify-center bg-red-600/20 hover:bg-red-600 border border-red-500/40 text-red-300 hover:text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:-translate-y-0.5 cursor-pointer text-center ${ESTILOS_TEXTO.boton}`}
          >
            SOLICITAR DESCONEXIÓN O PAUSA DE CUENTA →
          </button>
        </div>
      </div>
    </section>
  );
}