'use client';

import React, { useState } from 'react';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { ESTILOS_TEXTO } from '@/app/complementos/Tipografia';

interface Seccion3Props {
  variante?: TipoFondo;
}

export default function Seccion3({ variante = 'gridCyber' }: Seccion3Props) {
  // ESTADO PARA MANEJAR EL DESPLEGABLE
  const [isDesplegado, setIsDesplegado] = useState(false);

  // CONTACTO PARA RETENCIÓN (WhatsApp)
  const waRetencion = '573138712634';
  const msgRetencion = encodeURIComponent('Hola, quiero evaluar mi plan y recibir una asesoría antes de desconectar mi cuenta.');

  // PLANTILLA MAILTO CANCELACIÓN
  const mailSubject = encodeURIComponent('Cancelación de mi cuenta ATOM');
  const mailBody = encodeURIComponent(
    `Correo de la cuenta ATOM:\nNombre del titular de la proveeduría:\nPlan actual:\nMotivo de la cancelación:`
  );
  const mailToUrl = `mailto:info@atomsolutionsdata.com?subject=${mailSubject}&body=${mailBody}`;

  return (
    <section className="relative z-10 py-12 px-6 overflow-hidden w-full">
      {/* CAPA DE FONDO DINÁMICO */}
      <Fondos variante={variante} modo="absolute" />

      {/* ESTILOS Y ANIMACIONES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulseRescue {
          0% { box-shadow: 0 0 0 0 rgba(13, 237, 192, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(13, 237, 192, 0); }
          100% { box-shadow: 0 0 0 0 rgba(13, 237, 192, 0); }
        }
        .btn-rescue-solid {
          animation: pulseRescue 2.5s infinite;
        }
      ` }} />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        
        {/* BOTÓN DESPLEGABLE PRINCIPAL */}
        <button
          type="button"
          onClick={() => setIsDesplegado(!isDesplegado)}
          className="group relative overflow-hidden rounded-2xl bg-[#14181C]/80 hover:bg-[#14181C] px-8 py-4 border border-red-500/40 hover:border-red-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 flex items-center gap-4 cursor-pointer backdrop-blur-xl"
        >
          <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/40 flex items-center justify-center text-red-500 shrink-0 group-hover:scale-110 transition-transform">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </div>

          <span className="text-sm sm:text-base font-black text-slate-200 tracking-wide uppercase">
            Desconexión del Sistema
          </span>

          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#EF4444"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`shrink-0 transition-transform duration-300 ${
              isDesplegado ? 'rotate-180' : 'rotate-0'
            }`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {/* CONTENIDO DESPLEGABLE */}
        {isDesplegado && (
          <div className="w-full mt-6 transition-all duration-500 animate-fadeIn">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#14181C]/90 to-[#0B0F14]/95 p-6 sm:p-10 lg:p-12 border border-red-500/30 shadow-[0_30px_60px_rgba(0,0,0,0.6),inset_0_0_60px_rgba(239,68,68,0.04)] backdrop-blur-xl">
              
              {/* TEXTURA TÁCTICA ROJA */}
              <div className="absolute inset-0 opacity-5 bg-[linear-gradient(#EF4444_1px,transparent_1px),linear-gradient(90deg,#EF4444_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />

              {/* ENCABEZADO DE ZONA CRÍTICA */}
              <div className="relative z-10 flex items-center gap-4 mb-7">
                <div className="w-12 h-12 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center justify-center text-red-500 shrink-0 shadow-[inset_0_0_15px_rgba(239,68,68,0.2)]">
                  <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Desconexión del Sistema
                  </h2>
                  <span className="text-[10px] sm:text-xs font-mono font-black text-red-500 uppercase tracking-widest block mt-0.5">
                    PROTOCOLO DE APAGADO Y DESVINCULACIÓN
                  </span>
                </div>
              </div>

              {/* ALERTA ROJA (Bloque Crítico) */}
              <div className="relative z-10 bg-red-950/20 border-l-4 border-red-500 border-r border-t border-b border-red-500/20 rounded-r-2xl rounded-l-md p-5 mb-7 flex gap-4 items-start">
                <div className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center text-red-500 shrink-0 mt-0.5">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-red-400 font-black text-sm sm:text-base mb-1 tracking-tight">
                    ALERTA DE PÉRDIDA DE CAPITAL
                  </h4>
                  <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-medium">
                    Tu ecosistema registra operaciones logísticas recientes. Si desconectas tu cuenta hoy, perderás instantáneamente el acceso a las auditorías y reportes de reclamación, dejando tu dinero estancado en la calle a merced de las transportadoras.
                  </p>
                </div>
              </div>

              <p className="relative z-10 text-slate-400 text-xs sm:text-sm leading-relaxed mb-5 font-medium">
                Para solicitar la desvinculación definitiva de tus bodegas y la purga de tus datos de la plataforma, debes enviar un comando vía correo electrónico con la siguiente estructura:
              </p>

              {/* PLANTILLA DE CORREO (Estilo Terminal) */}
              <div className="relative z-10 bg-[#050B0E] border border-[#0DEDC0]/20 rounded-xl p-5 mb-8 font-mono text-xs sm:text-sm shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]">
                <div className="text-[#6884C5] font-semibold mb-1">
                  <span className="text-slate-600">&gt; Destinatario:</span> info@atomsolutionsdata.com
                </div>
                <div className="text-[#0DEDC0] font-semibold mb-4">
                  <span className="text-slate-600">&gt; Asunto:</span> Cancelación de mi cuenta ATOM
                </div>
                <div className="text-slate-400 flex flex-col gap-1.5">
                  <p>• <span className="text-slate-500">Correo de la cuenta ATOM:</span> <strong className="text-slate-200 font-normal">[ejemplo@dominio.com]</strong></p>
                  <p>• <span className="text-slate-500">Nombre del titular de la proveeduría:</span> <strong className="text-slate-200 font-normal">[Tu Nombre / Empresa]</strong></p>
                  <p>• <span className="text-slate-500">Plan actual:</span> <strong className="text-slate-200 font-normal">[Despegue / Escala / Experto / Control]</strong></p>
                  <p>• <span className="text-slate-500">Motivo de la cancelación:</span> <strong className="text-slate-200 font-normal">[Breve explicación]</strong></p>
                </div>
              </div>

              {/* BOTONES Y ACCIONES DE RETENCIÓN */}
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 border-t border-white/10 pt-7">
                
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm text-center lg:text-left">
                  El entorno operativo se apagará en un plazo de <strong className="text-slate-300">5 días hábiles</strong> tras la validación de seguridad.
                </p>

                {/* GRILLA DE ACCIONES SIMÉTRICAS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full lg:w-auto min-w-[320px] sm:min-w-[440px]">
                  
                  {/* BOTÓN SALVAVIDAS (WhatsApp Estratega) */}
                  <a
                    href={`https://wa.me/${waRetencion}?text=${msgRetencion}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn-rescue-solid w-full py-3.5 px-5 bg-[#0DEDC0] hover:bg-white text-[#091A23] border border-[#0DEDC0] text-xs font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(13,237,192,0.3)] hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider text-center ${ESTILOS_TEXTO.boton}`}
                  >
                    <span>Hablar con un Estratega</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.38 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.38 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </a>

                  {/* BOTÓN CANCELACIÓN (Ghost Email) */}
                  <a
                    href={mailToUrl}
                    rel="noopener noreferrer"
                    className={`w-full py-3.5 px-5 bg-transparent hover:bg-red-500/15 text-red-400 hover:text-white border border-red-500/40 hover:border-red-500 text-xs font-black rounded-xl transition-all duration-300 flex items-center justify-center text-center hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] cursor-pointer uppercase tracking-wider ${ESTILOS_TEXTO.boton}`}
                  >
                    Iniciar Desconexión
                  </a>

                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}