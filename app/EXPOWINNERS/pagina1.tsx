'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  MapPin, 
  Hash, 
  Zap, 
  Flame, 
  Check, 
  ArrowRight,
  ShieldAlert,
  Loader2
} from 'lucide-react';

export default function PaginaExpoWinners() {
  const [nombreMarca, setNombreMarca] = useState('');
  const [standNumero, setStandNumero] = useState('');
  const [pais, setPais] = useState('Colombia');
  const [confirmadoAtom, setConfirmadoAtom] = useState(true);

  const [cargando, setCargando] = useState(false);
  const [porcentajeCarga, setPorcentajeCarga] = useState(0);
  const [mensajeCarga, setMensajeCarga] = useState('');

  const [exito, setExito] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const GOOGLE_SHEETS_WEBHOOK_URL =
    process.env.NEXT_PUBLIC_SHEETS_INSIGNIA_URL ||
    'https://script.google.com/macros/s/AKfycbxFY7VnWbiiPO8K9_UuA501aiz3r0Cg9VSQmG2A3idXL3mlLlFcwVKg6fPfvQr2C38ctA/exec';

  const esperar = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombreMarca.trim() || !standNumero.trim()) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }

    if (!confirmadoAtom) {
      setError('Debes confirmar que eres cliente activo de ATOM Data para solicitar la insignia.');
      return;
    }

    setCargando(true);

    // FASE 1: Conexión
    setPorcentajeCarga(25);
    setMensajeCarga('Conectando con servidores ExpoWinners 2026...');
    await esperar(500);

    // FASE 2: Verificación de Stand y Proveeduría
    setPorcentajeCarga(60);
    setMensajeCarga('Validando ubicación de Stand y cuenta ATOM...');

    const payload = {
      sheetName: 'INSIGNIA ALTO RENDIMIENTO',
      fechaHora: new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
      nombreMarca: nombreMarca.trim(),
      standNumero: standNumero.trim(),
      pais,
      esClienteAtom: 'SÍ',
    };

    let guardadoEnSheets = false;

    // Ejecución de llamadas asíncronas
    try {
      await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      guardadoEnSheets = true;
    } catch (errSheets) {
      console.error('Error enviando a Google Sheets:', errSheets);
    }

    try {
      await addDoc(collection(db, 'insignias_alto_rendimiento'), {
        ...payload,
        creadoEn: serverTimestamp(),
      });
    } catch (errFirebase) {
      console.warn('Advertencia en Firestore:', errFirebase);
    }

    // FASE 3: Generación de Insignia
    setPorcentajeCarga(90);
    setMensajeCarga('Asignando estatus de Alto Rendimiento ATOM Data...');
    await esperar(600);

    setPorcentajeCarga(100);
    setMensajeCarga('¡Acreditación Verificada!');
    await esperar(400);

    setCargando(false);

    if (guardadoEnSheets) {
      setExito(true);
    } else {
      setError('Ocurrió un error al procesar tu acreditación. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-white flex items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden selection:bg-[#0DEDC0] selection:text-[#050811]">
      
      {/* CAPA DE FONDO CYBERPUNK */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10293515_1px,transparent_1px),linear-gradient(to_bottom,#10293515_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-[#0DEDC0]/20 via-[#0DEDC0]/5 to-transparent rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[160px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-2xl bg-[#090D16]/85 backdrop-blur-2xl border border-[#0DEDC0]/40 rounded-3xl p-6 sm:p-12 shadow-[0_0_80px_rgba(13,237,192,0.18)] space-y-8 overflow-hidden my-auto"
      >
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#0DEDC0] to-transparent shadow-[0_0_15px_#0DEDC0]" />

        {/* BADGES */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-extrabold uppercase tracking-widest shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            <Flame className="w-3 h-3 text-amber-400 animate-pulse" /> EXPOWINNERS 2026
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0DEDC0]/10 border border-[#0DEDC0]/40 text-[#0DEDC0] text-[10px] font-mono font-extrabold uppercase tracking-widest shadow-[0_0_15px_rgba(13,237,192,0.2)]">
            <Zap className="w-3 h-3 text-[#0DEDC0]" /> EXCLUSIVO CLIENTES ATOM
          </span>
        </div>

        {/* ENCABEZADO */}
        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 bg-[#0DEDC0]/20 rounded-2xl blur-xl animate-pulse" />
            <div className="relative w-full h-full bg-[#070B14] border-2 border-[#0DEDC0] text-[#0DEDC0] rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(13,237,192,0.35)]">
              <Award className="w-8 h-8 drop-shadow-[0_0_8px_#0DEDC0]" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Insignia de Proveeduría{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0DEDC0] via-cyan-300 to-emerald-400 drop-shadow-[0_0_20px_rgba(13,237,192,0.4)]">
              Alto Rendimiento
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Acredita tu marca y tu Stand en <strong className="text-white">ExpoWinners</strong> para recibir tu estandarte físico e insignia digital verificada ante más de <strong className="text-[#0DEDC0]">6,000 Dropshippers</strong>.
          </p>
        </div>

        {/* CONTENIDO Y PANTALLA DE CARGA / ÉXITO / FORMULARIO */}
        <AnimatePresence mode="wait">
          {cargando ? (
            /* ⏳ PANTALLA DE VALIDACIÓN Y BARRA DE PROGRESO */
            <motion.div 
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#050D1A]/90 border-2 border-[#0DEDC0]/60 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-[0_0_40px_rgba(13,237,192,0.2)]"
            >
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 bg-[#0DEDC0]/20 rounded-full blur-xl animate-ping" />
                <Loader2 className="w-12 h-12 text-[#0DEDC0] animate-spin drop-shadow-[0_0_15px_#0DEDC0]" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono font-bold text-[#0DEDC0] px-1">
                  <span>VALIDANDO CREDENCIALES ATOM</span>
                  <span>{porcentajeCarga}%</span>
                </div>

                <div className="w-full h-3 bg-[#08131E] border border-[#0DEDC0]/30 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#0DEDC0] via-cyan-400 to-emerald-300 rounded-full shadow-[0_0_15px_#0DEDC0]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${porcentajeCarga}%` }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  />
                </div>
              </div>

              <p className="text-xs sm:text-sm font-mono text-slate-300 animate-pulse tracking-wide min-h-[20px]">
                {mensajeCarga}
              </p>
            </motion.div>
          ) : exito ? (
            /* 🎉 VISTA DE ÉXITO */
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#050D1A]/90 border-2 border-[#0DEDC0]/60 rounded-3xl p-8 text-center space-y-5 shadow-[0_0_40px_rgba(13,237,192,0.25)] relative overflow-hidden"
            >
              <div className="w-16 h-16 bg-[#0DEDC0]/20 border border-[#0DEDC0] text-[#0DEDC0] rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(13,237,192,0.5)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#0DEDC0] font-bold uppercase tracking-widest block">
                  SISTEMA DE VERIFICACIÓN OFICIAL
                </span>
                <h3 className="text-2xl font-black text-white">¡Acreditación Confirmada!</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  La proveeduría <strong className="text-[#0DEDC0] font-extrabold">{nombreMarca}</strong> (Stand #{standNumero}) ha sido registrada exitosamente en la base oficial <strong className="text-white font-bold">INSIGNIA ALTO RENDIMIENTO</strong>.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setExito(false);
                    setNombreMarca('');
                    setStandNumero('');
                    setConfirmadoAtom(true);
                    setPorcentajeCarga(0);
                  }}
                  className="px-8 py-3.5 bg-[#0DEDC0] hover:bg-white text-[#061217] font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(13,237,192,0.4)] transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Registrar Otra Proveeduría</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            /* 📝 FORMULARIO DE INGRESO */
            <form key="form" onSubmit={handleSubmit} className="space-y-6 text-left">
              
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-2xl text-red-300 text-xs text-center font-bold flex items-center justify-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* NOMBRE DE LA MARCA */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#0DEDC0]" />
                  Nombre de la Proveeduría / Marca *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Distribuidora Logística Global"
                  value={nombreMarca}
                  onChange={(e) => setNombreMarca(e.target.value)}
                  className="w-full bg-[#050811]/90 border-2 border-slate-700/80 focus:border-[#0DEDC0] rounded-2xl p-4 text-white text-sm font-semibold outline-none transition-all placeholder:text-slate-500 shadow-inner focus:shadow-[0_0_20px_rgba(13,237,192,0.2)]"
                />
              </div>

              {/* STAND Y PAÍS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Hash className="w-4 h-4 text-[#0DEDC0]" />
                    Número de Stand *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. #42"
                    value={standNumero}
                    onChange={(e) => setStandNumero(e.target.value)}
                    className="w-full bg-[#050811]/90 border-2 border-slate-700/80 focus:border-[#0DEDC0] rounded-2xl p-4 text-white text-sm font-mono font-bold outline-none transition-all placeholder:text-slate-500 shadow-inner focus:shadow-[0_0_20px_rgba(13,237,192,0.2)]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0DEDC0]" />
                    País de Operación *
                  </label>
                  <select
                    value={pais}
                    onChange={(e) => setPais(e.target.value)}
                    className="w-full bg-[#050811]/90 border-2 border-slate-700/80 focus:border-[#0DEDC0] rounded-2xl p-4 text-white text-sm font-mono font-bold outline-none transition-all cursor-pointer shadow-inner focus:shadow-[0_0_20px_rgba(13,237,192,0.2)]"
                  >
                    <option value="Colombia">🇨🇴 Colombia</option>
                    <option value="México">🇲🇽 México</option>
                    <option value="Perú">🇵🇪 Perú</option>
                    <option value="Chile">🇨🇱 Chile</option>
                    <option value="Ecuador">🇪🇨 Ecuador</option>
                    <option value="Panamá">🇵🇦 Panamá</option>
                  </select>
                </div>
              </div>

              {/* VERIFICACIÓN EXCLUSIVA CLIENTE ATOM DATA */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <div 
                  onClick={() => setConfirmadoAtom(!confirmadoAtom)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    confirmadoAtom 
                      ? 'bg-[#0DEDC0]/10 border-[#0DEDC0] shadow-[0_0_20px_rgba(13,237,192,0.2)]' 
                      : 'bg-[#050811]/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
                      confirmadoAtom ? 'bg-[#0DEDC0] border-[#0DEDC0] text-[#061217]' : 'border-slate-600'
                    }`}>
                      {confirmadoAtom && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <span className="text-xs font-mono font-black text-white block uppercase tracking-wider">
                        Confirmo que mi marca es cliente activo de ATOM Data
                      </span>
                      <span className="text-[11px] text-slate-400 block leading-tight mt-0.5">
                        Acreditación y estandarte físico exclusivo para la red de proveedurías ATOM.
                      </span>
                    </div>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-[#0DEDC0] shrink-0 hidden sm:block" />
                </div>
              </div>

              {/* BOTÓN SUBMIT */}
              <button
                type="submit"
                className="w-full py-5 rounded-2xl bg-[#0DEDC0] hover:bg-white text-[#061217] font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_0_35px_rgba(13,237,192,0.4)] hover:shadow-[0_0_50px_rgba(255,255,255,0.6)] cursor-pointer mt-6 flex items-center justify-center gap-3"
              >
                <Sparkles className="w-4 h-4" />
                <span>SOLICITAR INSIGNIA ALTO RENDIMIENTO</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  🔒 VERIFICACIÓN DIRECTA CON ORGANIZADORES EXPOWINNERS
                </span>
              </div>

            </form>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}