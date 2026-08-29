'use client';

import React, { useState } from 'react';
import LandingCMS from './cms/LandingCMS';
import NoticiasCMS from './cms/NoticiasCMS';
import AcademyCMS from './cms/AcademyCMS';
import SoporteCMS from './cms/SoporteCMS';

type ModuloCMS = 'LANDING' | 'NOTICIAS' | 'ACADEMY' | 'SOPORTE';

export default function Pagina2() {
  const [moduloActivo, setModuloActivo] = useState<ModuloCMS>('LANDING');

  return (
    <div className="font-sans text-white space-y-6 pb-12">
      
      {/* BARRA DE BOTONES PARA MÓDULOS DEL CMS */}
      <div className="bg-[#090D16]/90 backdrop-blur-xl p-5 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0DEDC0] animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-[#0DEDC0] uppercase tracking-widest">
              GESTOR DE CONTENIDOS EN TIEMPO REAL (CMS)
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Editor Central de Contenidos</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#050811] rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setModuloActivo('LANDING')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
              moduloActivo === 'LANDING' ? 'bg-[#0DEDC0] text-[#090D16] shadow-[0_0_15px_rgba(13,237,192,0.3)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌐 1. Landing Page
          </button>

          <button
            type="button"
            onClick={() => setModuloActivo('NOTICIAS')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
              moduloActivo === 'NOTICIAS' ? 'bg-[#0DEDC0] text-[#090D16] shadow-[0_0_15px_rgba(13,237,192,0.3)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            📰 2. Noticias
          </button>

          <button
            type="button"
            onClick={() => setModuloActivo('ACADEMY')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
              moduloActivo === 'ACADEMY' ? 'bg-[#0DEDC0] text-[#090D16] shadow-[0_0_15px_rgba(13,237,192,0.3)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎓 3. Academy
          </button>

          <button
            type="button"
            onClick={() => setModuloActivo('SOPORTE')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
              moduloActivo === 'SOPORTE' ? 'bg-[#0DEDC0] text-[#090D16] shadow-[0_0_15px_rgba(13,237,192,0.3)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            💬 4. Soporte & FAQ
          </button>
        </div>
      </div>

      {/* COMPONENTES DE EDICIÓN */}
      <div className="animate-fade-in">
        {moduloActivo === 'LANDING' && <LandingCMS />}
        {moduloActivo === 'NOTICIAS' && <NoticiasCMS />}
        {moduloActivo === 'ACADEMY' && <AcademyCMS />}
        {moduloActivo === 'SOPORTE' && <SoporteCMS />}
      </div>

    </div>
  );
}