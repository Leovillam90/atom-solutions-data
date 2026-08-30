'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowRight, X, Sparkles } from 'lucide-react';
import AlarmaFinancieraModal from './AlarmaFinancieraModal';

export default function ExitIntentModal() {
  const [mostrarExitModal, setMostrarExitModal] = useState<boolean>(false);
  const [mostrarAlarmaModal, setMostrarAlarmaModal] = useState<boolean>(false);
  const [yaMostrado, setYaMostrado] = useState<boolean>(false);

  useEffect(() => {
    // Detecta cuando el cursor sale por la parte superior del navegador (Escritorio)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !yaMostrado) {
        setMostrarExitModal(true);
        setYaMostrado(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [yaMostrado]);

  // Transición: Cierra el primer aviso y despliega la Alarma Financiera
  const abrirAlarmaFinanciera = () => {
    setMostrarExitModal(false);
    setMostrarAlarmaModal(true);
  };

  return (
    <>
      {/* 1. MODAL PRIMARIO: AVISO DE SALIDA (EXIT INTENT) */}
      <AnimatePresence>
        {mostrarExitModal && (
          <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#090D16] border-2 border-[#0DEDC0] rounded-3xl p-6 shadow-[0_0_50px_rgba(13,237,192,0.35)] text-white text-center space-y-4 overflow-hidden"
            >
              {/* Luz ambiental */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-[#0DEDC0]/20 rounded-full blur-2xl pointer-events-none" />

              {/* Botón de cierre */}
              <button 
                type="button"
                onClick={() => setMostrarExitModal(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <AlertCircle className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-[#0DEDC0] uppercase tracking-widest flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" /> ANTES DE IRTE
                </span>
                <h3 className="text-xl font-black text-white leading-tight">
                  ¿Sabes cuánto dinero está perdiendo tu bodega hoy?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Prueba nuestro simulador gratuito en 10 segundos y calcula el impacto real de las devoluciones en tu margen.
                </p>
              </div>

              <div className="pt-2 space-y-2">
                {/* BOTÓN CTA: ABRE EL MODAL DE ALARMA FINANCIERA */}
                <button
                  type="button"
                  onClick={abrirAlarmaFinanciera}
                  className="w-full py-3.5 px-4 bg-[#0DEDC0] text-[#090D16] font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(13,237,192,0.4)] hover:bg-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>PROBAR SIMULADOR GRATIS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* BOTÓN CIERRE REJECT */}
                <button
                  type="button"
                  onClick={() => setMostrarExitModal(false)}
                  className="text-[11px] text-slate-400 hover:text-white font-mono transition-colors cursor-pointer"
                >
                  No gracias, prefiero continuar navegando
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. MODAL SECUNDARIO: ALARMA FINANCIERA CON SIMULADOR TÁCTICO */}
      <AlarmaFinancieraModal 
        isOpen={mostrarAlarmaModal} 
        onClose={() => setMostrarAlarmaModal(false)} 
      />
    </>
  );
}