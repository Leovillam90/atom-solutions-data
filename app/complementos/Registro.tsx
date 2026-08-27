'use client';

import React, { useState, useEffect } from 'react';
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
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { H2, Subtitulo, Highlight, ESTILOS_TEXTO } from '@/app/complementos/Tipografia';

interface RegistroProps {
  onLoginSuccess: () => void;
  variante?: TipoFondo;
}

const ROLES_PROVEEDURIA = [
  'Importador Directo',
  'Fabricante / Laboratorio',
  'Distribuidor Mayorista',
  'Marca Propia',
];

export default function Registro({ onLoginSuccess, variante = 'gridCyber' }: RegistroProps) {
  const [modo, setModo] = useState<'registro' | 'login'>('login');

  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [correo, setCorreo] = useState('');
  const [indicativo, setIndicativo] = useState('+57');
  const [telefono, setTelefono] = useState('');
  const [rol, setRol] = useState<string>('Importador Directo');
  const [loginIdentificador, setLoginIdentificador] = useState('');

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const sessionData = localStorage.getItem('atom_session');
    if (sessionData) {
      try {
        const { identificador, expiry } = JSON.parse(sessionData);
        if (identificador) setLoginIdentificador(identificador);

        if (expiry && new Date().getTime() > parseInt(expiry)) {
          localStorage.removeItem('atom_session');
          setModo('login');
          setError('Por tu seguridad, la sesión de 5 días ha caducado. Vuelve a ingresar.');
        }
      } catch (e) {
        localStorage.removeItem('atom_session');
      }
    }
  }, []);

  useEffect(() => {
    if (error !== 'Por tu seguridad, la sesión de 5 días ha caducado. Vuelve a ingresar.') {
       setError('');
    }
  }, [modo]);

  const guardarSesionLocal = (uid: string, identificador: string) => {
    const tiempoExpiracion = new Date().getTime() + (5 * 24 * 60 * 60 * 1000); 
    const payload = {
      registered: 'true',
      id: uid,
      identificador,
      expiry: tiempoExpiracion.toString()
    };
    localStorage.setItem('atom_session', JSON.stringify(payload));
  };

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    if (!nombreEmpresa.trim() || !correo.includes('@') || telefono.length < 7) {
      setError('Por favor completa todos los campos correctamente.');
      setCargando(false);
      return;
    }

    try {
      const correoMinusculas = correo.trim().toLowerCase();
      const telefonoCompleto = `${indicativo}${telefono.trim()}`;
      const usuariosRef = collection(db, 'usuarios');

      // Consultas de validación enviadas en paralelo
      const [snapCorreo, snapTel] = await Promise.all([
        getDocs(query(usuariosRef, where('correo', '==', correoMinusculas))),
        getDocs(query(usuariosRef, where('telefono', '==', telefonoCompleto)))
      ]);

      if (!snapCorreo.empty) {
        setError('Este correo ya está registrado. Inicia sesión directamente.');
        setCargando(false);
        return;
      }

      if (!snapTel.empty) {
        setError('Este teléfono celular ya está registrado en otra cuenta.');
        setCargando(false);
        return;
      }

      const nuevoDocRef = doc(collection(db, 'usuarios'));
      const nuevoUsuarioId = nuevoDocRef.id;

      await setDoc(nuevoDocRef, {
        uid: nuevoUsuarioId,
        correo: correoMinusculas,
        nombreEmpresa: nombreEmpresa.trim(),
        telefono: telefonoCompleto,
        indicativoPais: indicativo,
        rol: rol, // 'Importador Directo', 'Fabricante / Laboratorio', 'Distribuidor Mayorista', 'Marca Propia'
        esDropshipper: false,
        estadoCuenta: true,
        fechaCreacion: serverTimestamp(),
      });

      guardarSesionLocal(nuevoUsuarioId, correoMinusculas);
      setCargando(false);
      onLoginSuccess();

    } catch (err: any) {
      setCargando(false);
      console.error('❌ Error en el registro:', err.code, err.message);
      if (err.code === 'permission-denied') {
        setError('Permiso denegado por reglas de Firestore. Revisa firestore.rules.');
      } else {
        setError('Ocurrió un error al guardar los datos en Firestore. Intenta nuevamente.');
      }
    }
  };

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    const entrada = loginIdentificador.trim().toLowerCase();
    if (!entrada) {
      setError('Ingresa tu correo o número celular completo.');
      setCargando(false);
      return;
    }

    try {
      const usuariosRef = collection(db, 'usuarios');
      const telConIndicativo = !entrada.startsWith('+') ? `${indicativo}${entrada.replace(/\D/g, '')}` : entrada;

      // Disparo de red paralelo directo a Firestore
      const [snapCorreo, snapTel, snapTelIndicativo] = await Promise.all([
        getDocs(query(usuariosRef, where('correo', '==', entrada))),
        getDocs(query(usuariosRef, where('telefono', '==', entrada))),
        getDocs(query(usuariosRef, where('telefono', '==', telConIndicativo)))
      ]);

      const querySnapshot = !snapCorreo.empty ? snapCorreo : !snapTel.empty ? snapTel : snapTelIndicativo;

      if (querySnapshot.empty) {
        setError('No encontramos tus datos. Por favor, crea tu cuenta a continuación.');
        if (entrada.includes('@')) {
          setCorreo(entrada);
        } else {
          setTelefono(entrada.replace(/\D/g, ''));
        }
        setModo('registro');
        setCargando(false);
        return;
      }

      const usuarioDoc = querySnapshot.docs[0].data();

      if (usuarioDoc.estadoCuenta !== true && usuarioDoc.estadoCuenta !== 'activo') {
        setError('Tu cuenta se encuentra inactiva. Contacta al soporte de ATOM.');
        setCargando(false);
        return;
      }

      guardarSesionLocal(usuarioDoc.uid || querySnapshot.docs[0].id, entrada);
      setCargando(false);
      onLoginSuccess();

    } catch (err: any) {
      setCargando(false);
      console.error('❌ Error al buscar cuenta en Firestore:', err.code, err.message);
      if (err.code === 'permission-denied') {
        setError('Permiso denegado por reglas de Firestore. Actualiza firestore.rules.');
      } else {
        setError('Error al conectar con la base de datos. Intenta nuevamente.');
      }
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-[#070B14] flex flex-col md:flex-row overflow-hidden text-slate-200">
      
      {/* PANEL IZQUIERDO */}
      <div className="relative w-full md:w-1/2 min-h-[380px] md:min-h-screen flex flex-col justify-between p-8 lg:p-16 border-b md:border-b-0 md:border-r border-slate-800/60 overflow-hidden bg-[#0A0E1A]">
        <Fondos variante={variante} modo="absolute" />
        
        <div className="relative z-10 my-auto flex flex-col items-center text-center max-w-md mx-auto">
          <img 
            src="/logo-color.png" 
            alt="ATOM Logo" 
            className="h-20 sm:h-28 w-auto mb-6 object-contain drop-shadow-[0_0_25px_rgba(13,237,192,0.3)]"
          />

          <div className="inline-block animate-pulse mb-3">
            <span className="text-[#0DEDC0] text-xs font-mono font-bold tracking-[0.2em] uppercase bg-[#0DEDC0]/10 border border-[#0DEDC0]/40 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(13,237,192,0.4)]">
              SISTEMA EXCLUSIVO PARA BODEGAS
            </span>
          </div>

          <H2 className="text-2xl sm:text-3xl lg:text-4xl text-white mb-3">
            Toma el control de tu <Highlight>operación</Highlight>
          </H2>

          <Subtitulo className="!text-xs sm:!text-sm text-slate-400 max-w-sm leading-relaxed mb-6">
            Analítica avanzada, blindaje de precios, mermas y comisiones en tiempo real.
          </Subtitulo>

          <div className="w-full text-left bg-[#0E1726]/90 border border-amber-500/50 rounded-xl p-4 shadow-[0_0_20px_rgba(245,158,11,0.15)] backdrop-blur-md relative overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-400 to-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>
            
            <div className="flex items-start gap-3 pl-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 text-base font-bold shrink-0 animate-bounce [animation-duration:2s]">
                ⚠️
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  Alerta de Restricción
                </span>
                <p className="text-slate-300 text-xs leading-relaxed font-medium">
                  Plataforma restringida y exclusiva para <strong className="text-white">Fabricantes y Proveedores Directos</strong> con stock físico.
                </p>
                <div className="mt-3 text-[10px] font-mono font-bold text-[#090D18] bg-amber-400 inline-block px-2.5 py-1 rounded shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                  🚫 NO APTO PARA DROPSHIPPERS
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[10px] text-slate-600 font-mono text-center md:text-left">
          v1.4.0 · Security & Access
        </div>
      </div>

      {/* PANEL DERECHO */}
      <div className="relative w-full md:w-1/2 min-h-screen flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 bg-[#090D18]">
        <div className="w-full max-w-md mx-auto">
          
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
              {modo === 'registro' ? 'Crear Cuenta de Bodega' : 'Iniciar Sesión'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {modo === 'registro' 
                ? 'Ingresa tu información. Entrarás automáticamente a la plataforma.'
                : 'Ingresa tu correo o celular registrado para entrar de una.'
              }
            </p>
          </div>

          {error && (
            <div className={`mb-5 p-3.5 rounded-xl border text-xs text-center font-medium leading-relaxed ${
              error.includes('seguridad') 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              {error}
            </div>
          )}

          {modo === 'registro' ? (
            <form onSubmit={manejarRegistro} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nombre de la Bodega / Empresa <span className="text-[#0DEDC0]">*</span>
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
                    <option value="+57">🇨🇴 +57</option>
                    <option value="+52">🇲🇽 +52</option>
                    <option value="+51">🇵🇪 +51</option>
                    <option value="+56">🇨🇱 +56</option>
                    <option value="+593">🇪🇨 +593</option>
                    <option value="+507">🇵🇦 +507</option>
                    <option value="+595">🇵🇾 +595</option>
                    <option value="+58">🇻🇪 +58</option>
                    <option value="+54">🇦🇷 +54</option>
                  </select>
                  <input
                    type="tel"
                    required
                    placeholder="300 123 4567"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 bg-[#101625] border border-slate-800 focus:border-[#0DEDC0] rounded-lg px-4 py-2.5 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Rol de Proveeduría <span className="text-[#0DEDC0]">*</span>
                </label>
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  className="w-full bg-[#101625] border border-slate-800 focus:border-[#0DEDC0] rounded-lg px-4 py-2.5 text-slate-200 text-sm outline-none"
                >
                  {ROLES_PROVEEDURIA.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={cargando}
                className={`w-full bg-[#0DEDC0] text-[#090D18] hover:bg-[#0DEDC0]/90 font-bold py-3.5 px-6 rounded-lg tracking-wide transition-all duration-300 disabled:opacity-50 cursor-pointer mt-4 shadow-[0_0_15px_rgba(13,237,192,0.3)] flex justify-center items-center ${ESTILOS_TEXTO.boton}`}
              >
                {cargando ? 'Guardando en Firestore...' : 'Registrar Bodega e Ingresar'}
              </button>
            </form>
          ) : (
            <form onSubmit={manejarLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Correo o Celular registrado <span className="text-[#0DEDC0]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: contacto@tuempresa.com o 3001234567"
                  value={loginIdentificador}
                  onChange={(e) => setLoginIdentificador(e.target.value)}
                  className="w-full bg-[#101625] border border-slate-800 focus:border-[#0DEDC0] rounded-lg px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                />
              </div>

              <button
                type="submit"
                disabled={cargando}
                className={`w-full bg-[#0DEDC0] text-[#090D18] hover:bg-[#0DEDC0]/90 font-bold py-3.5 px-6 rounded-lg tracking-wide transition-all duration-300 disabled:opacity-50 cursor-pointer mt-4 shadow-[0_0_15px_rgba(13,237,192,0.3)] flex justify-center items-center ${ESTILOS_TEXTO.boton}`}
              >
                {cargando ? 'Buscando cuenta...' : 'Entrar a la Plataforma'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-slate-400">
            {modo === 'registro' ? (
              <>
                ¿Ya registraste tu empresa antes?{' '}
                <button 
                  onClick={() => setModo('login')} 
                  className="text-[#0DEDC0] hover:underline font-semibold bg-transparent border-none cursor-pointer"
                >
                  Inicia sesión aquí
                </button>
              </>
            ) : (
              <>
                ¿Eres nuevo en la plataforma?{' '}
                <button 
                  onClick={() => setModo('registro')} 
                  className="text-[#0DEDC0] hover:underline font-semibold bg-transparent border-none cursor-pointer"
                >
                  Registra tu bodega gratis
                </button>
              </>
            )}
          </div>

        </div>
      </div>

    </section>
  );
}