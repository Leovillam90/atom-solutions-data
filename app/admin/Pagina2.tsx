'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

const ESTRUCTURA_CMS_DEFAULT = {
  cabecera: {
    kicker: 'HERRAMIENTA PARA GERENCIA B2B',
    titulo_normal: 'Arquitectura de ',
    titulo_resaltado: 'Precios & Sensibilidad.',
    subtitulo: 'Audita matemáticamente tus costos logísticos inversos. Analiza los 4 escenarios de sensibilidad operativa y emite la propuesta comercial definitiva.'
  },
  menu_y_enlaces: {
    boton_portal_texto: 'ACCESO PORTAL',
    boton_portal_link: '/atomapp',
    link_lobostock: 'https://lobostock.vercel.app/',
    link_soporte: '/soporte',
    link_academy: '/academy'
  },
  alertas: {
    mermas_activa: true,
    mermas_titulo: 'Condición de Entrega Operativa',
    mermas_texto: 'Nota: Este valor solo se puede entregar si se cumple estrictamente con las condiciones especificadas en la tarjeta de propuesta.'
  }
};

type SeccionModulo = 'TODAS' | 'CABECERA' | 'ENLACES' | 'ALERTAS' | 'PREVIEW_LIVE';

export default function Pagina2() {
  const [data, setData] = useState(ESTRUCTURA_CMS_DEFAULT);
  const [dataOriginal, setDataOriginal] = useState(ESTRUCTURA_CMS_DEFAULT);
  const [seccionActiva, setSeccionActiva] = useState<SeccionModulo>('TODAS');
  
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'exito' | 'error' } | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const docRef = doc(db, 'configuracion_web', 'calculadora_b2b');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const rawData = docSnap.data();
          const datosCombinados = {
            cabecera: { ...ESTRUCTURA_CMS_DEFAULT.cabecera, ...(rawData.cabecera || {}) },
            menu_y_enlaces: { ...ESTRUCTURA_CMS_DEFAULT.menu_y_enlaces, ...(rawData.menu_y_enlaces || {}) },
            alertas: { ...ESTRUCTURA_CMS_DEFAULT.alertas, ...(rawData.alertas || {}) }
          };
          setData(datosCombinados);
          setDataOriginal(datosCombinados);
        }
      } catch (error) {
        console.error('Error al cargar datos desde Firestore:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const tieneCambiosSinGuardar = useMemo(() => {
    return JSON.stringify(data) !== JSON.stringify(dataOriginal);
  }, [data, dataOriginal]);

  const handleChange = (
    seccion: 'cabecera' | 'menu_y_enlaces' | 'alertas',
    campo: string,
    valor: string | boolean
  ) => {
    setData((prev) => ({
      ...prev,
      [seccion]: {
        ...prev[seccion],
        [campo]: valor
      }
    }));
  };

  const handleGuardar = async () => {
    setGuardando(true);
    setMensaje(null);
    try {
      const docRef = doc(db, 'configuracion_web', 'calculadora_b2b');
      await setDoc(docRef, data, { merge: true });
      setDataOriginal(data);
      setMensaje({ texto: '⚡ ¡Cambios sincronizados en Firestore y publicados en vivo!', tipo: 'exito' });
      setTimeout(() => setMensaje(null), 4000);
    } catch (error) {
      console.error('Error al guardar en Firestore:', error);
      setMensaje({ texto: '❌ Ocurrió un error al actualizar la base de datos.', tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  const handleDeshacerCambios = () => {
    setData(dataOriginal);
  };

  if (cargando) {
    return (
      <div className="flex flex-col justify-center items-center py-20 space-y-3 font-mono">
        <div className="w-8 h-8 border-4 border-[#0DEDC0] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-[#0DEDC0] uppercase font-bold">Cargando Firestore CMS...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-white pb-12">
      
      {/* HEADER DE CONTROL DE EDICIÓN */}
      <div className="bg-[#090D16]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0DEDC0] animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-[#0DEDC0] uppercase tracking-widest">
              MOTOR DE GESTIÓN DE CONTENIDOS EN TIEMPO REAL
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">Editor de Secciones Web</h2>
          <p className="text-xs text-slate-400">
            Modifica textos, frases y rutas sin redesplegar código fuente.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {tieneCambiosSinGuardar && (
            <button
              onClick={handleDeshacerCambios}
              disabled={guardando}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-mono text-xs font-bold transition-all border border-slate-700 cursor-pointer"
            >
              Deshacer
            </button>
          )}

          <button
            onClick={handleGuardar}
            disabled={guardando || !tieneCambiosSinGuardar}
            className={`px-6 py-2.5 rounded-xl font-mono font-bold text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
              tieneCambiosSinGuardar
                ? 'bg-[#0DEDC0] text-[#090D16] hover:bg-white shadow-[0_0_20px_rgba(13,237,192,0.4)] scale-105'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
            }`}
          >
            {guardando ? 'Guardando...' : tieneCambiosSinGuardar ? 'Guardar Cambios' : 'Sin Cambios'}
          </button>
        </div>
      </div>

      {mensaje && (
        <div className={`p-4 rounded-2xl text-xs font-mono font-bold flex items-center justify-between ${
          mensaje.tipo === 'exito' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
        }`}>
          <span>{mensaje.texto}</span>
          <button onClick={() => setMensaje(null)} className="text-slate-400 hover:text-white font-mono text-sm ml-4">✕</button>
        </div>
      )}

      {/* SELECTOR DE SUB-SECCIONES DEL CMS */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#091A23]/80 backdrop-blur-md rounded-2xl border border-slate-800">
        <button
          onClick={() => setSeccionActiva('TODAS')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
            seccionActiva === 'TODAS' ? 'bg-[#0DEDC0] text-[#090D16]' : 'text-slate-400 hover:text-white'
          }`}
        >
          📋 Vista Completa
        </button>

        <button
          onClick={() => setSeccionActiva('CABECERA')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
            seccionActiva === 'CABECERA' ? 'bg-[#0DEDC0] text-[#090D16]' : 'text-slate-400 hover:text-white'
          }`}
        >
          🚀 1. Cabecera & Hero
        </button>

        <button
          onClick={() => setSeccionActiva('ENLACES')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
            seccionActiva === 'ENLACES' ? 'bg-[#0DEDC0] text-[#090D16]' : 'text-slate-400 hover:text-white'
          }`}
        >
          🔗 2. Menú & Enlaces
        </button>

        <button
          onClick={() => setSeccionActiva('ALERTAS')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
            seccionActiva === 'ALERTAS' ? 'bg-amber-400 text-[#090D16]' : 'text-slate-400 hover:text-white'
          }`}
        >
          ⚠️ 3. Alertas & Mermas
        </button>

        <button
          onClick={() => setSeccionActiva('PREVIEW_LIVE')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ml-auto ${
            seccionActiva === 'PREVIEW_LIVE' ? 'bg-blue-500 text-white' : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
          }`}
        >
          👁️ Vista Previa Live
        </button>
      </div>

      {/* MÓDULO 1: CABECERA */}
      {(seccionActiva === 'TODAS' || seccionActiva === 'CABECERA') && (
        <div className="bg-[#090D16]/90 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
          <h3 className="text-[#0DEDC0] font-mono font-bold text-xs uppercase border-b border-slate-800 pb-2">
            1. Textos Principales de la Cabecera
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">Kicker (Texto superior pequeño)</label>
              <input 
                type="text" 
                value={data.cabecera?.kicker || ''} 
                onChange={(e) => handleChange('cabecera', 'kicker', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-white text-xs font-mono outline-none focus:border-[#0DEDC0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">Título Normal (Blanco)</label>
              <input 
                type="text" 
                value={data.cabecera?.titulo_normal || ''} 
                onChange={(e) => handleChange('cabecera', 'titulo_normal', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-[#0DEDC0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">Título Resaltado (Neón)</label>
              <input 
                type="text" 
                value={data.cabecera?.titulo_resaltado || ''} 
                onChange={(e) => handleChange('cabecera', 'titulo_resaltado', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-[#0DEDC0] text-xs font-bold outline-none focus:border-[#0DEDC0]"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">Subtítulo / Descripción Operativa</label>
              <textarea 
                rows={3} 
                value={data.cabecera?.subtitulo || ''} 
                onChange={(e) => handleChange('cabecera', 'subtitulo', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-slate-200 text-xs leading-relaxed outline-none focus:border-[#0DEDC0] resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* MÓDULO 2: ENLACES */}
      {(seccionActiva === 'TODAS' || seccionActiva === 'ENLACES') && (
        <div className="bg-[#090D16]/90 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
          <h3 className="text-[#0DEDC0] font-mono font-bold text-xs uppercase border-b border-slate-800 pb-2">
            2. Textos de Botones & Rutas de Navegación
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">Texto Botón Portal</label>
              <input 
                type="text" 
                value={data.menu_y_enlaces?.boton_portal_texto || ''} 
                onChange={(e) => handleChange('menu_y_enlaces', 'boton_portal_texto', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-[#0DEDC0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">Ruta Botón Portal</label>
              <input 
                type="text" 
                value={data.menu_y_enlaces?.boton_portal_link || ''} 
                onChange={(e) => handleChange('menu_y_enlaces', 'boton_portal_link', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-slate-300 font-mono text-xs outline-none focus:border-[#0DEDC0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">Link LoboStock</label>
              <input 
                type="text" 
                value={data.menu_y_enlaces?.link_lobostock || ''} 
                onChange={(e) => handleChange('menu_y_enlaces', 'link_lobostock', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-slate-300 font-mono text-xs outline-none focus:border-[#0DEDC0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">Link Soporte</label>
              <input 
                type="text" 
                value={data.menu_y_enlaces?.link_soporte || ''} 
                onChange={(e) => handleChange('menu_y_enlaces', 'link_soporte', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-slate-300 font-mono text-xs outline-none focus:border-[#0DEDC0]"
              />
            </div>
          </div>
        </div>
      )}

      {/* MÓDULO 3: ALERTAS */}
      {(seccionActiva === 'TODAS' || seccionActiva === 'ALERTAS') && (
        <div className="bg-[#090D16]/90 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-amber-400 font-mono font-bold text-xs uppercase">
              3. Mensajes de Alerta Operativa
            </h3>
            
            <label className="flex items-center gap-2 cursor-pointer bg-[#102935] px-3 py-1 rounded-xl border border-slate-700">
              <span className="text-xs font-mono font-bold text-slate-300">Mostrar Alerta:</span>
              <input 
                type="checkbox" 
                checked={Boolean(data.alertas?.mermas_activa)}
                onChange={(e) => handleChange('alertas', 'mermas_activa', e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </label>
          </div>

          <div className={`grid grid-cols-1 gap-5 ${!data.alertas?.mermas_activa ? 'opacity-40 pointer-events-none' : ''}`}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">Título Alerta</label>
              <input 
                type="text" 
                value={data.alertas?.mermas_titulo || ''} 
                onChange={(e) => handleChange('alertas', 'mermas_titulo', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-amber-300 text-xs font-bold outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">Texto Detallado</label>
              <textarea 
                rows={2} 
                value={data.alertas?.mermas_texto || ''} 
                onChange={(e) => handleChange('alertas', 'mermas_texto', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-slate-200 text-xs leading-relaxed outline-none focus:border-amber-400 resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* MÓDULO 4: VISTA PREVIA */}
      {(seccionActiva === 'TODAS' || seccionActiva === 'PREVIEW_LIVE') && (
        <div className="bg-[#050811] p-6 sm:p-8 rounded-3xl border border-blue-500/30 space-y-6 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
          <h3 className="text-blue-400 font-mono font-bold text-xs uppercase border-b border-blue-500/20 pb-2">
            👁️ Previsualización en Vivo de la Plataforma
          </h3>

          <div className="bg-[#070B14] p-6 rounded-2xl border border-slate-800 space-y-4">
            <span className="text-[11px] font-mono font-bold text-[#0DEDC0] tracking-widest uppercase block">
              {data.cabecera?.kicker}
            </span>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {data.cabecera?.titulo_normal}
              <span className="text-[#0DEDC0] drop-shadow-[0_0_15px_rgba(13,237,192,0.6)]">
                {data.cabecera?.titulo_resaltado}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {data.cabecera?.subtitulo}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="px-5 py-2.5 bg-[#0DEDC0] text-[#090D16] font-mono font-bold text-xs rounded-xl">
                {data.menu_y_enlaces?.boton_portal_texto}
              </span>
            </div>

            {data.alertas?.mermas_activa && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1 mt-4">
                <h4 className="text-xs font-mono font-bold text-amber-400 uppercase">
                  ⚠️ {data.alertas?.mermas_titulo}
                </h4>
                <p className="text-xs text-amber-200/90 leading-relaxed font-sans">
                  {data.alertas?.mermas_texto}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}