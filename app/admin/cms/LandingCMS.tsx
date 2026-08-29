'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { ESTRUCTURA_CMS_DEFAULT } from '@/app/context/CMSContext';

type SubTabLanding = 'HERO' | 'DIAGNOSTICOS' | 'METRICAS' | 'PRECIOS' | 'CIERRE';

export default function LandingCMS() {
  const [subLanding, setSubLanding] = useState<SubTabLanding>('HERO');
  const [landingData, setLandingData] = useState(ESTRUCTURA_CMS_DEFAULT.landing);
  const [landingOriginal, setLandingOriginal] = useState(ESTRUCTURA_CMS_DEFAULT.landing);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'exito' | 'error' } | null>(null);

  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        const docRef = doc(db, 'configuracion_web', 'plataforma_cms');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const bd = docSnap.data();
          if (bd.landing) {
            const combinado = {
              seccion1_hero: { ...ESTRUCTURA_CMS_DEFAULT.landing.seccion1_hero, ...(bd.landing.seccion1_hero || {}) },
              seccion3_diagnosticos: { ...ESTRUCTURA_CMS_DEFAULT.landing.seccion3_diagnosticos, ...(bd.landing.seccion3_diagnosticos || {}) },
              seccion4_metricas: { ...ESTRUCTURA_CMS_DEFAULT.landing.seccion4_metricas, ...(bd.landing.seccion4_metricas || {}) },
              seccion5_precios: { ...ESTRUCTURA_CMS_DEFAULT.landing.seccion5_precios, ...(bd.landing.seccion5_precios || {}) },
              seccion6_cierre: { ...ESTRUCTURA_CMS_DEFAULT.landing.seccion6_cierre, ...(bd.landing.seccion6_cierre || {}) },
            };
            setLandingData(combinado);
            setLandingOriginal(combinado);
          }
        }
      } catch (e) {
        console.error('Error cargando Landing CMS:', e);
      } finally {
        setCargando(false);
      }
    };

    cargarConfiguracion();
  }, []);

  const tieneCambios = useMemo(() => {
    return JSON.stringify(landingData) !== JSON.stringify(landingOriginal);
  }, [landingData, landingOriginal]);

  const handleFieldChange = (seccionKey: keyof typeof ESTRUCTURA_CMS_DEFAULT.landing, campo: string, valor: any) => {
    setLandingData((prev) => ({
      ...prev,
      [seccionKey]: {
        ...prev[seccionKey],
        [campo]: valor
      }
    }));
  };

  const handleArrayTarjetaChange = (idx: number, campo: string, valor: string) => {
    setLandingData((prev) => {
      const nuevasTarjetas = [...prev.seccion3_diagnosticos.tarjetas];
      nuevasTarjetas[idx] = { ...nuevasTarjetas[idx], [campo]: valor };
      return {
        ...prev,
        seccion3_diagnosticos: {
          ...prev.seccion3_diagnosticos,
          tarjetas: nuevasTarjetas
        }
      };
    });
  };

  const handleArrayMetricaChange = (idx: number, campo: string, valor: string) => {
    setLandingData((prev) => {
      const nuevasMetricas = [...prev.seccion4_metricas.metricas];
      nuevasMetricas[idx] = { ...nuevasMetricas[idx], [campo]: valor };
      return {
        ...prev,
        seccion4_metricas: {
          ...prev.seccion4_metricas,
          metricas: nuevasMetricas
        }
      };
    });
  };

  const handleArrayPlanChange = (idx: number, campo: string, valor: any) => {
    setLandingData((prev) => {
      const nuevosPlanes = [...prev.seccion5_precios.planes];
      nuevosPlanes[idx] = { ...nuevosPlanes[idx], [campo]: valor };
      return {
        ...prev,
        seccion5_precios: {
          ...prev.seccion5_precios,
          planes: nuevosPlanes
        }
      };
    });
  };

  const handleGuardar = async () => {
    setGuardando(true);
    setMensaje(null);
    try {
      const docRef = doc(db, 'configuracion_web', 'plataforma_cms');
      await setDoc(docRef, { landing: landingData }, { merge: true });
      setLandingOriginal(landingData);
      setMensaje({ texto: '⚡ ¡Landing Page actualizada con éxito!', tipo: 'exito' });
      setTimeout(() => setMensaje(null), 4000);
    } catch (e) {
      console.error('Error al guardar Landing CMS:', e);
      setMensaje({ texto: '❌ Error al guardar los cambios.', tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return <div className="p-8 text-center text-slate-400 font-mono text-xs">Cargando Módulo Landing...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* BOTÓN BARRAS Y SUBPESTAÑAS */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#090D16]/90 p-4 rounded-3xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSubLanding('HERO')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
              subLanding === 'HERO' ? 'bg-white text-[#090D16]' : 'text-slate-400 hover:text-white'
            }`}
          >
            🚀 Hero (Sección 1)
          </button>

          <button
            onClick={() => setSubLanding('DIAGNOSTICOS')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
              subLanding === 'DIAGNOSTICOS' ? 'bg-white text-[#090D16]' : 'text-slate-400 hover:text-white'
            }`}
          >
            🩺 Diagnósticos (Sección 3)
          </button>

          <button
            onClick={() => setSubLanding('METRICAS')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
              subLanding === 'METRICAS' ? 'bg-white text-[#090D16]' : 'text-slate-400 hover:text-white'
            }`}
          >
            📈 Métricas (Sección 4)
          </button>

          <button
            onClick={() => setSubLanding('PRECIOS')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
              subLanding === 'PRECIOS' ? 'bg-white text-[#090D16]' : 'text-slate-400 hover:text-white'
            }`}
          >
            💎 Planes (Sección 5)
          </button>

          <button
            onClick={() => setSubLanding('CIERRE')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
              subLanding === 'CIERRE' ? 'bg-white text-[#090D16]' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎯 Cierre / CTA (Sección 6)
          </button>
        </div>

        <button
          onClick={handleGuardar}
          disabled={guardando || !tieneCambios}
          className={`px-5 py-2 rounded-xl font-mono font-bold text-xs cursor-pointer ${
            tieneCambios ? 'bg-[#0DEDC0] text-[#090D16]' : 'bg-slate-800 text-slate-500'
          }`}
        >
          {guardando ? 'Guardando...' : tieneCambios ? 'Guardar Cambios' : 'Sin Cambios'}
        </button>
      </div>

      {mensaje && (
        <div className={`p-3 rounded-xl font-mono text-xs font-bold ${
          mensaje.tipo === 'exito' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400'
        }`}>
          {mensaje.texto}
        </div>
      )}

      {/* SUB-SECCIÓN HERO */}
      {subLanding === 'HERO' && (
        <div className="bg-[#090D16]/90 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-[#0DEDC0] font-mono font-bold text-xs uppercase border-b border-slate-800 pb-2">
            1. Hero Principal y Video
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-mono text-slate-300 mb-1">Kicker Superior</label>
              <input
                type="text"
                value={landingData.seccion1_hero.kicker}
                onChange={(e) => handleFieldChange('seccion1_hero', 'kicker', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Título Base (Blanco)</label>
              <input
                type="text"
                value={landingData.seccion1_hero.titulo_base}
                onChange={(e) => handleFieldChange('seccion1_hero', 'titulo_base', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Título Destacado (Neón)</label>
              <input
                type="text"
                value={landingData.seccion1_hero.titulo_destacado}
                onChange={(e) => handleFieldChange('seccion1_hero', 'titulo_destacado', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-[#0DEDC0] text-xs font-bold"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-mono text-slate-300 mb-1">Subtítulo Explicativo</label>
              <textarea
                rows={3}
                value={landingData.seccion1_hero.subtitulo}
                onChange={(e) => handleFieldChange('seccion1_hero', 'subtitulo', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-slate-200 text-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Checklist Item 1</label>
              <input
                type="text"
                value={landingData.seccion1_hero.check_1}
                onChange={(e) => handleFieldChange('seccion1_hero', 'check_1', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Checklist Item 2</label>
              <input
                type="text"
                value={landingData.seccion1_hero.check_2}
                onChange={(e) => handleFieldChange('seccion1_hero', 'check_2', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-slate-300 text-xs"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-mono text-slate-300 mb-1">Checklist Item 3</label>
              <input
                type="text"
                value={landingData.seccion1_hero.check_3}
                onChange={(e) => handleFieldChange('seccion1_hero', 'check_3', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Texto Botón CTA</label>
              <input
                type="text"
                value={landingData.seccion1_hero.cta_texto}
                onChange={(e) => handleFieldChange('seccion1_hero', 'cta_texto', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-[#0DEDC0] text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">URL Botón CTA</label>
              <input
                type="text"
                value={landingData.seccion1_hero.cta_link}
                onChange={(e) => handleFieldChange('seccion1_hero', 'cta_link', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-slate-300 font-mono text-xs"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-mono text-slate-300 mb-1">Ruta Video MP4</label>
              <input
                type="text"
                value={landingData.seccion1_hero.video_url}
                onChange={(e) => handleFieldChange('seccion1_hero', 'video_url', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-blue-300 font-mono text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECCIÓN DIAGNÓSTICOS */}
      {subLanding === 'DIAGNOSTICOS' && (
        <div className="bg-[#090D16]/90 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-[#0DEDC0] font-mono font-bold text-xs uppercase border-b border-slate-800 pb-2">
            3. Tarjetas de Diagnóstico
          </h3>

          <div className="space-y-4">
            {landingData.seccion3_diagnosticos.tarjetas.map((tarjeta, idx) => (
              <div key={tarjeta.id || idx} className="bg-[#102935]/60 p-4 rounded-2xl border border-slate-700 space-y-3">
                <span className="text-[10px] font-mono text-[#0DEDC0] uppercase font-bold block">Tarjeta #{idx + 1}</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Título</label>
                    <input
                      type="text"
                      value={tarjeta.titulo}
                      onChange={(e) => handleArrayTarjetaChange(idx, 'titulo', e.target.value)}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-lg p-2.5 text-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Texto Botón</label>
                    <input
                      type="text"
                      value={tarjeta.ctaText}
                      onChange={(e) => handleArrayTarjetaChange(idx, 'ctaText', e.target.value)}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-lg p-2.5 text-[#0DEDC0] text-xs font-bold"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Descripción</label>
                    <textarea
                      rows={2}
                      value={tarjeta.descripcion}
                      onChange={(e) => handleArrayTarjetaChange(idx, 'descripcion', e.target.value)}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-lg p-2.5 text-slate-300 text-xs resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-SECCIÓN MÉTRICAS */}
      {subLanding === 'METRICAS' && (
        <div className="bg-[#090D16]/90 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-[#0DEDC0] font-mono font-bold text-xs uppercase border-b border-slate-800 pb-2">
            4. Métricas Destacadas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {landingData.seccion4_metricas.metricas.map((metrica, idx) => (
              <div key={idx} className="bg-[#102935]/60 p-4 rounded-2xl border border-slate-700 space-y-3">
                <span className="text-[10px] font-mono text-[#0DEDC0] font-bold block">Métrica #{idx + 1}</span>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Valor</label>
                  <input
                    type="text"
                    value={metrica.valor}
                    onChange={(e) => handleArrayMetricaChange(idx, 'valor', e.target.value)}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-lg p-2 text-white text-base font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Kicker</label>
                  <input
                    type="text"
                    value={metrica.kicker}
                    onChange={(e) => handleArrayMetricaChange(idx, 'kicker', e.target.value)}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-lg p-2 text-slate-300 text-xs font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-SECCIÓN PRECIOS */}
      {subLanding === 'PRECIOS' && (
        <div className="bg-[#090D16]/90 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-[#0DEDC0] font-mono font-bold text-xs uppercase border-b border-slate-800 pb-2">
            5. Planes y Precios
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {landingData.seccion5_precios.planes.map((plan, idx) => (
              <div key={plan.id || idx} className="bg-[#102935]/60 p-4 rounded-2xl border border-slate-700 space-y-3">
                <span className="text-[10px] font-mono text-[#0DEDC0] uppercase font-bold block">Plan #{idx + 1}: {plan.nombre}</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Precio COP</label>
                    <input
                      type="text"
                      value={plan.precioCOP}
                      onChange={(e) => handleArrayPlanChange(idx, 'precioCOP', e.target.value)}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-lg p-2 text-emerald-400 font-mono text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Precio USD</label>
                    <input
                      type="text"
                      value={plan.precioUSD}
                      onChange={(e) => handleArrayPlanChange(idx, 'precioUSD', e.target.value)}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-lg p-2 text-blue-400 font-mono text-xs font-bold"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Perfil</label>
                    <input
                      type="text"
                      value={plan.perfil}
                      onChange={(e) => handleArrayPlanChange(idx, 'perfil', e.target.value)}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-lg p-2 text-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-SECCIÓN CIERRE */}
      {subLanding === 'CIERRE' && (
        <div className="bg-[#090D16]/90 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-[#0DEDC0] font-mono font-bold text-xs uppercase border-b border-slate-800 pb-2">
            6. Cierre Final
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Título</label>
              <input
                type="text"
                value={landingData.seccion6_cierre.titulo}
                onChange={(e) => handleFieldChange('seccion6_cierre', 'titulo', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Texto Botón</label>
              <input
                type="text"
                value={landingData.seccion6_cierre.cta_texto}
                onChange={(e) => handleFieldChange('seccion6_cierre', 'cta_texto', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-[#0DEDC0] text-xs font-bold"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-mono text-slate-300 mb-1">Subtítulo</label>
              <textarea
                rows={2}
                value={landingData.seccion6_cierre.subtitulo}
                onChange={(e) => handleFieldChange('seccion6_cierre', 'subtitulo', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-slate-200 text-xs resize-none"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}