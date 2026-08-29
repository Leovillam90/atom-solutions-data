'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { ESTRUCTURA_CMS_DEFAULT } from '@/app/context/CMSContext';

type SubAcademy = 'HERO' | 'LECCIONES' | 'MATERIALES';

export default function AcademyCMS() {
  const [subTab, setSubTab] = useState<SubAcademy>('LECCIONES');
  const [academyData, setAcademyData] = useState(ESTRUCTURA_CMS_DEFAULT.academy);
  const [academyOriginal, setAcademyOriginal] = useState(ESTRUCTURA_CMS_DEFAULT.academy);

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
          if (bd.academy) {
            const combinado = {
              cabecera: { ...ESTRUCTURA_CMS_DEFAULT.academy.cabecera, ...(bd.academy.cabecera || {}) },
              lecciones: bd.academy.lecciones || ESTRUCTURA_CMS_DEFAULT.academy.lecciones,
              materiales_cabecera: { ...ESTRUCTURA_CMS_DEFAULT.academy.materiales_cabecera, ...(bd.academy.materiales_cabecera || {}) },
              materiales: bd.academy.materiales || ESTRUCTURA_CMS_DEFAULT.academy.materiales,
            };
            setAcademyData(combinado);
            setAcademyOriginal(combinado);
          }
        }
      } catch (e) {
        console.error('Error cargando Academy CMS:', e);
      } finally {
        setCargando(false);
      }
    };

    cargarConfiguracion();
  }, []);

  const tieneCambios = useMemo(() => {
    return JSON.stringify(academyData) !== JSON.stringify(academyOriginal);
  }, [academyData, academyOriginal]);

  const handleCabeceraChange = (campo: string, valor: string) => {
    setAcademyData((prev) => ({
      ...prev,
      cabecera: {
        ...prev.cabecera,
        [campo]: valor
      }
    }));
  };

  const handleLeccionChange = (idx: number, campo: string, valor: any) => {
    setAcademyData((prev) => {
      const nuevasLecciones = [...prev.lecciones];
      nuevasLecciones[idx] = { ...nuevasLecciones[idx], [campo]: valor };
      return {
        ...prev,
        lecciones: nuevasLecciones
      };
    });
  };

  const handleAgregarLeccion = () => {
    setAcademyData((prev) => ({
      ...prev,
      lecciones: [
        ...prev.lecciones,
        {
          id: String(Date.now()),
          titulo: 'Nueva Lección',
          duracion: '02:00',
          categoria: 'Operaciones',
          badge: 'Táctica Rápida',
          descripcion: 'Descripción paso a paso de la nueva lección.',
          youtubeId: 'feDbKxnh50k'
        }
      ]
    }));
  };

  const handleEliminarLeccion = (idx: number) => {
    setAcademyData((prev) => ({
      ...prev,
      lecciones: prev.lecciones.filter((_, i) => i !== idx)
    }));
  };

  const handleMaterialChange = (idx: number, campo: string, valor: any) => {
    setAcademyData((prev) => {
      const nuevosMateriales = [...prev.materiales];
      nuevosMateriales[idx] = { ...nuevosMateriales[idx], [campo]: valor };
      return {
        ...prev,
        materiales: nuevosMateriales
      };
    });
  };

  const handleAgregarMaterial = () => {
    setAcademyData((prev) => ({
      ...prev,
      materiales: [
        ...prev.materiales,
        {
          id: String(Date.now()),
          titulo: 'Nuevo Documento',
          tipo: 'PDF',
          categoria: 'GUÍA OPERATIVA',
          metaInfo: 'PDF - 1.5 MB',
          descripcion: 'Descripción del documento.',
          textoBoton: '↓ DESCARGAR',
          urlDestino: '/apoyo/documento.pdf',
          esDescargaDirecta: true
        }
      ]
    }));
  };

  const handleEliminarMaterial = (idx: number) => {
    setAcademyData((prev) => ({
      ...prev,
      materiales: prev.materiales.filter((_, i) => i !== idx)
    }));
  };

  const handleGuardar = async () => {
    setGuardando(true);
    setMensaje(null);
    try {
      const docRef = doc(db, 'configuracion_web', 'plataforma_cms');
      await setDoc(docRef, { academy: academyData }, { merge: true });
      setAcademyOriginal(academyData);
      setMensaje({ texto: '⚡ ¡Módulo Academy actualizado con éxito!', tipo: 'exito' });
      setTimeout(() => setMensaje(null), 4000);
    } catch (e) {
      console.error('Error guardando Academy CMS:', e);
      setMensaje({ texto: '❌ Error al guardar.', tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return <div className="p-8 text-center text-slate-400 font-mono text-xs">Cargando Módulo Academy...</div>;
  }

  return (
    <div className="space-y-6">
      
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#090D16]/90 p-4 rounded-3xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSubTab('HERO')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
              subTab === 'HERO' ? 'bg-white text-[#090D16]' : 'text-slate-400 hover:text-white'
            }`}
          >
            🚀 Cabecera
          </button>

          <button
            onClick={() => setSubTab('LECCIONES')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
              subTab === 'LECCIONES' ? 'bg-white text-[#090D16]' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎥 Lecciones YouTube ({academyData.lecciones.length})
          </button>

          <button
            onClick={() => setSubTab('MATERIALES')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
              subTab === 'MATERIALES' ? 'bg-white text-[#090D16]' : 'text-slate-400 hover:text-white'
            }`}
          >
            📚 Biblioteca PDF / Excel ({academyData.materiales.length})
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

      {/* CABECERA */}
      {subTab === 'HERO' && (
        <div className="bg-[#090D16]/90 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-[#0DEDC0] font-mono font-bold text-xs uppercase border-b border-slate-800 pb-2">
            Cabecera Academy
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Título Normal</label>
              <input
                type="text"
                value={academyData.cabecera.titulo_base}
                onChange={(e) => handleCabeceraChange('titulo_base', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Título Destacado</label>
              <input
                type="text"
                value={academyData.cabecera.titulo_destacado}
                onChange={(e) => handleCabeceraChange('titulo_destacado', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-[#0DEDC0] text-xs font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* LECCIONES */}
      {subTab === 'LECCIONES' && (
        <div className="bg-[#090D16]/90 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-[#0DEDC0] font-mono font-bold text-xs uppercase">
              Videos de Entrenamiento (YouTube)
            </h3>
            <button
              onClick={handleAgregarLeccion}
              className="px-3 py-1 bg-[#0DEDC0] text-[#090D16] text-xs font-mono font-bold rounded-lg cursor-pointer"
            >
              + Agregar Video
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {academyData.lecciones.map((lec, idx) => (
              <div key={lec.id || idx} className="bg-[#102935]/60 p-4 rounded-2xl border border-slate-700 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-[#0DEDC0] font-bold">Lección #{idx + 1}</span>
                  <button onClick={() => handleEliminarLeccion(idx)} className="text-red-400 font-mono text-[10px] cursor-pointer">[Eliminar]</button>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Título</label>
                  <input
                    type="text"
                    value={lec.titulo}
                    onChange={(e) => handleLeccionChange(idx, 'titulo', e.target.value)}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-lg p-2 text-white text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">YouTube ID</label>
                    <input
                      type="text"
                      value={lec.youtubeId}
                      onChange={(e) => handleLeccionChange(idx, 'youtubeId', e.target.value)}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-lg p-2 text-blue-300 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Duración</label>
                    <input
                      type="text"
                      value={lec.duracion}
                      onChange={(e) => handleLeccionChange(idx, 'duracion', e.target.value)}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-lg p-2 text-slate-300 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MATERIALES */}
      {subTab === 'MATERIALES' && (
        <div className="bg-[#090D16]/90 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-[#0DEDC0] font-mono font-bold text-xs uppercase">
              Materiales Descargables (PDF / Excel)
            </h3>
            <button
              onClick={handleAgregarMaterial}
              className="px-3 py-1 bg-[#0DEDC0] text-[#090D16] text-xs font-mono font-bold rounded-lg cursor-pointer"
            >
              + Agregar Recurso
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {academyData.materiales.map((mat, idx) => (
              <div key={mat.id || idx} className="bg-[#102935]/60 p-4 rounded-2xl border border-slate-700 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-[#0DEDC0] font-bold">Recurso #{idx + 1}</span>
                  <button onClick={() => handleEliminarMaterial(idx)} className="text-red-400 font-mono text-[10px] cursor-pointer">[Eliminar]</button>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Título</label>
                  <input
                    type="text"
                    value={mat.titulo}
                    onChange={(e) => handleMaterialChange(idx, 'titulo', e.target.value)}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-lg p-2 text-white text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Ruta PDF/Excel</label>
                  <input
                    type="text"
                    value={mat.urlDestino}
                    onChange={(e) => handleMaterialChange(idx, 'urlDestino', e.target.value)}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-lg p-2 text-blue-300 font-mono text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}