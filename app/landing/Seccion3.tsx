'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PackageSearch, ClockAlert, TrendingDown, ArrowRight } from 'lucide-react';
import { Kicker, H2, H3, Subtitulo, Texto, Highlight } from '@/app/complementos/Tipografia';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';

interface Seccion3Props {
  variante?: TipoFondo;
}

interface TarjetaDiagnostico {
  id: string;
  titulo: string;
  descripcion: string;
  ctaText: string;
  ctaLink: string;
  icon: React.ReactNode;
}

const DIAGNOSTICOS: readonly TarjetaDiagnostico[] = Object.freeze([
  {
    id: 'descontrol-guias',
    titulo: 'Descontrol de Guías',
    descripcion: 'Dejas de rastrear el estado real de tus envíos y las devoluciones que jamás reingresan a tus estantes. Al no auditar en tiempo real, tu bodega asume pérdidas netas mes a mes en silencio.',
    ctaText: 'Radar de auditoría en tiempo real',
    ctaLink: 'https://atomapp.com.co/register',
    icon: <PackageSearch className="w-5 h-5 text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.4)]" />
  },
  {
    id: 'novedades-manuales',
    titulo: 'Novedades Manuales',
    descripcion: 'Pierdes horas al día chateando con soporte Dropi y transportadoras para destrabar envíos uno por uno. Sin una automatización que tome el control en tiempo real, las soluciones llegan tarde, las guías se marcan como devueltas y tu bodega absorbe el costo de la ineficiencia.',
    ctaText: 'Sistema de resolución automatizado',
    ctaLink: 'https://atomapp.com.co/register',
    icon: <ClockAlert className="w-5 h-5 text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.4)]" />
  },
  {
    id: 'margenes-ciegas',
    titulo: 'Márgenes a Ciegas',
    descripcion: 'Adivinas tu ganancia real sin conocer el costo exacto de la mercancía no devuelta. Al calcular tu utilidad sobre el precio de lista y no sobre despachos efectivos, absorbes mermas invisibles que devoran tu margen neto mes a mes.',
    ctaText: 'Tablero exacto de ROI operativo',
    ctaLink: 'https://atomapp.com.co/register',
    icon: <TrendingDown className="w-5 h-5 text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.4)]" />
  }
]);

export default function Seccion3({ variante = 'perspectiveGrid' }: Seccion3Props) {
  return (
    <section className="relative z-10 py-20 px-6 overflow-hidden">
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* ENCABEZADO DE SECCIÓN */}
        <div className="text-center mb-16">
          <Kicker varianteFondo={variante}>DIAGNÓSTICO OPERATIVO</Kicker>

          <H2 varianteFondo={variante} className="text-balance">
            ¿Cuánto capital <Highlight varianteFondo={variante}>dejaste estancado</Highlight> este mes?
          </H2>

          <Subtitulo varianteFondo={variante} className="max-w-[720px] mx-auto mt-3">
            El descontrol logístico no es un error de cálculo, es la pérdida directa de tu dinero.
          </Subtitulo>
        </div>

        {/* PARRILLA DE TARJETAS DE ALTO CONTRASTE Y PROFUNDIDAD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DIAGNOSTICOS.map((tarjeta, idx) => (
            <motion.div 
              key={tarjeta.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative group bg-gradient-to-b from-[#0F2633]/95 via-[#0B1C26]/95 to-[#07131C]/98 border border-[#0DEDC0]/30 border-t-[#0DEDC0]/70 rounded-2xl p-8 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-[#0DEDC0] hover:shadow-[0_20px_45px_rgba(0,0,0,0.8),0_0_30px_rgba(13,237,192,0.25)] hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
            >
              {/* LÍNEA DE RESPLANDOR SUPERIOR */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#0DEDC0]/60 to-transparent" />
              
              {/* HAZ DE LUZ AMBIENTAL DENTRO DE LA TARJETA */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0DEDC0]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#0DEDC0]/15 transition-all duration-500" />

              <div className="relative z-10">
                {/* CONTENEDOR DE ICONO DESTACADO */}
                <div className="w-11 h-11 bg-red-500/15 rounded-xl flex items-center justify-center mb-6 border border-red-500/30 shadow-[0_4px_15px_rgba(239,68,68,0.2)]">
                  {tarjeta.icon}
                </div>
                
                <H3 varianteFondo={variante} className="mb-3 text-white group-hover:text-[#0DEDC0] transition-colors">
                  {tarjeta.titulo}
                </H3>
                
                <Texto varianteFondo={variante} className="mb-6 text-slate-300 leading-relaxed font-normal">
                  {tarjeta.descripcion}
                </Texto>
              </div>
              
              {/* LINK DE ACCIÓN INFERIOR CON FLECHA ANIMADA */}
              <a 
                href={tarjeta.ctaLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="relative z-10 border-t border-white/15 pt-4 text-[#0DEDC0] text-xs sm:text-sm font-bold flex items-center justify-between group/link hover:text-white transition-colors"
              >
                <span>{tarjeta.ctaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1 text-[#0DEDC0]" />
              </a>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}