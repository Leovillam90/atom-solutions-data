'use client';

import React from 'react';
import { TipoFondo } from '@/app/complementos/Fondos';
import { cn } from '@/app/lib/utils';

export type ModoTema = 'oscuro' | 'claro' | 'auto';

// Variantes de Fondos.tsx que requieren tipografía oscura (ej: verde o blanco brillante)
const FONDOS_CLAROS: TipoFondo[] = ['atomGreenOnly'];

/**
 * Detecta automáticamente si un fondo requiere tipografía oscura para garantizar contraste.
 */
export function esFondoClaro(varianteFondo?: TipoFondo, modoOverride?: ModoTema): boolean {
  if (modoOverride === 'claro') return true;
  if (modoOverride === 'oscuro') return false;
  if (varianteFondo && FONDOS_CLAROS.includes(varianteFondo)) return true;
  return false;
}

interface PropsTextoBase extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  varianteFondo?: TipoFondo;
  modo?: ModoTema;
  className?: string;
}

// ----------------------------------------------------------------------
// 1. KICKER (Etiqueta superior táctica en mayúsculas)
// ----------------------------------------------------------------------
export function Kicker({ 
  children, 
  varianteFondo, 
  modo = 'auto', 
  className = '', 
  ...props 
}: PropsTextoBase) {
  const esClaro = esFondoClaro(varianteFondo, modo);
  const color = esClaro ? 'text-[#102935] font-black' : 'text-[#0DEDC0] font-bold';

  return (
    <span 
      className={cn(
        'block font-mono text-[11px] sm:text-xs tracking-widest uppercase mb-3',
        color,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// ----------------------------------------------------------------------
// 2. ENCABEZADOS PRINCIPALES (H1, H2, H3 - AJUSTE GLOBAL DE INTERLINEADO)
// ----------------------------------------------------------------------
export function H1({ 
  children, 
  varianteFondo, 
  modo = 'auto', 
  className = '', 
  ...props 
}: PropsTextoBase) {
  const esClaro = esFondoClaro(varianteFondo, modo);
  const color = esClaro ? 'text-[#102935]' : 'text-white';

  return (
    <h1 
      className={cn(
        // ⚡ leading-[1.1] compacta las líneas del título y mb-6 lo separa del subtítulo
        'text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6',
        color,
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({ 
  children, 
  varianteFondo, 
  modo = 'auto', 
  className = '', 
  ...props 
}: PropsTextoBase) {
  const esClaro = esFondoClaro(varianteFondo, modo);
  const color = esClaro ? 'text-[#102935]' : 'text-white';

  return (
    <h2 
      className={cn(
        'text-2xl sm:text-4xl font-black tracking-tight leading-[1.15] mb-5',
        color,
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function H3({ 
  children, 
  varianteFondo, 
  modo = 'auto', 
  className = '', 
  ...props 
}: PropsTextoBase) {
  const esClaro = esFondoClaro(varianteFondo, modo);
  const color = esClaro ? 'text-[#102935]' : 'text-white';

  return (
    <h3 
      className={cn(
        'text-xl sm:text-2xl font-black tracking-tight leading-[1.2] mb-4',
        color,
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

// ----------------------------------------------------------------------
// 3. SUBTÍTULO Y TEXTO DE CUERPO (AJUSTE GLOBAL DE ESPACIADO)
// ----------------------------------------------------------------------
export function Subtitulo({ 
  children, 
  varianteFondo, 
  modo = 'auto', 
  className = '', 
  ...props 
}: PropsTextoBase) {
  const esClaro = esFondoClaro(varianteFondo, modo);
  const color = esClaro ? 'text-[#1E293B] font-semibold' : 'text-slate-300 font-medium';

  return (
    <p 
      className={cn(
        'text-xs sm:text-base leading-relaxed mb-6',
        color,
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function Texto({ 
  children, 
  varianteFondo, 
  modo = 'auto', 
  className = '', 
  ...props 
}: PropsTextoBase) {
  const esClaro = esFondoClaro(varianteFondo, modo);
  const color = esClaro ? 'text-[#334155] font-medium' : 'text-slate-400 font-normal';

  return (
    <p 
      className={cn(
        'text-xs sm:text-sm leading-relaxed mb-4',
        color,
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

// ----------------------------------------------------------------------
// 4. HIGHLIGHT (Resaltado de marca Neón / Púrpura)
// ----------------------------------------------------------------------
interface HighlightProps {
  children: React.ReactNode;
  varianteColor?: 'cyan' | 'purple' | 'gunmetal';
  varianteFondo?: TipoFondo;
  modo?: ModoTema;
  className?: string;
}

export function Highlight({ 
  children, 
  varianteColor = 'cyan', 
  varianteFondo, 
  modo = 'auto', 
  className = '' 
}: HighlightProps) {
  const esClaro = esFondoClaro(varianteFondo, modo);

  if (esClaro) {
    return (
      <span className={cn('text-[#102935] underline decoration-[#102935]/40 font-black', className)}>
        {children}
      </span>
    );
  }

  const estilosColor = {
    cyan: 'text-[#0DEDC0] drop-shadow-[0_0_12px_rgba(13,237,192,0.4)]',
    purple: 'text-[#CB1FDA] drop-shadow-[0_0_12px_rgba(203,31,218,0.4)]',
    gunmetal: 'text-[#102935]',
  };

  return (
    <span className={cn(estilosColor[varianteColor], className)}>
      {children}
    </span>
  );
}

// ----------------------------------------------------------------------
// 5. ESTILOS GLOBALES DE TEXTO Y BOTONES
// ----------------------------------------------------------------------
export const ESTILOS_TEXTO = {
  boton: 'font-mono text-xs uppercase tracking-wider font-extrabold select-none',
  badge: 'font-mono text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full',
  codigo: 'font-mono text-xs font-bold text-[#0DEDC0]',
};