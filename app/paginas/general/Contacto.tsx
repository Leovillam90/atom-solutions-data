'use client';

import React, { useState } from 'react';
import Link from 'next/link';
// Importaciones globales desde la raíz usando el alias @/
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { Kicker, Texto } from '@/app/complementos/Tipografia';

interface SocialLink {
  name: string;
  url: string;
  color: string;
  rgb: string;
  icon: React.ReactNode;
}

interface ContactoProps {
  variante?: TipoFondo;
}

const SocialButton = ({ item }: { item: SocialLink }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!item) return null;

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      title={item.name}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 border cursor-pointer relative z-10"
      style={{
        backgroundColor: isHovered ? `rgba(${item.rgb}, 0.15)` : 'rgba(255, 255, 255, 0.05)',
        borderColor: isHovered ? item.color : 'rgba(255, 255, 255, 0.12)',
        color: isHovered ? item.color : '#FFFFFF',
        transform: isHovered ? 'translateY(-2px) scale(1.08)' : 'translateY(0) scale(1)',
        boxShadow: isHovered ? `0 4px 12px rgba(${item.rgb}, 0.35)` : 'none',
      }}
    >
      {item.icon}
    </a>
  );
};

export default function Contacto({ variante = 'gridCyber' }: ContactoProps) {
  const socialLinks: SocialLink[] = [
    {
      name: 'Instagram @atom.data',
      url: 'https://instagram.com/atom.data',
      color: '#E1306C',
      rgb: '225, 48, 108',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      )
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@atomsolutionsdata',
      color: '#FF0000',
      rgb: '255, 0, 0',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"/>
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/people/Atom-Solutions-Data/',
      color: '#1877F2',
      rgb: '24, 119, 242',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      )
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@atom.data',
      color: '#00F2FE',
      rgb: '0, 242, 254',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/atom-solutions-data/',
      color: '#0A66C2',
      rgb: '10, 102, 194',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect x="2" y="9" width="4" height="12"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="relative z-10 text-white pt-6 pb-3 px-5 overflow-hidden">
      
      {/* 1. ANIMACIÓN KEYFRAMES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes borderLightSweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      ` }} />

      {/* 2. BORDE SUPERIOR CON BARRIDO DE LUZ ANIMADO */}
      <div 
        className="absolute top-0 inset-x-0 h-[2px] z-20 bg-[linear-gradient(90deg,transparent_0%,#0DEDC0_50%,#6884C5_75%,transparent_100%)] bg-[length:200%_100%]"
        style={{ animation: 'borderLightSweep 4s linear infinite' }} 
      />

      {/* FONDO DINÁMICO */}
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Marca / Branding */}
          <div>
            <img 
              src="/isotipo-blanco.png" 
              alt="ATOM" 
              className="h-7 mb-1.5 block"
              onError={(e) => (e.currentTarget.style.display = 'none')} 
            />
            <span className="font-extrabold text-[#FFFFFF] text-sm tracking-wide block">
              ATOM SOLUTIONS DATA
            </span>
            <Texto className="text-[11px] mt-1 leading-snug">
              El centro de mando operativo y financiero para proveedores. Audita tu rentabilidad real, toma el control de tu logística y elimina las fugas de capital de tu bodega.
            </Texto>
          </div>

          {/* Navegación Footer */}
          <div>
            <Kicker className="!text-[#6884C5] mb-1.5">
              Ecosistema
            </Kicker>
            <ul className="space-y-1 p-0 m-0 list-none">
              <li><Link href="/#herramientas" className="text-slate-400 text-xs hover:text-white transition-colors">Herramientas</Link></li>
              <li><Link href="/academy" className="text-slate-400 text-xs hover:text-white transition-colors">ATOM School</Link></li>
              <li><Link href="/noticias" className="text-slate-400 text-xs hover:text-white transition-colors">Noticias</Link></li>
              <li><Link href="/soporte" className="text-slate-400 text-xs hover:text-white transition-colors">Soporte & FAQ</Link></li>
            </ul>
          </div>

          {/* Datos Oficiales */}
          <div>
            <Kicker className="!text-[#6884C5] mb-1.5">
              Contacto Oficial
            </Kicker>
            <ul className="space-y-1 p-0 m-0 list-none text-slate-400 text-xs">
              <li className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6884C5" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                info@atomsolutionsdata.com
              </li>
              <li className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6884C5" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +57 312 252 1130
              </li>
              <li className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6884C5" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"/></svg>
                Integrados en Dropi LATAM
              </li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <Kicker className="!text-[#6884C5] mb-1.5">
              Síguenos
            </Kicker>
            <div className="flex gap-2 flex-wrap">
              {socialLinks.map((item) => (
                <SocialButton key={item.name} item={item} />
              ))}
            </div>
          </div>

        </div>

        {/* Legal Bar */}
        <div className="mt-5 pt-3 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-slate-400 text-[11px] gap-1.5 sm:gap-0">
          <p>© 2026 ATOM SOLUTIONS DATA. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/terminos" className="text-slate-400 hover:text-white transition-colors">Términos y Condiciones</Link>
            <Link href="/privacidad" className="text-slate-400 hover:text-white transition-colors">Políticas de Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}