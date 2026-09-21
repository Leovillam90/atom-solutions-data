'use client';

import React from 'react';
import Menu from './paginas/Menu';
import Contacto from './paginas/Contacto';

export default function MenuContactoPage() {
  // 🎨 CONFIGURA LAS VARIANTES DE FONDO DIRECTAMENTE AQUÍ:
  const fondoMenu = 'hexGrid';         // Opciones: 'gridCyber', 'atomGreenTop', 'hexGrid', 'spotlightCyan', etc.
  const fondoContacto = 'spotlightCyan'; // Opciones: 'spotlightCyan', 'atomGreenDots', 'gridCyber', 'hexGrid', etc.

  return (
    <main className="min-h-screen bg-[#070B14] w-full overflow-x-hidden flex flex-col justify-between">
      
      {/* 1. MENÚ SUPERIOR */}
      <Menu variante={fondoMenu} />

      {/* ÁREA CENTRAL DE VISUALIZACIÓN */}
      <div className="flex-1 flex items-center justify-center py-20 px-4 text-center">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 max-w-md">
          <p className="text-xs font-mono text-[#0DEDC0] font-bold uppercase tracking-wider mb-1">
            Vista Previa de Componentes
          </p>
          <p className="text-xs text-slate-300">
            Fondo Menú: <code className="text-white font-bold">{fondoMenu}</code> <br />
            Fondo Contacto: <code className="text-white font-bold">{fondoContacto}</code>
          </p>
        </div>
      </div>

      {/* 2. PIE DE PÁGINA Y CONTACTO */}
      <Contacto variante={fondoContacto} />

    </main>
  );
}