'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  doc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

interface RegistroProps {
  onLoginSuccess: () => void;
}

export default function Registro({ onLoginSuccess }: RegistroProps) {
  const [modo, setModo] = useState<'login' | 'registro'>('login');

  // Campos de Registro
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [indicativo, setIndicativo] = useState('+57');
  const [telefono, setTelefono] = useState('');
  const [clave, setClave] = useState('');
  const [verClaveRegistro, setVerClaveRegistro] = useState(false);

  // Campos de Login
  const [loginIdentificador, setLoginIdentificador] = useState('');
  const [loginClave, setLoginClave] = useState('');
  const [verClaveLogin, setVerClaveLogin] = useState(false);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setMensajeExito(null);
  }, [modo]);

  const manejarRegistroAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMensajeExito(null);
    setCargando(true);

    const nombreLimpio = nombre.trim();
    const correoMinusculas = correo.trim().toLowerCase();
    const telefonoCompleto = `${indicativo}${telefono.trim()}`;
    const claveIngresada = clave.trim();

    if (!nombreLimpio || !correoMinusculas.includes('@') || telefono.length < 7 || claveIngresada.length < 4) {
      setError('Completa todos los campos correctamente (la clave debe tener al menos 4 caracteres).');
      setCargando(false);
      return;
    }

    try {
      const adminRef = collection(db, 'Administradores');

      const [snapCorreo, snapTel] = await Promise.all([
        getDocs(query(adminRef, where('correo', '==', correoMinusculas))),
        getDocs(query(adminRef, where('telefono', '==', telefonoCompleto)))
      ]);

      if (!snapCorreo.empty) {
        setError('Este correo ya está registrado en Administradores.');
        setCargando(false);
        return;
      }

      if (!snapTel.empty) {
        setError('Este número de teléfono ya está registrado.');
        setCargando(false);
        return;
      }

      const nuevoDocRef = doc(collection(db, 'Administradores'));

      await setDoc(nuevoDocRef, {
        uid: nuevoDocRef.id,
        nombre: nombreLimpio,
        correo: correoMinusculas,
        telefono: telefonoCompleto,
        indicativoPais: indicativo,
        clave: claveIngresada,
        esAdmin: false,
        activo: false,
        fechaCreacion: serverTimestamp(),
      });

      // Transición automática a login con credenciales listas
      setLoginIdentificador(correoMinusculas);
      setLoginClave(claveIngresada);
      setModo('login');
      setMensajeExito('¡Cuenta registrada con éxito! Tus credenciales fueron precargadas. Una vez que apruebes esAdmin: true en Bases de Datos, solo haz clic en "Ingresar al Dashboard".');

      setNombre('');
      setCorreo('');
      setTelefono('');
      setClave('');

    } catch (err) {
      console.error('Error al registrar administrador:', err);
      setError('Error al guardar en Bases de Datos. Verifica los permisos de la base de datos.');
    } finally {
      setCargando(false);
    }
  };

  const manejarLoginAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMensajeExito(null);
    setCargando(true);

    const inputLimpio = loginIdentificador.trim().toLowerCase();
    const passLimpia = loginClave.trim();

    if (!inputLimpio || !passLimpia) {
      setError('Ingresa tu correo o celular y tu contraseña.');
      setCargando(false);
      return;
    }

    try {
      const adminRef = collection(db, 'Administradores');
      const telConIndicativo = !inputLimpio.startsWith('+') ? `${indicativo}${inputLimpio.replace(/\D/g, '')}` : inputLimpio;

      const [snapCorreo, snapTel] = await Promise.all([
        getDocs(query(adminRef, where('correo', '==', inputLimpio))),
        getDocs(query(adminRef, where('telefono', '==', telConIndicativo)))
      ]);

      const querySnapshot = !snapCorreo.empty ? snapCorreo : snapTel;

      if (querySnapshot.empty) {
        setError('Cuenta no encontrada en la colección Administradores.');
        setCargando(false);
        return;
      }

      const adminDoc = querySnapshot.docs[0].data();
      const passGuardada = adminDoc.clave || adminDoc.password || '';

      if (passGuardada !== passLimpia) {
        setError('La contraseña ingresada es incorrecta.');
        setCargando(false);
        return;
      }

      if (adminDoc.esAdmin !== true && adminDoc.activo !== true) {
        setError('Tu cuenta aún no ha sido aprobada. Por favor, contacta al administrador ATOM.');
        setCargando(false);
        return;
      }

      const expiry = Date.now() + 8 * 60 * 60 * 1000; // 8 horas
      sessionStorage.setItem('atom_admin_session', JSON.stringify({ 
        usuario: adminDoc.correo, 
        expiry 
      }));

      onLoginSuccess();

    } catch (err) {
      console.error('Error al validar Administrador:', err);
      setError('Error de conexión con Bases de Datos. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-md bg-[#090D16] border-2 border-[#0DEDC0]/40 rounded-3xl p-8 shadow-[0_0_50px_rgba(13,237,192,0.15)] space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#0DEDC0]/10 border border-[#0DEDC0] text-[#0DEDC0] rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
            🔒
          </div>
          <span className="text-[10px] font-mono font-bold text-[#0DEDC0] uppercase tracking-widest block">
            ACCESO RESTRINGIDO DIRECTIVO
          </span>
          <h2 className="text-2xl font-black text-white">
            {modo === 'registro' ? 'Crear Cuenta Admin' : 'Portal Administradores'}
          </h2>
          <p className="text-xs text-slate-400">
            {modo === 'registro' 
              ? 'Registra tus datos. Tu cuenta requerirá aprobación del Administrador.' 
              : 'Ingresa tus credenciales autorizadas (esAdmin: true):'}
          </p>
        </div>

        {mensajeExito && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs text-center font-medium leading-relaxed">
            {mensajeExito}
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-red-900/30 border border-red-500/50 text-red-300 text-xs font-medium text-center leading-relaxed">
            {error}
          </div>
        )}

        {modo === 'registro' ? (
          <form onSubmit={manejarRegistroAdmin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Carlos Mendoza"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-white text-sm outline-none focus:border-[#0DEDC0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                Correo Corporativo *
              </label>
              <input
                type="email"
                required
                placeholder="director@atomsolutionsdata.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-white text-sm outline-none focus:border-[#0DEDC0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                Teléfono Celular *
              </label>
              <div className="flex gap-2">
                <select
                  value={indicativo}
                  onChange={(e) => setIndicativo(e.target.value)}
                  className="bg-[#102935] border border-slate-700 text-slate-300 text-xs rounded-xl px-2.5 outline-none focus:border-[#0DEDC0]"
                >
                  <option value="+57">🇨🇴 +57</option>
                  <option value="+52">🇲🇽 +52</option>
                  <option value="+51">🇵🇪 +51</option>
                  <option value="+56">🇨🇱 +56</option>
                </select>
                <input
                  type="tel"
                  required
                  placeholder="300 123 4567"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 bg-[#102935] border border-slate-700 rounded-xl p-3 text-white text-sm outline-none focus:border-[#0DEDC0]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                Contraseña / Clave *
              </label>
              <div className="relative">
                <input
                  type={verClaveRegistro ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 pr-10 text-white text-sm outline-none focus:border-[#0DEDC0]"
                />
                <button
                  type="button"
                  onClick={() => setVerClaveRegistro((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0DEDC0] transition-colors p-1"
                  title={verClaveRegistro ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {verClaveRegistro ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full py-4 rounded-xl bg-[#0DEDC0] hover:bg-white text-[#090D16] font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer mt-2"
            >
              {cargando ? 'Guardando...' : 'Crear Cuenta Administrador →'}
            </button>
          </form>
        ) : (
          <form onSubmit={manejarLoginAdmin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                Correo o Celular Admin *
              </label>
              <input
                type="text"
                required
                placeholder="director@atomsolutionsdata.com"
                value={loginIdentificador}
                onChange={(e) => setLoginIdentificador(e.target.value)}
                className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 text-white text-sm outline-none focus:border-[#0DEDC0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                Contraseña / Clave *
              </label>
              <div className="relative">
                <input
                  type={verClaveLogin ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={loginClave}
                  onChange={(e) => setLoginClave(e.target.value)}
                  className="w-full bg-[#102935] border border-slate-700 rounded-xl p-3 pr-10 text-white text-sm outline-none focus:border-[#0DEDC0]"
                />
                <button
                  type="button"
                  onClick={() => setVerClaveLogin((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0DEDC0] transition-colors p-1"
                  title={verClaveLogin ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {verClaveLogin ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full py-4 rounded-xl bg-[#0DEDC0] hover:bg-white text-[#090D16] font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer mt-2"
            >
              {cargando ? 'Validando...' : 'Ingresar al Dashboard →'}
            </button>
          </form>
        )}

        <div className="pt-2 text-center text-xs text-slate-400">
          {modo === 'registro' ? (
            <>
              ¿Ya tienes cuenta asignada?{' '}
              <button 
                onClick={() => setModo('login')} 
                className="text-[#0DEDC0] hover:underline font-bold bg-transparent border-none cursor-pointer"
              >
                Inicia sesión
              </button>
            </>
          ) : (
            <>
              ¿Necesitas registrar un nuevo administrador?{' '}
              <button 
                onClick={() => setModo('registro')} 
                className="text-[#0DEDC0] hover:underline font-bold bg-transparent border-none cursor-pointer"
              >
                Crear cuenta aquí
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}