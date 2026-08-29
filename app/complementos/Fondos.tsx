'use client';

import React from 'react';

export type TipoFondo =
  // 1. ESTRUCTURALES (Mallas y Geometría)
  | 'gridCyber'
  | 'dotMatrix'
  | 'perspectiveGrid'
  | 'hexGrid'
  | 'isometricLattice'
  | 'colorWavesGrid'
  // 2. ILUMINACIÓN Y FOCO (Glows & Neón)
  | 'spotlightCyan'
  | 'dualAmbient'
  | 'beamBurst'
  | 'auroraBoreal'
  | 'vignetteDark'
  // 3. VARIANTES VERDE ATOM (#0DEDC0)
  | 'atomGreenOnly'
  | 'atomGreenDots'
  | 'atomGreenGrid'
  // 4. CONCEPTUAL-LOGÍSTICOS (Data & Redes)
  | 'constellation'
  | 'frequencyWaves'
  | 'circuitBoard'
  | 'financialBlur'
  | 'topographicIsobars'
  // 5. TEXTURIZADOS Y ELEVACIÓN (Glass & Depth)
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

const POSICION_MAP: Record<'absolute' | 'fixed' | 'relative', string> = {
  fixed: 'fixed',
  relative: 'relative',
  absolute: 'absolute',
};

