'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MessageCircle, 
  GraduationCap, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Headset // ⚡ Corregido a singular
} from 'lucide-react';
import { Kicker, H2, Subtitulo, Highlight } from '@/app/complementos/Tipografia';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';

interface Pagina1SoporteProps {
  variante?: TipoFondo;
}

const CALENDAR_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1NLADoKo98JZGZMrlOPGvfIDoFwBklUgysMkLBhFl4YFhxruab4t-0ijwVyiPkHTt3CBUDtiFo?gv=true';
const WA_NUMERO_OPERATIVO = '573122521130';
const MSG_OPERATIVO = encodeURIComponent('Hola, necesito soporte operativo para mi bodega');
const WA_URL_OPERATIVO = `https://wa.me/${WA_NUMERO_OPERATIVO}?text=${MSG_OPERATIVO}`;

export default function Pagina1({ variante = 'atomDynamicGradient' }: Pagina1SoporteProps) {
  return (
    <section className="relative z-10 py-16 lg:py-20 px-6 overflow-hidden border-b border-[#0DEDC0]/10">
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* ENCABEZADO DE SECCIÓN */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Kicker varianteFondo={variante}>SOPORTE & ESTRATEGIA</Kicker>

          <H2 varianteFondo={variante} className="text-balance mb-4 max-w-4xl">
            Toma el control total de tu <Highlight varianteFondo={variante}>operación.</Highlight>
          </H2>

          <Subtitulo varianteFondo={variante} className="max-w-3xl mx-auto mb-12">
            Conecta directamente con nuestro Equipo ATOM para blindar tu operación, o accede a nuestra base táctica para destrabar cualquier fricción logística en segundos.
          </Subtitulo>
        </motion.div>

        {/* PARRILLA DE CANALES DE ATENCIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl text-left items-stretch">
          
          {/* TARJETA 1: AUDITORÍA 1:1 */}
          <motion.a
            href={CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="group relative flex flex-col justify-between p-7 rounded-2xl bg-gradient-to-b from-[#0F2836]/95 via-[#0B1D28]/95 to-[#07131B]/98 border border-[#0DEDC0]/40 border-t-[#0DEDC0]/80 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:border-[#0DEDC0] hover:shadow-[0_20px_45px_rgba(0,0,0,0.8),0_0_35px_rgba(13,237,192,0.3)] transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0DEDC0]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#0DEDC0]/20 transition-all" />

            <span className="absolute top-3.5 right-3.5 bg-[#0DEDC0] text-[#102935] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-[0_0_15px_rgba(13,237,192,0.6)] z-10 flex items-center gap-1">
              <Flame className="w-3 h-3 fill-current" /> MÁS SOLICITADO
            </span>

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#0DEDC0]/15 border border-[#0DEDC0]/50 flex items-center justify-center text-[#0DEDC0] mb-5 shadow-[0_4px_15px_rgba(13,237,192,0.2)]">
                <Calendar className="w-6 h-6" />
              </div>

              <span className="text-[11px] font-extrabold text-[#0DEDC0] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> ASESORÍA EMPRESARIAL ATOM
              </span>

              <h3 className="text-xl font-black text-white mb-2 tracking-tight group-hover:text-[#0DEDC0] transition-colors">
                Sesión de Recuperación de Capital
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Analizamos tu cuenta en vivo para detectar guías perdidas, devoluciones sin pagar y mucho más. Sal de la llamada con el plan exacto para recuperar tu dinero.
              </p>
            </div>

            <div className="relative z-10 mt-8 pt-4 border-t border-white/15 flex items-center justify-between">
              <span className="text-sm font-black text-white flex items-center gap-2 group-hover:text-[#0DEDC0] transition-colors">
                Solicitar Auditoría 1:1
              </span>
              <ArrowRight className="w-4 h-4 text-[#0DEDC0] transition-transform group-hover:translate-x-1" />
            </div>
          </motion.a>

          {/* TARJETA 2: ATENCIÓN WHATSAPP */}
          <motion.a
            href={WA_URL_OPERATIVO}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ y: -6 }}
            className="group relative flex flex-col justify-between p-7 rounded-2xl bg-[#090D16]/80 border border-slate-800/80 backdrop-blur-xl hover:border-[#0DEDC0]/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(13,237,192,0.15)] transition-all duration-300"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#0DEDC0]/10 border border-[#0DEDC0]/30 flex items-center justify-center text-[#0DEDC0] mb-5">
                <Headset className="w-6 h-6" /> {/* ⚡ Corregido aquí */}
              </div>

              <span className="text-[11px] font-extrabold text-[#0DEDC0] uppercase tracking-wider block mb-1.5">
                CENTRO DE ATENCIÓN OPERATIVA
              </span>

              <h3 className="text-xl font-black text-white mb-2 tracking-tight group-hover:text-[#0DEDC0] transition-colors">
                Soporte Técnico y Operativo
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                ¿Tienes dudas con la integración o fallas en la sincronización? Conéctate en vivo por WhatsApp con un especialista para corregir errores en Dropi y ajustar tus credenciales API.
              </p>
            </div>

            <div className="relative z-10 mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-sm font-black text-[#0DEDC0] flex items-center gap-2">
                Hablar por WhatsApp
              </span>
              <MessageCircle className="w-4 h-4 text-[#0DEDC0] transition-transform group-hover:translate-x-1" />
            </div>
          </motion.a>

          {/* TARJETA 3: ACADEMY TUTORIALES */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Link
              href="/academy"
              className="group relative flex flex-col justify-between p-7 rounded-2xl bg-[#090D16]/80 border border-slate-800/80 backdrop-blur-xl hover:border-[#0DEDC0]/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(13,237,192,0.15)] transition-all duration-300 h-full"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#0DEDC0]/10 border border-[#0DEDC0]/30 flex items-center justify-center text-[#0DEDC0] mb-5">
                  <GraduationCap className="w-6 h-6" />
                </div>

                <span className="text-[11px] font-extrabold text-[#0DEDC0] uppercase tracking-wider block mb-1.5">
                  ENTRENAMIENTO TÁCTICO
                </span>

                <h3 className="text-xl font-black text-white mb-2 tracking-tight group-hover:text-[#0DEDC0] transition-colors">
                  ATOM Academy
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Pasa de resolver problemas manuales a dirigir una operación automatizada. Accede a videotutoriales paso a paso para dominar la API de Dropi y blindar tus márgenes.
                </p>
              </div>

              <div className="relative z-10 mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-sm font-black text-[#0DEDC0] flex items-center gap-2">
                  Ir a Tutoriales
                </span>
                <ArrowRight className="w-4 h-4 text-[#0DEDC0] transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}