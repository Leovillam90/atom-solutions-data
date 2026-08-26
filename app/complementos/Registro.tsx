'use client';

import React, { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  linkWithPhoneNumber,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  ConfirmationResult
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/app/lib/firebase';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { Kicker, H2, Subtitulo, Highlight, ESTILOS_TEXTO } from '@/app/complementos/Tipografia';

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

interface RegistroProps {
  onLoginSuccess: () => void;
  variante?: TipoFondo;
}

export default function Registro({ onLoginSuccess, variante = 'gridCyber' }: RegistroProps) {
  const [modo, setModo] = useState<'login' | 'registro'>('registro');
  const [pasoRegistro, setPasoRegistro] = useState<1 | 2>(1);

  // Campos del formulario
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [indicativo, setIndicativo] = useState('+57');
  const [telefono, setTelefono] = useState('');
  const [rol, setRol] = useState<'proveedor' | 'emprendedor'>('proveedor');
  const [codigoSMS, setCodigoSMS] = useState('');

  // Estados UI y Firebase
  const [recordar, setRecordar] = useState(true);
  const [mostrarClave, setMostrarClave] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [resultadoSMS, setResultadoSMS] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    if (modo === 'login') {
      setPasoRegistro(1);
      setError('');
      setMensajeExito('');
    }
  }, [modo]);

  // ==========================================
  // MANEJO DE RECUPERACIÓN DE CONTRASEÑA
  // ==========================================
  const manejarRecuperarClave = async () => {
    setError('');
    setMensajeExito('');

    if (!correo || !correo.includes('@')) {
      setError('Ingresa tu correo electrónico en el campo superior para enviarte el enlace de recuperación.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, correo);
      setMensajeExito(`Te hemos enviado un correo a ${correo} para restablecer tu contraseña.`);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No existe ninguna cuenta registrada con este correo.');
      } else {
        setError('Error al enviar el correo de recuperación. Intenta nuevamente.');
      }
    }
  };

  // ==========================================
  // PASO 1: LOGIN O ENVÍO DE CÓDIGO SMS
  // ==========================================
  const manejarAutenticacion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMensajeExito('');

    if (!correo.includes('@') || clave.length < 6) {
      setError('Ingresa un correo válido y una clave de al menos 6 caracteres.');
      return;
    }

    setCargando(true);

    try {
      if (modo === 'login') {
        // Persistencia de credenciales
        const persistencia = recordar ? browserLocalPersistence : browserSessionPersistence;
        await setPersistence(auth, persistencia);

        const userCredential = await signInWithEmailAndPassword(auth, correo, clave);
        const user = userCredential.user;

        const userDocRef = doc(db, 'usuarios', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          if (data.estadoCuenta !== 'activo' && data.estadoCuenta !== true) {
            setCargando(false);
            setError('Tu cuenta se encuentra inactiva. Contacta al soporte de ATOM.');
            return;
          }
        }

        localStorage.setItem('atom_user_registered', 'true');
        setCargando(false);
        onLoginSuccess();

      } else {
        if (!telefono || telefono.length < 7) {
          setError('Ingresa un número telefónico celular válido.');
          setCargando(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, correo, clave);
        const user = userCredential.user;

        if (!window.recaptchaVerifier) {
          window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible'
          });
        }

        const telefonoCompleto = `${indicativo}${telefono.trim()}`;
        const confirmation = await linkWithPhoneNumber(user, telefonoCompleto, window.recaptchaVerifier);
        
        setResultadoSMS(confirmation);
        setCargando(false);
        setPasoRegistro(2);
      }
    } catch (err: any) {
      setCargando(false);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado. Intenta iniciar sesión.');
      } else if (err.code === 'auth/invalid-phone-number') {
        setError('El número telefónico ingresado no es válido.');
      } else if (err.code === 'auth/credential-already-in-use') {
        setError('Este número celular ya está registrado en otra cuenta.');
      } else {
        setError('Error al procesar la solicitud. Verifica tus datos.');
      }
    }
  };

  // ==========================================
  // PASO 2: VERIFICAR SMS Y GUARDAR BODEGA
  // ==========================================
  const verificarCodigoSMS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultadoSMS) return;
    
    setError('');
    setCargando(true);

    try {
      await resultadoSMS.confirm(codigoSMS);
      
      const user = auth.currentUser;
      if (user) {
        const telefonoCompleto = `${indicativo}${telefono.trim()}`;
        await setDoc(doc(db, 'usuarios', user.uid), {
          uid: user.uid,
          correo: user.email,
          nombreEmpresa: nombreEmpresa.trim() || 'Bodega / Proveedor',
          telefono: telefonoCompleto,
          indicativoPais: indicativo,
          rol: rol,
          esDropshipper: false,
          estadoCuenta: true,
          telefonoVerificado: true,
          fechaCreacion: serverTimestamp(),
        });

        localStorage.setItem('atom_user_registered', 'true');
        setCargando(false);
        onLoginSuccess();
      }
    } catch (err: any) {
      setCargando(false);
      if (err.code === 'auth/invalid-verification-code') {
        setError('El código ingresado es incorrecto.');
      } else {
        setError('Error al verificar el código SMS.');
      }
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-[#070B14] flex flex-col md:flex-row overflow-hidden text-slate-200">
      
      <div id="recaptcha-container"></div>

      {/* PANEL IZQUIERDO: BRANDING EXCLUSIVO PARA PROVEEDORES */}
      <div className="relative w-full md:w-1/2 min-h-[380px] md:min-h-screen flex flex-col justify-between p-8 lg:p-16 border-b md:border-b-0 md:border-r border-slate-800/60 overflow-hidden bg-[#0A0E1A]">
        <Fondos variante={variante} modo="absolute" />
        
        <div className="relative z-10 my-auto flex flex-col items-center text-center max-w-md mx-auto">
          <img 
            src="/logo-color.png" 
            alt="ATOM Logo" 
            className="h-20 sm:h-28 w-auto mb-8 object-contain drop-shadow-[0_0_25px_rgba(13,237,192,0.3)]"
          />

          <Kicker className="!text-[#0DEDC0] !bg-transparent !border-transparent !p-0 mb-3 tracking-widest font-mono">
            SISTEMA EXCLUSIVO PARA PROVEEDORES Y BODEGAS
          </Kicker>

          <H2 className="text-2xl sm:text-3xl lg:text-4xl text-white mb-4">
            Toma el control de tu <Highlight>operación</Highlight>
          </H2>

          <Subtitulo className="!text-xs sm:!text-sm text-slate-400 max-w-sm leading-relaxed">
            Analítica avanzada, blindaje de precios, mermas y comisiones en tiempo real.
            <span className="block mt-3 text-[#0DEDC0] font-semibold text-xs border border-[#0DEDC0]/30 bg-[#0DEDC0]/10 p-2.5 rounded-xl">
              Plataforma desarrollada únicamente para Fabricantes, Bodegas y Proveedores Directos con inventario. <br />
              <strong className="text-amber-300 uppercase tracking-wider block mt-1">(No diseñada para Dropshippers)</strong>
            </span>
          </Subtitulo>
        </div>

        <div className="relative z-10 text-[10px] text-slate-600 font-mono">
          v1.0.0 · 20260825
        </div>
      </div>

      {/* PANEL DERECHO: FORMULARIOS */}
      <div className="relative w-full md:w-1/2 min-h-screen flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 bg-[#090D18]">
        
        <div className="w-full max-w-md mx-auto">
          
          {pasoRegistro === 1 && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                  {modo === 'registro' ? 'Crear Cuenta de Bodega' : 'Iniciar sesión'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  {modo === 'registro' 
                    ? 'Registra tu infraestructura logística de proveedor para habilitar el simulador'
                    : 'Ingresa tus credenciales para acceder a la plataforma'
                  }
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium leading-relaxed">
                  {error}
                </div>
              )}

              {mensajeExito && (
                <div className="mb-5 p-3.5 rounded-xl bg-[#0DEDC0]/10 border border-[#0DEDC0]/30 text-[#0DEDC0] text-xs text-center font-medium leading-relaxed">
                  {mensajeExito}
                </div>
              )}

              <form onSubmit={manejarAutenticacion} className="space-y-4">
                
                {/* NOMBRE EMPRESA */}
                {modo === 'registro' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nombre de la Bodega o Empresa <span className="text-[#0DEDC0]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Distribuidora Central S.A.S"
                      value={nombreEmpresa}
                      onChange={(e) => setNombreEmpresa(e.target.value)}
                      className="w-full bg-[#101625] border border-slate-800 focus:border-[#0DEDC0] rounded-lg px-4 py-2.5 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                )}

                {/* CORREO ELECTRÓNICO */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Correo electrónico empresarial <span className="text-[#0DEDC0]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contacto@tuempresa.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="w-full bg-[#101625] border border-slate-800 focus:border-[#0DEDC0] rounded-lg px-4 py-2.5 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                  />
                </div>

                {/* TELÉFONO Y PAÍS */}
                {modo === 'registro' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Número Celular / WhatsApp <span className="text-[#0DEDC0]">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={indicativo}
                        onChange={(e) => setIndicativo(e.target.value)}
                        className="bg-[#101625] border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-2.5 outline-none focus:border-[#0DEDC0]"
                      >
                        <option value="+57">🇨🇴 Colombia (+57)</option>
                        <option value="+52">🇲🇽 México (+52)</option>
                        <option value="+51">🇵🇪 Perú (+51)</option>
                        <option value="+56">🇨🇱 Chile (+56)</option>
                        <option value="+593">🇪🇨 Ecuador (+593)</option>
                        <option value="+507">🇵🇦 Panamá (+507)</option>
                        <option value="+595">🇵🇾 Paraguay (+595)</option>
                        <option value="+58">🇻🇪 Venezuela (+58)</option>
                        <option value="+54">🇦🇷 Argentina (+54)</option>
                        <option value="+502">🇬🇹 Guatemala (+502)</option>
                        <option value="+506">🇨🇷 Costa Rica (+506)</option>
                      </select>
                      <input
                        type="tel"
                        required
                        placeholder="300 123 4567"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="flex-1 bg-[#101625] border border-slate-800 focus:border-[#0DEDC0] rounded-lg px-4 py-2.5 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                )}

                {/* PERFIL LOGÍSTICO */}
                {modo === 'registro' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Tipo de Perfil Logístico <span className="text-[#0DEDC0]">*</span>
                    </label>
                    <select
                      value={rol}
                      onChange={(e) => setRol(e.target.value as 'proveedor' | 'emprendedor')}
                      className="w-full bg-[#101625] border border-slate-800 focus:border-[#0DEDC0] rounded-lg px-4 py-2.5 text-slate-200 text-sm outline-none"
                    >
                      <option value="proveedor">Proveedor / Fabricante Directo</option>
                      <option value="emprendedor">Emprendedor con Inventario / Bodega Propia</option>
                    </select>
                  </div>
                )}

                {/* CONTRASEÑA */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Contraseña <span className="text-[#0DEDC0]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarClave ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={clave}
                      onChange={(e) => setClave(e.target.value)}
                      className="w-full bg-[#101625] border border-slate-800 focus:border-[#0DEDC0] rounded-lg px-4 py-2.5 text-white text-sm outline-none transition-all placeholder:text-slate-600 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarClave(!mostrarClave)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors bg-transparent border-none cursor-pointer text-xs font-medium"
                    >
                      {mostrarClave ? 'Ocultar' : 'Ver'}
                    </button>
                  </div>
                </div>

                {/* OPCIONES DE LOGIN (RECORDAR SESIÓN Y RECUPERAR CONTRASEÑA) */}
                {modo === 'login' && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={recordar}
                        onChange={(e) => setRecordar(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-800 bg-[#101625] accent-[#0DEDC0] cursor-pointer"
                      />
                      Recordar sesión
                    </label>

                    <button
                      type="button"
                      onClick={manejarRecuperarClave}
                      className="text-[#0DEDC0]/90 hover:text-[#0DEDC0] hover:underline font-medium bg-transparent border-none cursor-pointer"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={cargando}
                  className={`w-full bg-[#182338] hover:bg-[#0DEDC0] text-slate-200 hover:text-[#090D18] font-bold py-3.5 px-6 rounded-lg tracking-wide transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-4 border border-slate-700/50 hover:border-[#0DEDC0] shadow-lg ${ESTILOS_TEXTO.boton}`}
                >
                  {cargando ? 'Procesando...' : (modo === 'registro' ? 'Crear Cuenta de Bodega' : 'Ingresar')}
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-slate-400">
                {modo === 'registro' ? (
                  <>
                    ¿Ya tienes una cuenta registrada?{' '}
                    <button onClick={() => setModo('login')} className="text-[#0DEDC0] hover:underline font-semibold bg-transparent border-none cursor-pointer">
                      Inicia sesión
                    </button>
                  </>
                ) : (
                  <>
                    ¿Eres proveedor y no tienes cuenta?{' '}
                    <button onClick={() => setModo('registro')} className="text-[#0DEDC0] hover:underline font-semibold bg-transparent border-none cursor-pointer">
                      Regístrate gratis
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {/* VERIFICACIÓN SMS */}
          {pasoRegistro === 2 && (
            <div className="animate-fade-in-up">
              <div className="mb-6">
                <button 
                  onClick={() => setPasoRegistro(1)} 
                  className="text-slate-500 hover:text-white text-xs font-bold mb-4 flex items-center gap-1 bg-transparent border-none cursor-pointer transition-colors"
                >
                  ← Cambiar teléfono
                </button>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                  Verifica tu celular
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Hemos enviado un código SMS de 6 dígitos al número <br />
                  <span className="text-[#0DEDC0] font-bold font-mono tracking-wider">{indicativo} {telefono}</span>
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium leading-relaxed">
                  {error}
                </div>
              )}

              <form onSubmit={verificarCodigoSMS} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Código de 6 dígitos
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="123456"
                    maxLength={6}
                    value={codigoSMS}
                    onChange={(e) => setCodigoSMS(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#101625] border border-slate-800 focus:border-[#0DEDC0] rounded-lg px-4 py-3 text-white text-center text-2xl font-mono tracking-[0.5em] outline-none transition-all placeholder:text-slate-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={cargando || codigoSMS.length < 6}
                  className={`w-full bg-[#0DEDC0] text-[#090D18] hover:bg-[#0DEDC0]/90 font-bold py-3.5 px-6 rounded-lg tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-4 shadow-[0_0_15px_rgba(13,237,192,0.4)] ${ESTILOS_TEXTO.boton}`}
                >
                  {cargando ? 'Verificando...' : 'Confirmar Registro'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

    </section>
  );
}