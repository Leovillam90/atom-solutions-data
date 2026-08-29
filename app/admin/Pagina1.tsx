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

interface Pagina1Props {
  onLogout?: () => void;
}

export default function Pagina1({ onLogout }: Pagina1Props) {
  const [tabActiva, setTabActiva] = useState<TabAdmin>('METRICAS_GENERALES');
  const [adminActual, setAdminActual] = useState<string>('Sistema');
  
  const [solicitudes, setSolicitudes] = useState<SolicitudBaja[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState<boolean>(true);
  const [filtroEstado, setFiltroEstado] = useState<string>('TODAS');
  const [busqueda, setBusqueda] = useState<string>('');
  
  const [administradores, setAdministradores] = useState<Administrador[]>([]);
  const [cargandoAdmins, setCargandoAdmins] = useState<boolean>(false);

  const [bitacora, setBitacora] = useState<RegistroBitacora[]>([]);
  const [cargandoBitacora, setCargandoBitacora] = useState<boolean>(false);

  const esSuperAdmin = useMemo(() => {
    return adminActual.trim().toLowerCase() === 'info@atomsolutionsdata.com';
  }, [adminActual]);

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
    const nuevoRegistro = { adminEmail: adminActual, modulo, accion: accionTexto, fechaISO };
    try {
      const docRef = await addDoc(collection(db, 'bitacora_auditoria'), nuevoRegistro);
      setBitacora((prev) => [{ id: docRef.id, ...nuevoRegistro }, ...prev]);
    } catch (e) {
      console.error('Error guardando en bitácora:', e);
    }
  }, [adminActual]);

  const purgarBaseDatosDirecta = useCallback(async () => {
    if (!esSuperAdmin) {
      alert('⛔ ACCESO RESTRINGIDO: Exclusivo para Super Admin.');
      return;
    }
    if (!confirm('⚠️ ¿ESTÁS SEGURO DE PURGAR LA BASE DE DATOS?')) return;

    setCargandoDatos(true);
    setCargandoBitacora(true);
    try {
      const snapSolicitudes = await getDocs(collection(db, 'solicitudes_baja'));
      await Promise.all(snapSolicitudes.docs.map((d) => deleteDoc(doc(db, 'solicitudes_baja', d.id))));

      const snapBitacora = await getDocs(collection(db, 'bitacora_auditoria'));
      await Promise.all(snapBitacora.docs.map((d) => deleteDoc(doc(db, 'bitacora_auditoria', d.id))));

      setSolicitudes([]);
      setBitacora([]);
      alert('✅ Purga completada.');
      cargarTodo();
    } catch (error) {
      alert('❌ Error al purgar la base de datos.');
    } finally {
      setCargandoDatos(false);
      setCargandoBitacora(false);
    }
  }, [esSuperAdmin, cargarTodo]);

  const cambiarEstadoCancelacion = useCallback(async (item: SolicitudBaja, nuevoEstado: SolicitudBaja['estado']) => {
    try {
      const docRef = doc(db, 'solicitudes_baja', item.id);
      await updateDoc(docRef, { estado: nuevoEstado });
      setSolicitudes((prev) => prev.map((s) => (s.id === item.id ? { ...s, estado: nuevoEstado } : s)));
      await registrarAccionEnBitacora('CANCELACIONES', `Cambió estado a [${nuevoEstado}] en bodega: ${item.cuentaAtom}`);
    } catch (error) {
      alert('No se pudo actualizar el estado.');
    }
  }, [registrarAccionEnBitacora]);

  const alternarPermisoAdmin = useCallback(async (adminTarget: Administrador, campo: 'esAdmin' | 'activo') => {
    if (adminTarget.correo.toLowerCase() === 'info@atomsolutionsdata.com') {
      alert('⛔ No puedes modificar al Super Administrador.');
      return;
    }
    const nuevoValor = !adminTarget[campo];
    try {
      const docRef = doc(db, 'Administradores', adminTarget.id);
      await updateDoc(docRef, { [campo]: nuevoValor });
      setAdministradores((prev) => prev.map((a) => (a.id === adminTarget.id ? { ...a, [campo]: nuevoValor } : a)));
      await registrarAccionEnBitacora('DIRECTORIO', `${nuevoValor ? 'HABILITÓ' : 'REVOCÓ'} ${campo} para: ${adminTarget.correo}`);
    } catch (error) {
      alert('Error al modificar permisos.');
    }
  }, [registrarAccionEnBitacora]);

  const handleCerrarSesion = () => {
    if (onLogout) {
      onLogout();
    } else {
      sessionStorage.removeItem('atom_admin_session');
      window.location.reload();
    }
  };

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
    <div className="space-y-6 text-white font-sans">
      
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6 bg-[#090D16]/70 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#0DEDC0] animate-pulse shadow-[0_0_10px_#0DEDC0]" />
            <span className="text-xs font-mono font-bold text-[#0DEDC0] uppercase tracking-widest">
              PANEL DE CONTROL DIRECTIVO
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">Consola Operativa <span className="text-[#0DEDC0]">ATOM</span></h2>
          <p className="text-xs mt-1 text-slate-400 font-mono">
            Operador actual: <strong className="text-[#0DEDC0]">{adminActual}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {esSuperAdmin && (
            <button
              onClick={purgarBaseDatosDirecta}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/50 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer"
            >
              Purga Directa
            </button>
          )}

          <button
            onClick={cargarTodo}
            className="px-4 py-2 bg-[#102935] hover:bg-[#0DEDC0] text-[#0DEDC0] hover:text-[#090D18] border border-[#0DEDC0]/40 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer"
          >
            Actualizar Datos
          </button>

          <button
            onClick={handleCerrarSesion}
            className="px-4 py-2 bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer"
          >
            Salir
          </button>
        </div>
      </div>

      {/* PESTAÑAS INTERNAS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setTabActiva('METRICAS_GENERALES')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
            tabActiva === 'METRICAS_GENERALES' ? 'bg-[#0DEDC0] text-[#090D18]' : 'bg-[#102935]/50 text-slate-300'
          }`}
        >
          KPIs
        </button>
        <button
          onClick={() => setTabActiva('DIRECTORIO_USUARIOS')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
            tabActiva === 'DIRECTORIO_USUARIOS' ? 'bg-[#0DEDC0] text-[#090D18]' : 'bg-[#102935]/50 text-slate-300'
          }`}
        >
          Accesos
        </button>
        <button
          onClick={() => setTabActiva('MAPA_CALOR')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
            tabActiva === 'MAPA_CALOR' ? 'bg-[#0DEDC0] text-[#090D18]' : 'bg-[#102935]/50 text-slate-300'
          }`}
        >
          Interacciones
        </button>
        <button
          onClick={() => setTabActiva('GESTION_CANCELACIONES')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
            tabActiva === 'GESTION_CANCELACIONES' ? 'bg-[#0DEDC0] text-[#090D18]' : 'bg-[#102935]/50 text-slate-300'
          }`}
        >
          Cancelaciones ({conteoPendientes})
        </button>
        <button
          onClick={() => setTabActiva('BITACORA')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer ${
            tabActiva === 'BITACORA' ? 'bg-amber-400 text-[#090D18]' : 'bg-[#102935]/50 text-slate-300'
          }`}
        >
          Bitácora
        </button>
      </div>

      {/* KPIS */}
      {tabActiva === 'METRICAS_GENERALES' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="bg-[#090D16]/80 p-6 rounded-2xl border border-white/10">
            <span className="text-xs text-slate-400 block uppercase font-bold">Visitas Totales</span>
            <span className="text-3xl font-black text-[#0DEDC0] block mt-2">0</span>
          </div>
          <div className="bg-[#090D16]/80 p-6 rounded-2xl border border-white/10">
            <span className="text-xs text-slate-400 block uppercase font-bold">Registros Bodega</span>
            <span className="text-3xl font-black text-amber-400 block mt-2">0</span>
          </div>
          <div className="bg-[#090D16]/80 p-6 rounded-2xl border border-white/10">
            <span className="text-xs text-slate-400 block uppercase font-bold">Tarjetas B2B</span>
            <span className="text-3xl font-black text-blue-400 block mt-2">0</span>
          </div>
          <div className="bg-[#090D16]/80 p-6 rounded-2xl border border-white/10">
            <span className="text-xs text-slate-400 block uppercase font-bold">Riesgo Cancelación</span>
            <span className="text-3xl font-black text-red-400 block mt-2">{conteoPendientes}</span>
          </div>
        </div>
      )}

      {/* ACCESOS */}
      {tabActiva === 'DIRECTORIO_USUARIOS' && (
        <div className="bg-[#090D16]/80 rounded-3xl border border-white/10 p-6">
          <h3 className="text-sm font-bold text-[#0DEDC0] font-mono uppercase mb-4">Cuentas Administrativas</h3>
          {cargandoAdmins ? (
            <div className="p-8 text-center text-slate-400 font-mono text-xs">Cargando cuentas...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-black/40 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="p-4">Nombre / Correo</th>
                    <th className="p-4">Teléfono</th>
                    <th className="p-4 text-center">esAdmin</th>
                    <th className="p-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {administradores.map((admin) => (
                    <tr key={admin.id} className="hover:bg-white/5">
                      <td className="p-4 font-bold">{admin.nombre} <span className="block text-[10px] text-slate-400 font-normal">{admin.correo}</span></td>
                      <td className="p-4 font-mono">{admin.telefono}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => alternarPermisoAdmin(admin, 'esAdmin')} className="px-3 py-1 rounded bg-[#102935] text-xs font-mono font-bold cursor-pointer">
                          {admin.esAdmin ? 'APROBADO' : 'DENEGADO'}
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => alternarPermisoAdmin(admin, 'activo')} className="px-3 py-1 rounded bg-[#102935] text-xs font-mono font-bold cursor-pointer">
                          {admin.activo ? 'ACTIVO' : 'SUSPENDIDO'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MAPA DE CALOR */}
      {tabActiva === 'MAPA_CALOR' && (
        <div className="bg-[#090D16]/80 p-6 rounded-3xl border border-white/10 text-xs font-mono space-y-2">
          <h3 className="text-base font-black text-white">Interacciones de Usuarios</h3>
          <p className="text-slate-400">Módulo de métricas de mapas de calor activo.</p>
        </div>
      )}

      {/* CANCELACIONES */}
      {tabActiva === 'GESTION_CANCELACIONES' && (
        <div className="bg-[#090D16]/80 rounded-3xl border border-white/10 p-6">
          <h3 className="text-sm font-bold text-[#0DEDC0] font-mono uppercase mb-4">Gestión de Bajas</h3>
          {cargandoDatos ? (
            <div className="p-8 text-center text-slate-400 font-mono text-xs">Cargando cancelaciones...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-black/40 text-[#0DEDC0] font-mono text-[10px] uppercase">
                    <th className="p-4">Bodega / Solicitante</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {solicitudesFiltradas.map((item) => (
                    <tr key={item.id} className="hover:bg-[#102935]/60">
                      <td className="p-4 font-bold">{item.cuentaAtom} <span className="block text-[10px] text-slate-400">{item.nombreSolicitante}</span></td>
                      <td className="p-4 font-mono text-[10px]">{item.estado || 'PENDIENTE_BAJA'}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => cambiarEstadoCancelacion(item, 'RETENIDO_DESCUENTO')} className="px-2.5 py-1 bg-[#0DEDC0]/10 text-[#0DEDC0] rounded mr-2 font-mono text-[10px] font-bold cursor-pointer">50% Desc</button>
                        <button onClick={() => cambiarEstadoCancelacion(item, 'COMPLETADO_BAJA')} className="px-2.5 py-1 bg-red-500/10 text-red-400 rounded font-mono text-[10px] font-bold cursor-pointer">Procesar Baja</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* BITÁCORA */}
      {tabActiva === 'BITACORA' && (
        <div className="bg-[#090D16]/80 rounded-3xl border border-white/10 p-6 font-mono text-xs space-y-4">
          <h3 className="text-sm font-bold text-amber-400 uppercase">Bitácora de Auditoría</h3>
          {cargandoBitacora ? (
            <div className="text-slate-400">Cargando historial...</div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {bitacora.map((log) => (
                <div key={log.id} className="p-3 bg-black/40 rounded border border-white/5 flex justify-between">
                  <span>[{new Date(log.fechaISO).toLocaleTimeString('es-CO')}] <strong className="text-white">{log.adminEmail}</strong>: {log.accion}</span>
                  <span className="text-amber-400 text-[10px]">{log.modulo}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}