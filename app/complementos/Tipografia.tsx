import React from 'react';

// DICCIONARIO DE CLASES TAILWIND CON INTERLINEADO AJUSTADO
export const ESTILOS_TEXTO = {
  kicker: 'text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#0DEDC0] font-mono block mb-1',
  h1: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] tracking-tight',
  h2: 'text-2xl md:text-4xl font-bold text-white leading-[1.15] tracking-tight',
  h3: 'text-lg md:text-xl font-bold text-white leading-snug',
  subtitulo: 'text-sm md:text-lg font-normal text-slate-400 leading-normal',
  cuerpo: 'text-sm font-normal text-slate-400 leading-normal',
  boton: 'text-sm font-semibold uppercase tracking-wider',
  destacado: 'text-[#0DEDC0]',
} as const;

// COMPONENTES REUTILIZABLES DE TIPOGRAFÍA

interface TextoProps {
  children: React.ReactNode;
  className?: string;
}

export function Kicker({ children, className = '' }: TextoProps) {
  return <span className={`${ESTILOS_TEXTO.kicker} ${className}`}>{children}</span>;
}

export function H1({ children, className = '' }: TextoProps) {
  return <h1 className={`${ESTILOS_TEXTO.h1} ${className}`}>{children}</h1>;
}

export function H2({ children, className = '' }: TextoProps) {
  return <h2 className={`${ESTILOS_TEXTO.h2} ${className}`}>{children}</h2>;
}

export function H3({ children, className = '' }: TextoProps) {
  return <h3 className={`${ESTILOS_TEXTO.h3} ${className}`}>{children}</h3>;
}

export function Subtitulo({ children, className = '' }: TextoProps) {
  return <p className={`${ESTILOS_TEXTO.subtitulo} ${className}`}>{children}</p>;
}

export function Texto({ children, className = '' }: TextoProps) {
  return <p className={`${ESTILOS_TEXTO.cuerpo} ${className}`}>{children}</p>;
}

export function Highlight({ children, className = '' }: TextoProps) {
  return <span className={`${ESTILOS_TEXTO.destacado} ${className}`}>{children}</span>;
}

