import React from 'react';
import Link from 'next/link';
import { Kicker, H2, Subtitulo, Highlight } from '@/app/complementos/Tipografia';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';

interface Seccion1SoporteProps {
  variante?: TipoFondo;
}

// CONSTANTES ESTÁTICAS FUERA DEL RENDER
const CALENDAR_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1NLADoKo98JZGZMrlOPGvfIDoFwBklUgysMkLBhFl4YFhxruab4t-0ijwVyiPkHTt3CBUDtiFo?gv=true';
const WA_NUMERO_OPERATIVO = '573122521130';
const MSG_OPERATIVO = encodeURIComponent('Hola, necesito soporte operativo para mi bodega');
const WA_URL_OPERATIVO = `https://wa.me/${WA_NUMERO_OPERATIVO}?text=${MSG_OPERATIVO}`;

export default function Seccion1({ variante = 'gridCyber' }: Seccion1SoporteProps) {
  return (
    <section className="relative z-10 py-16 lg:py-20 px-6 overflow-hidden border-b border-[#0DEDC0]/10">
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
        <Kicker>SOPORTE & ESTRATEGIA</Kicker>

        <H2 className="text-balance mb-4 max-w-4xl">
          Toma el control total de tu <Highlight>operación.</Highlight>
        </H2>

        <Subtitulo className="max-w-3xl mx-auto mb-12">
          Conecta directamente con nuestro Equipo ATOM para blindar tu operación, o accede a nuestra base táctica para destrabar cualquier fricción logística en segundos.
        </Subtitulo>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl text-left">
          
          {/* TARJETA 1 */}
          <a
            href={CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-[#102935]/80 to-[#0B171C]/95 border border-[#0DEDC0]/50 backdrop-blur-xl shadow-[0_10px_30px_rgba(13,237,192,0.15)] hover:-translate-y-1.5 hover:border-[#0DEDC0] hover:shadow-[0_20px_40px_rgba(0,0,0,0.6),0_0_40px_rgba(13,237,192,0.3)] transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 opacity-5 bg-[linear-gradient(#0DEDC0_1px,transparent_1px),linear-gradient(90deg,#0DEDC0_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            <span className="absolute top-3.5 right-3.5 bg-[#0DEDC0] text-[#102935] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-[0_0_15px_rgba(13,237,192,0.5)] z-10">
              🔥 MÁS SOLICITADO
            </span>

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#0DEDC0]/15 border border-[#0DEDC0]/50 flex items-center justify-center text-[#0DEDC0] mb-5 shadow-[inset_0_0_10px_rgba(13,237,192,0.2)]">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>

              <span className="text-[11px] font-extrabold text-[#0DEDC0] uppercase tracking-wider block mb-1.5">
                ASESORIA EMPRESARIAL ATOM
              </span>

              <h3 className="text-xl font-black text-white mb-2 tracking-tight">
                Sesión de Recuperación de Capital
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Analizamos tu cuenta en vivo para detectar guías perdidas, devoluciones sin pagar y mucho más. Sal de la llamada con el plan exacto para recuperar tu dinero.
              </p>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-[#0DEDC0]/30 flex items-center justify-between">
              <span className="text-sm font-black text-white flex items-center gap-1.5 group-hover:text-[#0DEDC0] transition-colors">
                Solicitar Auditoría <span className="text-[#0DEDC0] text-base">→</span>
              </span>
            </div>
          </a>

          {/* TARJETA 2 */}
          <a
            href={WA_URL_OPERATIVO}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between p-6 rounded-2xl bg-[#102935]/45 border border-[#6884C5]/25 backdrop-blur-xl hover:-translate-y-1.5 hover:border-[#0DEDC0]/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_25px_rgba(13,237,192,0.12)] transition-all duration-300"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#0DEDC0]/10 border border-[#0DEDC0]/25 flex items-center justify-center text-[#0DEDC0] mb-4">
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.38 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.38 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>

              <span className="text-[11px] font-extrabold text-[#0DEDC0] uppercase tracking-wider block mb-1">
                CENTRO DE ATENCIÓN OPERATIVA
              </span>

              <h3 className="text-lg font-black text-white mb-2 tracking-tight">
                Soporte Técnico y Operativo
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                ¿Tienes dudas con la integración o fallas en la sincronización? Conéctate en vivo por WhatsApp con un especialista para corregir errores en Dropi, ajustar tus credenciales API y mantener tu bodega operando a 100%.
              </p>
            </div>

            <div className="mt-6 pt-3.5 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-extrabold text-[#0DEDC0] group-hover:translate-x-1 transition-transform">
                Hablar por WhatsApp →
              </span>
            </div>
          </a>

          {/* TARJETA 3 */}
          <Link
            href="/academy"
            className="group flex flex-col justify-between p-6 rounded-2xl bg-[#102935]/45 border border-[#6884C5]/25 backdrop-blur-xl hover:-translate-y-1.5 hover:border-[#0DEDC0]/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_25px_rgba(13,237,192,0.12)] transition-all duration-300"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#0DEDC0]/10 border border-[#0DEDC0]/25 flex items-center justify-center text-[#0DEDC0] mb-4">
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </div>

              <span className="text-[11px] font-extrabold text-[#0DEDC0] uppercase tracking-wider block mb-1">
                ENTRENAMIENTO TÁCTICO
              </span>

              <h3 className="text-lg font-black text-white mb-2 tracking-tight">
                ATOM Academy
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                Pasa de resolver problemas manuales a dirigir una operación automatizada. Accede a videotutoriales paso a paso para dominar la API de Dropi, blindar tus márgenes y auditar tu rentabilidad en tiempo real.
              </p>
            </div>

            <div className="mt-6 pt-3.5 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-extrabold text-[#0DEDC0] group-hover:translate-x-1 transition-transform">
                Ir a Tutoriales →
              </span>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}