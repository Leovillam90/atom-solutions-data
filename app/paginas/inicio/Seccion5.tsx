'use client';

import React, { useState } from 'react';
import { Kicker, H2, Subtitulo, Highlight } from '@/app/complementos/Tipografia';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';

export interface PlanPricing {
  id: string;
  nombre: string;
  badge?: string | null;
  perfil: string;
  precioCOP: string;
  precioUSD: string;
  destacado: boolean;
  caracteristicas: string[];
  cta: string;
}

interface Seccion5Props {
  variante?: TipoFondo;
}

export default function Seccion5({ variante = 'gridCyber' }: Seccion5Props) {
  const [moneda, setMoneda] = useState<'COP' | 'USD'>('COP');

  const planes: PlanPricing[] = [
    {
      id: 'despegue',
      nombre: 'DESPEGUE',
      badge: null,
      perfil: 'Bodegas nacientes (hasta 700 órdenes)',
      precioCOP: '$55.000',
      precioUSD: '$15 USD',
      destacado: false,
      caracteristicas: [
        '1 Conexión Nativa a Dropi',
        'Hasta 700 guías auditadas/mes',
        'Radar de Detección de Fugas',
        'Auditoría en Tiempo Real',
        'Soporte Táctico Directo',
      ],
      cta: 'Iniciar con Despegue →',
    },
    {
      id: 'escala',
      nombre: 'ESCALA',
      badge: null,
      perfil: 'Bodegas en aceleración (hasta 1.500 órdenes)',
      precioCOP: '$150.000',
      precioUSD: '$49 USD',
      destacado: false,
      caracteristicas: [
        '1 Conexión Nativa a Dropi',
        'Hasta 1.500 guías auditadas/mes',
        'Radar de Detección de Fugas',
        'Auditoría en Tiempo Real',
        'Detección de Devoluciones Fantasma',
        'Soporte Táctico Directo',
      ],
      cta: 'Escalar mi Bodega →',
    },
    {
      id: 'experto',
      nombre: 'EXPERTO',
      badge: '🔥 MÁS VENDIDO',
      perfil: 'Operaciones masivas sin límite de órdenes',
      precioCOP: '$250.000',
      precioUSD: '$69 USD',
      destacado: true,
      caracteristicas: [
        'Conexión Nativa Multicanal',
        'Guías auditadas ILIMITADAS/mes',
        'Radar de Detección de Fugas Pro',
        'Auditoría en Tiempo Real',
        'Alertas de Vendedores Tóxicos',
        'Soporte Táctico Dedicado Prioritario',
      ],
      cta: 'Activar Operación Masiva →',
    },
    {
      id: 'control',
      nombre: 'CONTROL',
      badge: null,
      perfil: 'Redes de bodegas o holding (hasta 5 cuentas)',
      precioCOP: '$350.000',
      precioUSD: '$97 USD',
      destacado: false,
      caracteristicas: [
        'Hasta 5 Cuentas / Bodegas Centralizadas',
        'Guías e inventario ILIMITADO',
        'Suite Completa de Automatizaciones',
        'Directorio de Proveedores Élite',
        'Aviso Automático de Novedades',
        'Asistente y Estratega Dedicado 1:1',
      ],
      cta: 'Control Multi-cuenta →',
    },
  ];

  return (
    <section className="relative z-20 py-14 w-full overflow-hidden">
      
      {/* CAPA DE FONDO DINÁMICO */}
      <Fondos variante={variante} modo="absolute" />

      <div className="relative z-10 max-w-7xl mx-auto px-5">
        
        {/* ENCABEZADO CON TIPOGRAFÍA REUTILIZABLE */}
        <div className="text-center mb-10">
          <Kicker>INVERSIÓN TRANSPARENTE</Kicker>

          <H2 className="text-balance">
            Planes diseñados para <Highlight>escalar tu rentabilidad.</Highlight>
          </H2>

          <Subtitulo className="max-w-[720px] mx-auto mt-3">
            Elige el nivel de auditoría que tu bodega necesita hoy y recupera tu capital sin contratos de permanencia.
          </Subtitulo>

          {/* TOGGLE MULTI-MONEDA */}
          <div className="inline-flex items-center gap-1.5 bg-[#102935]/70 p-1 rounded-full border border-[#6884C5]/25 mt-6 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setMoneda('COP')}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all duration-300 cursor-pointer ${
                moneda === 'COP'
                  ? 'bg-[#0DEDC0] text-[#0B171C] shadow-[0_0_12px_rgba(13,237,192,0.3)]'
                  : 'bg-transparent text-slate-400 hover:text-white'
              }`}
            >
              🇨🇴 Colombia (COP)
            </button>
            <button
              type="button"
              onClick={() => setMoneda('USD')}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all duration-300 cursor-pointer ${
                moneda === 'USD'
                  ? 'bg-[#0DEDC0] text-[#0B171C] shadow-[0_0_12px_rgba(13,237,192,0.3)]'
                  : 'bg-transparent text-slate-400 hover:text-white'
              }`}
            >
              Internacional (USD)
            </button>
          </div>
        </div>

        {/* PARRILLA DE PLANES (4 COLUMNAS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {planes.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col justify-between p-5 rounded-xl relative transition-all duration-300 backdrop-blur-md ${
                plan.destacado
                  ? 'bg-gradient-to-b from-[#102935]/95 to-[#091A23]/98 border-2 border-[#0DEDC0] shadow-[0_10px_30px_rgba(13,237,192,0.18)] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(13,237,192,0.3)]'
                  : 'bg-[#102935]/40 border border-[#6884C5]/20 hover:-translate-y-1 hover:border-[#0DEDC0]/40 hover:shadow-xl'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0DEDC0] text-[#0B171C] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-[0_0_12px_rgba(13,237,192,0.5)] whitespace-nowrap">
                  {plan.badge}
                </span>
              )}

              <div>
                <h3 className="text-lg font-black text-white tracking-tight m-0">
                  {plan.nombre}
                </h3>
                <p className="text-slate-400 text-xs mt-1 leading-snug min-h-[2.2rem] font-medium">
                  {plan.perfil}
                </p>

                <div className="my-3 border-b border-white/10 pb-3 flex items-baseline">
                  <span className="text-2xl lg:text-3xl font-black text-white tracking-tight">
                    {moneda === 'COP' ? plan.precioCOP : plan.precioUSD}
                  </span>
                  <span className="text-slate-400 text-xs ml-1 font-semibold">
                    / mes
                  </span>
                </div>

                <ul className="space-y-2 mb-6 p-0 list-none">
                  {plan.caracteristicas.map((feat, idx) => (
                    <li
                      key={idx}
                      className="text-slate-300 text-xs flex items-start gap-1.5 leading-snug font-medium"
                    >
                      <span className="text-[#0DEDC0] font-black shrink-0">
                        ✓
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              {/* BOTÓN CTA */}
              <a
                href="https://atomapp.com.co/register"
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full py-2.5 px-3 rounded-lg text-center text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                  plan.destacado
                    ? 'bg-[#0DEDC0] text-[#0B171C] shadow-[0_0_12px_rgba(13,237,192,0.35)] hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]'
                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-[#0DEDC0] hover:text-[#0DEDC0]'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}