'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ESTILOS_TEXTO } from '@/app/complementos/Tipografia';
import { registrarSolicitudCancelacion } from '@/app/lib/cancelaciones';

interface CancelacionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOTIVOS_CANCELACION = [
  'Costos elevados para mi volumen actual',
  'No estoy utilizando todas las herramientas',
  'Problemas técnicos o de sincronización',
  'Cambio de modelo de negocio / Cierre de bodega',
  'Encontré otra alternativa',
];

const PLANES_ATOM = ['DESPEGUE', 'ESCALA', 'EXPERTO', 'CONTROL'];

const ROLES_PROVEEDURIA = [
  'Importador Directo',
  'Fabricante / Laboratorio',
  'Distribuidor Mayorista',
  'Marca Propia / E-commerce',
];

export default function CancelacionModal({ 
  isOpen, 
  onClose 
}: CancelacionModalProps) {
  // Estado para verificar hidratación en Next.js (React Portal)
  const [mounted, setMounted] = useState<boolean>(false);

  const [paso, setPaso] = useState<number>(1);
  const [nombreSolicitante, setNombreSolicitante] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [cuentaAtom, setCuentaAtom] = useState<string>('');
  const [planActual, setPlanActual] = useState<string>('EXPERTO');
  const [rolProveeduria, setRolProveeduria] = useState<string>('Importador Directo');
  
  const [motivoSeleccionado, setMotivoSeleccionado] = useState<string>('');
  const [detallesAdicionales, setDetallesAdicionales] = useState<string>('');
  const [aceptoRetencion, setAceptoRetencion] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

  // Asegurar montaje en el cliente para React Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Cierre por tecla ESC y Bloqueo de Scroll en Body
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Autocompletado de datos desde sesión
  useEffect(() => {
    if (isOpen) {
      setPaso(1);
      setErrorEnvio(null);
      try {
        const sessionData = localStorage.getItem('atom_session');
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          setNombreSolicitante(parsed.nombre || parsed.nombreCompleto || parsed.usuario || '');
          setCorreo(parsed.identificador || parsed.email || parsed.correo || '');
          setCuentaAtom(parsed.empresa || parsed.bodega || '');
          if (parsed.plan) setPlanActual(parsed.plan.toUpperCase());
        }
      } catch (e) {
        // Ignorar
      }
    }
  }, [isOpen]);

  const handleConfirmarCancelacion = useCallback(async () => {
    setCargando(true);
    setErrorEnvio(null);

    const payloadSolicitud = {
      nombreSolicitante: nombreSolicitante.trim() || 'Sin Nombre',
      correo: correo.trim().toLowerCase() || 'sin-correo@atom.com',
      cuentaAtom: cuentaAtom.trim() || 'Bodega Sin Nombre',
      planActual,
      rolProveeduria,
      motivo: motivoSeleccionado,
      detalles: detallesAdicionales.trim(),
      aceptoOfertaRetencion: aceptoRetencion,
      fechaSolicitud: new Date().toISOString(),
    };

    try {
      const resData = await registrarSolicitudCancelacion(payloadSolicitud);

      if (!resData.success) {
        throw new Error(resData.error || 'Ocurrió un error al procesar la solicitud.');
      }

      setPaso(4);
    } catch (error: any) {
      console.error('Error procesando cancelación:', error);
      setErrorEnvio(error.message || 'No pudimos procesar la solicitud. Por favor, intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  }, [nombreSolicitante, correo, cuentaAtom, planActual, rolProveeduria, motivoSeleccionado, detallesAdicionales, aceptoRetencion]);

  // Si no está abierto o no se ha montado el cliente, no renderiza
  if (!isOpen || !mounted) return null;

  // RENDERIZADO FUERA DEL DOM NORMAL VIA REACT PORTAL
  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/85 backdrop-blur-xl p-3 sm:p-6 font-sans">
      <div className="flex min-h-full items-center justify-center pt-16 pb-8 sm:pt-20 sm:pb-10">
        
        {/* TARJETA MODAL CON MARGEN SUPERIOR DE SEGURIDAD */}
        <div className="relative w-full max-w-lg bg-[#090D16] border border-[#0DEDC0]/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_50px_rgba(13,237,192,0.15)] text-white space-y-4 my-auto">
          
          {/* BOTÓN CIERRE 2D */}
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all cursor-pointer group z-10"
            title="Cerrar (Esc)"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* PASO 1: DATOS Y MOTIVO */}
          {paso === 1 && (
            <div className="space-y-4">
              <div className="pr-8">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                    Paso 1 de 3 · Datos de la Cuenta
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-black text-white leading-tight">
                  Gestión de Baja de Suscripción
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                  Verifica tus datos operativos para tramitar la desconexión:
                </p>
              </div>

              {/* GRID ADAPTABLE: 1 COLUMNA EN MÓVIL / 2 COLUMNAS EN PC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold text-[11px]">Nombre de quien gestiona *</label>
                  <input
                    type="text"
                    required
                    value={nombreSolicitante}
                    onChange={(e) => setNombreSolicitante(e.target.value)}
                    placeholder="Tu Nombre Completo"
                    className="w-full bg-[#102935] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-[#0DEDC0] transition-colors text-xs font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold text-[11px]">Correo Corporativo *</label>
                  <input
                    type="email"
                    required
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="correo@tuempresa.com"
                    className="w-full bg-[#102935] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-[#0DEDC0] transition-colors text-xs font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold text-[11px]">Nombre Cuenta / Bodega ATOM *</label>
                  <input
                    type="text"
                    required
                    value={cuentaAtom}
                    onChange={(e) => setCuentaAtom(e.target.value)}
                    placeholder="Ej: Distribuidora Global Dropi"
                    className="w-full bg-[#102935] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-[#0DEDC0] transition-colors text-xs font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold text-[11px]">Plan Actual Contratado</label>
                  <select
                    value={planActual}
                    onChange={(e) => setPlanActual(e.target.value)}
                    className="w-full bg-[#102935] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-[#0DEDC0] transition-colors font-mono text-xs cursor-pointer"
                  >
                    {PLANES_ATOM.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Rol de Proveeduría *</label>
                <select
                  value={rolProveeduria}
                  onChange={(e) => setRolProveeduria(e.target.value)}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#0DEDC0] transition-colors font-sans cursor-pointer"
                >
                  {ROLES_PROVEEDURIA.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="block text-[11px] sm:text-xs font-bold text-slate-300">Motivo Principal de la Cancelación:</label>
                <div className="space-y-1.5">
                  {MOTIVOS_CANCELACION.map((motivo, idx) => {
                    const seleccionado = motivoSeleccionado === motivo;
                    return (
                      <label 
                        key={idx}
                        className={`flex items-center px-3 py-2 rounded-xl border text-[11px] sm:text-xs cursor-pointer transition-all ${
                          seleccionado
                            ? 'bg-[#102935] border-[#0DEDC0] text-white shadow-[0_0_12px_rgba(13,237,192,0.15)]'
                            : 'bg-[#101D28]/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-[#102935]/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="motivo"
                          value={motivo}
                          checked={seleccionado}
                          onChange={(e) => setMotivoSeleccionado(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center mr-2.5 transition-all shrink-0 ${
                          seleccionado ? 'border-[#0DEDC0] bg-[#0DEDC0]' : 'border-slate-600 bg-transparent'
                        }`}>
                          {seleccionado && <div className="w-1.5 h-1.5 rounded-full bg-[#090D16]" />}
                        </div>
                        <span className="leading-tight">{motivo}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                disabled={!motivoSeleccionado || !nombreSolicitante || !correo || !cuentaAtom}
                onClick={() => setPaso(2)}
                className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 ${
                  motivoSeleccionado && nombreSolicitante && correo && cuentaAtom
                    ? 'bg-[#0DEDC0] text-[#090D16] hover:bg-white shadow-[0_0_15px_rgba(13,237,192,0.3)] active:scale-98'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                } ${ESTILOS_TEXTO.boton}`}
              >
                <span>Continuar a Solución Alternativa</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </div>
          )}

          {/* PASO 2: RETENCIÓN */}
          {paso === 2 && (
            <div className="space-y-4">
              <div className="pr-8">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0DEDC0] animate-pulse shadow-[0_0_6px_#0DEDC0]" />
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#0DEDC0] uppercase tracking-widest">
                    Paso 2 de 3 · Beneficio de Retención
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-black text-white leading-tight">
                  ¿Prefieres congelar la tarifa con un 50% de descuento?
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed mt-1">
                  Queremos ayudarte a superar esta etapa operativa. Conserva tus integraciones activas con un <strong className="text-[#0DEDC0]">50% de descuento en tus próximos 2 ciclos</strong> de facturación.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#102935]/80 border border-[#0DEDC0]/40 space-y-1 shadow-[0_0_15px_rgba(13,237,192,0.1)]">
                <div className="flex items-center gap-1.5 text-[#0DEDC0] text-xs font-bold font-mono">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 13C10.832 19.832 8.71 18 6.5 18c-1.54 0-2.5 1-2.5 2v1h16v-1c0-1-1-2-2.5-2-2.21 0-4.332 1.832-5.5 3z"/></svg>
                  <span>Propuesta Comercial Especial</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-300">
                  Aplica únicamente para la cuenta <strong className="text-white">{cuentaAtom}</strong> en su plan <strong className="text-amber-400">{planActual}</strong>.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <button
                  onClick={() => {
                    setAceptoRetencion(true);
                    setDetallesAdicionales('Solicitó la aplicación del 50% de descuento en plan de retención.');
                    setPaso(3);
                  }}
                  className={`w-full py-3.5 rounded-xl bg-[#0DEDC0] text-[#090D16] font-extrabold text-xs uppercase tracking-wider hover:bg-white transition-all cursor-pointer shadow-[0_0_15px_rgba(13,237,192,0.3)] active:scale-98 flex items-center justify-center gap-2 ${ESTILOS_TEXTO.boton}`}
                >
                  <span>Aceptar 50% de Descuento Promocional</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>

                <button
                  onClick={() => {
                    setAceptoRetencion(false);
                    setPaso(3);
                  }}
                  className="w-full py-2.5 text-slate-400 hover:text-white text-[11px] sm:text-xs font-bold uppercase transition-colors cursor-pointer"
                >
                  No gracias, deseo solicitar la baja definitiva
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: CONFIRMACIÓN Y ENVÍO */}
          {paso === 3 && (
            <div className="space-y-4">
              <div className="pr-8">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse shadow-[0_0_6px_rgba(248,113,113,0.8)]" />
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest">
                    Paso 3 de 3 · Confirmación y Envío
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-black text-white leading-tight">
                  Confirmar Envío de Solicitud
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                  Agrega observaciones finales para la gerencia operativa:
                </p>
              </div>

              <textarea
                rows={3}
                value={detallesAdicionales}
                onChange={(e) => setDetallesAdicionales(e.target.value)}
                placeholder="Escribe observaciones adicionales sobre tu experiencia..."
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-white text-xs focus:border-[#0DEDC0] outline-none transition-colors font-sans"
              />

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[10px] sm:text-[11px] text-amber-300 flex items-center gap-2.5">
                <svg className="w-4 h-4 shrink-0 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span>
                  Al confirmar, se registrará la solicitud en el sistema y notificará a la gerencia directiva.
                </span>
              </div>

              {errorEnvio && (
                <div className="p-3 rounded-xl bg-red-900/30 border border-red-500/50 text-red-300 text-xs font-medium">
                  {errorEnvio}
                </div>
              )}

              <button
                disabled={cargando}
                onClick={handleConfirmarCancelacion}
                className={`w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_5px_15px_rgba(220,38,38,0.4)] cursor-pointer active:scale-98 ${ESTILOS_TEXTO.boton}`}
              >
                {cargando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Procesando Solicitud...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmar y Enviar Solicitud</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                  </>
                )}
              </button>
            </div>
          )}

          {/* PASO 4: ÉXITO */}
          {paso === 4 && (
            <div className="space-y-3.5 text-center py-4 sm:py-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#0DEDC0]/20 border border-[#0DEDC0] text-[#0DEDC0] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(13,237,192,0.4)]">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Solicitud Enviada Exitosamente
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                Hemos enviado los detalles completos de tu solicitud a nuestro equipo directivo. Revisaremos tu cuenta y nos pondremos en contacto a través de tu correo corporativo.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-8 py-3 rounded-xl bg-slate-800 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-700 transition-all cursor-pointer shadow-lg active:scale-95"
              >
                Cerrar Ventana
              </button>
            </div>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
}