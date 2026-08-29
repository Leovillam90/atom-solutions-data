'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  XCircle, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Receipt, 
  Wallet, 
  Boxes, 
  TrendingDown 
} from 'lucide-react';
import { ESTILOS_TEXTO } from '@/app/complementos/Tipografia';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';

interface Pagina2Props {
  variante?: TipoFondo;
}

const VARIABLES_OMITIDAS = [
  {
    titulo: 'Impacto Fiscal',
    detalle: '(IVA, ICA, 4x1000)',
    icon: <Receipt className="w-4 h-4 text-red-400" />
  },
  {
    titulo: 'Capital Inmovilizado',
    detalle: '(Retención de Wallet)',
    icon: <Wallet className="w-4 h-4 text-red-400" />
  },
  {
    titulo: 'Costos Ocultos',
    detalle: '(Almacenaje y Picking)',
    icon: <Boxes className="w-4 h-4 text-red-400" />
  },
  {
    titulo: 'Mermas Logísticas',
    detalle: '(Abandono y Destrucción)',
    icon: <TrendingDown className="w-4 h-4 text-red-400" />
  }
];

export default function Pagina2({ variante = 'hexGrid' }: Pagina2Props) {
  return (
    <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden w-full border-b border-[#0DEDC0]/10 text-white font-sans">
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-10">
        
        {/* TARJETAS DE VARIABLES CRÍTICAS OMITIDAS */}
        <div className="space-y-4">
          <span className="text-white font-extrabold block text-xs sm:text-sm font-mono tracking-wider uppercase flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-400" />
            Variables críticas omitidas en la versión básica:
          </span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VARIABLES_OMITIDAS.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex items-center gap-3 bg-[#0C1824]/90 p-4 rounded-xl border border-red-500/40 shadow-lg hover:border-red-400 transition-colors backdrop-blur-md font-mono text-xs sm:text-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-400/50 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <span className="text-slate-300 block font-medium">{item.titulo}</span>
                  <strong className="text-white block font-bold text-xs">{item.detalle}</strong>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CUADRO DESTACADO: CTA TÁCTICO */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-[#090D16]/90 p-6 sm:p-8 lg:p-10 border-2 border-[#0DEDC0] shadow-[0_0_50px_rgba(13,237,192,0.25)] backdrop-blur-md"
        >
          {/* LUZ AMBIENTAL DENTRO DEL TARJETÓN */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#0DEDC0]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-black uppercase tracking-wider bg-[#0DEDC0]/20 text-[#0DEDC0] border border-[#0DEDC0]/60 px-3 py-1 rounded-md shadow-[0_0_12px_rgba(13,237,192,0.3)]">
                  <Sparkles className="w-3 h-3" /> Acceso Inmediato
                </span>

                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-800 text-slate-200 border border-slate-600 px-3 py-1 rounded-md">
                  <ShieldCheck className="w-3 h-3 text-[#0DEDC0]" /> Exclusivo para Proveedores
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug m-0">
                Lleva el control de tu operación al siguiente nivel financiero.
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed m-0">
                Desbloquea el Simulador Avanzado ATOM para proyectar tu flujo de caja real, calcular retenciones fiscales y auditar el verdadero costo de tu operación.
              </p>
            </div>

            <div className="w-full lg:w-auto shrink-0 space-y-2">
              <Link
                href="/calculadora"
                className={`group/btn relative w-full lg:w-auto bg-[#0DEDC0] hover:bg-white text-[#061217] font-black py-4 px-8 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_30px_rgba(13,237,192,0.6)] hover:shadow-[0_0_40px_rgba(255,255,255,0.9)] cursor-pointer text-center flex items-center justify-center gap-3 overflow-hidden ${ESTILOS_TEXTO.boton}`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Desbloquear Simulador Avanzado
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </span>
              </Link>

              <span className="block text-center lg:text-right text-[10px] font-mono text-slate-400 font-medium">
                Activación en 2 clics
              </span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}