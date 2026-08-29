'use client';

import React, { useState } from 'react';
import Pagina1 from './Pagina1';
import Pagina2 from './Pagina2';

export default function AdminPage() {
  const [tabModulo, setTabModulo] = useState<'modulo1' | 'modulo2'>('modulo1');

  const handleLogout = () => {
    sessionStorage.removeItem('atom_admin_session');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-white p-4 sm:p-8 relative font-sans select-none">
      
      {/* Capa de fondo decorativa */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0DEDC0]/10 via-[#070B14] to-[#070B14] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        
        {/* BARRA DE NAVEGACIÓN MAESTRA */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-5 gap-4 bg-[#090D16]/90 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0DEDC0]/10 border border-[#0DEDC0]/40 flex items-center justify-center text-[#0DEDC0] shadow-[0_0_15px_rgba(13,237,192,0.2)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wider uppercase text-white">Panel Administrador ATOM</h1>
              <p className="text-xs text-slate-400 font-mono">Selecciona el módulo de trabajo activo</p>
            </div>
          </div>

          <div className="flex bg-[#050811] p-1.5 rounded-2xl border border-slate-800 shadow-inner">
            <button
              type="button"
              onClick={() => setTabModulo('modulo1')}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                tabModulo === 'modulo1'
                  ? 'bg-[#0DEDC0] text-[#090D16] shadow-[0_0_20px_rgba(13,237,192,0.4)] scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-[#102935]/50'
              }`}
            >
              <span>📊 Módulo 1: Consola Operativa</span>
            </button>

            <button
              type="button"
              onClick={() => setTabModulo('modulo2')}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                tabModulo === 'modulo2'
                  ? 'bg-[#0DEDC0] text-[#090D16] shadow-[0_0_20px_rgba(13,237,192,0.4)] scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-[#102935]/50'
              }`}
            >
              <span>✏️ Módulo 2: Editor CMS</span>
            </button>
          </div>
        </header>

        <main>
          {tabModulo === 'modulo1' && <Pagina1 onLogout={handleLogout} />}
          {tabModulo === 'modulo2' && <Pagina2 />}
        </main>

      </div>
    </div>
  );
}