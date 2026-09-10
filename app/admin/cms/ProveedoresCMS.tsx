'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Search, 
  Plus, 
  Trash2, 
  Download, 
  RotateCcw, 
  Check, 
  X, 
  Globe, 
  Hash, 
  ArrowUp, 
  ArrowDown, 
  SlidersHorizontal,
  CheckCircle2,
  FileCode
} from 'lucide-react';
import { 
  ProveedorData, 
  PROVEEDORES_INICIALES, 
  PAISES_CATALOGO, 
  ICONOS_MAP 
} from '@/app/landing/Seccion6';

const STORAGE_KEY = 'atom_proveedores_config';

export default function ProveedoresCMS() {
  const [proveedores, setProveedores] = useState<ProveedorData[]>(PROVEEDORES_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [seleccionadoId, setSeleccionadoId] = useState<string>('');
  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState<string | null>(null);

  // Formulario para nuevo proveedor
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoStand, setNuevoStand] = useState('Stand Pendiente');
  const [nuevosPaises, setNuevosPaises] = useState<string[]>(['co']);
  const [nuevoIcono, setNuevoIcono] = useState<string>('Sparkles');

  // Cargar datos
  const cargarDatos = useCallback(() => {
    const datosGuardados = localStorage.getItem(STORAGE_KEY);
    if (datosGuardados) {
      try {
        const parsed = JSON.parse(datosGuardados);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProveedores(parsed);
          setSeleccionadoId(parsed[0].id);
          return;
        }
      } catch (e) {
        console.error("Error al cargar proveedores en CMS:", e);
      }
    }
    setProveedores(PROVEEDORES_INICIALES);
    setSeleccionadoId(PROVEEDORES_INICIALES[0].id);
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const mostrarNotificacion = (mensaje: string) => {
    setNotificacion(mensaje);
    setTimeout(() => setNotificacion(null), 3000);
  };

  // Guardar en LocalStorage y notificar cambios
  const guardarEnStorage = (nuevosDatos: ProveedorData[], msj = 'Cambios guardados con éxito') => {
    setProveedores(nuevosDatos);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevosDatos));
    window.dispatchEvent(new Event('atom_proveedores_updated'));
    mostrarNotificacion(msj);
  };

  const proveedorSeleccionado = proveedores.find(p => p.id === seleccionadoId) || proveedores[0];

  // Modificar campo de proveedor
  const actualizarProveedorActual = (campo: keyof ProveedorData, valor: any) => {
    if (!proveedorSeleccionado) return;
    const actualizados = proveedores.map(p => {
      if (p.id === proveedorSeleccionado.id) {
        return { ...p, [campo]: valor };
      }
      return p;
    });
    guardarEnStorage(actualizados, `Actualizado: ${proveedorSeleccionado.nombre}`);
  };

  // Toggle de país para el proveedor actual
  const togglePaisProveedor = (codePais: string) => {
    if (!proveedorSeleccionado) return;
    const yaExiste = proveedorSeleccionado.paisesActivos.includes(codePais);
    let nuevosPaises = yaExiste
      ? proveedorSeleccionado.paisesActivos.filter(c => c !== codePais)
      : [...proveedorSeleccionado.paisesActivos, codePais];

    if (nuevosPaises.length === 0) nuevosPaises = [codePais];
    actualizarProveedorActual('paisesActivos', nuevosPaises);
  };

  // Crear nuevo proveedor
  const crearProveedor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return;

    const nuevoObj: ProveedorData = {
      id: `prov-${Date.now()}`,
      nombre: nuevoNombre.trim(),
      stand: nuevoStand.trim() || 'Stand Pendiente',
      paisesActivos: nuevosPaises.length > 0 ? nuevosPaises : ['co'],
      iconoName: nuevoIcono
    };

    const actualizados = [nuevoObj, ...proveedores];
    guardarEnStorage(actualizados, `¡Marca "${nuevoObj.nombre}" creada con éxito!`);
    
    // Reset
    setNuevoNombre('');
    setNuevoStand('Stand Pendiente');
    setNuevosPaises(['co']);
    setNuevoIcono('Sparkles');
    setModalNuevoAbierto(false);
    setSeleccionadoId(nuevoObj.id);
  };

  // Eliminar proveedor
  const eliminarProveedor = (id: string, nombre: string) => {
    if (confirm(`¿Estás seguro de eliminar a "${nombre}"?`)) {
      const actualizados = proveedores.filter(p => p.id !== id);
      guardarEnStorage(actualizados, `Proveedor "${nombre}" eliminado`);
      if (actualizados.length > 0) {
        setSeleccionadoId(actualizados[0].id);
      }
    }
  };

  // Reordenar
  const moverProveedor = (index: number, direccion: 'arriba' | 'abajo') => {
    const nuevoIndex = direccion === 'arriba' ? index - 1 : index + 1;
    if (nuevoIndex < 0 || nuevoIndex >= proveedores.length) return;

    const copia = [...proveedores];
    const temp = copia[index];
    copia[index] = copia[nuevoIndex];
    copia[nuevoIndex] = temp;

    guardarEnStorage(copia, 'Orden de lista actualizado');
  };

  // Restaurar por defecto
  const restaurarOriginales = () => {
    if (confirm('¿Deseas restaurar la lista a sus valores iniciales de fábrica?')) {
      guardarEnStorage(PROVEEDORES_INICIALES, 'Se reestableció la lista inicial');
      setSeleccionadoId(PROVEEDORES_INICIALES[0].id);
    }
  };

  // 📥 EXPORTAR VARIABLE COMPLETA EN SINTAXIS TYPESCRIPT
  const exportarCodigoTS = () => {
    const lineas = proveedores.map(p => {
      const paisesStr = JSON.stringify(p.paisesActivos).replace(/"/g, "'");
      const nombreEscapado = p.nombre.replace(/'/g, "\\'");
      const standEscapado = p.stand.replace(/'/g, "\\'");
      return `  { id: '${p.id}', nombre: '${nombreEscapado}', stand: '${standEscapado}', paisesActivos: ${paisesStr}, iconoName: '${p.iconoName}' }`;
    });

    const contenidoTS = `export const PROVEEDORES_INICIALES: ProveedorData[] = [\n${lineas.join(',\n')}\n];\n`;

    const blob = new Blob([contenidoTS], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PROVEEDORES_INICIALES.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    mostrarNotificacion('Código PROVEEDORES_INICIALES exportado');
  };

  const proveedoresFiltrados = proveedores.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.stand.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050811] text-white p-4 sm:p-8 font-sans relative selection:bg-[#0DEDC0] selection:text-[#050811]">
      
      {/* NOTIFICACIÓN FLOTANTE */}
      <AnimatePresence>
        {notificacion && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[100000] bg-[#09101D] border-2 border-[#0DEDC0] text-[#0DEDC0] px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(13,237,192,0.4)] font-mono text-xs font-black flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{notificacion}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ENCABEZADO Y ACCIONES PRINCIPALES */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-[#0DEDC0] uppercase tracking-widest flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> ATOM DATA CMS · GESTOR MAESTRO
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
              Proveedores <span className="text-[#0DEDC0]">Sección 6</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setModalNuevoAbierto(true)}
              className="px-4 py-3 bg-[#0DEDC0] text-[#050811] font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(13,237,192,0.4)] hover:bg-white transition-all cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Nuevo Proveedor</span>
            </button>

            <button
              type="button"
              onClick={exportarCodigoTS}
              className="px-4 py-3 bg-[#09101D] border border-[#0DEDC0]/60 text-[#0DEDC0] hover:bg-[#0DEDC0] hover:text-[#050811] font-mono font-bold text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_15px_rgba(13,237,192,0.15)]"
            >
              <FileCode className="w-4 h-4" />
              <span>Exportar Código TS</span>
            </button>

            <button
              type="button"
              onClick={restaurarOriginales}
              className="p-3 bg-[#09101D] border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all cursor-pointer"
              title="Restaurar de fábrica"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* LAYOUT PRINCIPAL CMS (2 COLUMNAS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: LISTA Y BUSCADOR (5 COLS) */}
          <div className="lg:col-span-5 bg-[#080E18]/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar proveedor o stand..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-[#050811] border border-slate-800 focus:border-[#0DEDC0] text-white text-xs font-mono rounded-2xl pl-11 pr-4 py-3 outline-none transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1 pt-1">
              <span>LISTADO DE MARCAS</span>
              <span className="text-[#0DEDC0] font-black">{proveedoresFiltrados.length} DE {proveedores.length}</span>
            </div>

            {/* LISTA */}
            <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#0DEDC0]/30">
              {proveedoresFiltrados.map((prov, index) => {
                const esSeleccionado = prov.id === proveedorSeleccionado?.id;
                const IconoComp = ICONOS_MAP[prov.iconoName] || Building2;

                return (
                  <div
                    key={prov.id}
                    onClick={() => setSeleccionadoId(prov.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      esSeleccionado
                        ? 'bg-[#0DEDC0]/15 border-[#0DEDC0] shadow-[0_0_20px_rgba(13,237,192,0.25)]'
                        : 'bg-[#050811]/60 border-slate-800/80 hover:border-slate-700 hover:bg-[#080E18]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-xl border shrink-0 ${
                        esSeleccionado ? 'bg-[#0DEDC0] text-[#050811] border-[#0DEDC0]' : 'bg-[#09101D] text-[#0DEDC0] border-slate-800'
                      }`}>
                        <IconoComp className="w-4 h-4" />
                      </div>

                      <div className="truncate text-left">
                        <h4 className="text-xs font-black uppercase text-white truncate">{prov.nombre}</h4>
                        <span className="text-[10px] font-mono text-slate-400 block">{prov.stand}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); moverProveedor(index, 'arriba'); }}
                        disabled={index === 0}
                        className="p-1 text-slate-500 hover:text-[#0DEDC0] disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); moverProveedor(index, 'abajo'); }}
                        disabled={index === proveedores.length - 1}
                        className="p-1 text-slate-500 hover:text-[#0DEDC0] disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMNA DERECHA: EDITOR DEL PROVEEDOR SELECCIONADO (7 COLS) */}
          {proveedorSeleccionado && (
            <div className="lg:col-span-7 bg-[#080E18]/90 border-2 border-[#0DEDC0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(13,237,192,0.15)] text-left relative">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#0DEDC0] uppercase tracking-widest block">
                    EDITOR EN TIEMPO REAL
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase">
                    {proveedorSeleccionado.nombre}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => eliminarProveedor(proveedorSeleccionado.id, proveedorSeleccionado.nombre)}
                  className="px-3 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white text-xs font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar</span>
                </button>
              </div>

              {/* CAMPOS DE FORMULARIO */}
              <div className="space-y-5">
                {/* NOMBRE */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">
                    Nombre del Proveedor / Marca
                  </label>
                  <input
                    type="text"
                    value={proveedorSeleccionado.nombre}
                    onChange={(e) => actualizarProveedorActual('nombre', e.target.value)}
                    className="w-full bg-[#050811] border-2 border-slate-800 focus:border-[#0DEDC0] text-white text-sm font-mono rounded-2xl px-4 py-3 outline-none transition-all"
                  />
                </div>

                {/* STAND */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">
                    Ubicación Stand
                  </label>
                  <input
                    type="text"
                    value={proveedorSeleccionado.stand}
                    onChange={(e) => actualizarProveedorActual('stand', e.target.value)}
                    placeholder="Ej: Stand #123 - 124"
                    className="w-full bg-[#050811] border-2 border-slate-800 focus:border-[#0DEDC0] text-white text-sm font-mono rounded-2xl px-4 py-3 outline-none transition-all"
                  />
                </div>

                {/* SELECCIÓN DE ÍCONO */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">
                    Ícono Representativo
                  </label>
                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-36 overflow-y-auto p-2 bg-[#050811] border border-slate-800 rounded-2xl scrollbar-thin scrollbar-thumb-[#0DEDC0]/30">
                    {Object.keys(ICONOS_MAP).map((iconKey) => {
                      const IconComp = ICONOS_MAP[iconKey];
                      const seleccionado = proveedorSeleccionado.iconoName === iconKey;
                      return (
                        <button
                          key={iconKey}
                          type="button"
                          onClick={() => actualizarProveedorActual('iconoName', iconKey)}
                          className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                            seleccionado
                              ? 'bg-[#0DEDC0] text-[#050811] border-[#0DEDC0] shadow-[0_0_10px_#0DEDC0]'
                              : 'bg-[#09101D] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                          }`}
                          title={iconKey}
                        >
                          <IconComp className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ACTIVACIÓN DE PAÍSES */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#0DEDC0]" /> Países de Operación Habilitados
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto p-2 bg-[#050811] border border-slate-800 rounded-2xl scrollbar-thin scrollbar-thumb-[#0DEDC0]/30">
                    {Object.values(PAISES_CATALOGO).map((pais) => {
                      const activo = proveedorSeleccionado.paisesActivos.includes(pais.code);
                      return (
                        <button
                          key={pais.code}
                          type="button"
                          onClick={() => togglePaisProveedor(pais.code)}
                          className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            activo
                              ? 'bg-[#0DEDC0]/15 border-[#0DEDC0] text-white shadow-[0_0_12px_rgba(13,237,192,0.2)]'
                              : 'bg-[#09101D] border-slate-800 text-slate-500 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={`https://flagcdn.com/${pais.code}.svg`}
                              alt={pais.nombre}
                              className="w-5 h-3.5 object-cover rounded shadow"
                            />
                            <span className="text-xs font-mono font-bold">{pais.nombre}</span>
                          </div>
                          {activo ? <Check className="w-4 h-4 text-[#0DEDC0]" /> : <Plus className="w-4 h-4 text-slate-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* MODAL NUEVO PROVEEDOR */}
      <AnimatePresence>
        {modalNuevoAbierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100001] bg-[#050811]/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#09101D] border-2 border-[#0DEDC0] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_50px_rgba(13,237,192,0.3)] space-y-5 text-left relative"
            >
              <button
                type="button"
                onClick={() => setModalNuevoAbierto(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#0DEDC0] uppercase tracking-widest block">
                  NUEVO REGISTRO
                </span>
                <h3 className="text-xl font-black text-white uppercase">
                  Agregar Proveedor
                </h3>
              </div>

              <form onSubmit={crearProveedor} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                    Nombre Marca / Proveedor
                  </label>
                  <input
                    type="text"
                    required
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    placeholder="Ej: Nueva Proveeduría"
                    className="w-full bg-[#050811] border-2 border-slate-800 focus:border-[#0DEDC0] text-white text-xs font-mono rounded-xl px-4 py-3 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                    Ubicación Stand
                  </label>
                  <input
                    type="text"
                    value={nuevoStand}
                    onChange={(e) => setNuevoStand(e.target.value)}
                    placeholder="Stand #100 o Stand Pendiente"
                    className="w-full bg-[#050811] border-2 border-slate-800 focus:border-[#0DEDC0] text-white text-xs font-mono rounded-xl px-4 py-3 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#0DEDC0] text-[#050811] font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(13,237,192,0.4)] hover:bg-white transition-all cursor-pointer mt-2"
                >
                  REGISTRAR PROVEEDOR
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}