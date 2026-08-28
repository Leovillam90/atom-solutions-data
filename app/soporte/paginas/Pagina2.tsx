'use client';

import React, { useState, useMemo } from 'react';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { Kicker, H2, Subtitulo, Highlight } from '@/app/complementos/Tipografia';
import { FAQS_OFICIALES, FAQItem } from '@/app/complementos/Preguntas';

interface Pagina2Props {
  variante?: TipoFondo;
}

// ARRAY ESTÁTICO EN SCOPE GLOBAL
const CATEGORIAS = [
  'Todas',
  'Integración',
  'Inventario',
  'Auditoría Financiera',
  'Automatización',
  'Planes y Facturación',
];

export default function Pagina2({ variante = 'gridCyber' }: Pagina2Props) {
  const [categoriaActiva, setCategoriaActiva] = useState<string>('Todas');
  const [busqueda, setBusqueda] = useState<string>('');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const faqsFiltradas = useMemo(() => {
    return FAQS_OFICIALES.filter((f: FAQItem) => {
      const coincideCategoria =
        categoriaActiva === 'Todas' || f.categoria === categoriaActiva;

      const termino = busqueda.toLowerCase().trim();
      const coincideBusqueda =
        termino === '' ||
        f.pregunta.toLowerCase().includes(termino) ||
        f.respuesta.toLowerCase().includes(termino) ||
        f.categoria.toLowerCase().includes(termino);

      return coincideCategoria && coincideBusqueda;
    });
  }, [categoriaActiva, busqueda]);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section className="relative z-10 py-16 lg:py-24 px-6 overflow-hidden w-full border-t border-[#0DEDC0]/10">
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-8">
          <Kicker>RESOLUCIÓN DE DUDAS</Kicker>

          <H2 className="text-balance mb-4 max-w-4xl mx-auto">
            Centro de <Highlight>Inteligencia Operativa.</Highlight>
          </H2>

          <Subtitulo className="max-w-3xl mx-auto">
            Encuentra la respuesta exacta para destrabar tu logística, blindar tu operación y mantener tu capital circulando.
          </Subtitulo>
        </div>

        <div className="w-full max-w-2xl mb-8 relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar pregunta o palabra clave (ej: Dropi, fletes, stock, DIAN...)"
              className="w-full bg-[#102935]/80 border-2 border-[#6884C5]/30 focus:border-[#0DEDC0] rounded-2xl py-3.5 pl-12 pr-10 text-white placeholder-slate-400 text-xs sm:text-sm outline-none backdrop-blur-md transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            />
            <svg
              className="absolute left-4 w-5 h-5 text-[#0DEDC0]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda('')}
                className="absolute right-4 text-slate-400 hover:text-white bg-transparent border-none cursor-pointer text-xs font-bold font-mono"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12 w-full">
          {CATEGORIAS.map((cat) => {
            const isActive = categoriaActiva === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoriaActiva(cat)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 border cursor-pointer ${
                  isActive
                    ? 'bg-[#0DEDC0] text-[#091A23] border-[#0DEDC0] shadow-[0_0_20px_rgba(13,237,192,0.4)]'
                    : 'bg-[#102935]/60 text-slate-400 border-[#6884C5]/20 hover:text-white hover:bg-[#102935] hover:border-[#0DEDC0]/30'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {faqsFiltradas.length === 0 && (
          <div className="text-center py-10 px-6 bg-[#102935]/40 border border-[#6884C5]/20 rounded-2xl max-w-lg w-full mb-8">
            <p className="text-white font-bold text-sm mb-1">
              No se encontraron coincidencias para &quot;{busqueda}&quot;
            </p>
            <p className="text-slate-400 text-xs mb-4">
              Intenta buscar con palabras más generales o selecciona otra categoría.
            </p>
            <button
              type="button"
              onClick={() => {
                setBusqueda('');
                setCategoriaActiva('Todas');
              }}
              className="bg-[#0DEDC0] text-[#091A23] font-bold text-xs px-4 py-2 rounded-xl border-none cursor-pointer"
            >
              Restablecer búsqueda
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3.5 w-full max-w-5xl mx-auto">
          {faqsFiltradas.map((faq: FAQItem) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border backdrop-blur-md transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#102935]/80 border-[#0DEDC0]/50 shadow-[0_10px_25px_rgba(13,237,192,0.12)]'
                    : 'bg-[#102935]/50 border-[#6884C5]/20 hover:border-[#0DEDC0]/40'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex justify-between items-center text-sm sm:text-base font-extrabold text-white bg-transparent border-none cursor-pointer gap-4"
                >
                  <span className="tracking-tight leading-snug">{faq.pregunta}</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0DEDC0"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-300 border-t border-white/10 pt-3.5 leading-relaxed font-medium">
                    <span className="text-[#0DEDC0] text-[10px] sm:text-xs font-mono font-extrabold uppercase tracking-wider block mb-2">
                      {faq.categoria}
                    </span>
                    {faq.respuesta}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}