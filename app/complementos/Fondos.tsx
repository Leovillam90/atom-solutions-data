'use client';

import React from 'react';

export type TipoFondo =
  // 1. ESTRUCTURALES (Mallas y Geometría)
  | 'gridCyber'
  | 'dotMatrix'
  | 'perspectiveGrid'
  | 'hexGrid'
  | 'isometricLattice'
  | 'colorWavesGrid' // 🌊 Nueva variante: Ondas de colores animadas sobre malla
  // 2. ILUMINACIÓN Y FOCO (Glows & Neón)
  | 'spotlightCyan'
  | 'dualAmbient'
  | 'beamBurst'
  | 'auroraBoreal'
  | 'vignetteDark'
  // 3. VARIANTES VERDE ATOM (#0DEDC0)
  | 'atomGreenOnly'  // Solo verde cibernético (#0DEDC0)
  | 'atomGreenDots'  // Verde con punticos sutiles
  | 'atomGreenGrid'  // Verde con cuadritos sutiles
  // 4. VARIANTES VERDE CIAN (#0CE8C0)
  | 'cyanSolidOnly'  // Solo verde cian (#0CE8C0)
  | 'cyanDotsOnly'   // Punticos sutiles en #0CE8C0 sobre fondo oscuro
  | 'cyanSolidDots'  // Fondo #0CE8C0 puro con puntos en #1D2935
  // 5. CONCEPTUAL-LOGÍSTICOS (Data & Redes)
  | 'constellation'
  | 'frequencyWaves'
  | 'circuitBoard'
  | 'financialBlur'
  | 'topographicIsobars'
  // 6. TEXTURIZADOS Y ELEVACIÓN (Glass & Depth)
  | 'darkNoise'
  | 'gradientMesh'
  | 'glassmorphism'
  | 'bokehParticles'
  | 'bentoSlate';

interface FondosProps {
  variante?: TipoFondo;
  modo?: 'absolute' | 'fixed' | 'relative';
  className?: string;
}

