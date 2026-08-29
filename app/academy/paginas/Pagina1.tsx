'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Check, 
  CheckCircle2, 
  Zap, 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  Lock, 
  X, 
  Sparkles 
} from 'lucide-react';
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

const CATEGORIAS: string[] = ['Todas', 'Integraciones', 'Financieras', 'Operaciones', 'Estrategias'];

const BADGE_STYLES: Record<BadgeTipo, { color: string; border: string; bg: string; icon: React.ReactNode }> = {
  'Táctica Rápida': { 
    color: '#0DEDC0', 
    border: 'rgba(13, 237, 192, 0.4)', 
    bg: 'rgba(13, 237, 192, 0.1)',
    icon: <Zap className="w-3 h-3 text-[#0DEDC0]" />
  },
  'Alta Rentabilidad': { 
    color: '#CB1FDA', 
    border: 'rgba(203, 31, 218, 0.4)', 
    bg: 'rgba(203, 31, 218, 0.1)',
    icon: <DollarSign className="w-3 h-3 text-[#CB1FDA]" />
  },
  'Nivel Experto': { 
    color: '#6884C5', 
    border: 'rgba(104, 132, 197, 0.4)', 
    bg: 'rgba(104, 132, 197, 0.1)',
    icon: <ShieldCheck className="w-3 h-3 text-[#6884C5]" />
  },
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

interface Pagina1Props {
  variante?: TipoFondo;
}

export default function Pagina1({ variante = 'atomDynamicGradient' }: Pagina1Props) {
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
        // Ignorar
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [selectedVideo, completedLessons]);

  const videosFiltrados = categoriaActiva === 'Todas' 
    ? LESSONS 
    : LESSONS.filter(v => v.categoria === categoriaActiva);

  return (
    <section className="relative z-10 py-16 lg:py-24 px-6 overflow-hidden w-full border-b border-[#0DEDC0]/10 font-sans text-white">
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* CABECERA */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Kicker varianteFondo={variante}>CENTRO DE ENTRENAMIENTO TÁCTICO</Kicker>

          <H2 varianteFondo={variante} className="text-balance mb-4 max-w-4xl mx-auto">
            Domina la infraestructura de tu <Highlight varianteFondo={variante}>bodega.</Highlight>
          </H2>

          <Subtitulo varianteFondo={variante} className="max-w-3xl mx-auto">
            Entrénate con tácticas avanzadas para automatizar tu logística en Dropi, blindar tu inventario y multiplicar la rentabilidad real de tu negocio.
          </Subtitulo>
        </motion.div>

        {/* FILTROS DE CATEGORÍA */}
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

        {/* GRILLA DE LECCIONES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {videosFiltrados.map((lesson, idx) => {
            const badgeStyle = BADGE_STYLES[lesson.badge];
            const isCompleted = completedLessons.includes(lesson.id);
            const isAvailable = lesson.id === '0' || lesson.id === '1';

            return (
              <motion.div 
                key={lesson.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`group relative flex flex-col justify-between rounded-2xl border backdrop-blur-xl transition-all duration-300 overflow-hidden ${
                  isCompleted
                    ? 'bg-gradient-to-b from-[#0A202A] to-[#06141D] border-[#0DEDC0]/60 shadow-[0_10px_25px_rgba(13,237,192,0.12)]'
                    : 'bg-[#090D16]/80 border-slate-800'
                } ${isAvailable ? 'hover:border-[#0DEDC0] hover:shadow-[0_20px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(13,237,192,0.15)] hover:-translate-y-1.5' : ''}`}
              >
                
                {/* CANDADO O BLOQUEO DE CONTENIDO FUTURO */}
                {!isAvailable && (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#070B14]/85 backdrop-blur-[3px] p-6 text-center select-none">
                    <div className="flex items-center gap-2 bg-[#6884C5]/20 border border-[#6884C5]/50 px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(104,132,197,0.3)]">
                      <Lock className="w-3.5 h-3.5 text-[#6884C5]" />
                      <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
                        Próximamente
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-400 mt-3 max-w-[200px]">
                      Lección en producción para ATOM 2.0
                    </p>
                  </div>
                )}

                <div className={`flex flex-col flex-1 justify-between ${!isAvailable ? 'blur-[4px] opacity-30 select-none pointer-events-none' : ''}`}>
                  
                  <div>
                    {/* THUMBNAIL CON REPRODUCTOR HOVER */}
                    <div 
                      className="relative aspect-video bg-[#091A23] flex items-center justify-center cursor-pointer overflow-hidden group/thumb"
                      onClick={() => isAvailable && setSelectedVideo(lesson)}
                    >
                      <img 
                        src={`https://img.youtube.com/vi/${lesson.youtubeId}/hqdefault.jpg`} 
                        alt={lesson.titulo}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-105"
                      />

                      <div className="absolute inset-0 bg-[#091A23]/50 group-hover/thumb:bg-[#091A23]/20 transition-colors duration-300 z-10" />

                      {isCompleted && (
                        <span className="absolute top-3 right-3 bg-[#0DEDC0] text-[#0B171C] text-[10px] font-black font-mono uppercase tracking-wider px-2.5 py-1 rounded-full shadow-[0_0_15px_rgba(13,237,192,0.6)] z-20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> VISTO
                        </span>
                      )}

                      <div className="absolute w-12 h-12 rounded-full bg-[#0DEDC0]/20 border border-[#0DEDC0] text-[#0DEDC0] flex items-center justify-center shadow-[0_0_20px_rgba(13,237,192,0.4)] group-hover/thumb:scale-110 group-hover/thumb:bg-[#0DEDC0] group-hover/thumb:text-[#091A23] group-hover/thumb:shadow-[0_0_30px_rgba(13,237,192,0.7)] transition-all duration-300 z-20">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>

                      <span className="absolute bottom-3 right-3 bg-[#091A23]/90 border border-white/15 text-slate-300 text-[11px] font-bold font-mono px-2 py-0.5 rounded backdrop-blur-md z-20 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#0DEDC0]" /> {lesson.duracion}
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <span className="text-xs font-black text-[#6884C5] uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> {lesson.categoria}
                        </span>
                        
                        <span 
                          className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1.5"
                          style={{
                            borderColor: badgeStyle.border,
                            backgroundColor: badgeStyle.bg,
                            color: badgeStyle.color
                          }}
                        >
                          {badgeStyle.icon}
                          {lesson.badge}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-white mb-2 leading-snug tracking-tight group-hover:text-[#0DEDC0] transition-colors">
                        {lesson.titulo}
                      </h3>
                      
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                        {lesson.descripcion}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button 
                      type="button"
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
                          <Check className="w-4 h-4 text-[#0DEDC0]" />
                          <span>VOLVER A VER</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>REPRODUCIR LECCIÓN</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </motion.div>
            );
          })}
        </div>

      </div>

      {/* REPRODUCTOR MODAL CON FRAMER MOTION */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#091A23]/90 backdrop-blur-2xl z-[2000] flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#090D16] border border-[#0DEDC0]/40 rounded-2xl w-full max-w-4xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(13,237,192,0.2)]"
            >
              <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-[#0F1722]">
                <div>
                  <span className="text-xs text-[#0DEDC0] font-mono font-bold uppercase tracking-wider block">
                    {selectedVideo.categoria} • {selectedVideo.duracion}
                  </span>
                  <h3 className="text-white font-black text-sm sm:text-base tracking-tight mt-0.5">
                    {selectedVideo.titulo}
                  </h3>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => marcarCompletada(selectedVideo.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                      completedLessons.includes(selectedVideo.id)
                        ? 'bg-[#0DEDC0]/20 border-[#0DEDC0]/50 text-[#0DEDC0]'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-[#0DEDC0]/50'
                    }`}
                  >
                    {completedLessons.includes(selectedVideo.id) ? '✓ Visto' : 'Marcar como visto'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedVideo(null)}
                    className="bg-white/5 hover:bg-red-500/20 border border-white/15 text-white w-9 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
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

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}