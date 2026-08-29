'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { ESTRUCTURA_CMS_DEFAULT } from '@/app/context/CMSContext';

type SubSoporte = 'CARDS' | 'FAQ' | 'PAUSA';

export default function SoporteCMS() {
  const [subTab, setSubTab] = useState<SubSoporte>('CARDS');
  const [soporteData, setSoporteData] = useState(ESTRUCTURA_CMS_DEFAULT.soporte);
  const [soporteOriginal, setSoporteOriginal] = useState(ESTRUCTURA_CMS_DEFAULT.soporte);

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
          if (bd.soporte) {
            const combinado = {
              seccion1_cards: { ...ESTRUCTURA_CMS_DEFAULT.soporte.seccion1_cards, ...(bd.soporte.seccion1_cards || {}) },
              seccion2_faq: {
                ...ESTRUCTURA_CMS_DEFAULT.soporte.seccion2_faq,
                ...(bd.soporte.seccion2_faq || {}),
                faqs: bd.soporte.seccion2_faq?.faqs || ESTRUCTURA_CMS_DEFAULT.soporte.seccion2_faq.faqs
              },
              seccion3_cancelaciones: { ...ESTRUCTURA_CMS_DEFAULT.soporte.seccion3_cancelaciones, ...(bd.soporte.seccion3_cancelaciones || {}) }
            };
            setSoporteData(combinado);
            setSoporteOriginal(combinado);
          }
        }
      } catch (e) {
        console.error('Error cargando Soporte CMS:', e);
      } finally {
        setCargando(false);
      }
    };

    cargarConfiguracion();
  }, []);

  const tieneCambios = useMemo(() => {
    return JSON.stringify(soporteData) !== JSON.stringify(soporteOriginal);
  }, [soporteData, soporteOriginal]);

  const handleFieldChange = (seccion: 'seccion1_cards' | 'seccion2_faq' | 'seccion3_cancelaciones', campo: string, valor: any) => {
    setSoporteData((prev) => ({
      ...prev,
      [seccion]: {
        ...prev[seccion],
        [campo]: valor
      }
    }));
  };

  const handleFaqChange = (idx: number, campo: string, valor: string) => {
    setSoporteData((prev) => {
      const nuevasFaqs = [...prev.seccion2_faq.faqs];
      nuevasFaqs[idx] = { ...nuevasFaqs[idx], [campo]: valor };
      return {
        ...prev,
        seccion2_faq: {
          ...prev.seccion2_faq,
          faqs: nuevasFaqs
        }
      };
    });
  };

  const handleAgregarFaq = () => {
    setSoporteData((prev) => ({
      ...prev,
      seccion2_faq: {
        ...prev.seccion2_faq,
        faqs: [
          ...prev.seccion2_faq.faqs,
          {
            id: String(Date.now()),
            categoria: 'Integración',
            pregunta: '¿Pregunta FAQ Nueva?',
            respuesta: 'Respuesta paso a paso para el usuario.'
          }
        ]
      }
    }));
  };

  const handleEliminarFaq = (idx: number) => {
    setSoporteData((prev) => ({
      ...prev,
      seccion2_faq: {
        ...prev.seccion2_faq,
        faqs: prev.seccion2_faq.faqs.filter((_, i) => i !== idx)
      }
    }));
  };

  const handleGuardar = async () => {
    setGuardando(true);
    setMensaje(null);
    try {
      const docRef = doc(db, 'configuracion_web', 'plataforma_cms');
      await setDoc(docRef, { soporte: soporteData }, { merge: true });
      setSoporteOriginal(soporteData);
      setMensaje({ texto: '⚡ ¡Soporte & FAQ actualizados con éxito!', tipo: 'exito' });
      setTimeout(() => setMensaje(null), 4000);
    } catch (e) {
      console.error('Error guardando Soporte CMS:', e);
      setMensaje({ texto: '❌ Error al guardar.', tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return <div className="p-8 text-center text-slate-400 font-mono text-xs">Cargando Módulo Soporte...</div>;
  }

  return (
    <div className="space-y-6">
      
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#090D16]/90 p-4 rounded-3xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSubTab('CARDS')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
              subTab === 'CARDS' ? 'bg-white text-[#090D16]' : 'text-slate-400 hover:text-white'
            }`}
          >
            📞 Asesorías & WhatsApp
          </button>

          <button
            onClick={() => setSubTab('FAQ')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
              subTab === 'FAQ' ? 'bg-white text-[#090D16]' : 'text-slate-400 hover:text-white'
            }`}
          >
            ❓ Preguntas FAQ ({soporteData.seccion2_faq.faqs.length})
          </button>

          <button
            onClick={() => setSubTab('PAUSA')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
              subTab === 'PAUSA' ? 'bg-white text-[#090D16]' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚠️ Pausa de Membresía
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

      {/* CARDS Y CANALES */}
      {subTab === 'CARDS' && (
        <div className="bg-[#090D16]/90 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-[#0DEDC0] font-mono font-bold text-xs uppercase border-b border-slate-800 pb-2">
            Asesorías y WhatsApp Operativo
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-mono text-amber-400 mb-1 font-bold">
                URL Google Calendar (Asesorías Empresariales)
              </label>
              <input
                type="text"
                value={soporteData.seccion1_cards.card1_calendar_url}
                onChange={(e) => handleFieldChange('seccion1_cards', 'card1_calendar_url', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-blue-300 font-mono text-xs"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-mono text-emerald-400 mb-1 font-bold">
                URL WhatsApp Soporte Técnico Operativo
              </label>
              <input
                type="text"
                value={soporteData.seccion1_cards.card2_wa_url}
                onChange={(e) => handleFieldChange('seccion1_cards', 'card2_wa_url', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-emerald-400 font-mono text-xs font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* FAQ */}
      {subTab === 'FAQ' && (
        <div className="bg-[#090D16]/90 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-[#0DEDC0] font-mono font-bold text-xs uppercase">
              Preguntas Frecuentes FAQ
            </h3>
            <button
              onClick={handleAgregarFaq}
              className="px-3 py-1 bg-[#0DEDC0] text-[#090D16] text-xs font-mono font-bold rounded-lg cursor-pointer"
            >
              + Agregar FAQ
            </button>
          </div>

          <div className="space-y-3">
            {soporteData.seccion2_faq.faqs.map((item, idx) => (
              <div key={item.id || idx} className="bg-[#102935]/60 p-4 rounded-2xl border border-slate-700 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-[#0DEDC0] font-bold">Pregunta #{idx + 1}</span>
                  <button onClick={() => handleEliminarFaq(idx)} className="text-red-400 font-mono text-[10px] cursor-pointer">[Eliminar]</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Categoría</label>
                    <select
                      value={item.categoria}
                      onChange={(e) => handleFaqChange(idx, 'categoria', e.target.value)}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-lg p-2 text-slate-300 text-xs"
                    >
                      <option value="Integración">Integración</option>
                      <option value="Inventario">Inventario</option>
                      <option value="Auditoría Financiera">Auditoría Financiera</option>
                      <option value="Automatización">Automatización</option>
                      <option value="Planes y Facturación">Planes y Facturación</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Pregunta</label>
                    <input
                      type="text"
                      value={item.pregunta}
                      onChange={(e) => handleFaqChange(idx, 'pregunta', e.target.value)}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-lg p-2 text-white text-xs font-bold"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Respuesta</label>
                    <textarea
                      rows={2}
                      value={item.respuesta}
                      onChange={(e) => handleFaqChange(idx, 'respuesta', e.target.value)}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-lg p-2 text-slate-300 text-xs resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAUSA */}
      {subTab === 'PAUSA' && (
        <div className="bg-[#090D16]/90 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-red-400 font-mono font-bold text-xs uppercase border-b border-slate-800 pb-2">
            Banner de Pausa de Membresía
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Kicker</label>
              <input
                type="text"
                value={soporteData.seccion3_cancelaciones.kicker}
                onChange={(e) => handleFieldChange('seccion3_cancelaciones', 'kicker', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-red-400 font-bold text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Texto Botón</label>
              <input
                type="text"
                value={soporteData.seccion3_cancelaciones.boton_texto}
                onChange={(e) => handleFieldChange('seccion3_cancelaciones', 'boton_texto', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-red-300 text-xs font-bold"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-mono text-slate-300 mb-1">Título Pregunta</label>
              <input
                type="text"
                value={soporteData.seccion3_cancelaciones.titulo}
                onChange={(e) => handleFieldChange('seccion3_cancelaciones', 'titulo', e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-white text-xs font-bold"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}