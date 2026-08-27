'use client';

import React, { useState, useEffect } from 'react';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { Kicker, H1, Subtitulo, Highlight, ESTILOS_TEXTO } from '@/app/complementos/Tipografia';

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
  historias: string[];
}

interface Seccion1Props {
  articuloPrincipal?: Articulo;
  variante?: TipoFondo;
}

const ARTICULO_DEFAULT: Articulo = {
  id: 1,
  titulo: '¿Por qué los Dropshippers Élite buscarán los stand de proveedores de Alto Rendimiento ATOM en Expo Winners?',
  resumen: 'Durante el 12 y 13 de septiembre en Ágora Bogotá, los vendedores con mayor volumen de ventas filtrarán a sus aliados a través de la App del evento. Al completar la ruta, serás destacado como "Proveedor de Alto Rendimiento ATOM". Esto motivará a los súper-afiliados a buscarte en persona para coordinar la privatización de su producto ganador y acordar incentivos exclusivos por cumplimiento de metas logísticas.',
  categoria:'ESTRATEGIA COMERCIAL',
  fecha: 'Agosto 26 del 2026',
  tiempoLectura: 'Evento Oficial',
  autor: 'Equipo Comercial ATOM',
  destacado: true,
  tagColor: '#0DEDC0',
  historias: [
    '/noticias/Expo.mp4', 
    '/noticias/Rendimiento.jpeg',
   
  ],
};

