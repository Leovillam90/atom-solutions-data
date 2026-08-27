'use client';

import React, { useState, useEffect } from 'react';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { Kicker, H2, Subtitulo, Highlight } from '@/app/complementos/Tipografia';

type CategoriaLesson = 'Integraciones' | 'Financieras' | 'Operaciones' | 'Estrategias';
type BadgeTipo = 'Táctica Rápida' | 'Alta Rentabilidad' | 'Nivel Experto';

interface VideoLesson {
  id: string;
  titulo: string;
  duracion: string;
  categoria: CategoriaLesson;
  descripcion: string;
  youtubeId: string;
  badge: BadgeTipo;
}

const ID_VIDEO_TEMPORAL = 'feDbKxnh50k';

// DATA ESTÁTICA EN MEMORIA GLOBAL
const CATEGORIAS: string[] = ['Todas', 'Integraciones', 'Financieras', 'Operaciones', 'Estrategias'];

const BADGE_STYLES: Record<BadgeTipo, { color: string; border: string; bg: string }> = {
  'Táctica Rápida': { color: '#0DEDC0', border: 'rgba(13, 237, 192, 0.3)', bg: 'rgba(13, 237, 192, 0.08)' },
  'Alta Rentabilidad': { color: '#CB1FDA', border: 'rgba(203, 31, 218, 0.3)', bg: 'rgba(203, 31, 218, 0.08)' },
  'Nivel Experto': { color: '#6884C5', border: 'rgba(104, 132, 197, 0.3)', bg: 'rgba(104, 132, 197, 0.08)' },
};

const LESSONS: VideoLesson[] = [
  {
    id: '0',
    titulo: '¿Qué es ATOM? El Centro de Mando de la Élite Logística',
    duracion: '00:40',
    categoria: 'Integraciones',
    badge: 'Táctica Rápida',
    descripcion: 'Descubre en 40 segundos cómo ATOM se conecta a tu cuenta de Dropi para auditar cada guía en tiempo real, frenar la fuga de fletes y convertir el caos operativo de tu bodega en rentabilidad pura.',
    youtubeId: ID_VIDEO_TEMPORAL,
  },
  {
    id: '1',
    titulo: 'Cómo integrar ATOM a tu negocio en Dropi',
    duracion: '01:04',
    categoria: 'Integraciones',
    badge: 'Táctica Rápida',
    descripcion: 'Sincroniza tu cuenta en simples pasos y descubre exactamente dónde está la plata atrapada en tus guías.',
    youtubeId: '2Wz4_tpgF6M',
  },
  {
    id: '2',
    titulo: 'Dominio Operativo y Eficiencia de Entregas',
    duracion: '02:20',
    categoria: 'Financieras',
    badge: 'Alta Rentabilidad',
    descripcion: 'Mide la efectividad exacta de tu operación. Identifica qué transportadoras te están cumpliendo y optimiza tu logística.',
    youtubeId: ID_VIDEO_TEMPORAL,
  },
  {
    id: '3',
    titulo: 'Radiografía Logística y Control de Fugas',
    duracion: '02:10',
    categoria: 'Financieras',
    badge: 'Nivel Experto',
    descripcion: 'Audita el rendimiento real de las transportadoras, detecta cuellos de botella al instante y frena las fugas de dinero.',
    youtubeId: ID_VIDEO_TEMPORAL,
  },
  {
    id: '4',
    titulo: 'Trazabilidad y Control de Envíos',
    duracion: '02:05',
    categoria: 'Operaciones',
    badge: 'Táctica Rápida',
    descripcion: 'El historial exacto de tus despachos. Supervisa el estado real de cada envío sin depender de reportes manuales.',
    youtubeId: ID_VIDEO_TEMPORAL,
  },
  {
    id: '5',
    titulo: 'Rentabilidad de Catálogo',
    duracion: '02:30',
    categoria: 'Operaciones',
    badge: 'Alta Rentabilidad',
    descripcion: 'Analiza el rendimiento exacto de tu inventario. Descubre qué productos te dejan utilidad real y cuáles generan pérdidas.',
    youtubeId: ID_VIDEO_TEMPORAL,
  },
  {
    id: '6',
    titulo: 'Auditoría de Vendedores (Dropshippers)',
    duracion: '02:00',
    categoria: 'Operaciones',
    badge: 'Nivel Experto',
    descripcion: 'Mide el rendimiento real de tus aliados comerciales. Detecta quiénes impulsan tu facturación y quiénes te cuestan dinero.',
    youtubeId: ID_VIDEO_TEMPORAL,
  },
  {
    id: '7',
    titulo: 'Eficiencia de Operadores Logísticos',
    duracion: '02:00',
    categoria: 'Operaciones',
    badge: 'Alta Rentabilidad',
    descripcion: 'Compara tiempos y rendimiento de cada empresa de transporte para tomar decisiones basadas en datos reales.',
    youtubeId: ID_VIDEO_TEMPORAL,
  },
  {
    id: '8',
    titulo: 'Centro de Estrategia y Rentabilidad',
    duracion: '04:00',
    categoria: 'Estrategias',
    badge: 'Nivel Experto',
    descripcion: 'Convierte tus datos en dinero. Ejecuta planes de acción precisos para reducir tu tasa de devoluciones y blindar tu margen.',
    youtubeId: ID_VIDEO_TEMPORAL,
  },
  {
    id: '9',
    titulo: 'Escalamiento y Dominio',
    duracion: '04:00',
    categoria: 'Estrategias',
    badge: 'Nivel Experto',
    descripcion: 'Aplica tácticas avanzadas para rotar inventario a máxima velocidad y hacer que los mejores dropshippers vendan por ti.',
    youtubeId: ID_VIDEO_TEMPORAL,
  },
];

