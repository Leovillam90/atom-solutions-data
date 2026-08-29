'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Calculator, 
  Boxes, 
  GraduationCap, 
  Tag, 
  Newspaper, 
  HelpCircle, 
  LogIn, 
  Menu as MenuIcon, 
  X, 
  Sparkles 
} from 'lucide-react';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { ESTILOS_TEXTO, ModoTema, esFondoClaro } from '@/app/complementos/Tipografia';

interface MenuProps {
  variante?: TipoFondo;
  modoTema?: ModoTema;
}

export default function Menu({ variante = 'atomGreenTop', modoTema = 'auto' }: MenuProps) {
  const pathname = usePathname();
  const esClaro = esFondoClaro(variante, modoTema);

  const [herramientasOpen, setHerramientasOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Ocultar menú en la app principal
  if (pathname === '/atomapp') return null;

  /**
   * ⚡ EVALUADOR DE ESTILOS INDIVIDUALES (HOVER Y ACTIVO)
   */
  const getLinkStyles = (href: string) => {
    // Verifica si la opción coincide exactamente con la URL actual
    const esActivo = pathname === href;

    if (esClaro) {
      return esActivo
        ? 'text-[#102935] font-black border-b-2 border-[#102935] pb-0.5'
        : 'text-[#102935]/70 hover:text-[#102935] font-bold transition-colors duration-200';
    }

    return esActivo
      ? 'text-[#0DEDC0] font-black drop-shadow-[0_0_10px_rgba(13,237,192,0.6)] border-b-2 border-[#0DEDC0] pb-0.5'
      : 'text-slate-300 hover:text-[#0DEDC0] font-semibold transition-colors duration-200';
  };

  const bgHeader = esClaro ? 'bg-[#0DEDC0]' : 'bg-[#091A23]';
  const bgDropdown = esClaro 
    ? 'bg-white border-[#102935]/20 text-[#102935]' 
    : 'bg-[#091A23] border-[#0DEDC0]/40 text-slate-200';

  return (
    <header className={`sticky top-0 z-[1000] overflow-visible transition-colors duration-300 ${bgHeader}`}>
      {/* CAPA DE FONDO DINÁMICO */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-full opacity-60 overflow-hidden">
        <Fondos variante={variante} modo="absolute" />
      </div>

      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <div className="flex items-center justify-between gap-4">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3.5 group shrink-0">
            <img 
              src="/logo-color.png" 
              alt="ATOM Solutions Data" 
              className="h-14 md:h-16 w-auto transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>

          {/* NAVEGACIÓN DESKTOP INDIVIDUALIZADA */}
          <nav className="hidden lg:flex flex-1 items-center justify-evenly max-w-4xl px-4 text-xs xl:text-sm">
            
            <Link href="/" className={`whitespace-nowrap ${getLinkStyles('/')}`}>
              Inicio
            </Link>

            <Link href="/simulador" className={`whitespace-nowrap ${getLinkStyles('/simulador')}`}>
              Simuladores
            </Link>

            {/* DESPLEGABLE HERRAMIENTAS */}
            <div 
              className="relative py-2"
              onMouseEnter={() => setHerramientasOpen(true)}
              onMouseLeave={() => setHerramientasOpen(false)}
            >
              <button 
                type="button" 
                className={`flex items-center gap-1 cursor-pointer bg-transparent border-none ${getLinkStyles('/calculadora')}`}
              >
                <span>Herramientas</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${herramientasOpen ? 'rotate-180 text-[#0DEDC0]' : ''}`} />
              </button>

              <AnimatePresence>
                {herramientasOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute top-full left-0 w-60 border rounded-xl py-2 shadow-2xl z-[9999] ${bgDropdown}`}
                  >
                    <div className="px-3 py-1.5 border-b border-slate-700/50 text-[10px] font-mono text-[#0DEDC0] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      Proveedores
                    </div>

                    <Link 
                      href="/calculadora" 
                      className={`flex items-center justify-between px-4 py-2.5 text-xs transition-colors ${
                        pathname === '/calculadora' 
                          ? 'bg-[#0DEDC0]/20 text-[#0DEDC0] font-bold' 
                          : 'hover:bg-[#0DEDC0]/10'
                      }`}
                    >
                      <span className="flex items-center gap-2"><Calculator className="w-3.5 h-3.5" /> Calculadora Avanzada</span>
                      <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#0DEDC0] text-[#091A23]">NUEVO</span>
                    </Link>

                    <a 
                      href="https://lobostock.vercel.app/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-between px-4 py-2.5 text-xs hover:bg-[#0DEDC0]/10 transition-colors"
                    >
                      <span className="flex items-center gap-2"><Boxes className="w-3.5 h-3.5" /> LoboStock</span>
                      <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#0DEDC0] text-[#091A23]">NUEVO</span>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/academy" className={`flex items-center gap-1.5 whitespace-nowrap ${getLinkStyles('/academy')}`}>
              <GraduationCap className="w-4 h-4" /> ATOM Academy
            </Link>

            <a href="/#precios" className={`flex items-center gap-1.5 whitespace-nowrap ${getLinkStyles('/#precios')}`}>
              <Tag className="w-4 h-4" /> Precios
            </a>

            <Link href="/noticias" className={`flex items-center gap-1.5 whitespace-nowrap ${getLinkStyles('/noticias')}`}>
              <Newspaper className="w-4 h-4" /> Noticias
            </Link>

            <Link href="/soporte" className={`flex items-center gap-1.5 whitespace-nowrap ${getLinkStyles('/soporte')}`}>
              <HelpCircle className="w-4 h-4" /> Soporte
            </Link>
          </nav>

          {/* BOTÓN DE ACCIÓN DESKTOP */}
          <div className="hidden lg:flex items-center shrink-0">
            <Link 
              href="/atomapp" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all duration-300 ${
                esClaro 
                  ? 'bg-[#102935] text-white hover:bg-black' 
                  : 'text-[#0DEDC0] bg-[#0DEDC0]/10 border border-[#0DEDC0]/40 hover:bg-[#0DEDC0]/20 hover:border-[#0DEDC0] hover:shadow-[0_0_15px_rgba(13,237,192,0.4)]'
              } ${ESTILOS_TEXTO.boton}`}
            >
              <LogIn className="w-4 h-4" />
              ACCESO PORTAL
            </Link>
          </div>

          {/* BOTÓN MÓVIL */}
          <button 
            type="button" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg border cursor-pointer ${
              esClaro ? 'bg-[#102935] text-white' : 'bg-[#0DEDC0]/10 text-[#0DEDC0] border-[#0DEDC0]/30'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden px-6 py-5 flex flex-col gap-3 border-t ${bgHeader}`}
          >
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className={`text-sm pb-2 border-b border-white/10 ${getLinkStyles('/')}`}>Inicio</Link>
            <Link href="/simulador" onClick={() => setMobileMenuOpen(false)} className={`text-sm pb-2 border-b border-white/10 ${getLinkStyles('/simulador')}`}>Simulador</Link>
            <Link href="/academy" onClick={() => setMobileMenuOpen(false)} className={`text-sm pb-2 border-b border-white/10 ${getLinkStyles('/academy')}`}>Academy</Link>
            <Link href="/soporte" onClick={() => setMobileMenuOpen(false)} className={`text-sm pb-2 border-b border-white/10 ${getLinkStyles('/soporte')}`}>Soporte</Link>
            <Link href="/atomapp" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 py-3 bg-[#0DEDC0] text-[#061217] rounded-lg font-black text-xs uppercase shadow-lg">
              <LogIn className="w-4 h-4" /> ACCESO PORTAL
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}