'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Maximize2, 
  ShieldCheck, 
  ExternalLink, 
  Loader2, 
  AlertCircle,
  Radio
} from 'lucide-react';
import Fondos from '@/app/complementos/Fondos';

interface Pagina1Props {
  variante?: 'gridCyber' | 'spotlightCyan' | 'hexGrid' | 'default';
}

const ATOM_APP_URL = 'https://atomapp.com.co/login';

export default function Pagina1({ variante = 'hexGrid' }: Pagina1Props) {
  const [cargando, setCargando] = useState<boolean>(true);
  const [mostrarBotonExterno, setMostrarBotonExterno] = useState<boolean>(false);

  // Temporizador de cortesía: Si el iframe tarda más de 5s, ofrece link directo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (cargando) {
        setMostrarBotonExterno(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [cargando]);

  return (
    <section className="relative z-10 w-full h-screen h-[100dvh] bg-[#070B14] flex flex-col overflow-hidden font-sans antialiased">
      
      {/* BARRA SUPERIOR DE CONTROL Y NAVEGACIÓN */}
      <header className="relative z-30 shrink-0 bg-[#091A23] px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-[#0DEDC0]/30 shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
        
        {/* RETORNO A LA WEB PRINCIPAL */}
        <Link
          href="/"
          title="Volver a la Web Principal"
          className="group flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#102935]/80 border border-[#0DEDC0]/40 hover:border-[#0DEDC0] hover:bg-[#0DEDC0]/10 transition-all duration-300 cursor-pointer text-xs font-mono font-bold text-[#0DEDC0]"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="hidden sm:inline">Volver a ATOM</span>
        </Link>

        {/* INDICADOR DE ESTADO EN VIVO */}
        <div className="flex items-center gap-2 bg-[#102935]/60 px-3 py-1 rounded-full border border-white/10">
          <Radio className="w-3.5 h-3.5 text-[#0DEDC0] animate-pulse" />
          <span className="text-[11px] font-mono text-slate-200 font-extrabold uppercase tracking-wider">
            Portal Operativo ATOM
          </span>
        </div>

        {/* BOTÓN EXPANDIR EN PESTAÑA INDEPENDIENTE */}
        <a
          href={ATOM_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Abrir en ventana completa"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#102935] border border-slate-700 hover:border-[#0DEDC0] text-slate-300 hover:text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(13,237,192,0.2)]"
        >
          <span className="hidden sm:inline">Expandir Portal</span>
          <Maximize2 className="w-3.5 h-3.5 text-[#0DEDC0]" />
        </a>

        {/* LÍNEA DIVISORIA LUMINOSA */}
        <div className="absolute bottom-0 inset-x-0 h-[2px] z-20 bg-[linear-gradient(90deg,transparent_0%,#0DEDC0_50%,#6884C5_75%,transparent_100%)] bg-[length:200%_100%] animate-border-sweep" />
      </header>

      {/* CONTENEDOR DEL IFRAME Y OVERLAY DE CARGA */}
      <div className="relative z-10 flex-1 w-full h-full bg-[#070B14] overflow-hidden">
        
        {/* OVERLAY DE CARGA ANIMADO */}
        <AnimatePresence>
          {cargando && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#070B14] p-6 gap-5 text-center"
            >
              <Fondos variante="atomDynamicGradient" modo="absolute" />

              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="relative flex items-center justify-center">
                  <div className="w-14 h-14 border-4 border-[#0DEDC0]/20 border-t-[#0DEDC0] rounded-full animate-spin shadow-[0_0_25px_rgba(13,237,192,0.4)]" />
                  <ShieldCheck className="w-6 h-6 text-[#0DEDC0] absolute" />
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-mono text-[#0DEDC0] tracking-widest uppercase font-black">
                    Estableciendo enlace seguro con atomapp.com.co...
                  </p>
                  <p className="text-[11px] font-sans text-slate-400 max-w-sm font-medium">
                    Sincronizando portal de auditoría e inventarios en tiempo real.
                  </p>
                </div>

                {/* BOTÓN RESCATE EN CASO DE BLOQUEO DE COOKIES */}
                {mostrarBotonExterno && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-4 rounded-2xl bg-[#090D16]/90 border border-amber-500/40 text-amber-300 text-xs space-y-2.5 max-w-md shadow-2xl backdrop-blur-md"
                  >
                    <div className="flex items-center gap-2 justify-center font-bold">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>¿Tu navegador restringe sesiones embebidas?</span>
                    </div>
                    <a
                      href={ATOM_APP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-white text-[#090D16] font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
                    >
                      <span>Abrir App en Pestaña Directa</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* EMBED DEL APLICATIVO */}
        <iframe
          src={ATOM_APP_URL}
          title="ATOM App Portal Operativo"
          className="w-full h-full border-0 block"
          onLoad={() => setCargando(false)}
          allow="geolocation; microphone; camera; clipboard-write; encrypted-media; autoplay; storage-access"
          referrerPolicy="origin-when-cross-origin"
        />
      </div>
      
    </section>
  );
}