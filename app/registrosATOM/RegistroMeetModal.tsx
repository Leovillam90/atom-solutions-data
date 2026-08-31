'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Calendar, 
  Users, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  Loader2, 
  Award, 
  Calculator, 
  Zap,
  ShieldCheck,
  Mail,
  Phone,
  User,
  Globe,
  Clock
} from 'lucide-react';

interface RegistroMeetModalProps {
  isOpen: boolean;
  onClose: () => void;
  imagenFondo?: string;
}

// 🔗 MAPA DE INDICATIVOS POR PAÍS (SIN SIGNO +)
const INDICATIVOS: Record<string, string> = {
  Colombia: '57',
  México: '52',
  Ecuador: '593',
  Perú: '51',
  Chile: '56',
  Panamá: '507',
  Guatemala: '502',
  Otro: ''
};

// 🔗 URL OFICIAL DE TU WEBHOOK DE GOOGLE APPS SCRIPT
const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyAblGCTQeCPNQTMR7L-F01udgEfWwR_czILopHCMY95zgQHb-Pr6QXkx-8HQfi4EtfmQ/exec';

// 🔗 ENLACE OFICIAL A TU GRUPO VIP DE WHATSAPP
const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/FPPwdtDtJgd1OUY1UIxIuG';

export default function RegistroMeetModal({ 
  isOpen, 
  onClose,
  imagenFondo = '/complementos/FONDO.PNG' 
}: RegistroMeetModalProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  
  // ESTADOS DEL FORMULARIO
  const [nombre, setNombre] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [pais, setPais] = useState<string>('Colombia');
  const [indicativo, setIndicativo] = useState<string>('57');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [clienteAtom, setClienteAtom] = useState<string>('No');

  const [cargando, setCargando] = useState<boolean>(false);
  const [completado, setCompletado] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handlePaisChange = (nuevoPais: string) => {
    setPais(nuevoPais);
    setIndicativo(INDICATIVOS[nuevoPais] || '');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);

    const whatsappCompleto = `${indicativo} ${whatsapp}`.replace(/\+/g, '').trim();

    const payload = { 
      nombre, 
      correo,
      pais, 
      whatsapp: whatsappCompleto, 
      clienteAtom 
    };

    // 1. Guardar en Google Sheets vía Webhook
    try {
      await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 
          'Content-Type': 'text/plain;charset=utf-8' 
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error('Error enviando a Google Sheets:', err);
    }

    // 2. Disparar Evento en Meta Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Schedule', {
        content_name: 'Meet ExpoWinners ATOM Dropi',
        country: pais,
        supplier_email: correo,
        is_atom_client: clienteAtom,
      });
    }

    setCargando(false);
    setCompletado(true);

    // 3. Redirección al Grupo VIP de WhatsApp
    setTimeout(() => {
      window.open(WHATSAPP_GROUP_URL, '_blank');
    }, 1200);
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] bg-[#04080F]/85 backdrop-blur-2xl flex items-center justify-center p-3 font-sans overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-[#08101C]/95 border border-[#0DEDC0]/40 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_0_60px_rgba(13,237,192,0.22)] text-white space-y-2.5 my-auto max-h-[92vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden overflow-hidden"
        >
          {/* CAPA DE FONDO */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <img 
              src={imagenFondo} 
              alt="Fondo ATOM Data" 
              className="w-full h-full object-cover opacity-30 mix-blend-screen scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#08101C]/95 via-[#08101C]/85 to-[#04080F]/95" />
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-32 bg-[#0DEDC0]/20 rounded-full blur-3xl" />
          </div>

          {/* BOTÓN CERRAR */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-[#0DEDC0]/20 rounded-xl border border-white/10 hover:border-[#0DEDC0]/40 transition-all cursor-pointer z-30"
          >
            <X className="w-4 h-4" />
          </button>

          {!completado ? (
            <div className="relative z-10 space-y-2.5">
              {/* ENCABEZADO */}
              <div className="text-center space-y-1 pt-0.5">
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  <span className="text-[8.5px] font-mono font-black uppercase tracking-widest text-[#0DEDC0] bg-[#0DEDC0]/10 border border-[#0DEDC0]/35 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-[0_0_10px_rgba(13,237,192,0.15)]">
                    <Sparkles className="w-2.5 h-2.5" /> EXPOWINNERS 2026
                  </span>
                  <span className="text-[8.5px] font-mono font-black uppercase tracking-widest text-amber-300 bg-amber-400/10 border border-amber-400/35 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-[0_0_10px_rgba(251,191,36,0.12)]">
                    <Zap className="w-2.5 h-2.5" /> ALIANZA ATOM × DROPI
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  Muestra la mejor versión{' '}
                  <span className="text-[#0DEDC0] drop-shadow-[0_0_12px_rgba(13,237,192,0.35)]">
                    +6,000 Dropshippers
                  </span>
                </h3>

                <p className="text-[11px] text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Activa tu <strong className="text-white font-bold">Insignia Oficial ATOM</strong> y aprende a traer ventas masivas <strong className="text-[#0DEDC0] font-bold">como experto</strong> sin arriesgar tu margen.
                </p>
              </div>

              {/* TARJETAS DE BENEFICIOS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left text-xs">
                <div className="bg-[#0B1726]/80 backdrop-blur-md p-2 rounded-xl border border-[#0DEDC0]/25 flex items-start gap-2">
                  <div className="p-1.5 bg-[#0DEDC0]/15 rounded-lg text-[#0DEDC0] shrink-0 border border-[#0DEDC0]/30 mt-0.5">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-white block text-[10px] leading-tight">Insignia Alto Rendimiento</span>
                    <span className="text-slate-400 text-[9px] leading-tight block">Estatus prioritario en el mapa oficial del evento.</span>
                  </div>
                </div>

                <div className="bg-[#0B1726]/80 backdrop-blur-md p-2 rounded-xl border border-amber-500/25 flex items-start gap-2">
                  <div className="p-1.5 bg-amber-500/15 rounded-lg text-amber-400 shrink-0 border border-amber-500/30 mt-0.5">
                    <Calculator className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-white block text-[10px] leading-tight">Calculadora Avanzada</span>
                    <span className="text-slate-400 text-[9px] leading-tight block">Liquida precios estratégicos protegiendo tu utilidad.</span>
                  </div>
                </div>
              </div>

              {/* ⚡ FECHA Y HORA DESTACADA */}
              <div className="relative overflow-hidden bg-gradient-to-r from-[#0DEDC0]/20 via-[#0F2D3D] to-[#0DEDC0]/20 p-2.5 sm:p-3 rounded-xl border-2 border-[#0DEDC0] shadow-[0_0_20px_rgba(13,237,192,0.25)]">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-[#0DEDC0]/20 rounded-lg text-[#0DEDC0] shrink-0 border border-[#0DEDC0]/40">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-black text-white tracking-tight leading-tight">
                        Jueves, 3 de Septiembre
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#0DEDC0] mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>4:00 PM (Hora Colombia)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[9px] font-mono font-black uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Users className="w-2.5 h-2.5 text-amber-400" />
                      <span>Privado (30m)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* FORMULARIO */}
              <form onSubmit={handleSubmit} className="space-y-2 pt-0.5 text-left">
                {/* NOMBRE */}
                <div>
                  <label className="block text-[9px] font-mono font-bold text-slate-300 uppercase mb-0.5 flex items-center gap-1">
                    <User className="w-3 h-3 text-[#0DEDC0]" /> Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos Mendoza"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full bg-[#050B14]/90 border border-slate-700/70 rounded-lg py-1.5 px-2.5 font-mono text-white text-xs font-semibold focus:border-[#0DEDC0] focus:ring-1 focus:ring-[#0DEDC0] outline-none transition-all"
                  />
                </div>

                {/* CORREO DE PROVEEDURÍA */}
                <div>
                  <label className="block text-[9px] font-mono font-bold text-slate-300 uppercase mb-0.5 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#0DEDC0]" /> Correo de Proveeduría
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contacto@mibodega.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="w-full bg-[#050B14]/90 border border-slate-700/70 rounded-lg py-1.5 px-2.5 font-mono text-white text-xs font-semibold focus:border-[#0DEDC0] focus:ring-1 focus:ring-[#0DEDC0] outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* PAÍS */}
                  <div>
                    <label className="block text-[9px] font-mono font-bold text-slate-300 uppercase mb-0.5 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-[#0DEDC0]" /> País
                    </label>
                    <select
                      value={pais}
                      onChange={(e) => handlePaisChange(e.target.value)}
                      className="w-full bg-[#050B14]/90 border border-slate-700/70 rounded-lg py-1.5 px-2 font-mono text-white text-xs font-semibold focus:border-[#0DEDC0] outline-none cursor-pointer transition-all"
                    >
                      <option value="Colombia">Colombia 🇨🇴</option>
                      <option value="México">México 🇲🇽</option>
                      <option value="Ecuador">Ecuador 🇪🇨</option>
                      <option value="Perú">Perú 🇵🇪</option>
                      <option value="Chile">Chile 🇨🇱</option>
                      <option value="Panamá">Panamá 🇵🇦</option>
                      <option value="Guatemala">Guatemala 🇬🇹</option>
                      <option value="Otro">Otro País</option>
                    </select>
                  </div>

                  {/* INDICATIVO + WHATSAPP */}
                  <div>
                    <label className="block text-[9px] font-mono font-bold text-slate-300 uppercase mb-0.5 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#0DEDC0]" /> WhatsApp
                    </label>
                    <div className="relative flex items-center">
                      {indicativo && (
                        <span className="absolute left-2.5 font-mono font-bold text-[#0DEDC0] bg-[#0DEDC0]/10 border border-[#0DEDC0]/30 px-1.5 py-0.5 rounded text-[10px] z-10 pointer-events-none select-none">
                          {indicativo}
                        </span>
                      )}
                      <input
                        type="tel"
                        required
                        placeholder="313 000 0000"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className={`w-full bg-[#050B14]/90 border border-slate-700/70 rounded-lg py-1.5 ${indicativo ? 'pl-12' : 'pl-2.5'} pr-2.5 font-mono text-white text-xs font-semibold focus:border-[#0DEDC0] focus:ring-1 focus:ring-[#0DEDC0] outline-none transition-all`}
                      />
                    </div>
                  </div>
                </div>

                {/* CLIENTE ATOM */}
                <div>
                  <label className="block text-[9px] font-mono font-bold text-slate-300 uppercase mb-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#0DEDC0]" /> ¿Actualmente usas ATOM Data?
                  </label>
                  <select
                    value={clienteAtom}
                    onChange={(e) => setClienteAtom(e.target.value)}
                    className="w-full bg-[#050B14]/90 border border-slate-700/70 rounded-lg py-1.5 px-2 font-mono text-white text-xs font-semibold focus:border-[#0DEDC0] outline-none cursor-pointer transition-all"
                  >
                    <option value="No">No, quiero activar mi insignia</option>
                    <option value="Sí">Sí, soy usuario activo de ATOM</option>
                    <option value="En Pruebas">Estoy en periodo de prueba</option>
                  </select>
                </div>

                {/* BOTÓN SUBMIT */}
                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full py-3 px-5 bg-[#0DEDC0] text-[#061217] font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(13,237,192,0.35)] hover:bg-white hover:shadow-[0_0_35px_rgba(255,255,255,0.7)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2.5 disabled:opacity-50"
                >
                  {cargando ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>PROCESANDO REGISTRO...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>RESERVAR MI CUPO AL MEET PRIVADO</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* VISTA DE CONFIRMACIÓN SIN BOTÓN DE WHATSAPP */
            <div className="relative z-10 text-center py-8 space-y-3">
              <CheckCircle2 className="w-14 h-14 text-[#0DEDC0] mx-auto animate-bounce drop-shadow-[0_0_15px_rgba(13,237,192,0.5)]" />
              <div className="space-y-1.5">
                <h4 className="text-xl font-black text-white">¡Cupo Reservado con Éxito!</h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                  Tus datos han sido registrados correctamente. Te estamos uniendo al <strong className="text-[#0DEDC0]">Grupo VIP de WhatsApp</strong> para enviarte el enlace a Google Meet.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}