export default function Fondos({ 
  variante = 'gridCyber', 
  modo = 'absolute',
  className = '' 
}: FondosProps) {
  const posicionClass = modo === 'fixed' ? 'fixed' : modo === 'relative' ? 'relative' : 'absolute';

  return (
    <div className={`${posicionClass} inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      
      {/* ========================================== */}
      {/* 🌊 ONDAS DE COLORES ANIMADAS SOBRE PERSPECTIVA */}
      {/* ========================================== */}

      {variante === 'colorWavesGrid' && (
        <div className="absolute inset-0 bg-[#070B14]">
          {/* Resplandor de Onda Neón Cian (#0DEDC0) */}
          <div 
            className="absolute top-[-20%] left-[-10%] w-[80%] h-[70%] bg-[#0DEDC0]/15 rounded-full blur-[140px] animate-pulse" 
            style={{ animationDuration: '6s' }}
          />

          {/* Resplandor de Onda Neón Violeta (#8B5CF6) */}
          <div 
            className="absolute bottom-[-10%] right-[-5%] w-[70%] h-[60%] bg-[#8B5CF6]/15 rounded-full blur-[150px] animate-pulse" 
            style={{ animationDuration: '8s' }}
          />

          {/* Onda Fluida Cian Espacial (#0CE8C0) */}
          <div 
            className="absolute top-[30%] right-[15%] w-[500px] h-[300px] bg-[#0CE8C0]/10 rounded-full blur-[120px] -rotate-12 animate-pulse" 
            style={{ animationDuration: '7s' }}
          />

          {/* Trama de Puntos (Parte Superior) */}
          <div className="absolute inset-0 bg-[radial-gradient(#6884C5_1px,transparent_1px)] [background-size:28px_28px] opacity-20" />

          {/* Malla en Perspectiva 3D proyeccion hacia el horizonte */}
          <div className="absolute bottom-0 left-0 right-0 h-[60%] [perspective:1000px] overflow-hidden">
            <div 
              className="w-full h-[200%] bg-[linear-gradient(to_right,#0DEDC0_1px,transparent_1px),linear-gradient(to_bottom,#0DEDC0_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 [transform:rotateX(75deg)] [transform-origin:bottom_center]" 
            />
            {/* Fade de degradado para desvanecer el plano verticalmente */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#070B14]/80 to-[#070B14]" />
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 🟢 VARIANTES VERDE CIAN EXCLUSIVAS (#0CE8C0) */}
      {/* ========================================== */}

      {/* Solo Verde #0CE8C0 Plano */}
      {variante === 'cyanSolidOnly' && (
        <div className="absolute inset-0 bg-[#0CE8C0]" />
      )}

      {/* Punticos Sutiles en #0CE8C0 sobre fondo oscuro */}
      {variante === 'cyanDotsOnly' && (
        <div className="absolute inset-0 bg-[#051F1A]">
          <div className="absolute inset-0 bg-[radial-gradient(#0CE8C0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-30" />
        </div>
      )}

      {/* Fondo Verde Cian #0CE8C0 puro con puntos en #1D2935 (sin degradados) */}
      {variante === 'cyanSolidDots' && (
        <div className="absolute inset-0 bg-[#0CE8C0]">
          <div className="absolute inset-0 bg-[radial-gradient(#1D2935_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
        </div>
      )}

      {/* ========================================== */}
      {/* 🟢 VARIANTES VERDE ATOM (#0DEDC0) */}
      {/* ========================================== */}

      {/* Solo Verde ATOM (#0DEDC0) */}
      {variante === 'atomGreenOnly' && (
        <div className="absolute inset-0 bg-[#06201B]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#0DEDC0/35_0%,transparent_70%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0DEDC0]/20 via-[#06201B] to-[#041411]" />
        </div>
      )}

      {/* Verde con Punticos Sutiles */}
      {variante === 'atomGreenDots' && (
        <div className="absolute inset-0 bg-[#06201B]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#0DEDC0/30_0%,transparent_75%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(#0DEDC0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#06201B]/50 to-[#041411]" />
        </div>
      )}

      {/* Verde con Cuadritos Sutiles */}
      {variante === 'atomGreenGrid' && (
        <div className="absolute inset-0 bg-[#06201B]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#0DEDC0/25_0%,transparent_75%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0DEDC0_1px,transparent_1px),linear-gradient(to_bottom,#0DEDC0_1px,transparent_1px)] bg-[size:32px_32px] opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#06201B]/40 to-[#041411]" />
        </div>
      )}

      {/* ========================================== */}
      {/* 1. FONDOS ESTRUCTURALES (MALLAS Y GEOMETRÍA) */}
      {/* ========================================== */}

      {variante === 'gridCyber' && (
        <div className="absolute inset-0 bg-[#090D16]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E293B_1px,transparent_1px),linear-gradient(to_bottom,#1E293B_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.05]" />
        </div>
      )}

      {variante === 'dotMatrix' && (
        <div className="absolute inset-0 bg-[#090D16]">
          <div className="absolute inset-0 bg-[radial-gradient(#6884C5_2px,transparent_2px)] [background-size:24px_24px] opacity-20" />
        </div>
      )}

      {variante === 'perspectiveGrid' && (
        <div className="absolute inset-0 bg-[#090D16] [perspective:1000px]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0DEDC0_1px,transparent_1px),linear-gradient(to_bottom,#0DEDC0_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 [transform:rotateX(60deg)_translateY(-20%)] [transform-origin:top_center]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-transparent to-transparent" />
        </div>
      )}

      {variante === 'hexGrid' && (
        <div className="absolute inset-0 bg-[#090D16]">
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `radial-gradient(#00F2FE 1px, transparent 0)`,
              backgroundSize: '30px 30px',
              backgroundPosition: '-15px -15px'
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,242,254,0.08),transparent_100%)]" />
        </div>
      )}

      {variante === 'isometricLattice' && (
        <div className="absolute inset-0 bg-[#090D16]">
          <div className="absolute inset-0 bg-[linear-gradient(30deg,#6884C5_1px,transparent_1px),linear-gradient(150deg,#6884C5_1px,transparent_1px)] bg-[size:30px_52px] opacity-10" />
        </div>
      )}

      {/* ========================================== */}
      {/* 2. FONDOS DE ILUMINACIÓN Y FOCO (GLOWS & NEÓN) */}
      {/* ========================================== */}

      {variante === 'spotlightCyan' && (
        <div className="absolute inset-0 bg-[#090D16]">
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#0DEDC0]/15 rounded-full blur-[120px]" />
        </div>
      )}

      {variante === 'dualAmbient' && (
        <div className="absolute inset-0 bg-[#090D16]">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#1877F2]/20 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#0DEDC0]/15 rounded-full blur-[140px]" />
        </div>
      )}

      {variante === 'beamBurst' && (
        <div className="absolute inset-0 bg-[#090D16]">
          <div className="absolute -top-40 -left-20 w-[800px] h-[400px] bg-gradient-to-br from-[#0DEDC0]/20 via-[#6884C5]/10 to-transparent rotate-[-25deg] blur-3xl" />
        </div>
      )}

      {variante === 'auroraBoreal' && (
        <div className="absolute inset-0 bg-[#090D16]">
          <div className="absolute top-[-15%] left-[20%] w-[60%] h-[70%] bg-[#0DEDC0]/15 rounded-full blur-[130px] animate-pulse" />
          <div className="absolute bottom-[-15%] right-[10%] w-[50%] h-[60%] bg-[#102935]/80 rounded-full blur-[110px]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#090D16] via-transparent to-transparent" />
        </div>
      )}

      {variante === 'vignetteDark' && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#102935_0%,#05080E_100%)]" />
      )}

      {/* ========================================== */}
      {/* 3. FONDOS CONCEPTUAL-LOGÍSTICOS (DATA & REDES) */}
      {/* ========================================== */}

      {variante === 'constellation' && (
        <div className="absolute inset-0 bg-[#090D16]">
          <div className="absolute inset-0 bg-[radial-gradient(#0DEDC0_2px,transparent_2px)] [background-size:64px_64px] opacity-30" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#6884C5_1px,transparent_1px)] [background-size:64px_64px] opacity-10" />
        </div>
      )}

      {variante === 'frequencyWaves' && (
        <div className="absolute inset-0 bg-[#090D16]">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,#0DEDC0_0,#0DEDC0_1px,transparent_0,transparent_20px)] opacity-[0.04]" />
        </div>
      )}

      {variante === 'circuitBoard' && (
        <div className="absolute inset-0 bg-[#090D16]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#1E293B_1px,transparent_1px),linear-gradient(0deg,#1E293B_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
          <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-[#0DEDC0] shadow-[0_0_8px_#0DEDC0]" />
          <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-[#6884C5] shadow-[0_0_8px_#6884C5]" />
        </div>
      )}

      {variante === 'financialBlur' && (
        <div className="absolute inset-0 bg-[#090D16]">
          <div className="absolute top-[20%] left-[15%] w-24 h-64 bg-[#0DEDC0]/20 blur-[80px]" />
          <div className="absolute top-[10%] left-[45%] w-24 h-96 bg-[#6884C5]/20 blur-[90px]" />
          <div className="absolute top-[30%] left-[75%] w-24 h-48 bg-[#8B5CF6]/20 blur-[80px]" />
        </div>
      )}

      {variante === 'topographicIsobars' && (
        <div className="absolute inset-0 bg-[#090D16]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#6884C5_1px,transparent_100%)] bg-[size:100px_60px] opacity-[0.03]" />
        </div>
      )}

      {/* ========================================== */}
      {/* 4. FONDOS TEXTURIZADOS Y ELEVACIÓN (GLASS & DEPTH) */}
      {/* ========================================== */}

      {variante === 'darkNoise' && (
        <div className="absolute inset-0 bg-[#090D16]">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] opacity-[0.03]" />
        </div>
      )}

      {variante === 'gradientMesh' && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#090D16] via-[#102935] to-[#0A1A24]">
          <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-[#1E293B]/40 rounded-full blur-[100px]" />
        </div>
      )}

      {variante === 'glassmorphism' && (
        <div className="absolute inset-0 bg-[#090D16]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#0DEDC0]/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[#090D16]/40 backdrop-blur-[16px]" />
        </div>
      )}

      {variante === 'bokehParticles' && (
        <div className="absolute inset-0 bg-[#090D16]">
          <div className="absolute top-1/4 left-1/5 w-12 h-12 rounded-full bg-[#0DEDC0]/10 blur-md animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-20 h-20 rounded-full bg-[#6884C5]/10 blur-xl" />
          <div className="absolute bottom-1/4 left-1/3 w-8 h-8 rounded-full bg-[#0DEDC0]/20 blur-sm" />
        </div>
      )}

      {variante === 'bentoSlate' && (
        <div className="absolute inset-0 bg-[#090D16]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E293B_1px,transparent_1px),linear-gradient(to_bottom,#1E293B_1px,transparent_1px)] bg-[size:120px_120px] opacity-40" />
        </div>
      )}

    </div>
  );
}