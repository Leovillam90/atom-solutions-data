'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { Kicker, H1, Subtitulo, Highlight, ESTILOS_TEXTO } from '@/app/complementos/Tipografia';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';

interface Seccion1Props {
  variante?: TipoFondo;
}

export default function Seccion1({ variante = 'atomDynamicGradient' }: Seccion1Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const nuevoEstado = !videoRef.current.muted;
      videoRef.current.muted = nuevoEstado;
      setIsMuted(nuevoEstado);
    }
  }, []);

  return (
    <section className="relative z-10 py-12 lg:py-16 border-b border-[#0DEDC0]/10 overflow-hidden">
      <Fondos variante={variante} modo="absolute" />

      {/* Borde animado superior */}
      <div className="absolute top-0 inset-x-0 h-[2px] z-20 bg-[linear-gradient(90deg,transparent_0%,#0DEDC0_50%,#6884C5_75%,transparent_100%)] bg-[length:200%_100%] animate-border-sweep transform-gpu" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-10 items-center min-h-[75vh]">
        
        {/* COLUMNA IZQUIERDA: COPY PRINCIPAL */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 w-full lg:max-w-[600px]"
        >
          <Kicker varianteFondo={variante}>EXCLUSIVO PARA BODEGAS E IMPORTADORES CON INVENTARIO EN DROPI</Kicker>

          <H1 varianteFondo={variante} className="mb-4">
            Deja de regalarle tu dinero a las <Highlight varianteFondo={variante}>transportadoras.</Highlight>
          </H1>
          
          <Subtitulo varianteFondo={variante} className="max-w-[550px] mb-6">
            ATOM audita tu cuenta Dropi 24/7 y detecta mercancía &quot;devuelta&quot; que jamás reingresó a tu bodega o en &quot;curso&quot; que sigue en la calle. Te entregamos la evidencia irrefutable para cobrar lo que te corresponde en 1 clic.
          </Subtitulo>
          
          <div className="flex flex-col gap-3 mb-8">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#0DEDC0] shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-300">
                Integración nativa a Dropi LATAM
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#0DEDC0] shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-300">
                Detecta tus pedidos estancados
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#0DEDC0] shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-300">
                Audita devoluciones fantasma en tiempo real
              </span>
            </div>
          </div>

          <a 
            href="https://atomapp.com.co/register"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0DEDC0] text-[#102935] font-extrabold rounded-xl shadow-[0_0_25px_rgba(13,237,192,0.35)] hover:bg-[#25ffd3] hover:scale-[1.02] transition-all cursor-pointer ${ESTILOS_TEXTO.boton}`}
          >
            <span>RECLAMAR MI DINERO RETENIDO</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* COLUMNA DERECHA: REPRODUCTOR DE VIDEO */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 w-full max-w-[650px] relative"
        >
          <div className="absolute -inset-5 bg-[radial-gradient(circle,rgba(13,237,192,0.15)_0%,transparent_60%)] blur-2xl z-0 pointer-events-none" />
          
          <div className="relative z-10 bg-[#102935]/60 border border-[#0DEDC0]/30 rounded-2xl p-2 shadow-2xl backdrop-blur-md">
            <div className="flex gap-1.5 p-2">
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
            </div>

            <div className="rounded-lg overflow-hidden bg-[#091A23] border border-white/5 relative aspect-video">
              <button 
                type="button"
                onClick={toggleMute} 
                className="absolute top-3 right-3 z-10 bg-[#091A23]/85 text-[#0DEDC0] border border-[#0DEDC0]/40 rounded-md px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition-all hover:bg-[#0DEDC0] hover:text-[#102935] cursor-pointer"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    Activar Sonido
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    Silenciar
                  </>
                )}
              </button>

              <video 
                ref={videoRef}
                autoPlay 
                loop 
                muted={isMuted}
                playsInline
                preload="metadata"
                className="w-full h-full object-cover relative z-1"
              >
                <source src="/video-landing.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}