'use client';

import React from 'react';

export type TipoFondo =
  | 'atomDynamicGradient'
  | 'atomGreenTop'
  | 'vignetteDark'
  | 'spotlightCyan'
  | 'circuitBoard'
  | 'perspectiveGrid'
  | 'gridCyber'
  | 'hexGrid'
  | 'dualAmbient'
  | 'atomGreenDots';

interface FondosProps {
  variante?: TipoFondo;
  modo?: 'absolute' | 'fixed' | 'relative';
  opacidad?: string;
  className?: string;
}

const POSICION_MAP: Record<'absolute' | 'fixed' | 'relative', string> = {
  fixed: 'fixed',
  relative: 'relative',
  absolute: 'absolute',
};

export default function Fondos({ 
  variante = 'atomGreenTop', 
  modo = 'absolute',
  opacidad = 'opacity-100',
  className = '' 
}: FondosProps) {
  const posicionClass = POSICION_MAP[modo] || 'absolute';

  const renderFondo = () => {
    switch (variante) {
      case 'atomGreenTop':
        return (
          <div className="absolute inset-0 bg-[#1D2935] overflow-hidden">
            <div className="absolute top-[-20%] inset-x-0 h-[65%] bg-[radial-gradient(ellipse_at_top,#0DEDC0_0%,transparent_75%)] opacity-35 blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0DEDC0]/25 via-[#102935]/80 to-[#1D2935]" />
          </div>
        );

      case 'atomDynamicGradient':
        return (
          <div className="absolute inset-0 bg-[#09111A] overflow-hidden">
            <div className="absolute -top-[25%] -left-[15%] w-[85%] h-[85%] bg-[#CB1FDA]/60 rounded-full blur-[100px] animate-pulse [animation-duration:6s] will-change-transform" />
            <div className="absolute -bottom-[25%] -right-[15%] w-[85%] h-[85%] bg-[#0DEDC0]/55 rounded-full blur-[100px] animate-pulse [animation-duration:8s] will-change-transform" />
            <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] bg-[#68B4C5]/30 rounded-full blur-[80px] animate-pulse [animation-duration:10s] will-change-transform" />
            <div className="absolute inset-0 bg-[#102935]/40 backdrop-blur-[35px]" />
            <div className="absolute inset-0 bg-[radial-gradient(#0DEDC0_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04]" />
          </div>
        );

      case 'vignetteDark':
        return <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1D3A49_0%,#102935_100%)]" />;

      case 'spotlightCyan':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#0DEDC0]/15 rounded-full blur-[120px]" />
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

      case 'perspectiveGrid':
        return (
          <div className="absolute inset-0 bg-[#102935] [perspective:1000px]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0DEDC0_1px,transparent_1px),linear-gradient(to_bottom,#0DEDC0_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 [transform:rotateX(60deg)_translateY(-20%)] [transform-origin:top_center] transform-gpu" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102935] via-transparent to-transparent" />
          </div>
        );

      case 'gridCyber':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#68B4C5_1px,transparent_1px),linear-gradient(to_bottom,#68B4C5_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.10]" />
          </div>
        );

      case 'hexGrid':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0DEDC0_1px,transparent_0)] bg-[size:30px_30px] bg-[-15px_-15px]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(13,237,192,0.08),transparent_100%)]" />
          </div>
        );

      case 'dualAmbient':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#68B4C5]/20 rounded-full blur-[140px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#0DEDC0]/15 rounded-full blur-[140px]" />
          </div>
        );

      case 'atomGreenDots':
        return (
          <div className="absolute inset-0 bg-[#102935]">
            <div className="absolute inset-0 bg-[radial-gradient(#0DEDC0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-30" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`${posicionClass} inset-0 pointer-events-none z-0 overflow-hidden ${opacidad} ${className}`}>
      {renderFondo()}
    </div>
  );
}