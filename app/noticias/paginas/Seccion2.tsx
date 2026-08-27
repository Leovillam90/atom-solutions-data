'use client';

import React from 'react';
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

interface Seccion2Props {
  articulosSecundarios?: Articulo[];
  variante?: TipoFondo;
}

const ARTICULOS_DEFAULT: Articulo[] = [
  {
    id: 2,
  titulo: 'EVENTO PRESENCIAL ✕ EXPO WINNERS BY DROPI',
  resumen: 'En Expo Winners, los verdaderos top sellers no buscan cualquier proveedor: buscan Proveedores de Alto Rendimiento ATOM. Posiciona tu bodega en el evento como el aliado clave para privatizar productos ganadores y cerrar acuerdos exclusivos por efectividad de entrega.',
  categoria: 'ALIANZAS ESTRATÉGICAS',
  fecha: ' 12 y 13 de Septiembre | Ágora Bogotá',
  tiempoLectura: 'Proveedores ATOM',
  autor: 'Producto & Tech',
  destacado: true,
  tagColor: '#6884C5',
  link: '[https://wa.me/573122521130?text=Hola,%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20la%20estrategia%20Expo%20Winners](https://wa.me/573122521130?text=Hola,%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20la%20estrategia%20Expo%20Winners).',
  badge: 'IMPORTANTE ',
  textoCta: 'SABER MÁS DEL EVENTO →',
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
    textoCta: 'VER DROKO →',
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
    textoCta: 'VER TESTIMONIO ↗',
    esInstagram: true,
  },
];

export default function Seccion2({
  articulosSecundarios = ARTICULOS_DEFAULT,
  variante = 'cyanDotsOnly',
}: Seccion2Props) {
  return (
    <section className="relative z-10 py-16 lg:py-24 px-6 overflow-hidden w-full border-t border-[#0DEDC0]/10">
      {/* 1. CAPA DE FONDO DINÁMICO */}
      <Fondos variante={variante} modo="absolute" />

      {/* 2. CONTENIDO SOBREPUESTO */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* ENCABEZADO */}
        <div className="w-full flex items-center gap-3 mb-8">
          <div className="w-1 h-6 bg-[#0DEDC0] rounded-full" />
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Últimas Publicaciones
          </h3>
        </div>

        {/* GRILLA DE ARTÍCULOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {articulosSecundarios.map((art) => (
            <article
              key={art.id}
              className={`group relative flex flex-col justify-between p-6 rounded-2xl backdrop-blur-md transition-all duration-300 ${
                art.destacado
                  ? 'bg-[#102935]/80 border-2 border-[#0DEDC0] shadow-[0_0_25px_rgba(13,237,192,0.15)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(13,237,192,0.3)] hover:-translate-y-1.5'
                  : 'bg-[#102935]/40 border border-[#6884C5]/20 hover:border-[#0DEDC0]/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(13,237,192,0.08)] hover:-translate-y-1.5'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <span
                    className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md border"
                    style={{
                      color: art.tagColor,
                      backgroundColor: `${art.tagColor}15`,
                      borderColor: `${art.tagColor}40`,
                    }}
                  >
                    {art.categoria}
                  </span>

                  {art.badge ? (
                    <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-[#0DEDC0] text-[#090D16] tracking-wider animate-pulse">
                      🔥 {art.badge}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs font-medium">
                      {art.fecha}
                    </span>
                  )}
                </div>

                <h4 className="text-lg font-black text-white leading-snug mb-3 group-hover:text-[#0DEDC0] transition-colors tracking-tight">
                  {art.titulo}
                </h4>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                  {art.resumen}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[#6884C5] text-xs font-semibold">
                  {art.tiempoLectura}
                </span>

                {art.link ? (
                  <a
                    href={art.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0DEDC0] text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform"
                  >
                    {art.esInstagram && (
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    )}
                    {art.textoCta || 'Leer →'}
                  </a>
                ) : (
                  <span className="text-[#0DEDC0] text-xs font-extrabold cursor-pointer inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Leer →
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}