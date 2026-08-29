'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, Zap, MousePointerClick, Sparkles, Crown } from 'lucide-react';
import { Kicker, H2, Subtitulo, Highlight, ESTILOS_TEXTO } from '@/app/complementos/Tipografia';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';

export interface PlanPricing {
  id: string;
  nombre: string;
  badge?: string | null;
  perfil: string;
  precioCOP: string;
  precioUSD: string;
  destacadoTipo?: 'experto' | 'control' | null;
  caracteristicas: { texto: string; resaltado?: boolean }[];
  cta: string;
}

interface Seccion5Props {
  variante?: TipoFondo;
}

const PLANES: readonly PlanPricing[] = Object.freeze([
  {
    id: 'despegue',
    nombre: 'DESPEGUE',
    badge: null,
    perfil: 'Bodegas nacientes en fase de pruebas',
    precioCOP: '$55.000',
    precioUSD: '$15 USD',
    destacadoTipo: null,
    caracteristicas: [
      { texto: '1 Conexión Nativa a Dropi' },
      { texto: 'Hasta 700 guías auditadas/mes' },
      { texto: 'Radar de Detección de Fugas' },
      { texto: 'Auditoría en Tiempo Real' },
      { texto: 'Soporte Táctico Estándar' },
    ],
    cta: 'Iniciar con Despegue →',
  },
  {
    id: 'escala',
    nombre: 'ESCALA',
    badge: null,
    perfil: 'Bodegas en aceleración intermedia',
    precioCOP: '$150.000',
    precioUSD: '$49 USD',
    destacadoTipo: null,
    caracteristicas: [
      { texto: '1 Conexión Nativa a Dropi' },
      { texto: 'Hasta 1.500 guías auditadas/mes' },
      { texto: 'Radar de Detección de Fugas' },
      { texto: 'Auditoría en Tiempo Real' },
      { texto: 'Control de Vendedores', resaltado: true },
      { texto: 'Soporte Táctico Directo' },
    ],
    cta: 'Escalar mi Bodega →',
  },
  {
    id: 'experto',
    nombre: 'EXPERTO',
    badge: 'MÁS POPULAR · RECOMENDADO',
    perfil: 'Operaciones de venta a gran escala',
    precioCOP: '$250.000',
    precioUSD: '$69 USD',
    destacadoTipo: 'experto',
    caracteristicas: [
      { texto: '1 Conexión Nativa a Dropi' },
      { texto: 'Guías auditadas Ilimitadas/mes', resaltado: true },
      { texto: 'Radar de Detección de Fugas' },
      { texto: 'Herramientas y Aplicaciones' },
      { texto: 'Detección de Devoluciones Fantasma', resaltado: true },
      { texto: 'Soporte Táctico Dedicado Prioritario' },
    ],
    cta: 'Activar Operación Masiva →',
  },
  {
    id: 'control',
    nombre: 'CONTROL',
    badge: 'MULTI-BODEGA & HOLDING',
    perfil: 'Redes de bodegas o grupos empresariales',
    precioCOP: '$350.000',
    precioUSD: '$97 USD',
    destacadoTipo: 'control',
    caracteristicas: [
      { texto: 'Hasta 5 Cuentas / Bodegas Centralizadas' },
      { texto: 'Guías auditadas Ilimitadas/mes' },
      { texto: 'Suite Completa de Automatizaciones', resaltado: true },
      { texto: 'Directorio de Proveedores Élite' },
      { texto: 'Aviso Automático de Novedades' },
      { texto: 'Asistente y Estratega Dedicado 1:1', resaltado: true },
    ],
    cta: 'Activar Multi-Cuenta →',
  },
]);

