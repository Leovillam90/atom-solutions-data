  'use client';

  import React from 'react';
  import { motion } from 'framer-motion';
  import { 
    Calendar, 
    MessageCircle, 
    GraduationCap, 
    ArrowRight, 
    Sparkles, 
    Flame, 
    Headset
  } from 'lucide-react';
  import { Kicker, H2, Subtitulo, Highlight } from '@/app/complementos/Tipografia';
  import Fondos, { TipoFondo } from '@/app/complementos/Fondos';

  interface Pagina1SoporteProps {
    variante?: TipoFondo;
  }

  // 📌 CANALES OFICIALES DE ATENCIÓN Y AGENDAMIENTO
  const URL_ASESORIA_EMPRESARIAL = 'https://calendar.app.google/84KPeHVQKDw6nxqY6';
  const URL_CAPACITACIONES = 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1F759EpZaYzkL12gW2zrzgPk52nSSS37P2WmrE0DUF3mwMWcbz8sfw-EQgvuu72VW_w-fzS6fU';

  const WA_NUMERO_SOPORTE = '573122521130';
  const MSG_SOPORTE = encodeURIComponent('Hola, necesito soporte operativo para mi bodega');
  const URL_SOPORTE_WA = `https://wa.me/${WA_NUMERO_SOPORTE}?text=${MSG_SOPORTE}`;

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
              Conecta directamente con el equipo especialista ATOM para agendar sesiones estratégicas, capacitar a tu personal o solucionar incidencias operativas en tiempo real.
            </Subtitulo>
          </motion.div>

          {/* PARRILLA DE CANALES DE ATENCIÓN CON COLORES DIFERENCIADOS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl text-left items-stretch">
            
            {/* 1. ASESORÍA EMPRESARIAL - TEMA CYAN / TURQUESA NEÓN */}
            <motion.a
              href={URL_ASESORIA_EMPRESARIAL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col justify-between p-7 rounded-2xl bg-gradient-to-b from-[#0F2836]/95 via-[#0B1D28]/95 to-[#07131B]/98 border border-[#0DEDC0]/40 border-t-[#0DEDC0]/80 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:border-[#0DEDC0] hover:shadow-[0_20px_45px_rgba(0,0,0,0.8),0_0_35px_rgba(13,237,192,0.3)] transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#0DEDC0]/15 rounded-full blur-2xl pointer-events-none group-hover:bg-[#0DEDC0]/25 transition-all" />

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
                  Asesoría Estratégica
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Analizamos tu operación en vivo para detectar fugas de capital ocultas. Sal de nuestra sesión con un plan de acción tecnológico y exacto para optimizar tus procesos y recuperar tu rentabilidad.
                </p>
              </div>

              <div className="relative z-10 mt-8 pt-4 border-t border-[#0DEDC0]/20 flex items-center justify-between">
                <span className="text-sm font-black text-white flex items-center gap-2 group-hover:text-[#0DEDC0] transition-colors">
                  Agendar Asesoría
                </span>
                <ArrowRight className="w-4 h-4 text-[#0DEDC0] transition-transform group-hover:translate-x-1" />
              </div>
            </motion.a>

            {/* 2. CAPACITACIONES - TEMA VIOLETA / PÚRPURA NEÓN */}
            <motion.a
              href={URL_CAPACITACIONES}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col justify-between p-7 rounded-2xl bg-gradient-to-b from-[#1B0F38]/95 via-[#130A28]/95 to-[#080416]/98 border border-purple-500/40 border-t-purple-400/80 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:border-purple-400 hover:shadow-[0_20px_45px_rgba(0,0,0,0.8),0_0_35px_rgba(168,85,247,0.3)] transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/15 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/25 transition-all" />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/50 flex items-center justify-center text-purple-400 mb-5 shadow-[0_4px_15px_rgba(168,85,247,0.2)]">
                  <GraduationCap className="w-6 h-6" />
                </div>

                <span className="text-[11px] font-extrabold text-purple-400 uppercase tracking-wider block mb-1.5">
                  ENTRENAMIENTO DE EQUIPO
                </span>

                <h3 className="text-xl font-black text-white mb-2 tracking-tight group-hover:text-purple-300 transition-colors">
                  Capacitación Operativa
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Pasa de apagar incendios manuales a dirigir una operación 100% automatizada. Entrena a tu equipo en vivo para dominar nuestro ecosistema y blindar tu margen de rentabilidad.
                </p>
              </div>

              <div className="relative z-10 mt-8 pt-4 border-t border-purple-500/20 flex items-center justify-between">
                <span className="text-sm font-black text-purple-300 flex items-center gap-2 group-hover:text-purple-200 transition-colors">
                  Agendar Capacitación
                </span>
                <ArrowRight className="w-4 h-4 text-purple-400 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.a>

            {/* 3. SOPORTE OPERATIVO WHATSAPP - TEMA VERDE ESMERALDA / WHATSAPP */}
            <motion.a
              href={URL_SOPORTE_WA}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col justify-between p-7 rounded-2xl bg-gradient-to-b from-[#0A291D]/95 via-[#071F16]/95 to-[#03100B]/98 border border-emerald-500/40 border-t-emerald-400/80 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:border-emerald-400 hover:shadow-[0_20px_45px_rgba(0,0,0,0.8),0_0_35px_rgba(34,197,94,0.3)] transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/25 transition-all" />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-5 shadow-[0_4px_15px_rgba(34,197,94,0.2)]">
                  <Headset className="w-6 h-6" />
                </div>

                <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider block mb-1.5">
                  ATENCIÓN DIRECTA
                </span>

                <h3 className="text-xl font-black text-white mb-2 tracking-tight group-hover:text-emerald-300 transition-colors">
                  Soporte Técnico y Operativo
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  ¿Dudas de integración o fallas de sincronización? No detengas tu operación. Conéctate en vivo vía WhatsApp con un especialista ATOM para diagnosticar y corregir cualquier error al instante.
                </p>
              </div>

              <div className="relative z-10 mt-8 pt-4 border-t border-emerald-500/20 flex items-center justify-between">
                <span className="text-sm font-black text-emerald-400 flex items-center gap-2 group-hover:text-emerald-300 transition-colors">
                  Hablar por WhatsApp
                </span>
                <MessageCircle className="w-4 h-4 text-emerald-400 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.a>

          </div>
        </div>
      </section>
    );
  }
