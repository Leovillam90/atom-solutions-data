'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Flame, ArrowRight, Sparkles } from 'lucide-react';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';

interface Articulo {
  id: number;
  titulo: string;
  resumen: string;
  categoria: string;
  fecha: string;
  tiempoLectura: string;
  autor: string;
  destacado: boolean;
  tagColor: string;
  link?: string;
  badge?: string;
  textoCta?: string;
  esInstagram?: boolean;
}

interface Pagina2Props {
  articulosSecundarios?: Articulo[];
  variante?: TipoFondo;
}

const ARTICULOS_DEFAULT: Articulo[] = [
  {
    id: 2,
    titulo: 'EVENTO PRESENCIAL ✕ EXPO WINNERS BY DROPI',
    resumen: 'En Expo Winners, los verdaderos top sellers no buscan cualquier proveedor: buscan Proveedores de Alto Rendimiento ATOM. Posiciona tu bodega en el evento como el aliado clave para privatizar productos ganadores y cerrar acuerdos exclusivos por efectividad de entrega.',
    categoria: 'ALIANZAS ESTRATÉGICAS',
    fecha: '12 y 13 de Septiembre | Ágora Bogotá',
    tiempoLectura: 'Proveedores ATOM',
    autor: 'Producto & Tech',
    destacado: true,
    tagColor: '#6884C5',
    link: 'https://wa.me/573122521130?text=Hola,%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20la%20estrategia%20Expo%20Winners',
    badge: 'IMPORTANTE',
    textoCta: 'SABER MÁS DEL EVENTO',
  },
  {
    id: 3,
    titulo: 'El puente directo entre grandes importadores y compradores VIP.',
    resumen: 'Una línea comercial exclusiva donde ambas partes ganan: Si compras al por mayor, aseguras inventario ganador a precios de puerto antes de que salga al mercado. Si eres importador, pre-vendes tus contenedores en tránsito y liberas flujo de caja en tiempo récord.',
    categoria: 'DROKO',
    fecha: 'Agosto 25 del 2026',
    tiempoLectura: 'Línea Comercial',
    autor: 'ATOM & Droko',
    destacado: false,
    tagColor: '#0DEDC0',
    link: 'https://app.droko.app/login',
    textoCta: 'VER DROKO',
  },
  {
    id: 4,
    titulo: 'Conoce cómo este proveedor recuperó el 30% en devoluciones fantasma en solo 60 días.',
    resumen: 'Dejó de asumir pérdidas a ciegas. Descubre la estrategia operativa exacta que aplicó para auditar guías retenidas, frenar el desangre de fletes y blindar su capital operativo con ATOM.',
    categoria: 'CASO DE ÉXITO | ESTUDIO DE BODEGA',
    fecha: '28 Jun, 2026',
    tiempoLectura: '5 min de video',
    autor: 'Casos ATOM',
    destacado: false,
    tagColor: '#CB1FDA',
    link: 'https://www.instagram.com/s/aGlnaGxpZ2h0OjE4MDQ5MTA3MTMxMTEyNTg1?igsi=aDFjcm4wdHF2ZHRt',
    textoCta: 'VER TESTIMONIO',
    esInstagram: true,
  },
];

export default function Pagina2({
  articulosSecundarios = ARTICULOS_DEFAULT,
  variante = 'perspectiveGrid',
}: Pagina2Props) {
  return (
    <section className="relative z-10 py-16 lg:py-24 px-6 overflow-hidden w-full border-t border-[#0DEDC0]/10 font-sans">
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* TITULAR DE SECCIÓN */}
        <div className="w-full flex items-center gap-3 mb-10">
          <div className="w-1.5 h-7 bg-[#0DEDC0] rounded-full shadow-[0_0_10px_#0DEDC0]" />
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Últimas Publicaciones & Alianzas
          </h3>
        </div>

        {/* REJILLA DE TARJETAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {articulosSecundarios.map((art, idx) => (
            <motion.article
              key={art.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className={`group relative flex flex-col justify-between p-7 rounded-2xl backdrop-blur-xl transition-all duration-300 ${
                art.destacado
                  ? 'bg-gradient-to-b from-[#0F2836] via-[#0B1D28] to-[#07131B] border-2 border-[#0DEDC0] shadow-[0_0_30px_rgba(13,237,192,0.2)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.7),0_0_35px_rgba(13,237,192,0.35)]'
                  : 'bg-[#090D16]/80 border border-slate-800/80 hover:border-[#0DEDC0]/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(13,237,192,0.15)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <span
                    className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-lg border flex items-center gap-1.5"
                    style={{
                      color: art.tagColor,
                      backgroundColor: `${art.tagColor}15`,
                      borderColor: `${art.tagColor}40`,
                    }}
                  >
                    <Sparkles className="w-3 h-3" />
                    {art.categoria}
                  </span>

                  {art.badge ? (
                    <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full bg-[#0DEDC0] text-[#090D16] tracking-wider animate-pulse flex items-center gap-1 shadow-[0_0_10px_rgba(13,237,192,0.5)]">
                      <Flame className="w-3 h-3 fill-current" /> {art.badge}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs font-mono font-medium">
                      {art.fecha}
                    </span>
                  )}
                </div>

                <h4 className="text-lg sm:text-xl font-black text-white leading-snug mb-3 group-hover:text-[#0DEDC0] transition-colors tracking-tight">
                  {art.titulo}
                </h4>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                  {art.resumen}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[#6884C5] text-xs font-mono font-semibold">
                  {art.tiempoLectura}
                </span>

                {art.link && (
                  <a
                    href={art.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0DEDC0] text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    <span>{art.textoCta || 'Leer'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}