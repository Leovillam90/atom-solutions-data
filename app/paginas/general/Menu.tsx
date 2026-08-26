'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Fondos, { TipoFondo } from '../../complementos/Fondos';
import { ESTILOS_TEXTO } from '../../complementos/Tipografia';

interface MenuProps {
  variante?: TipoFondo;
}

export default function Menu({ variante = 'gridCyber' }: MenuProps) {
  const [herramientasOpen, setHerramientasOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [herramientasMobileOpen, setHerramientasMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[1000] overflow-visible relative bg-[#091A23]">
      
      {/* KEYFRAMES PARA BOTÓN Y BARRIDO DE LUZ EN LA LÍNEA DIVISORIA */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulseActivar {
          0%, 100% {
            box-shadow: 0 0 12px rgba(13, 237, 192, 0.4);
            transform: translateY(0);
          }
          50% {
            box-shadow: 0 0 25px rgba(13, 237, 192, 0.85);
            transform: translateY(-2px);
          }
        }
        @keyframes borderLightSweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .btn-activar-anim {
          animation: pulseActivar 2.5s infinite ease-in-out;
        }
        .animate-border-sweep {
          animation: borderLightSweep 4s linear infinite;
        }
      ` }} />

      {/* CAPA DE FONDO DINÁMICO (z-0) */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-full opacity-60 overflow-hidden">
        <Fondos variante={variante} modo="absolute" />
      </div>

      {/* BARRA DE NAVEGACIÓN PRINCIPAL (z-30 PARA QUEDAR POR ENCIMA DE LA LÍNEA) */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <div className="flex items-center justify-between lg:flex lg:items-center lg:justify-between gap-4">
          
          {/* LOGO (EXTREMO IZQUIERDO) */}
          <div className="flex items-center justify-start shrink-0">
            <Link href="/" className="flex items-center gap-3.5 no-underline group">
              <img 
                src="/logo-color.png" 
                alt="ATOM Solutions Data" 
                className="h-12 md:h-16 w-auto block transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                  if (fallback) fallback.style.display = 'flex';
                }} 
              />
              <div className="hidden items-center gap-2">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#0DEDC0"/>
                  <path d="M2 17L12 22L22 17" stroke="#6884C5" strokeWidth="2.2" strokeLinecap="round"/>
                  <path d="M2 12L12 17L22 12" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
                <span className="text-white font-extrabold text-lg tracking-wide">
                  ATOM <span className="text-[#6884C5] font-normal">DATA</span>
                </span>
              </div>
            </Link>
          </div>

          {/* NAVEGACIÓN DESKTOP */}
          <nav className="hidden lg:flex flex-1 items-center justify-evenly max-w-4xl px-4 text-xs xl:text-sm font-medium text-slate-200">
            
            {/* 1. INICIO */}
            <div className="h-10 flex items-center justify-center">
              <Link href="/" className="hover:text-[#0DEDC0] transition-colors whitespace-nowrap">
                Inicio
              </Link>
            </div>

            {/* 2. HERRAMIENTAS */}
            <div
              className="relative h-10 flex items-center justify-center"
              onMouseEnter={() => setHerramientasOpen(true)}
              onMouseLeave={() => setHerramientasOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 hover:text-[#0DEDC0] transition-colors outline-none cursor-pointer bg-transparent border-none whitespace-nowrap text-xs xl:text-sm font-medium text-slate-200"
              >
                Herramientas
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className={`transition-transform duration-200 ${herramientasOpen ? 'rotate-180 text-[#0DEDC0]' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {/* CUADRO DESPLEGABLE (z-[9999] SOBRE LA NAVEGACIÓN) */}
              {herramientasOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-[#091A23] border border-[#0DEDC0]/40 rounded-xl py-2 shadow-[0_15px_35px_rgba(0,0,0,0.9)] z-[9999]">
                  {/* PROVEEDORES */}
                  <div className="flex items-center justify-between px-4 py-2.5 text-xs text-slate-200 hover:bg-[#0DEDC0]/10 transition-all cursor-not-allowed">
                    <span>Proveedores</span>
                    <span className="text-[8px] font-mono text-[#6884C5] bg-[#6884C5]/15 border border-[#6884C5]/30 px-1.5 py-0.5 rounded-full">
                      Próximamente
                    </span>
                  </div>

                  <div className="border-t border-slate-800 my-1"></div>

                  {/* DROPSHIPPERS */}
                  <Link
                    href="/#beneficios"
                    className="flex items-center justify-between px-4 py-2.5 text-xs text-slate-200 hover:text-[#0DEDC0] hover:bg-[#0DEDC0]/10 transition-all"
                  >
                    <span>Dropshippers</span>
                    <span className="text-[8px] font-mono text-[#6884C5] bg-[#6884C5]/15 border border-[#6884C5]/30 px-1.5 py-0.5 rounded-full">
                      Próximamente
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {/* 3. CALCULADORA */}
            <div className="h-10 flex items-center justify-center">
              <Link href="/calculadora" className="hover:text-[#0DEDC0] transition-colors whitespace-nowrap flex items-center gap-1.5 group">
                <span>Calculadora</span>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#0DEDC0] text-[#091A23] shadow-[0_0_10px_rgba(13,237,192,0.6)] animate-pulse group-hover:scale-105 transition-transform leading-none">
                  NUEVO
                </span>
              </Link>
            </div>

            {/* 4. ATOM ACADEMY */}
            <div className="h-10 flex items-center justify-center">
              <Link href="/academy" className="hover:text-[#0DEDC0] transition-colors whitespace-nowrap">
                ATOM Academy
              </Link>
            </div>

            {/* 5. NOTICIAS */}
            <div className="h-10 flex items-center justify-center">
              <Link href="/noticias" className="hover:text-[#0DEDC0] transition-colors whitespace-nowrap flex items-center gap-1.5 group">
                <span>Noticias</span>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#0DEDC0] text-[#091A23] shadow-[0_0_10px_rgba(13,237,192,0.6)] animate-pulse group-hover:scale-105 transition-transform leading-none">
                  NUEVO
                </span>
              </Link>
            </div>

            {/* 6. SOPORTE & FAQ */}
            <div className="h-10 flex items-center justify-center">
              <Link href="/soporte" className="hover:text-[#0DEDC0] transition-colors whitespace-nowrap">
                Soporte & FAQ
              </Link>
            </div>

          </nav>

          {/* BOTÓN DE ACCIÓN DESKTOP */}
          <div className="hidden lg:flex items-center justify-end shrink-0">
            <Link 
              href="/atomapp" 
              className={`btn-activar-anim flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-extrabold text-[#0DEDC0] bg-[#0DEDC0]/10 border border-[#0DEDC0]/40 hover:bg-[#0DEDC0]/20 hover:border-[#0DEDC0] transition-all duration-300 ${ESTILOS_TEXTO.boton}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              ACCESO PORTAL
            </Link>
          </div>

          {/* BOTÓN HAMBURGUESA MÓVIL */}
          <button
            type="button"
            aria-label="Abrir menú de navegación"
            className="lg:hidden flex items-center justify-center p-2 rounded-lg bg-[#0DEDC0]/10 border border-[#0DEDC0]/30 text-[#0DEDC0] cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>

        </div>
      </div>

      {/* LÍNEA DIVISORIA INFERIOR ANIMADA (z-10 PARA QUEDAR POR DEBAJO DEL DESPLEGABLE) */}
      <div 
        className="absolute bottom-0 inset-x-0 h-[2px] z-10 bg-[linear-gradient(90deg,transparent_0%,#0DEDC0_50%,#6884C5_75%,transparent_100%)] bg-[length:200%_100%] animate-border-sweep"
      />

      {/* MENÚ DESPLEGABLE MÓVIL */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#091A23] border-t border-[#0DEDC0]/20 px-6 py-5 flex flex-col gap-4 relative z-[9999]">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-200 font-semibold text-sm pb-2 border-b border-white/5 hover:text-[#0DEDC0]"
          >
            Inicio
          </Link>

          <div>
            <button
              type="button"
              onClick={() => setHerramientasMobileOpen(!herramientasMobileOpen)}
              className="w-full flex items-center justify-between text-slate-200 font-semibold text-sm pb-2 border-b border-white/5 bg-transparent border-none cursor-pointer"
            >
              <span>Herramientas</span>
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#0DEDC0" 
                strokeWidth="2.5" 
                className={`transition-transform duration-200 ${herramientasMobileOpen ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {herramientasMobileOpen && (
              <div className="flex flex-col gap-3 pl-3 pt-3">
                <div className="flex items-center justify-between text-slate-300 font-medium text-xs py-1">
                  <span>• Proveedores</span>
                  <span className="text-[8px] font-mono text-[#6884C5] bg-[#6884C5]/15 border border-[#6884C5]/30 px-1.5 py-0.5 rounded-full">
                    Próximamente
                  </span>
                </div>

                <Link
                  href="/#beneficios"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-300 font-medium text-xs flex items-center justify-between pt-1"
                >
                  <span>• Dropshippers</span>
                  <span className="text-[8px] font-mono text-[#6884C5] bg-[#6884C5]/15 border border-[#6884C5]/30 px-1.5 py-0.5 rounded-full">
                    Próximamente
                  </span>
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/calculadora"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-200 font-semibold text-sm pb-2 border-b border-white/5 hover:text-[#0DEDC0] flex items-center justify-between"
          >
            <span>Calculadora</span>
            <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#0DEDC0] text-[#091A23] shadow-[0_0_10px_rgba(13,237,192,0.6)] animate-pulse">
              NUEVO
            </span>
          </Link>

          <Link
            href="/academy"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-200 font-semibold text-sm pb-2 border-b border-white/5 hover:text-[#0DEDC0]"
          >
            ATOM Academy
          </Link>

          <Link
            href="/noticias"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-200 font-semibold text-sm pb-2 border-b border-white/5 hover:text-[#0DEDC0] flex items-center justify-between"
          >
            <span>Noticias</span>
            <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#0DEDC0] text-[#091A23] shadow-[0_0_10px_rgba(13,237,192,0.6)] animate-pulse">
              NUEVO
            </span>
          </Link>

          <Link
            href="/soporte"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-200 font-semibold text-sm pb-2 border-b border-white/5 hover:text-[#0DEDC0]"
          >
            Soporte & FAQ
          </Link>

          <div className="flex flex-col gap-3 mt-2">
            <Link
              href="/atomapp"
              onClick={() => setMobileMenuOpen(false)}
              className={`btn-activar-anim flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-extrabold text-[#0DEDC0] bg-[#0DEDC0]/10 border border-[#0DEDC0]/40 ${ESTILOS_TEXTO.boton}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              ACCESO PORTAL
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}