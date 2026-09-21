'use client';

import React from 'react';
import Menu from './paginas/Menu';
import Contacto from './paginas/Contacto';

export default function MenuContactoPage() {
  // 🎨 CONFIGURA LAS VARIANTES DE FONDO PARA PROBARLAS AQUÍ:
  const fondoMenu = 'spotlightCyan';          // Opciones: 'gridCyber', 'atomGreenTop', 'hexGrid', 'spotlightCyan', 'atomDynamicGradient'
  const fondoContacto = 'spotlightCyan';  // Opciones: 'spotlightCyan', 'atomGreenDots', 'gridCyber', 'hexGrid'

  return (
    <main className="min-h-screen bg-[#070B14] w-full overflow-x-hidden flex flex-col justify-between">
      
      {/* 1. MENÚ SUPERIOR (Aplica la variante definida arriba) */}
      <Menu variante={fondoMenu} />

      {/* ÁREA CENTRAL DE VISUALIZACIÓN */}
      <div className="flex-1 flex items-center justify-center py-20 px-4 text-center">
        <div className="p-6 rounded-2xl bg-[#102935]/80 border border-[#0DEDC0]/30 max-w-md backdrop-blur-md shadow-2xl">
          <p className="text-xs font-mono text-[#0DEDC0] font-bold uppercase tracking-wider mb-2">
            Vista Previa de Componentes
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            Fondo Menú activo: <code className="text-[#0DEDC0] font-bold bg-[#091A23] px-2 py-0.5 rounded border border-[#0DEDC0]/30">{fondoMenu}</code> <br />
            Fondo Contacto activo: <code className="text-[#0DEDC0] font-bold bg-[#091A23] px-2 py-0.5 rounded border border-[#0DEDC0]/30">{fondoContacto}</code>
          </p>
        </div>
      </div>

      {/* 2. PIE DE PÁGINA Y CONTACTO (Aplica la variante definida arriba) */}
      <Contacto variante={fondoContacto} />

    </main>
  );
}