export default function Fondos({ 
  variante = 'gridCyber', 
  modo = 'absolute',
  className = '' 
}: FondosProps) {
  const posicionClass = POSICION_MAP[modo] || 'absolute';

  const renderFondo = () => {
    switch (variante) {
      // ==========================================
      // 🌊 ONDAS DE COLORES ANIMADAS
      // ==========================================
      case 'colorWavesGrid':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[70%] bg-[#0DEDC0]/15 rounded-full blur-[140px] animate-pulse [animation-duration:6s] will-change-transform" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[70%] h-[60%] bg-[#CB1FDA]/15 rounded-full blur-[150px] animate-pulse [animation-duration:8s] will-change-transform" />
            <div className="absolute top-[30%] right-[15%] w-[500px] h-[300px] bg-[#0DEDC0]/10 rounded-full blur-[120px] -rotate-12 animate-pulse [animation-duration:7s] will-change-transform" />
            <div className="absolute inset-0 bg-[radial-gradient(#68B4C5_1px,transparent_1px)] [background-size:28px_28px] opacity-20" />
            <div className="absolute bottom-0 left-0 right-0 h-[60%] [perspective:1000px] overflow-hidden">
              <div className="w-full h-[200%] bg-[linear-gradient(to_right,#0DEDC0_1px,transparent_1px),linear-gradient(to_bottom,#0DEDC0_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 [transform:rotateX(75deg)] [transform-origin:bottom_center] transform-gpu" />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#102935]/80 to-[#102935]" />
            </div>
          </div>
        );

      // ==========================================
      // 🟢 VARIANTES VERDE ATOM (#0DEDC0)
      // ==========================================
      case 'atomGreenOnly':
        return <div className="absolute inset-0 bg-[#0DEDC0]" />;

      case 'atomGreenDots':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute inset-0 bg-[radial-gradient(#0DEDC0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-30" />
          </div>
        );

      case 'atomGreenGrid':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#0DEDC0/25_0%,transparent_75%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0DEDC0_1px,transparent_1px),linear-gradient(to_bottom,#0DEDC0_1px,transparent_1px)] bg-[size:32px_32px] opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#102935]/40 to-[#102935]" />
          </div>
        );

      // ==========================================
      // 1. MALLAS Y GEOMETRÍA
      // ==========================================
      case 'gridCyber':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#68B4C5_1px,transparent_1px),linear-gradient(to_bottom,#68B4C5_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.10]" />
          </div>
        );

      case 'dotMatrix':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute inset-0 bg-[radial-gradient(#68B4C5_2px,transparent_2px)] [background-size:24px_24px] opacity-20" />
          </div>
        );

      case 'perspectiveGrid':
        return (
          <div className="absolute inset-0 bg-[#102935] [perspective:1000px]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0DEDC0_1px,transparent_1px),linear-gradient(to_bottom,#0DEDC0_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 [transform:rotateX(60deg)_translateY(-20%)] [transform-origin:top_center] transform-gpu" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102935] via-transparent to-transparent" />
          </div>
        );

      case 'hexGrid':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0DEDC0_1px,transparent_0)] bg-[size:30px_30px] bg-[-15px_-15px]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(13,237,192,0.08),transparent_100%)]" />
          </div>
        );

      case 'isometricLattice':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute inset-0 bg-[linear-gradient(30deg,#68B4C5_1px,transparent_1px),linear-gradient(150deg,#68B4C5_1px,transparent_1px)] bg-[size:30px_52px] opacity-10" />
          </div>
        );

      // ==========================================
      // 2. ILUMINACIÓN Y FOCO
      // ==========================================
      case 'spotlightCyan':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#0DEDC0]/15 rounded-full blur-[120px]" />
          </div>
        );

      case 'dualAmbient':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#68B4C5]/20 rounded-full blur-[140px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#0DEDC0]/15 rounded-full blur-[140px]" />
          </div>
        );

      case 'beamBurst':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute -top-40 -left-20 w-[800px] h-[400px] bg-gradient-to-br from-[#0DEDC0]/20 via-[#68B4C5]/10 to-transparent rotate-[-25deg] blur-3xl" />
          </div>
        );

      case 'auroraBoreal':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute top-[-15%] left-[20%] w-[60%] h-[70%] bg-[#0DEDC0]/15 rounded-full blur-[130px] animate-pulse [animation-duration:5s] will-change-transform" />
            <div className="absolute bottom-[-15%] right-[10%] w-[50%] h-[60%] bg-[#CB1FDA]/15 rounded-full blur-[110px]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#102935] via-transparent to-transparent" />
          </div>
        );

      case 'vignetteDark':
        return <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1D3A49_0%,#102935_100%)]" />;

      // ==========================================
      // 3. CONCEPTUAL-LOGÍSTICOS
      // ==========================================
      case 'constellation':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute inset-0 bg-[radial-gradient(#0DEDC0_2px,transparent_2px)] [background-size:64px_64px] opacity-30" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,#68B4C5_1px,transparent_1px)] [background-size:64px_64px] opacity-10" />
          </div>
        );

      case 'frequencyWaves':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,#0DEDC0_0,#0DEDC0_1px,transparent_0,transparent_20px)] opacity-[0.04]" />
          </div>
        );

      case 'circuitBoard':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#68B4C5_1px,transparent_1px),linear-gradient(0deg,#68B4C5_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
            <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-[#0DEDC0] shadow-[0_0_8px_#0DEDC0]" />
            <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-[#CB1FDA] shadow-[0_0_8px_#CB1FDA]" />
          </div>
        );

      case 'financialBlur':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute top-[20%] left-[15%] w-24 h-64 bg-[#0DEDC0]/20 blur-[80px]" />
            <div className="absolute top-[10%] left-[45%] w-24 h-96 bg-[#68B4C5]/20 blur-[90px]" />
            <div className="absolute top-[30%] left-[75%] w-24 h-48 bg-[#CB1FDA]/20 blur-[80px]" />
          </div>
        );

      case 'topographicIsobars':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#68B4C5_1px,transparent_100%)] bg-[size:100px_60px] opacity-[0.05]" />
          </div>
        );

      // ==========================================
      // 4. TEXTURIZADOS Y ELEVACIÓN
      // ==========================================
      case 'darkNoise':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] opacity-[0.03]" />
          </div>
        );

      case 'gradientMesh':
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-[#102935] via-[#102935] to-[#0A1A24]">
            <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-[#68B4C5]/20 rounded-full blur-[100px]" />
          </div>
        );

      case 'glassmorphism':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#0DEDC0]/10 rounded-full blur-[100px]" />
            <div className="absolute inset-0 bg-[#102935]/40 backdrop-blur-[16px]" />
          </div>
        );

      case 'bokehParticles':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute top-1/4 left-1/5 w-12 h-12 rounded-full bg-[#0DEDC0]/10 blur-md animate-pulse" />
            <div className="absolute top-3/4 right-1/4 w-20 h-20 rounded-full bg-[#CB1FDA]/10 blur-xl" />
            <div className="absolute bottom-1/4 left-1/3 w-8 h-8 rounded-full bg-[#0DEDC0]/20 blur-sm" />
          </div>
        );

      case 'bentoSlate':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#68B4C5_1px,transparent_1px),linear-gradient(to_bottom,#68B4C5_1px,transparent_1px)] bg-[size:120px_120px] opacity-10" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`${posicionClass} inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      {renderFondo()}
    </div>
  );
}