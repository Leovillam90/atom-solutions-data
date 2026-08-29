'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // ⚡ Importamos el detector de ruta
import { Mail, Phone, Globe, ShieldCheck } from 'lucide-react';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { Kicker, Texto, ModoTema, esFondoClaro } from '@/app/complementos/Tipografia';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

interface ContactoProps {
  variante?: TipoFondo;
  modoTema?: ModoTema;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'Instagram @atom.data',
    url: 'https://instagram.com/atom.data',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    )
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@atomsolutionsdata',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"/>
      </svg>
    )
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/people/Atom-Solutions-Data/',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    )
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@atom.data',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
      </svg>
    )
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/atom-solutions-data/',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    )
  }
];

export default function Contacto({ variante = 'spotlightCyan', modoTema = 'auto' }: ContactoProps) {
  const pathname = usePathname(); // ⚡ Obtenemos la ruta actual

  // ⚡ SI ESTAMOS EN EL PORTAL OPERATIVO, EL FOOTER SE OCULTA COMPLETAMENTE
  if (pathname === '/atomapp') {
    return null;
  }

  const esClaro = esFondoClaro(variante, modoTema);
  const bgFooter = esClaro ? 'bg-[#0DEDC0]' : 'bg-[#091A23]';
  const colorTextoPrincipal = esClaro ? 'text-[#102935]' : 'text-white';
  const colorTextoSecundario = esClaro ? 'text-[#102935]/80' : 'text-slate-400';

  return (
    <footer className={`relative z-10 pt-8 pb-4 px-5 overflow-hidden border-t ${bgFooter} ${esClaro ? 'border-[#102935]/20' : 'border-[#0DEDC0]/20'}`}>
      
      {/* LÍNEA ANIMADA EN EL BORDE SUPERIOR */}
      <div className="absolute top-0 inset-x-0 h-[2px] z-20 bg-[linear-gradient(90deg,transparent_0%,#0DEDC0_50%,#6884C5_75%,transparent_100%)] bg-[length:200%_100%] animate-border-sweep" />

      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* COLUMNA 1: ISOTIPO & MARCA */}
          <div>
            <img 
              src="/isotipo-blanco.png" 
              alt="Isotipo ATOM Solutions Data" 
              className={`h-8 w-auto mb-3 block transition-transform duration-300 hover:scale-105 ${
                esClaro ? 'brightness-0' : 'drop-shadow-[0_0_8px_rgba(13,237,192,0.5)]'
              }`}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }} 
            />

            <span className={`font-extrabold text-sm tracking-wide block ${colorTextoPrincipal}`}>
              ATOM SOLUTIONS DATA
            </span>

            <Texto varianteFondo={variante} modo={modoTema} className="text-[11px] mt-1.5 leading-snug">
              El centro de mando operativo y financiero para proveedores. Audita tu rentabilidad real y elimina las fugas de capital de tu bodega.
            </Texto>
          </div>

          {/* COLUMNA 2: ECOSISTEMA */}
          <div>
            <Kicker varianteFondo={variante} modo={modoTema} className="mb-2">Ecosistema</Kicker>
            <ul className="space-y-1 p-0 m-0 list-none">
              <li><Link href="/#herramientas" className={`${colorTextoSecundario} text-xs hover:underline`}>Herramientas</Link></li>
              <li><Link href="/academy" className={`${colorTextoSecundario} text-xs hover:underline`}>ATOM School</Link></li>
              <li><Link href="/noticias" className={`${colorTextoSecundario} text-xs hover:underline`}>Noticias</Link></li>
              <li><Link href="/soporte" className={`${colorTextoSecundario} text-xs hover:underline`}>Soporte & FAQ</Link></li>
            </ul>
          </div>

          {/* COLUMNA 3: CONTACTO OFICIAL */}
          <div>
            <Kicker varianteFondo={variante} modo={modoTema} className="mb-2">Contacto Oficial</Kicker>
            <ul className={`space-y-1.5 p-0 m-0 list-none text-xs ${colorTextoSecundario}`}>
              <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> info@atomsolutionsdata.com</li>
              <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> +57 312 252 1130</li>
              <li className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Integrados en Dropi LATAM</li>
            </ul>
          </div>

          {/* COLUMNA 4: REDES SOCIALES */}
          <div>
            <Kicker varianteFondo={variante} modo={modoTema} className="mb-2">Síguenos</Kicker>
            <div className="flex gap-2 flex-wrap">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  title={item.name}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 border cursor-pointer relative z-10 ${
                    esClaro
                      ? 'bg-[#102935] text-white border-[#102935] hover:bg-black'
                      : 'bg-white/5 border-white/10 text-white hover:border-[#0DEDC0] hover:text-[#0DEDC0]'
                  }`}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* PIE DE PÁGINA INFERIOR */}
        <div className={`mt-6 pt-4 border-t flex flex-col sm:flex-row justify-between items-center text-[11px] ${esClaro ? 'border-[#102935]/20 text-[#102935]' : 'border-white/10 text-slate-400'}`}>
          <p>© 2026 ATOM SOLUTIONS DATA. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <a href="/complementos/Terminos&Condiciones.pdf" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Términos & Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}