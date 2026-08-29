'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { ESTRUCTURA_CMS_DEFAULT } from '@/app/context/CMSContext';

type SubNoticias = 'PRINCIPAL' | 'STORIES' | 'SECUNDARIOS' | 'WHATSAPP';

export default function NoticiasCMS() {
  const [subTab, setSubTab] = useState<SubNoticias>('PRINCIPAL');
  const [noticiasData, setNoticiasData] = useState(ESTRUCTURA_CMS_DEFAULT.noticias);
  const [noticiasOriginal, setNoticiasOriginal] = useState(ESTRUCTURA_CMS_DEFAULT.noticias);

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
          if (bd.noticias) {
            const combinado = {
              hero: { ...ESTRUCTURA_CMS_DEFAULT.noticias.hero, ...(bd.noticias.hero || {}) },
              articulo_principal: { ...ESTRUCTURA_CMS_DEFAULT.noticias.articulo_principal, ...(bd.noticias.articulo_principal || {}) },
              articulosecundarios: bd.noticias.articulosecundarios || ESTRUCTURA_CMS_DEFAULT.noticias.articulosecundarios,
              comunidad_whatsapp: { ...ESTRUCTURA_CMS_DEFAULT.noticias.comunidad_whatsapp, ...(bd.noticias.comunidad_whatsapp || {}) },
            };
            setNoticiasData(combinado);
            setNoticiasOriginal(combinado);
          }
        }
      } catch (e) {
        console.error('Error cargando Noticias CMS:', e);
      } finally {
        setCargando(false);
      }
    };

    cargarConfiguracion();
  }, []);

  const tieneCambios = useMemo(() => {
    return JSON.stringify(noticiasData) !== JSON.stringify(noticiasOriginal);
  }, [noticiasData, noticiasOriginal]);

  const handleFieldChange = (seccion: 'hero' | 'articulo_principal' | 'comunidad_whatsapp', campo: string, valor: any) => {
    setNoticiasData((prev) => ({
      ...prev,
      [seccion]: {
        ...prev[seccion],
        [campo]: valor
      }
    }));
  };

  const handleHistoriaChange = (idx: number, valor: string) => {
    setNoticiasData((prev) => {
      const nuevasHistorias = [...prev.articulo_principal.historias];
      nuevasHistorias[idx] = valor;
      return {
        ...prev,
        articulo_principal: {
          ...prev.articulo_principal,
          historias: nuevasHistorias
        }
      };
    });
  };

  const handleAgregarHistoria = () => {
    setNoticiasData((prev) => ({
      ...prev,
      articulo_principal: {
        ...prev.articulo_principal,
        historias: [...prev.articulo_principal.historias, '/noticias/nueva.jpeg']
      }
    }));
  };

  const handleEliminarHistoria = (idx: number) => {
    setNoticiasData((prev) => ({
      ...prev,
      articulo_principal: {
        ...prev.articulo_principal,
        historias: prev.articulo_principal.historias.filter((_, i) => i !== idx)
      }
    }));
  };

  const handleArticuloSecundarioChange = (idx: number, campo: string, valor: any) => {
    setNoticiasData((prev) => {
      const nuevosArticulos = [...prev.articulosecundarios];
      nuevosArticulos[idx] = { ...nuevosArticulos[idx], [campo]: valor };
      return {
        ...prev,
        articulosecundarios: nuevosArticulos
      };
    });
  };

  const handleGuardar = async () => {
    setGuardando(true);
    setMensaje(null);
    try {
      const docRef = doc(db, 'configuracion_web', 'plataforma_cms');
      await setDoc(docRef, { noticias: noticiasData }, { merge: true });
      setNoticiasOriginal(noticiasData);
      setMensaje({ texto: '⚡ ¡Noticias actualizadas con éxito!', tipo: 'exito' });
      setTimeout(() => setMensaje(null), 4000);
    } catch (e) {
      console.error('Error guardando Noticias CMS:', e);
      setMensaje({ texto: '❌ Error al guardar.', tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return <div className="p-8 text-center text-slate-400 font-mono text-xs">Cargando Módulo Noticias...</div>;
  }

  return (
    <div className="space-y-6">
      
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#090D16]/90 p-4 rounded-3xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSubTab('PRINCIPAL')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
              subTab === 'PRINCIPAL' ? 'bg-white text-[#090D16]' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⭐ Noticia Principal
          </button>

          <button
            onClick={() => setSubTab('STORIES')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
              subTab === 'STORIES' ? 'bg-white text-[#090D16]' : 'text-slate-400 hover:text-white'
            }`}
          >
            📱 Historias ({noticiasData.articulo_principal.historias.length})
          </button>

          <button
            onClick={() => setSubTab('SECUNDARIOS')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
              subTab === 'SECUNDARIOS' ? 'bg-white text-[#090D16]' : 'text-slate-400 hover:text-white'
            }`}
          >
            📚 Artículos Secundarios
          </button>

          <button
            onClick={() => setSubTab('WHATSAPP')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
              subTab === 'WHATSAPP' ? 'bg-white text-[#090D16]' : 'text-slate-400 hover:text-white'
            }`}
          >
            💬 Banner WhatsApp
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

      {/* NOTICIA PRINCIPAL */}
      {subTab === 'PRINCIPAL' && (
        <div className="bg-[#090D16]/90 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-[#0DEDC0] font-mono font-bold text-xs uppercase border-b border-slate-800 pb-2">
            Noticia Principal
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Categoría</label>
              <input
                type="text"
                value={noticiasData.articulo_principal.categoria}
                onChange={(e) => handleFieldChange('articulo_principal', 'categoria', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Fecha</label>
              <input
                type="text"
                value={noticiasData.articulo_principal.fecha}
                onChange={(e) => handleFieldChange('articulo_principal', 'fecha', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-slate-300 text-xs"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-mono text-slate-300 mb-1">Título Noticia</label>
              <input
                type="text"
                value={noticiasData.articulo_principal.titulo}
                onChange={(e) => handleFieldChange('articulo_principal', 'titulo', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-white text-sm font-bold"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-mono text-slate-300 mb-1">Resumen</label>
              <textarea
                rows={3}
                value={noticiasData.articulo_principal.resumen}
                onChange={(e) => handleFieldChange('articulo_principal', 'resumen', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-slate-200 text-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Texto Botón CTA</label>
              <input
                type="text"
                value={noticiasData.articulo_principal.textoCta}
                onChange={(e) => handleFieldChange('articulo_principal', 'textoCta', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-[#0DEDC0] text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Enlace Destino CTA</label>
              <input
                type="text"
                value={noticiasData.articulo_principal.linkCta}
                onChange={(e) => handleFieldChange('articulo_principal', 'linkCta', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-blue-300 font-mono text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* HISTORIAS */}
      {subTab === 'STORIES' && (
        <div className="bg-[#090D16]/90 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-[#0DEDC0] font-mono font-bold text-xs uppercase">
              Carrusel de Historias (.mp4 / .jpeg)
            </h3>
            <button
              onClick={handleAgregarHistoria}
              className="px-3 py-1 bg-[#0DEDC0] text-[#090D16] text-xs font-mono font-bold rounded-lg cursor-pointer"
            >
              + Agregar
            </button>
          </div>

          <div className="space-y-2">
            {noticiasData.articulo_principal.historias.map((hist, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-[#102935]/60 p-3 rounded-xl border border-slate-700">
                <span className="text-xs font-mono font-bold text-[#0DEDC0]">#{idx + 1}</span>
                <input
                  type="text"
                  value={hist}
                  onChange={(e) => handleHistoriaChange(idx, e.target.value)}
                  className="flex-1 bg-[#090D16] border border-slate-700 rounded-lg p-2 text-white text-xs font-mono"
                />
                <button
                  onClick={() => handleEliminarHistoria(idx)}
                  className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-mono font-bold cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ARTÍCULOS SECUNDARIOS */}
      {subTab === 'SECUNDARIOS' && (
        <div className="bg-[#090D16]/90 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-[#0DEDC0] font-mono font-bold text-xs uppercase border-b border-slate-800 pb-2">
            Tarjetas Secundarias
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {noticiasData.articulosecundarios.map((art, idx) => (
              <div key={art.id || idx} className="bg-[#102935]/60 p-4 rounded-2xl border border-slate-700 space-y-3">
                <span className="text-[10px] font-mono text-[#0DEDC0] uppercase font-bold block">Artículo #{idx + 1}</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Título</label>
                    <input
                      type="text"
                      value={art.titulo}
                      onChange={(e) => handleArticuloSecundarioChange(idx, 'titulo', e.target.value)}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-lg p-2 text-white text-xs font-bold"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Link</label>
                    <input
                      type="text"
                      value={art.link}
                      onChange={(e) => handleArticuloSecundarioChange(idx, 'link', e.target.value)}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-lg p-2 text-blue-300 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WHATSAPP */}
      {subTab === 'WHATSAPP' && (
        <div className="bg-[#090D16]/90 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-[#0DEDC0] font-mono font-bold text-xs uppercase border-b border-slate-800 pb-2">
            Banner Comunidad WhatsApp
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-mono text-slate-300 mb-1">Título</label>
              <input
                type="text"
                value={noticiasData.comunidad_whatsapp.titulo}
                onChange={(e) => handleFieldChange('comunidad_whatsapp', 'titulo', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-white text-xs font-bold"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-mono text-slate-300 mb-1">URL Grupo WhatsApp</label>
              <input
                type="text"
                value={noticiasData.comunidad_whatsapp.whatsappGroupUrl}
                onChange={(e) => handleFieldChange('comunidad_whatsapp', 'whatsappGroupUrl', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-emerald-400 font-mono text-xs font-bold"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}