export default function Seccion1({
  articuloPrincipal = ARTICULO_DEFAULT,
  variante = 'gridCyber',
}: Seccion1Props) {
  const [indexHistoria, setIndexHistoria] = useState(0);
  const [pausado, setPausado] = useState(false);

  // Asegurar que use las historias del default si no llegan props
  const historias = articuloPrincipal.historias && articuloPrincipal.historias.length > 0 
    ? articuloPrincipal.historias 
    : ARTICULO_DEFAULT.historias;

  // Temporizador automático de 4 segundos
  useEffect(() => {
    if (pausado) return;
    const timer = setInterval(() => {
      setIndexHistoria((prev) => (prev + 1) % historias.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [historias.length, pausado]);

  const cambiarHistoria = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) {
      setIndexHistoria((prev) => (prev === 0 ? historias.length - 1 : prev - 1));
    } else {
      setIndexHistoria((prev) => (prev + 1) % historias.length);
    }
  };

  // Función auxiliar para detectar si es video
  const esVideo = (url: string) => {
    return url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm');
  };

  return (
    <section className="relative z-10 py-16 lg:py-20 px-6 overflow-hidden border-b border-[#0DEDC0]/10 text-white">
      {/* CAPA DE FONDO DINÁMICO */}
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* HERO CABECERA */}
        <div className="text-center mb-12">
          <Kicker>INTELIGENCIA & CONTENIDO</Kicker>
          <H1 className="text-balance mb-4 max-w-4xl mx-auto">
            Noticias del Ecosistema <Highlight>E-Commerce LATAM.</Highlight>
          </H1>
          <Subtitulo className="max-w-3xl mx-auto">
            Información estratégica, métricas operativas y actualizaciones logísticas para proveedores, importadores y dropshippers.
          </Subtitulo>
        </div>

        {/* TARJETA DESTACADA (REPORTE OFICIAL) */}
        <div className="w-full relative bg-[#102935]/50 backdrop-blur-xl border border-[#0DEDC0]/30 rounded-3xl p-6 sm:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0DEDC0] to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Contenido del Artículo (Izquierda) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* ETIQUETA Y FECHA */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border"
                    style={{
                      color: articuloPrincipal.tagColor,
                      backgroundColor: `${articuloPrincipal.tagColor}18`,
                      borderColor: `${articuloPrincipal.tagColor}40`,
                    }}
                  >
                    🎯 {articuloPrincipal.categoria}
                  </span>
                  <span className="text-slate-400 text-xs font-semibold font-mono">
                    {articuloPrincipal.fecha} | {articuloPrincipal.tiempoLectura}
                  </span>
                </div>

                {/* TÍTULO PRINCIPAL (H2) */}
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4 tracking-tight">
                  {articuloPrincipal.titulo}
                </h2>

                {/* RESUMEN / CUERPO DE TEXTO */}
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                  {articuloPrincipal.resumen}
                </p>
              </div>

              {/* FOOTER: AUTOR Y BOTÓN DE ACCIÓN ESTRATÉGICO */}
              <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-white/10">
                <span className="text-slate-300 text-xs sm:text-sm font-bold">
                  Por <span className="text-[#0DEDC0]">{articuloPrincipal.autor}</span>
                </span>

                <a 
                  href="[https://wa.me/573122521130?text=Hola,%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20la%20estrategia%20Expo%20Winners](https://wa.me/573122521130?text=Hola,%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20la%20estrategia%20Expo%20Winners)."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-[#0DEDC0] hover:bg-white text-[#102935] font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(13,237,192,0.2)] hover:shadow-[0_0_30px_rgba(13,237,192,0.4)] cursor-pointer inline-flex items-center justify-center gap-2 ${ESTILOS_TEXTO.boton}`}
                >
                  SABER MÁS SOBRE EL EVENTO EXPO WINNERS →
                </a>
              </div>
            </div>

            {/* MÓDULO DE IMPACTO: VISOR TIPO HISTORIA IG (Derecha) */}
            <div className="lg:col-span-5 flex justify-center items-center relative py-4">
              
              {/* Resplandor Neón Ambiental de Fondo */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#0DEDC0]/30 via-[#6884C5]/20 to-[#CB1FDA]/30 rounded-3xl blur-3xl pointer-events-none animate-pulse" />

              {/* MOCKUP SMARTPHONE EN FORMATO 9:16 */}
              <div 
                className="relative z-10 w-full max-w-[320px] aspect-[9/16] bg-[#050B0E] rounded-[32px] p-2 border-2 border-[#0DEDC0]/70 shadow-[0_0_50px_rgba(13,237,192,0.35)] cursor-pointer select-none group transition-all duration-500 hover:scale-[1.02] hover:border-[#0DEDC0]"
                onClick={cambiarHistoria}
                onMouseEnter={() => setPausado(true)}
                onMouseLeave={() => setPausado(false)}
              >
                {/* Contenedor Interno de Pantalla */}
                <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-black flex items-center justify-center">
                  
                  {/* Capa 1: Fondo Desenfocado Ambiental (Solo para imágenes) */}
                  {!esVideo(historias[indexHistoria]) && (
                    <img 
                      src={historias[indexHistoria]} 
                      alt="Ambient Background"
                      className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-125 pointer-events-none"
                    />
                  )}

                  {/* Capa 2: IMAGEN O VIDEO PRINCIPAL */}
                  {esVideo(historias[indexHistoria]) ? (
                    <video 
                      key={historias[indexHistoria]} /* Fuerza re-render para que el video inicie desde cero al cambiar */
                      src={historias[indexHistoria]} 
                      className="relative z-10 w-full h-full object-cover transition-all duration-500"
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                    />
                  ) : (
                    <img 
                      src={historias[indexHistoria]} 
                      alt={`Historia destacada ${indexHistoria + 1}`}
                      className="relative z-10 w-full h-full object-contain transition-all duration-500"
                    />
                  )}

                  {/* Sombras superiores e inferiores de legibilidad */}
                  <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 via-black/20 to-transparent pointer-events-none z-20" />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-20" />

                  {/* BARRAS DE PROGRESO SUPERIORES */}
                  <div className="absolute top-3 inset-x-3 z-30 flex gap-1.5 pointer-events-none">
                    {historias.map((_, i) => (
                      <div key={i} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-md">
                        <div 
                          className={`h-full bg-[#0DEDC0] transition-all duration-300 ${
                            i < indexHistoria 
                              ? 'w-full' 
                              : i === indexHistoria 
                              ? 'w-full shadow-[0_0_10px_#0DEDC0]' 
                              : 'w-0'
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* ENCABEZADO TIPO HISTORIA (LOGO + BADGE LIVE) */}
                  <div className="absolute top-7 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#0DEDC0] p-0.5 border border-white/50 shadow-[0_0_10px_rgba(13,237,192,0.6)]">
                        <img src="/logo-color.png" alt="ATOM" className="w-full h-full object-contain rounded-full bg-[#091A23]" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-white tracking-wide block drop-shadow-md">
                          ATOM Stories
                        </span>
                        <span className="text-[9px] font-mono text-[#0DEDC0] block -mt-0.5 font-bold drop-shadow-md">
                          Exclusivo Bodegas
                        </span>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono font-black uppercase tracking-wider bg-red-500/80 text-white px-2 py-0.5 rounded-full border border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)] backdrop-blur-md">
                      ● LIVE
                    </span>
                  </div>

                  {/* CONTROLES TÁCTILES VISUALES */}
                  <div className="absolute inset-y-0 left-0 w-12 z-30 flex items-center justify-start pl-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="w-7 h-7 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center text-xs backdrop-blur-md">
                      ‹
                    </div>
                  </div>
                  <div className="absolute inset-y-0 right-0 w-12 z-30 flex items-center justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="w-7 h-7 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center text-xs backdrop-blur-md">
                      ›
                    </div>
                  </div>

                  {/* FOOTER INFERIOR DE NAVEGACIÓN */}
                  <div className="absolute bottom-3 inset-x-3 z-30 flex items-center justify-between text-[10px] text-slate-300 font-mono pointer-events-none bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="text-[#0DEDC0] font-bold">Toca para cambiar</span>
                    <span className="bg-[#0DEDC0]/20 text-[#0DEDC0] px-1.5 py-0.5 rounded font-bold">
                      {indexHistoria + 1} / {historias.length}
                    </span>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}