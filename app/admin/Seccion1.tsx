'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { H2, Subtitulo, Highlight } from '@/app/complementos/Tipografia';

// --- INTERFACES ---
interface SolicitudBaja {
  id: string;
  nombreSolicitante: string;
  correo: string;
  cuentaAtom: string;
  planActual: string;
  rolProveeduria: string;
  motivo: string;
  detalles: string;
  aceptoOfertaRetencion: boolean;
  fechaSolicitud: string;
  estado: 'PENDIENTE_BAJA' | 'RETENIDO_DESCUENTO' | 'COMPLETADO_BAJA';
}

interface Administrador {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  esAdmin: boolean;
  activo: boolean;
  fechaCreacion: unknown;
}

interface RegistroBitacora {
  id: string;
  adminEmail: string;
  modulo: string;
  accion: string;
  fechaISO: string;
}

type TabAdmin = 'METRICAS_GENERALES' | 'DIRECTORIO_USUARIOS' | 'MAPA_CALOR' | 'GESTION_CANCELACIONES' | 'BITACORA';

interface Seccion1Props {
  onLogout: () => void;
  variante?: TipoFondo;
}

export default function Seccion1({ onLogout, variante = 'hexGrid' }: Seccion1Props) {
  const [tabActiva, setTabActiva] = useState<TabAdmin>('METRICAS_GENERALES');
  const [adminActual, setAdminActual] = useState<string>('Sistema');
  
  // Estados de datos
  const [solicitudes, setSolicitudes] = useState<SolicitudBaja[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState<boolean>(true);
  const [filtroEstado, setFiltroEstado] = useState<string>('TODAS');
  const [busqueda, setBusqueda] = useState<string>('');
  
  // Estado para la fila expandida en Cancelaciones
  const [filaExpandida, setFilaExpandida] = useState<string | null>(null);

  const [administradores, setAdministradores] = useState<Administrador[]>([]);
  const [cargandoAdmins, setCargandoAdmins] = useState<boolean>(false);

  const [bitacora, setBitacora] = useState<RegistroBitacora[]>([]);
  const [cargandoBitacora, setCargandoBitacora] = useState<boolean>(false);

  // Validar si el usuario actual es el Super Admin
  const esSuperAdmin = useMemo(() => {
    return adminActual.trim().toLowerCase() === 'info@atomsolutionsdata.com';
  }, [adminActual]);

  // Carga inicial de sesión
  useEffect(() => {
    const session = sessionStorage.getItem('atom_admin_session');
    if (session) {
      try {
        setAdminActual(JSON.parse(session).usuario);
      } catch (e) {
        console.error('Error al parsear sesión:', e);
      }
    }
  }, []);

  const cargarSolicitudes = useCallback(async () => {
    setCargandoDatos(true);
    try {
      const q = query(collection(db, 'solicitudes_baja'), orderBy('fechaSolicitud', 'desc'));
      const snap = await getDocs(q);
      const docsData: SolicitudBaja[] = [];
      snap.forEach((docSnap) => docsData.push({ id: docSnap.id, ...docSnap.data() } as SolicitudBaja));
      setSolicitudes(docsData);
    } catch (error) {
      console.error('Error cargando cancelaciones:', error);
    } finally {
      setCargandoDatos(false);
    }
  }, []);

  const cargarAdministradores = useCallback(async () => {
    setCargandoAdmins(true);
    try {
      const snap = await getDocs(collection(db, 'Administradores'));
      const adminData: Administrador[] = [];
      snap.forEach((docSnap) => adminData.push({ id: docSnap.id, ...docSnap.data() } as Administrador));
      setAdministradores(adminData);
    } catch (error) {
      console.error('Error cargando administradores:', error);
    } finally {
      setCargandoAdmins(false);
    }
  }, []);

  const cargarBitacora = useCallback(async () => {
    setCargandoBitacora(true);
    try {
      const q = query(collection(db, 'bitacora_auditoria'), orderBy('fechaISO', 'desc'), limit(50));
      const snap = await getDocs(q);
      const logs: RegistroBitacora[] = [];
      snap.forEach((docSnap) => logs.push({ id: docSnap.id, ...docSnap.data() } as RegistroBitacora));
      setBitacora(logs);
    } catch (error) {
      console.error('Error cargando bitácora:', error);
    } finally {
      setCargandoBitacora(false);
    }
  }, []);

  useEffect(() => {
    cargarSolicitudes();
  }, [cargarSolicitudes]);

  useEffect(() => {
    if (tabActiva === 'DIRECTORIO_USUARIOS' && administradores.length === 0) {
      cargarAdministradores();
    } else if (tabActiva === 'BITACORA' && bitacora.length === 0) {
      cargarBitacora();
    }
  }, [tabActiva, administradores.length, bitacora.length, cargarAdministradores, cargarBitacora]);

  const cargarTodo = useCallback(() => {
    cargarSolicitudes();
    cargarAdministradores();
    cargarBitacora();
  }, [cargarSolicitudes, cargarAdministradores, cargarBitacora]);

  const registrarAccionEnBitacora = useCallback(async (modulo: string, accionTexto: string) => {
    const fechaISO = new Date().toISOString();
    const nuevoRegistro = {
      adminEmail: adminActual,
      modulo,
      accion: accionTexto,
      fechaISO,
    };

    try {
      const docRef = await addDoc(collection(db, 'bitacora_auditoria'), nuevoRegistro);
      setBitacora((prev) => [{ id: docRef.id, ...nuevoRegistro }, ...prev]);
    } catch (e) {
      console.error('Error guardando en bitácora:', e);
    }
  }, [adminActual]);

  // -------------------------------------------------------------
  // 🔥 FUNCIÓN DE PURGA DIRECTA EXCLUSIVA PARA SUPER ADMIN
  // -------------------------------------------------------------
  const purgarBaseDatosDirecta = useCallback(async () => {
    if (!esSuperAdmin) {
      alert('⛔ ACCESO RESTRINGIDO: Esta función es exclusiva para el Super Administrador principal.');
      return;
    }

    const confirmacion1 = confirm(
      '⚠️ ¿ESTÁS SEGURO DE EJECUTAR LA PURGA DIRECTA?\n\n' +
      'Esta acción eliminará PERMANENTEMENTE de Bases de Datos:\n' +
      '1. Todas las solicitudes de cancelación registradas.\n' +
      '2. Todos los registros de la bitácora de auditoría.\n\n' +
      'Esta operación NO se puede deshacer.'
    );

    if (!confirmacion1) return;

    setCargandoDatos(true);
    setCargandoBitacora(true);

    try {
      // 1. Borrar todos los documentos de solicitudes_baja
      const snapSolicitudes = await getDocs(collection(db, 'solicitudes_baja'));
      const promesasSolicitudes = snapSolicitudes.docs.map((d) => deleteDoc(doc(db, 'solicitudes_baja', d.id)));
      await Promise.all(promesasSolicitudes);

      // 2. Borrar todos los documentos de bitacora_auditoria
      const snapBitacora = await getDocs(collection(db, 'bitacora_auditoria'));
      const promesasBitacora = snapBitacora.docs.map((d) => deleteDoc(doc(db, 'bitacora_auditoria', d.id)));
      await Promise.all(promesasBitacora);

      // 3. Limpiar estado local
      setSolicitudes([]);
      setBitacora([]);

      // 4. Escribir registro inicial de la purga
      await addDoc(collection(db, 'bitacora_auditoria'), {
        adminEmail: adminActual,
        modulo: 'SUPER_ADMIN',
        accion: 'PURGA DIRECTA: Se eliminaron todas las cancelaciones e historiales anteriores.',
        fechaISO: new Date().toISOString(),
      });

      alert('✅ PURGA COMPLETADA: Se han borrado los datos de prueba en Bases de Datos con éxito.');
      cargarTodo();
    } catch (error) {
      console.error('Error al ejecutar la purga directa:', error);
      alert('❌ Error al purgar la base de datos. Asegúrate de tener permisos de eliminación en las reglas de Bases de Datos.');
    } finally {
      setCargandoDatos(false);
      setCargandoBitacora(false);
    }
  }, [esSuperAdmin, adminActual, cargarTodo]);

  const cambiarEstadoCancelacion = useCallback(async (item: SolicitudBaja, nuevoEstado: SolicitudBaja['estado']) => {
    try {
      const docRef = doc(db, 'solicitudes_baja', item.id);
      await updateDoc(docRef, { estado: nuevoEstado });
      setSolicitudes((prev) => prev.map((s) => (s.id === item.id ? { ...s, estado: nuevoEstado } : s)));
      await registrarAccionEnBitacora('CANCELACIONES', `Cambió el estado a [${nuevoEstado}] para la bodega: ${item.cuentaAtom}`);
    } catch (error) {
      alert('No se pudo actualizar el estado.');
    }
  }, [registrarAccionEnBitacora]);

  const alternarPermisoAdmin = useCallback(async (adminTarget: Administrador, campo: 'esAdmin' | 'activo') => {
    if (adminTarget.correo.toLowerCase() === 'info@atomsolutionsdata.com') {
      alert('⛔ SEGURIDAD DE SISTEMA: No tienes permisos para modificar el Super Administrador.');
      return;
    }
    const nuevoValor = !adminTarget[campo];
    try {
      const docRef = doc(db, 'Administradores', adminTarget.id);
      await updateDoc(docRef, { [campo]: nuevoValor });
      setAdministradores((prev) => prev.map((a) => (a.id === adminTarget.id ? { ...a, [campo]: nuevoValor } : a)));
      const accion = nuevoValor ? 'HABILITÓ' : 'REVOCÓ';
      await registrarAccionEnBitacora('DIRECTORIO', `${accion} el permiso [${campo}] de: ${adminTarget.correo}`);
    } catch (error) {
      alert('Error de permisos al modificar Bases de Datos.');
    }
  }, [registrarAccionEnBitacora]);

  const toggleFila = useCallback((id: string) => {
    setFilaExpandida((prev) => (prev === id ? null : id));
  }, []);

  const solicitudesFiltradas = useMemo(() => {
    return solicitudes.filter((s) => {
      const coincideEstado = filtroEstado === 'TODAS' || s.estado === filtroEstado;
      const termino = busqueda.toLowerCase();
      const coincideBusqueda = !busqueda || 
        s.cuentaAtom?.toLowerCase().includes(termino) || 
        s.correo?.toLowerCase().includes(termino) ||
        s.nombreSolicitante?.toLowerCase().includes(termino);
      return coincideEstado && coincideBusqueda;
    });
  }, [solicitudes, filtroEstado, busqueda]);

  const conteoPendientes = useMemo(() => {
    return solicitudes.filter((s) => s.estado === 'PENDIENTE_BAJA' || (!s.estado && !s.aceptoOfertaRetencion)).length;
  }, [solicitudes]);

  return (
    <div className="relative min-h-screen text-white font-sans overflow-hidden">
      {/* 🌌 FONDO ATOM */}
      <Fondos variante={variante} modo="fixed" />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
        
        {/* CABECERA GENERAL */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-6 bg-[#090D16]/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#0DEDC0] animate-pulse shadow-[0_0_10px_#0DEDC0]" />
              <span className="text-xs font-mono font-bold text-[#0DEDC0] uppercase tracking-widest">
                PANEL DE CONTROL DIRECTIVO
              </span>
            </div>
            <H2 className="!text-2xl sm:!text-3xl font-black">Consola Operativa <Highlight>ATOM</Highlight></H2>
            <Subtitulo className="!text-xs mt-1 text-slate-400">
              Operador actual: <strong className="text-[#0DEDC0] font-mono">{adminActual}</strong>
            </Subtitulo>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            
            {/* BOTÓN DE PURGA DIRECTA (SOLO SUPER ADMIN) */}
            {esSuperAdmin && (
              <button
                onClick={purgarBaseDatosDirecta}
                className="group flex items-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/50 rounded-xl font-mono text-xs font-bold transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.3)] active:scale-95 cursor-pointer"
                title="Elimina permanentemente solicitudes y bitácora de prueba"
              >
                <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Purga Directa</span>
              </button>
            )}

            <button
              onClick={cargarTodo}
              className="group flex items-center gap-2 px-4 py-2.5 bg-[#102935]/80 hover:bg-[#0DEDC0] text-[#0DEDC0] hover:text-[#090D18] border border-[#0DEDC0]/40 rounded-xl font-mono text-xs font-bold transition-all duration-300 shadow-[0_0_15px_rgba(13,237,192,0.15)] active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Actualizar Datos</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-950/40 hover:bg-red-600/90 text-red-400 hover:text-white border border-red-500/30 rounded-xl font-mono text-xs font-bold transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.15)] active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Salir</span>
            </button>
          </div>
        </div>

        {/* SELECTOR DE PESTAÑAS */}
        <div className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-4">
          <button
            onClick={() => setTabActiva('METRICAS_GENERALES')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all duration-300 backdrop-blur-md cursor-pointer ${
              tabActiva === 'METRICAS_GENERALES' 
                ? 'bg-[#0DEDC0] text-[#090D18] shadow-[0_0_20px_rgba(13,237,192,0.4)] scale-105' 
                : 'bg-[#102935]/50 text-slate-300 hover:text-white hover:bg-[#102935] border border-white/10'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>KPIs</span>
          </button>

          <button
            onClick={() => setTabActiva('DIRECTORIO_USUARIOS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all duration-300 backdrop-blur-md cursor-pointer ${
              tabActiva === 'DIRECTORIO_USUARIOS' 
                ? 'bg-[#0DEDC0] text-[#090D18] shadow-[0_0_20px_rgba(13,237,192,0.4)] scale-105' 
                : 'bg-[#102935]/50 text-slate-300 hover:text-white hover:bg-[#102935] border border-white/10'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Accesos</span>
          </button>

          <button
            onClick={() => setTabActiva('MAPA_CALOR')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all duration-300 backdrop-blur-md cursor-pointer ${
              tabActiva === 'MAPA_CALOR' 
                ? 'bg-[#0DEDC0] text-[#090D18] shadow-[0_0_20px_rgba(13,237,192,0.4)] scale-105' 
                : 'bg-[#102935]/50 text-slate-300 hover:text-white hover:bg-[#102935] border border-white/10'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9.879z" />
            </svg>
            <span>Interacciones</span>
          </button>

          <button
            onClick={() => setTabActiva('GESTION_CANCELACIONES')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all duration-300 backdrop-blur-md relative cursor-pointer ${
              tabActiva === 'GESTION_CANCELACIONES' 
                ? 'bg-[#0DEDC0] text-[#090D18] shadow-[0_0_20px_rgba(13,237,192,0.4)] scale-105' 
                : 'bg-[#102935]/50 text-slate-300 hover:text-white hover:bg-[#102935] border border-white/10'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Cancelaciones</span>
            {conteoPendientes > 0 && (
              <span className="ml-1 bg-red-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.8)]">
                {conteoPendientes}
              </span>
            )}
          </button>

          <button
            onClick={() => setTabActiva('BITACORA')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all duration-300 backdrop-blur-md cursor-pointer ${
              tabActiva === 'BITACORA' 
                ? 'bg-amber-400 text-[#090D18] shadow-[0_0_20px_rgba(251,191,36,0.4)] scale-105' 
                : 'bg-[#102935]/50 text-slate-300 hover:text-white hover:bg-[#102935] border border-white/10'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Bitácora</span>
          </button>
        </div>

        {/* PESTAÑA 1: MÉTRICAS GENERALES */}
        {tabActiva === 'METRICAS_GENERALES' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
              
              <div className="group bg-[#090D16]/70 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-[#0DEDC0]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(13,237,192,0.15)] relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Visitas Totales Mes</span>
                  <div className="w-8 h-8 rounded-lg bg-[#0DEDC0]/10 border border-[#0DEDC0]/30 flex items-center justify-center text-[#0DEDC0]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </div>
                </div>
                <span className="text-3xl font-black text-[#0DEDC0] block mt-2 drop-shadow-[0_0_12px_rgba(13,237,192,0.4)]">0</span>
                <span className="text-[10px] text-slate-500 mt-2 block font-semibold">Sin tráfico registrado</span>
              </div>

              <div className="group bg-[#090D16]/70 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-amber-400/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(251,191,36,0.15)] relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Registros de Bodega</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m3 0h1m-4-8l-2-2m0 0l-2 2m2-2v6"/></svg>
                  </div>
                </div>
                <span className="text-3xl font-black text-amber-400 block mt-2 drop-shadow-[0_0_12px_rgba(251,191,36,0.4)]">0</span>
                <span className="text-[10px] text-slate-500 mt-2 block font-semibold">Tasa Conversión: 0%</span>
              </div>

              <div className="group bg-[#090D16]/70 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-blue-400/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(96,165,250,0.15)] relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tarjetas B2B Creadas</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-400/10 border border-blue-400/30 flex items-center justify-center text-blue-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </div>
                </div>
                <span className="text-3xl font-black text-blue-400 block mt-2 drop-shadow-[0_0_12px_rgba(96,165,250,0.4)]">0</span>
                <span className="text-[10px] text-slate-500 mt-2 block font-semibold">Vía Calculadora Avanzada</span>
              </div>

              <div className="group bg-[#090D16]/70 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-red-400/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(248,113,113,0.15)] relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Riesgo Cancelación</span>
                  <div className="w-8 h-8 rounded-lg bg-red-400/10 border border-red-400/30 flex items-center justify-center text-red-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                </div>
                <span className="text-3xl font-black text-red-400 block mt-2 drop-shadow-[0_0_12px_rgba(248,113,113,0.4)]">{conteoPendientes}</span>
                <span className="text-[10px] text-red-300 mt-2 block font-semibold">Solicitudes pendientes hoy</span>
              </div>

            </div>
          </div>
        )}

        {/* PESTAÑA 2: DIRECTORIO DE USUARIOS */}
        {tabActiva === 'DIRECTORIO_USUARIOS' && (
          <div className="bg-[#090D16]/80 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="p-5 border-b border-white/10 bg-[#102935]/40 flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#0DEDC0] font-mono uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                Gestión de Cuentas Administrativas
              </h3>
            </div>

            {cargandoAdmins ? (
              <div className="p-12 text-center text-slate-400 font-mono text-xs flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-[#0DEDC0] border-t-transparent rounded-full animate-spin" />
                <span>Cargando directorio de administradores...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead>
                    <tr className="bg-black/30 text-slate-400 font-mono text-[10px] uppercase border-b border-white/10">
                      <th className="p-4">Nombre / Correo</th>
                      <th className="p-4">Teléfono</th>
                      <th className="p-4 text-center">esAdmin</th>
                      <th className="p-4 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300 font-sans">
                    {administradores.map((admin) => {
                      const esSuperAdminTarget = admin.correo.toLowerCase() === 'info@atomsolutionsdata.com';
                      return (
                        <tr key={admin.id} className={`hover:bg-white/5 transition-colors ${esSuperAdminTarget ? 'bg-[#0DEDC0]/5' : ''}`}>
                          <td className="p-4">
                            <strong className="text-white block font-bold flex items-center gap-2">
                              {admin.nombre} 
                              {esSuperAdminTarget && (
                                <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                                  <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg>
                                  SUPER ADMIN
                                </span>
                              )}
                            </strong>
                            <span className="text-[11px] text-slate-400 font-mono block mt-0.5">{admin.correo}</span>
                          </td>
                          <td className="p-4 font-mono">{admin.telefono}</td>
                          
                          <td className="p-4 text-center">
                            <button
                              onClick={() => alternarPermisoAdmin(admin, 'esAdmin')}
                              disabled={esSuperAdminTarget}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold transition-all border cursor-pointer ${
                                esSuperAdminTarget ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 cursor-not-allowed opacity-80'
                                : admin.esAdmin ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500 hover:text-white shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                                : 'bg-black/40 text-slate-400 border-white/10 hover:bg-white/10'
                              }`}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                {admin.esAdmin 
                                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  : <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                }
                              </svg>
                              <span>{admin.esAdmin ? 'APROBADO' : 'DENEGADO'}</span>
                            </button>
                          </td>

                          <td className="p-4 text-center">
                            <button
                              onClick={() => alternarPermisoAdmin(admin, 'activo')}
                              disabled={esSuperAdminTarget}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold transition-all border cursor-pointer ${
                                esSuperAdminTarget ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 cursor-not-allowed opacity-80'
                                : admin.activo ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 hover:bg-blue-500 hover:text-white shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                                : 'bg-black/40 text-slate-400 border-white/10 hover:bg-white/10'
                              }`}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <circle cx="12" cy="12" r="9" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                              </svg>
                              <span>{admin.activo ? 'ACTIVO' : 'SUSPENDIDO'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA 3: MAPA DE CALOR */}
        {tabActiva === 'MAPA_CALOR' && (
          <div className="bg-[#090D16]/80 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 space-y-4 font-mono text-xs shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-[#0DEDC0]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Top Interacciones de Usuarios
            </h3>
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-slate-200 mb-1.5 font-bold">
                  <span>1. Botón "Descargar Tarjeta B2B (PNG)"</span>
                  <span className="text-[#0DEDC0] font-black">0%</span>
                </div>
                <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-[#0DEDC0] to-emerald-400 shadow-[0_0_12px_rgba(13,237,192,0.8)] w-[0%]" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 4: GESTIÓN DE CANCELACIONES */}
        {tabActiva === 'GESTION_CANCELACIONES' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between gap-4 bg-[#090D16]/70 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por bodega, correo o solicitante..."
                  className="bg-[#102935] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-[#0DEDC0] w-full transition-colors"
                />
                <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>

              <div className="flex flex-wrap gap-2">
                {['TODAS', 'PENDIENTE_BAJA', 'RETENIDO_DESCUENTO', 'COMPLETADO_BAJA'].map((est) => (
                  <button
                    key={est}
                    onClick={() => setFiltroEstado(est)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      filtroEstado === est 
                        ? 'bg-[#0DEDC0] text-[#090D18] shadow-[0_0_15px_rgba(13,237,192,0.3)]' 
                        : 'bg-[#102935] text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {est.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#090D16]/80 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              {cargandoDatos ? (
                <div className="p-12 text-center text-slate-400 font-mono text-xs flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-2 border-[#0DEDC0] border-t-transparent rounded-full animate-spin" />
                  <span>Cargando solicitudes de cancelación desde Bases de Datos...</span>
                </div>
              ) : solicitudesFiltradas.length === 0 ? (
                <div className="p-12 text-center text-slate-400 font-mono text-xs">No hay solicitudes registradas con ese filtro.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-sans">
                    <thead>
                      <tr className="bg-black/30 text-[#0DEDC0] font-mono text-[10px] uppercase border-b border-white/10">
                        <th className="p-4 w-12 text-center">Ver</th>
                        <th className="p-4">Bodega / Solicitante</th>
                        <th className="p-4">Retención</th>
                        <th className="p-4">Estado Actual</th>
                        <th className="p-4 text-center">Acción Operativa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {solicitudesFiltradas.map((item) => {
                        const estaAbierto = filaExpandida === item.id;
                        
                        return (
                          <React.Fragment key={item.id}>
                            <tr 
                              onClick={() => toggleFila(item.id)}
                              className={`hover:bg-[#102935]/60 transition-all cursor-pointer ${
                                estaAbierto ? 'bg-[#102935]/80 border-l-4 border-l-[#0DEDC0]' : ''
                              }`}
                            >
                              <td className="p-4 text-center">
                                <div className={`w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center transition-transform duration-300 ${estaAbierto ? 'rotate-180 bg-[#0DEDC0]/20 text-[#0DEDC0]' : 'text-slate-400'}`}>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </td>

                              <td className="p-4">
                                <strong className="text-white block font-bold text-sm">{item.cuentaAtom || 'Sin Nombre de Bodega'}</strong>
                                <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                                  {item.nombreSolicitante} · {item.correo}
                                </span>
                              </td>

                              <td className="p-4 font-mono">
                                {item.aceptoOfertaRetencion ? (
                                  <span className="inline-flex items-center gap-1.5 text-[#0DEDC0] font-bold bg-[#0DEDC0]/10 px-2.5 py-1 rounded-lg border border-[#0DEDC0]/30 shadow-[0_0_10px_rgba(13,237,192,0.1)]">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 13C10.832 19.832 8.71 18 6.5 18c-1.54 0-2.5 1-2.5 2v1h16v-1c0-1-1-2-2.5-2-2.21 0-4.332 1.832-5.5 3z"/></svg>
                                    SÍ (50% Desc)
                                  </span>
                                ) : (
                                  <span className="text-slate-500 font-semibold">NO</span>
                                )}
                              </td>

                              <td className="p-4 font-mono text-[10px]">
                                <span className={`px-2.5 py-1 rounded-lg border font-bold ${
                                  item.estado === 'RETENIDO_DESCUENTO'
                                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                                    : item.estado === 'COMPLETADO_BAJA'
                                    ? 'bg-red-500/20 text-red-400 border-red-500/40'
                                    : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                }`}>
                                  {item.estado || 'PENDIENTE_BAJA'}
                                </span>
                              </td>

                              <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                <div className="flex justify-center gap-2">
                                  <button 
                                    onClick={() => cambiarEstadoCancelacion(item, 'RETENIDO_DESCUENTO')} 
                                    className="px-3 py-1.5 rounded-lg bg-[#0DEDC0]/10 text-[#0DEDC0] text-[10px] border border-[#0DEDC0]/30 hover:bg-[#0DEDC0] hover:text-[#090D18] font-mono font-bold transition-all cursor-pointer shadow-[0_0_10px_rgba(13,237,192,0.1)] active:scale-95"
                                  >
                                    50% Desc
                                  </button>
                                  <button 
                                    onClick={() => cambiarEstadoCancelacion(item, 'COMPLETADO_BAJA')} 
                                    className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-[10px] border border-red-500/30 hover:bg-red-500 hover:text-white font-mono font-bold transition-all cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.1)] active:scale-95"
                                  >
                                    Procesar Baja
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {estaAbierto && (
                              <tr className="bg-[#080C14] border-b border-white/10">
                                <td colSpan={5} className="p-6">
                                  <div className="bg-[#0F172A]/90 border border-[#0DEDC0]/30 rounded-2xl p-6 space-y-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] font-sans">
                                    
                                    <div className="flex justify-between items-center border-b border-slate-800 pb-3 flex-wrap gap-2">
                                      <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-[#0DEDC0]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-4 0h4"/></svg>
                                        <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                                          Ficha Técnica de Cancelación · {item.cuentaAtom}
                                        </h4>
                                      </div>
                                      <span className="text-[11px] font-mono text-slate-400">
                                        Fecha Solicitud: <strong className="text-amber-400">{item.fechaSolicitud ? new Date(item.fechaSolicitud).toLocaleString('es-CO') : 'Sin Fecha'}</strong>
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                                      <div className="bg-[#102935]/50 p-3.5 rounded-xl border border-slate-800">
                                        <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Nombre Solicitante</span>
                                        <span className="text-white font-bold block truncate">{item.nombreSolicitante || 'N/A'}</span>
                                      </div>

                                      <div className="bg-[#102935]/50 p-3.5 rounded-xl border border-slate-800">
                                        <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Correo Corporativo</span>
                                        <span className="text-[#0DEDC0] font-bold block truncate">{item.correo || 'N/A'}</span>
                                      </div>

                                      <div className="bg-[#102935]/50 p-3.5 rounded-xl border border-slate-800">
                                        <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Plan Contratado</span>
                                        <span className="text-amber-400 font-bold block">{item.planActual || 'EXPERTO'}</span>
                                      </div>

                                      <div className="bg-[#102935]/50 p-3.5 rounded-xl border border-slate-800">
                                        <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Rol Proveeduría</span>
                                        <span className="text-blue-400 font-bold block">{item.rolProveeduria || 'Importador Directo'}</span>
                                      </div>
                                    </div>

                                    <div className="space-y-3 font-sans">
                                      <div>
                                        <span className="text-xs font-bold text-red-400 font-mono uppercase tracking-wider block mb-1">
                                          Motivo Declarado de la Baja:
                                        </span>
                                        <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl text-red-300 text-xs font-bold">
                                          {item.motivo || 'No especificó motivo.'}
                                        </div>
                                      </div>

                                      <div>
                                        <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider block mb-1">
                                          Observaciones / Comentarios Adicionales del Cliente:
                                        </span>
                                        <div className="p-4 bg-[#0A0E1A] border border-slate-800 rounded-xl text-slate-300 text-xs leading-relaxed italic">
                                          "{item.detalles || 'El cliente no agregó comentarios adicionales.'}"
                                        </div>
                                      </div>
                                    </div>

                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PESTAÑA 5: BITÁCORA / AUDITORÍA */}
        {tabActiva === 'BITACORA' && (
          <div className="bg-[#090D16]/80 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="p-5 border-b border-white/10 bg-amber-500/10 flex justify-between items-center">
              <h3 className="text-sm font-bold text-amber-400 font-mono uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                Bitácora de Auditoría (Logs de Sistema)
              </h3>
            </div>

            {cargandoBitacora ? (
              <div className="p-12 text-center text-slate-400 font-mono text-xs flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span>Cargando registros de auditoría...</span>
              </div>
            ) : bitacora.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-mono text-xs">Sin registros de auditoría aún.</div>
            ) : (
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead className="sticky top-0 bg-[#090D16] z-10 border-b border-white/10">
                    <tr className="text-amber-400 font-mono text-[10px] uppercase">
                      <th className="p-4">Fecha & Hora</th>
                      <th className="p-4">Administrador</th>
                      <th className="p-4">Módulo</th>
                      <th className="p-4">Acción Realizada</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {bitacora.map((log) => {
                      const fechaFormat = new Date(log.fechaISO).toLocaleString('es-CO', { 
                        day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' 
                      });
                      return (
                        <tr key={log.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono text-[11px] text-slate-400">{fechaFormat}</td>
                          <td className="p-4 font-bold text-white font-mono">{log.adminEmail}</td>
                          <td className="p-4 font-mono text-[10px]">
                            <span className="bg-black/40 border border-white/10 px-2.5 py-1 rounded text-amber-300">
                              {log.modulo}
                            </span>
                          </td>
                          <td className="p-4 text-[11px] text-slate-300 font-mono">{log.accion}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}