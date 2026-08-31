'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Calendar, 
  Users, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Loader2, 
  Award, 
  Calculator, 
  Zap,
  ShieldCheck,
  Mail,
  Phone,
  User,
  Globe
} from 'lucide-react';

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

export default function Pagina1() {
  // ESTADOS DEL FORMULARIO
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [pais, setPais] = useState('Colombia');
  const [indicativo, setIndicativo] = useState('57');
  const [whatsapp, setWhatsapp] = useState('');
  const [clienteAtom, setClienteAtom] = useState('No');

  const [cargando, setCargando] = useState(false);
  const [completado, setCompletado] = useState(false);

  const handlePaisChange = (nuevoPais: string) => {
    setPais(nuevoPais);
    setIndicativo(INDICATIVOS[nuevoPais] || '');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);

    // Formatear WhatsApp sin el signo +
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

  return (
    <div className="min-h-screen w-full bg-[#090D16] text-white flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* PANEL IZQUIERDO */}
      <div className="relative w-full lg:w-1/2 bg-gradient-to-br from-[#180B2B] via-[#0E0C1F] to-[#070B14] p-8 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80 min-h-[450px] lg:min-h-screen overflow-hidden">
        
        <div className="absolute inset-0 pointer-events-none z-0 opacity-25">
          <img 
            src="/complementos/FONDO.PNG" 
            alt="Malla ATOM" 
            className="w-full h-full object-cover mix-blend-screen scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0DEDC0]/15 rounded-full blur-[120px]" />
        </div>


        <div className="relative z-10 my-auto py-8 space-y-6 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#0DEDC0] bg-[#0DEDC0]/10 border border-[#0DEDC0]/40 px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-[0_0_15px_rgba(13,237,192,0.2)]">
              <Sparkles className="w-3 h-3" /> EXPOWINNERS 2026
            </span>
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-amber-300 bg-amber-400/10 border border-amber-400/40 px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
              <Zap className="w-3 h-3" /> ALIANZA ATOM × DROPI
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
            Muestra tú mejor versión ante <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0DEDC0] via-[#38BDF8] to-[#A855F7]">
              +6,000 Dropshippers
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Aprende a activar tu <strong className="text-white">Insignia Oficial ATOM de Alto Rendimiento</strong> y posicionar tu catálogo frente a los mejores vendedores de la región sin poner en riesgo tu margen.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-[#131129]/80 backdrop-blur-md p-3.5 rounded-2xl border border-purple-500/30 flex items-start gap-3">
              <div className="p-2 bg-purple-500/20 rounded-xl text-[#0DEDC0] shrink-0 border border-purple-500/30">
                <Award className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-white block text-xs">Insignia Oficial ATOM</span>
                <span className="text-slate-400 text-[11px] leading-tight block">Preferencia y estatus en el mapa oficial de ExpoWinners.</span>
              </div>
            </div>

            <div className="bg-[#131129]/80 backdrop-blur-md p-3.5 rounded-2xl border border-amber-500/30 flex items-start gap-3">
              <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400 shrink-0 border border-amber-500/30">
                <Calculator className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-white block text-xs">Calculadora Avanzada</span>
                <span className="text-slate-400 text-[11px] leading-tight block">Liquida precios y bonos asegurando el 100% de tu margen.</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gradient-to-r from-[#171333] via-[#1E1945] to-[#171333] px-4 py-3 rounded-2xl border border-[#0DEDC0]/30 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0DEDC0]" />
              <span className="font-bold text-white">Jueves · 4:00 PM (Hora CO)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Users className="w-4 h-4 text-[#0DEDC0]" />
              <span className="text-[11px]">Sesión Privada (30 min)</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-[11px] font-mono flex items-center justify-between pt-4">
          <span>v1.0.0 · 20260831.ATOM</span>
          <span>ExpoWinners × ATOM Data</span>
        </div>
      </div>

      {/* PANEL DERECHO */}
      <div className="w-full lg:w-1/2 bg-[#090D16] p-8 lg:p-14 flex flex-col justify-center min-h-[550px] lg:min-h-screen">
        <div className="max-w-md w-full mx-auto space-y-6">
          
          {!completado ? (
            <AnimatePresence mode="wait">
              <motion.div
                key="form-container"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="space-y-2 text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Inscripción al Meet
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Ingresa los datos de tu proveeduría para reservar tu cupo.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  
                  {/* NOMBRE COMPLETO */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Nombre Completo <span className="text-[#0DEDC0]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Ej. Carlos Mendoza"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full bg-[#EEF2F6] text-[#0F172A] placeholder-slate-400 font-medium rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0DEDC0] transition-all shadow-sm"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* CORREO DE PROVEEDURÍA */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Correo de Proveeduría <span className="text-[#0DEDC0]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="contacto@mibodega.com"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        className="w-full bg-[#EEF2F6] text-[#0F172A] placeholder-slate-400 font-medium rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0DEDC0] transition-all shadow-sm"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* PAÍS + WHATSAPP */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* PAÍS */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-slate-300">
                        País <span className="text-[#0DEDC0]">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={pais}
                          onChange={(e) => handlePaisChange(e.target.value)}
                          className="w-full bg-[#EEF2F6] text-[#0F172A] font-medium rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0DEDC0] transition-all cursor-pointer shadow-sm appearance-none"
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
                        <Globe className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* WHATSAPP (SIN SIGNO +) */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-slate-300">
                        WhatsApp <span className="text-[#0DEDC0]">*</span>
                      </label>
                      <div className="relative flex items-center">
                        {indicativo && (
                          <span className="absolute left-3 font-mono font-bold text-[#090D16] bg-[#0DEDC0] px-2 py-0.5 rounded-lg text-xs z-10 pointer-events-none select-none shadow-sm">
                            {indicativo}
                          </span>
                        )}
                        <input
                          type="tel"
                          required
                          placeholder="313 000 0000"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          className={`w-full bg-[#EEF2F6] text-[#0F172A] placeholder-slate-400 font-medium rounded-xl ${indicativo ? 'pl-14' : 'pl-4'} pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0DEDC0] transition-all shadow-sm`}
                        />
                        <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* CLIENTE ATOM */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      ¿Actualmente usas ATOM Data? <span className="text-[#0DEDC0]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={clienteAtom}
                        onChange={(e) => setClienteAtom(e.target.value)}
                        className="w-full bg-[#EEF2F6] text-[#0F172A] font-medium rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0DEDC0] transition-all cursor-pointer shadow-sm appearance-none"
                      >
                        <option value="No">No, quiero activar mi insignia</option>
                        <option value="Sí">Sí, soy usuario activo de ATOM</option>
                        <option value="En Pruebas">Estoy en periodo de prueba</option>
                      </select>
                      <ShieldCheck className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={cargando}
                    className="w-full py-3.5 px-6 bg-[#162238] hover:bg-[#0DEDC0] text-white hover:text-[#090D16] border border-slate-700 hover:border-[#0DEDC0] font-bold text-sm rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-4 disabled:opacity-50"
                  >
                    {cargando ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-current" />
                        <span>GUARDANDO RESERVA...</span>
                      </>
                    ) : (
                      <>
                        <span>Reservar Cupo al Meet</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-slate-500 text-[11px] text-center pt-2">
                  Al hacer clic serás redirigido al grupo de WhatsApp VIP para la entrega del acceso a Google Meet.
                </p>
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-5 bg-[#111827] p-8 rounded-3xl border border-[#0DEDC0]/30 shadow-[0_0_50px_rgba(13,237,192,0.1)]"
            >
              <CheckCircle2 className="w-16 h-16 text-[#0DEDC0] mx-auto animate-bounce drop-shadow-[0_0_20px_rgba(13,237,192,0.6)]" />
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">¡Cupo Reservado con Éxito!</h3>
                <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                  Tus datos se registraron correctamente. Te estamos redirigiendo al <strong className="text-[#0DEDC0]">Grupo VIP de WhatsApp</strong>.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={WHATSAPP_GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-[#04080F] font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(37,211,102,0.4)] transition-all cursor-pointer"
                >
                  <span>UNIRME AL GRUPO DE WHATSAPP</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <p className="text-[10px] text-slate-400 font-mono mt-2">
                  (Haz clic aquí si tu navegador bloqueó la ventana emergente)
                </p>
              </div>
            </motion.div>
          )}

        </div>
      </div>

    </div>
  );
}