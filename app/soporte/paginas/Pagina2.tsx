'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { Kicker, H2, Subtitulo, Highlight } from '@/app/complementos/Tipografia';
import { FAQS_OFICIALES, FAQItem } from '@/app/complementos/Preguntas';

interface Pagina2Props {
  variante?: TipoFondo;
}

const CATEGORIAS = [
  'Todas',
  'Integración',
  'Inventario',
  'Auditoría Financiera',
  'Automatización',
  'Planes y Facturación',
];

export default function Pagina2({ variante = 'perspectiveGrid' }: Pagina2Props) {
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
    <section className="relative z-10 py-16 lg:py-24 px-6 overflow-hidden w-full border-t border-[#0DEDC0]/10 font-sans">
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* TITULAR */}
        <div className="text-center mb-8">
          <Kicker varianteFondo={variante}>RESOLUCIÓN DE DUDAS</Kicker>

          <H2 varianteFondo={variante} className="text-balance mb-4 max-w-4xl mx-auto">
            Centro de <Highlight varianteFondo={variante}>Inteligencia Operativa.</Highlight>
          </H2>

          <Subtitulo varianteFondo={variante} className="max-w-3xl mx-auto">
            Encuentra la respuesta exacta para destrabar tu logística, blindar tu operación y mantener tu capital circulando.
          </Subtitulo>
        </div>

        {/* INPUT DE BÚSQUEDA */}
        <div className="w-full max-w-2xl mb-8 relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-[#0DEDC0] pointer-events-none" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar pregunta o palabra clave (ej: Dropi, fletes, stock, DIAN...)"
              className="w-full bg-[#102935]/80 border-2 border-[#6884C5]/30 focus:border-[#0DEDC0] rounded-2xl py-3.5 pl-12 pr-10 text-white placeholder-slate-400 text-xs sm:text-sm outline-none backdrop-blur-md transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            />

            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda('')}
                className="absolute right-4 text-slate-400 hover:text-white bg-transparent border-none cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* CATEGORÍAS */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12 w-full">
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

        {/* MENSAJE DE BÚSQUEDA VACÍA */}
        {faqsFiltradas.length === 0 && (
          <div className="text-center py-10 px-6 bg-[#102935]/60 border border-slate-800 rounded-2xl max-w-lg w-full mb-8 backdrop-blur-md">
            <HelpCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
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
              className="bg-[#0DEDC0] text-[#091A23] font-black text-xs px-4 py-2 rounded-xl border-none cursor-pointer"
            >
              Restablecer búsqueda
            </button>
          </div>
        )}

        {/* LISTA DE FAQS ACORDEÓN CON FRAMER MOTION */}
        <div className="flex flex-col gap-3.5 w-full max-w-4xl mx-auto">
          {faqsFiltradas.map((faq: FAQItem) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border backdrop-blur-md transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#090D16]/90 border-[#0DEDC0]/60 shadow-[0_10px_25px_rgba(13,237,192,0.15)]'
                    : 'bg-[#090D16]/60 border-slate-800 hover:border-[#0DEDC0]/40'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex justify-between items-center text-sm sm:text-base font-black text-white bg-transparent border-none cursor-pointer gap-4"
                >
                  <span className="tracking-tight leading-snug">{faq.pregunta}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#0DEDC0] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-300 border-t border-white/10 pt-3.5 leading-relaxed font-medium"
                    >
                      <span className="text-[#0DEDC0] text-[10px] sm:text-xs font-mono font-extrabold uppercase tracking-wider flex items-center gap-1 mb-2">
                        <Sparkles className="w-3 h-3" />
                        {faq.categoria}
                      </span>
                      {faq.respuesta}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}