const renderBadgeIcon = (badge: BadgeTipo) => {
  if (badge === 'Táctica Rápida') {
    return (
      <svg width="12" height="12" fill="none" stroke="#0DEDC0" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  }
  if (badge === 'Alta Rentabilidad') {
    return (
      <svg width="12" height="12" fill="none" stroke="#CB1FDA" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" fill="none" stroke="#6884C5" viewBox="0 0 24 24" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
};

interface Seccion1Props {
  variante?: TipoFondo;
}

export default function Seccion1({ variante = 'auroraBoreal' }: Seccion1Props) {
  const [categoriaActiva, setCategoriaActiva] = useState<string>('Todas');
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('atom_completed_lessons');
    if (saved) {
      try {
        setCompletedLessons(JSON.parse(saved));
      } catch (e) {
        console.error('Error cargando lecciones completadas', e);
      }
    }
  }, []);

  const marcarCompletada = (id: string) => {
    if (!completedLessons.includes(id)) {
      const updated = [...completedLessons, id];
      setCompletedLessons(updated);
      localStorage.setItem('atom_completed_lessons', JSON.stringify(updated));
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'string') return;
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'infoDelivery' && data.info && data.info.playerState === 0) {
          if (selectedVideo) {
            marcarCompletada(selectedVideo.id);
          }
        }
      } catch (e) {
        // Ignorar mensajes irrelevantes
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [selectedVideo, completedLessons]);

  const videosFiltrados = categoriaActiva === 'Todas' 
    ? LESSONS 
    : LESSONS.filter(v => v.categoria === categoriaActiva);

  return (
    <section className="relative z-10 py-16 lg:py-24 px-6 overflow-hidden w-full border-b border-[#0DEDC0]/10">
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* CABECERA */}
        <div className="text-center mb-12">
          <Kicker>CENTRO DE ENTRENAMIENTO TÁCTICO</Kicker>

          <H2 className="text-balance mb-4 max-w-4xl mx-auto">
            Domina la infraestructura de tu <Highlight>bodega.</Highlight>
          </H2>

          <Subtitulo className="max-w-3xl mx-auto">
            Entrénate con tácticas avanzadas para automatizar tu logística en Dropi, blindar tu inventario y multiplicar la rentabilidad real de tu negocio.
          </Subtitulo>
        </div>

        {/* FILTROS DE CATEGORÍA */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 w-full">
          {CATEGORIAS.map((cat) => {
            const isActive = categoriaActiva === cat;
            return (
              <button
                key={cat}
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

        {/* GRILLA DE LECCIONES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {videosFiltrados.map((lesson) => {
            const badgeStyle = BADGE_STYLES[lesson.badge];
            const isCompleted = completedLessons.includes(lesson.id);
            const isAvailable = lesson.id === '0' || lesson.id === '1';

            return (
              <div 
                key={lesson.id} 
                className={`group relative flex flex-col justify-between rounded-2xl border backdrop-blur-md transition-all duration-300 overflow-hidden ${
                  isCompleted
                    ? 'bg-[#0A202A]/70 border-[#0DEDC0]/60 shadow-[0_10px_25px_rgba(13,237,192,0.08)]'
                    : 'bg-[#102935]/60 border-[#6884C5]/20'
                } ${isAvailable ? 'hover:border-[#0DEDC0]/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_25px_rgba(13,237,192,0.08)] hover:-translate-y-1.5' : ''}`}
              >
                
                {!isAvailable && (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#070B14]/85 backdrop-blur-[3px] p-6 text-center select-none">
                    <div className="flex items-center gap-2 bg-[#6884C5]/20 border border-[#6884C5]/50 px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(104,132,197,0.3)]">
                      <div className="w-2 h-2 rounded-full bg-[#6884C5] animate-pulse" />
                      <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
                        Próximamente
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-400 mt-3 max-w-[200px]">
                      Lección en producción para ATOM 2.0
                    </p>
                  </div>
                )}

                <div className={`flex flex-col flex-1 justify-between transition-all duration-300 ${!isAvailable ? 'blur-[4px] opacity-30 select-none pointer-events-none' : ''}`}>
                  
                  <div>
                    <div 
                      className="relative aspect-video bg-[#091A23] flex items-center justify-center cursor-pointer overflow-hidden"
                      onClick={() => isAvailable && setSelectedVideo(lesson)}
                    >
                      <img 
                        src={`https://img.youtube.com/vi/${lesson.youtubeId}/hqdefault.jpg`} 
                        alt={lesson.titulo}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-[#091A23]/40 group-hover:bg-[#091A23]/20 transition-colors duration-300 z-10" />

                      {isCompleted && (
                        <span className="absolute top-3 right-3 bg-[#0DEDC0] text-[#0B171C] text-[10px] font-black font-mono uppercase tracking-wider px-2.5 py-1 rounded-full shadow-[0_0_15px_rgba(13,237,192,0.6)] z-20">
                          ✓ VISTO
                        </span>
                      )}

                      <div className="absolute w-12 h-12 rounded-full bg-[#0DEDC0]/20 border border-[#0DEDC0] text-[#0DEDC0] flex items-center justify-center shadow-[0_0_20px_rgba(13,237,192,0.4)] group-hover:scale-110 group-hover:bg-[#0DEDC0] group-hover:text-[#091A23] group-hover:shadow-[0_0_30px_rgba(13,237,192,0.7)] transition-all duration-300 z-20">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>

                      <span className="absolute bottom-3 right-3 bg-[#091A23]/90 border border-white/15 text-slate-300 text-[11px] font-bold font-mono px-2 py-0.5 rounded backdrop-blur-md z-20">
                        {lesson.duracion}
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-extrabold text-[#6884C5] uppercase tracking-wider">
                          {lesson.categoria}
                        </span>
                        
                        <span 
                          className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1.5"
                          style={{
                            borderColor: badgeStyle.border,
                            backgroundColor: badgeStyle.bg,
                            color: badgeStyle.color
                          }}
                        >
                          {renderBadgeIcon(lesson.badge)}
                          {lesson.badge}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-white mb-2 leading-snug tracking-tight group-hover:text-[#0DEDC0] transition-colors">
                        {lesson.titulo}
                      </h3>
                      
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                        {lesson.descripcion}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button 
                      onClick={() => isAvailable && setSelectedVideo(lesson)} 
                      disabled={!isAvailable}
                      className={`w-full py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                        isCompleted
                          ? 'bg-[#0DEDC0]/10 border border-[#0DEDC0]/50 text-white hover:bg-[#0DEDC0] hover:text-[#0B171C] hover:shadow-[0_0_20px_rgba(13,237,192,0.4)]'
                          : 'bg-[#6884C5]/10 border border-[#6884C5]/30 text-white hover:bg-[#0DEDC0] hover:text-[#091A23] hover:border-[#0DEDC0] hover:shadow-[0_0_20px_rgba(13,237,192,0.3)]'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <span className="text-[#0DEDC0] font-black group-hover:text-[#0B171C]">✓ COMPLETADA</span>
                          <span className="opacity-40">•</span>
                          <span>VOLVER A VER</span>
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          REPRODUCIR LECCIÓN
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* REPRODUCTOR MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-[#091A23]/90 backdrop-blur-xl z-[2000] flex items-center justify-center p-4 sm:p-6">
          <div className="relative bg-[#102935] border border-[#0DEDC0]/40 rounded-2xl w-full max-w-4xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(13,237,192,0.15)]">
            
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#091A23]">
              <div>
                <span className="text-xs text-[#0DEDC0] font-extrabold uppercase tracking-wider block">
                  {selectedVideo.categoria} • {selectedVideo.duracion}
                </span>
                <h3 className="text-white font-black text-sm sm:text-base tracking-tight mt-0.5">
                  {selectedVideo.titulo}
                </h3>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => marcarCompletada(selectedVideo.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold border transition-all cursor-pointer ${
                    completedLessons.includes(selectedVideo.id)
                      ? 'bg-[#0DEDC0]/20 border-[#0DEDC0]/40 text-[#0DEDC0]'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-[#0DEDC0]/50'
                  }`}
                >
                  {completedLessons.includes(selectedVideo.id) ? '✓ Visto' : 'Marcar como visto'}
                </button>

                <button
                  onClick={() => setSelectedVideo(null)}
                  className="bg-white/5 hover:bg-red-500/20 border border-white/15 text-white w-9 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="aspect-video w-full bg-black">
              <iframe
                id="youtube-player"
                className="w-full h-full border-none"
                src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&iv_load_policy=3`}
                title={selectedVideo.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

          </div>
        </div>
      )}
    </section>
  );
}