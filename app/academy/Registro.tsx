'use client';

import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/app/lib/firebase';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { Kicker, H2, Subtitulo, Highlight, ESTILOS_TEXTO } from '@/app/complementos/Tipografia';

interface FormularioRegistroProps {
  onLoginSuccess: () => void;
  variante?: TipoFondo;
}

export default function FormularioRegistro({ onLoginSuccess, variante = 'gridCyber' }: FormularioRegistroProps) {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [recordar, setRecordar] = useState(false);
  const [mostrarClave, setMostrarClave] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Autenticación principal
  const manejarAutenticacion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!correo.includes('@') || clave.length < 6) {
      setError('Ingresa un correo válido y una clave de al menos 6 caracteres.');
      return;
    }

    setCargando(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, correo, clave);
      const user = userCredential.user;

      const userDocRef = doc(db, 'usuarios', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        const estaActivo = data.estadoCuenta === 'activo' || data.estadoCuenta === true;

        if (!estaActivo) {
          setCargando(false);
          setError('Tu cuenta se encuentra inactiva. Contacta al soporte de ATOM.');
          return;
        }
      } else {
        await setDoc(userDocRef, {
          correo: user.email,
          nombreEmpresa: 'Bodega Proveedor',
          rol: 'proveedor',
          estadoCuenta: true,
          fechaCreacion: serverTimestamp(),
        });
      }

      setCargando(false);
      onLoginSuccess();
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          const newCredential = await createUserWithEmailAndPassword(auth, correo, clave);
          const newUser = newCredential.user;

          await setDoc(doc(db, 'usuarios', newUser.uid), {
            correo: newUser.email,
            nombreEmpresa: 'Nueva Proveeduría',
            rol: 'proveedor',
            estadoCuenta: true,
            fechaCreacion: serverTimestamp(),
          });

          setCargando(false);
          onLoginSuccess();
        } catch (createErr: any) {
          setCargando(false);
          setError('Contraseña incorrecta o error al registrar.');
        }
      } else {
        setCargando(false);
        setError('Error de conexión con la red de ATOM.');
      }
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-[#070B14] flex flex-col md:flex-row overflow-hidden text-slate-200">
      
      {/* 🔴 PANEL IZQUIERDO: Branding & Fondo Dinámico */}
      <div className="relative w-full md:w-1/2 min-h-[380px] md:min-h-screen flex flex-col justify-between p-8 lg:p-16 border-b md:border-b-0 md:border-r border-slate-800/60 overflow-hidden bg-[#0A0E1A]">
        {/* Capa de fondo reactiva según el prop 'variante' */}
        <Fondos variante={variante} modo="absolute" />
        
        <div className="relative z-10 my-auto flex flex-col items-center text-center max-w-md mx-auto">
          <img 
            src="/logo-color.png" 
            alt="ATOM Logo" 
            className="h-20 sm:h-28 w-auto mb-8 object-contain drop-shadow-[0_0_25px_rgba(13,237,192,0.3)]"
          />

          <Kicker className="!text-[#0DEDC0] !bg-transparent !border-transparent !p-0 mb-3">
            ACCESO PLATAFORMA
          </Kicker>

          <H2 className="text-2xl sm:text-3xl lg:text-4xl text-white mb-4">
            Toma el control de tu <Highlight>operación</Highlight>
          </H2>

          <Subtitulo className="!text-xs sm:!text-sm text-slate-400 max-w-sm">
            Analítica avanzada, reportes en tiempo real y métricas que impulsan tu negocio.
          </Subtitulo>
        </div>

        <div className="relative z-10 text-[10px] text-slate-600 font-mono">
          v1.0.0 · 20260825
        </div>
      </div>

      {/* 🔵 PANEL DERECHO: Formulario de Inicio de Sesión */}
      <div className="relative w-full md:w-1/2 min-h-screen flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 bg-[#090D18]">
        
        {/* Selector de Idioma */}
        <div className="absolute top-6 right-6 lg:top-8 lg:right-10 z-20">
          <select className="bg-[#111726] border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-1.5 outline-none cursor-pointer hover:border-slate-700 transition-all">
            <option value="es">Español ▾</option>
            <option value="en">English ▾</option>
          </select>
        </div>

        <div className="w-full max-w-md mx-auto">
          
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
              Iniciar sesión
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Alerta Error */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={manejarAutenticacion} className="space-y-5">
            {/* Campo Correo */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Correo electrónico <span className="text-[#0DEDC0]">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="nombre@empresa.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full bg-[#101625] border border-slate-800 focus:border-[#0DEDC0] rounded-lg px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-slate-600 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"
              />
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Contraseña <span className="text-[#0DEDC0]">*</span>
              </label>
              <div className="relative">
                <input
                  type={mostrarClave ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  className="w-full bg-[#101625] border border-slate-800 focus:border-[#0DEDC0] rounded-lg px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-slate-600 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setMostrarClave(!mostrarClave)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors bg-transparent border-none cursor-pointer"
                >
                  {mostrarClave ? (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                  ) : (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Checkbox Recordar y Enlace Olvidaste tu contraseña */}
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

              <a
                href="https://atomapp.com.co/password"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0DEDC0]/90 hover:text-[#0DEDC0] hover:underline font-medium"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón Ingresar usando los estilos estandarizados ESTILOS_TEXTO.boton */}
            <button
              type="submit"
              disabled={cargando}
              className={`w-full bg-[#182338] hover:bg-[#0DEDC0] text-slate-200 hover:text-[#090D18] font-bold py-3.5 px-6 rounded-lg tracking-wide transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-4 border border-slate-700/50 hover:border-[#0DEDC0] shadow-lg ${ESTILOS_TEXTO.boton}`}
            >
              {cargando ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Cargando...
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          {/* Enlace Registrarse */}
          <div className="mt-8 text-center text-xs text-slate-400">
            ¿No tienes una cuenta?{' '}
            <a
              href="https://atomapp.com.co/register"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0DEDC0] font-semibold hover:underline"
            >
              Regístrate
            </a>
          </div>

        </div>
      </div>

    </section>
  );
}