export default function Seccion5({ variante = 'spotlightCyan' }: Seccion5Props) {
  const [moneda, setMoneda] = useState<'COP' | 'USD'>('COP');

  return (
    <section id="precios" className="relative z-20 py-16 w-full overflow-hidden">       
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-7xl mx-auto px-5">
        
        {/* ENCABEZADO */}
        <div className="text-center mb-12">
          <Kicker varianteFondo={variante}>INVERSIÓN TRANSPARENTE</Kicker>

          <H2 varianteFondo={variante} className="text-balance">
            Planes diseñados para <Highlight varianteFondo={variante}>escalar tu rentabilidad.</Highlight>
          </H2>

          <Subtitulo varianteFondo={variante} className="max-w-[720px] mx-auto mt-3">
            Elige el nivel de auditoría que tu bodega necesita hoy y recupera tu capital sin contratos de permanencia.
          </Subtitulo>

          {/* TOGGLE MULTI-MONEDA */}
          <div className="inline-flex items-center gap-1.5 bg-[#102935]/80 p-1.5 rounded-full border border-[#0DEDC0]/30 mt-6 backdrop-blur-md shadow-lg">
            <button
              type="button"
              onClick={() => setMoneda('COP')}
              className={`px-5 py-2 rounded-full text-xs font-black tracking-wider transition-all duration-300 cursor-pointer ${
                moneda === 'COP'
                  ? 'bg-[#0DEDC0] text-[#0B171C] shadow-[0_0_15px_rgba(13,237,192,0.4)]'
                  : 'bg-transparent text-slate-400 hover:text-white'
              }`}
            >
              🇨🇴 Colombia (COP)
            </button>
            <button
              type="button"
              onClick={() => setMoneda('USD')}
              className={`px-5 py-2 rounded-full text-xs font-black tracking-wider transition-all duration-300 cursor-pointer ${
                moneda === 'USD'
                  ? 'bg-[#0DEDC0] text-[#0B171C] shadow-[0_0_15px_rgba(13,237,192,0.4)]'
                  : 'bg-transparent text-slate-400 hover:text-white'
              }`}
            >
              🌏 Internacional (USD)
            </button>
          </div>
        </div>

        {/* PARRILLA DE PLANES (TODOS MISMO TAMAÑO) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch pt-4">
          {PLANES.map((plan, idx) => {
            const esExperto = plan.destacadoTipo === 'experto';
            const esControl = plan.destacadoTipo === 'control';

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className={`flex flex-col justify-between p-6 rounded-2xl relative transition-all duration-300 backdrop-blur-xl h-full ${
                  esExperto
                    ? 'bg-gradient-to-b from-[#0F2836] via-[#0B1D28] to-[#07131B] border-2 border-[#0DEDC0] shadow-[0_0_35px_rgba(13,237,192,0.25)] z-20'
                    : esControl
                    ? 'bg-gradient-to-b from-[#161B30] via-[#0F1426] to-[#0A0D18] border-2 border-[#8B5CF6] shadow-[0_0_30px_rgba(139,92,246,0.2)] z-10'
                    : 'bg-[#090D16]/80 border border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* HAZ DE LUZ DE FONDO PARA PLANES RECOMENDADOS */}
                {esExperto && (
                  <div className="absolute top-0 inset-x-0 h-32 bg-[radial-gradient(ellipse_at_top,#0DEDC0_0%,transparent_70%)] opacity-20 pointer-events-none rounded-t-2xl" />
                )}
                {esControl && (
                  <div className="absolute top-0 inset-x-0 h-32 bg-[radial-gradient(ellipse_at_top,#8B5CF6_0%,transparent_70%)] opacity-20 pointer-events-none rounded-t-2xl" />
                )}

                {/* BADGE DESTACADO */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                    <span
                      className={`relative z-10 flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full whitespace-nowrap shadow-lg ${
                        esExperto
                          ? 'bg-[#0DEDC0] text-[#090D18] shadow-[0_0_15px_rgba(13,237,192,0.6)]'
                          : 'bg-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                      }`}
                    >
                      {esExperto ? <Sparkles className="w-3 h-3" /> : <Crown className="w-3 h-3" />}
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`text-xl font-black tracking-tight ${
                      esExperto ? 'text-[#0DEDC0]' : esControl ? 'text-[#A78BFA]' : 'text-white'
                    }`}>
                      {plan.nombre}
                    </h3>
                  </div>

                  <p className="text-slate-400 text-xs leading-snug min-h-[2.5rem] font-medium">
                    {plan.perfil}
                  </p>

                  <div className="my-4 border-b border-white/10 pb-4 flex items-baseline">
                    <span className={`text-3xl lg:text-4xl font-black tracking-tight font-mono ${
                      esExperto ? 'text-[#0DEDC0]' : esControl ? 'text-white' : 'text-slate-200'
                    }`}>
                      {moneda === 'COP' ? plan.precioCOP : plan.precioUSD}
                    </span>
                    <span className="text-slate-400 text-xs ml-1 font-semibold">
                      / mes
                    </span>
                  </div>

                  <ul className="space-y-2.5 mb-8 p-0 list-none">
                    {plan.caracteristicas.map((feat, fIdx) => (
                      <li
                        key={fIdx}
                        className={`text-xs flex items-start gap-2 leading-snug ${
                          feat.resaltado
                            ? 'text-white font-bold'
                            : 'text-slate-300 font-medium'
                        }`}
                      >
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${
                          esExperto ? 'text-[#0DEDC0]' : esControl ? 'text-[#A78BFA]' : 'text-slate-400'
                        }`} />
                        {feat.texto}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="https://atomapp.com.co/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative z-10 block w-full py-3 px-4 rounded-xl text-center text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${ESTILOS_TEXTO.boton} ${
                    esExperto
                      ? 'bg-[#0DEDC0] text-[#090D18] shadow-[0_0_20px_rgba(13,237,192,0.4)] hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.7)]'
                      : esControl
                      ? 'bg-[#8B5CF6] text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:bg-white hover:text-[#090D18]'
                      : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:border-[#0DEDC0] hover:text-[#0DEDC0]'
                  }`}
                >
                  {plan.cta}
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* GARANTÍAS DE CONFIANZA */}
        <div className="mt-10 text-center text-xs font-mono text-slate-400 flex items-center justify-center gap-3 flex-wrap">
          <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-[#0DEDC0]" /> Cero contratos de permanencia</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-[#0DEDC0]" /> Activación inmediata</span>
          <span>·</span>
          <span className="flex items-center gap-1"><MousePointerClick className="w-4 h-4 text-[#0DEDC0]" /> Control a 1 clic</span>
        </div>

      </div>
    </section>
  );
}