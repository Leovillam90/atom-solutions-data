'use client';

import React, { useState, useMemo } from 'react';
import Fondos, { TipoFondo } from '@/app/complementos/Fondos';
import { Kicker, H2, Subtitulo, Highlight } from '@/app/complementos/Tipografia';

export interface FAQItem {
  id: string;
  categoria: 'Integración' | 'Inventario' | 'Auditoría Financiera' | 'Automatización' | 'Planes y Facturación';
  pregunta: string;
  respuesta: string;
}

export const FAQS_OFICIALES: FAQItem[] = [
  // Categoría 1: Integración & Conectividad
  {
    id: '1',
    categoria: 'Integración',
    pregunta: '¿Cómo integro mi cuenta de Dropi con ATOM?',
    respuesta: 'En menos de 5 minutos. Conectas tus credenciales API desde el panel de ATOM y el sistema sincroniza automáticamente tu inventario, catálogo y el historial de guías en tiempo real.',
  },
  {
    id: '2',
    categoria: 'Integración',
    pregunta: '¿Cuánto tarda el sistema en mostrar mis datos después de conectarme?',
    respuesta: 'Es casi inmediato. Una vez enlazada la API, ATOM procesa tu historial y en pocos minutos genera la primera radiografía de auditabilidad y fugas de capital.',
  },
  {
    id: '3',
    categoria: 'Integración',
    pregunta: '¿ATOM sirve para dropshippers sin stock propio?',
    respuesta: 'No. ATOM es un centro de mando y escudo financiero diseñado exclusivamente para proveedores, fabricantes, importadores y bodegas con inventario propio.',
  },
  {
    id: '4',
    categoria: 'Integración',
    pregunta: '¿Funciona solo con Dropi o puedo conectar otros canales?',
    respuesta: 'Es totalmente omnicanal. Centraliza la operación de Dropi, Véndelo, Shopify y tus puntos de venta o bodegas físicas en una sola pantalla.',
  },
  {
    id: '5',
    categoria: 'Integración',
    pregunta: '¿Necesito conocimientos técnicos o un programador para usar ATOM?',
    respuesta: 'Ninguno. Es una plataforma 100% Plug & Play, diseñada con interfaz intuitiva para que el equipo operativo o gerencial tome el control sin tocar una sola línea de código.',
  },

  // Categoría 2: ATOM STOCK y Control de Inventario
  {
    id: '6',
    categoria: 'Inventario',
    pregunta: '¿Qué es exactamente ATOM STOCK?',
    respuesta: 'Es el motor de gestión de inventario multibodega que automatiza despachos, sincroniza existencias en tiempo real y evita sobreventas en todos tus canales.',
  },
  {
    id: '7',
    categoria: 'Inventario',
    pregunta: '¿Puedo manejar múltiples bodegas y sedes físicas?',
    respuesta: 'Sí. Ofrece control total multibodega para segmentar tu stock por ubicaciones geográficas, bodegas centrales y sedes físicas con trazabilidad exacta por unidad.',
  },
  {
    id: '8',
    categoria: 'Inventario',
    pregunta: '¿El stock se descuenta en automático en Dropi al vender por otro canal?',
    respuesta: 'Correcto. Si vendes un producto en tu punto físico o Shopify, ATOM actualiza las existencias en Dropi automáticamente para evitar vender inventario inexistente.',
  },
  {
    id: '9',
    categoria: 'Inventario',
    pregunta: '¿Puedo crear usuarios para mis empleados con permisos limitados?',
    respuesta: 'Sí. Cuenta con gestión granular de roles (Administradores, Operadores de Bodega, Vendedores), protegiendo la confidencialidad de tu data financiera.',
  },
  {
    id: '10',
    categoria: 'Inventario',
    pregunta: '¿Cómo aparezco en el Directorio de Proveedores Élite?',
    respuesta: 'Es un beneficio exclusivo para bodegas activas. Destacamos tus métricas de efectividad de despacho para que los súper-afiliados elijan comercializar tu catálogo.',
  },

  // Categoría 3: Auditoría Financiera y Fugas de Dinero
  {
    id: '11',
    categoria: 'Auditoría Financiera',
    pregunta: '¿Qué es una "devolución fantasma"?',
    respuesta: 'Mercancía que la transportadora cobra y reporta como "devuelta", pero que jamás reingresa físicamente a tu bodega. Capital perdido si no se audita en tiempo real.',
  },
  {
    id: '12',
    categoria: 'Auditoría Financiera',
    pregunta: '¿Cómo recupero el dinero de las guías estancadas o pérdidas?',
    respuesta: 'ATOM cruza el estado de cada guía y genera un reporte de inconsistencias irrefutable para exigir la restitución inmediata de capital a la transportadora.',
  },
  {
    id: '13',
    categoria: 'Auditoría Financiera',
    pregunta: '¿La plataforma calcula mi utilidad real por producto?',
    respuesta: 'Sí. Deduce fletes, devoluciones acumuladas y costos de producción para mostrar el margen neto real por SKU, identificando qué productos generan ganancia y cuáles absorben caja.',
  },
  {
    id: '14',
    categoria: 'Auditoría Financiera',
    pregunta: '¿Puedo evaluar el rendimiento de cada transportadora?',
    respuesta: 'Por supuesto. Obtienes un ranking de eficiencia por transportadora que mide tiempos de entrega, tasa de devoluciones y promedio de pérdidas para optimizar la asignación de envíos.',
  },
  {
    id: '15',
    categoria: 'Auditoría Financiera',
    pregunta: '¿ATOM realiza el cobro directamente a la transportadora?',
    respuesta: 'ATOM genera la evidencia analítica irrefutable (data de reclamo). Tu equipo la presenta formalmente a la transportadora para asegurar la acreditación directa en tus cuentas.',
  },

  // Categoría 4: Automatización Operativa y Novedades
  {
    id: '16',
    categoria: 'Automatización',
    pregunta: '¿Cómo automatiza ATOM el seguimiento de novedades?',
    respuesta: 'El sistema detecta guías estancadas y activa alertas o acciones programadas para resolver la novedad antes de que la transportadora declare el pedido como devolución.',
  },
  {
    id: '17',
    categoria: 'Automatización',
    pregunta: '¿Cómo funciona la gestión masiva de guías?',
    respuesta: 'Te permite seleccionar cientos de pedidos retenidos o con novedades y actualizar sus instrucciones de entrega o estado en bloque en solo dos clics.',
  },
  {
    id: '18',
    categoria: 'Automatización',
    pregunta: '¿Cómo mido la efectividad de los dropshippers que venden mi catálogo?',
    respuesta: 'Con el Score de Vendedores. Identificas quiénes tienen alta tasa de entrega efectiva para priorizarles stock y limitar a los vendedores que generan volumen alto de devoluciones.',
  },
  {
    id: '19',
    categoria: 'Automatización',
    pregunta: '¿Qué ocurre si un dropshipper registra altas tasas de devolución?',
    respuesta: 'Detectas patrones de mala gestión o pedidos falsos a tiempo, lo que te permite pausar el despacho a ese vendedor y frenar el desangre en fletes de ida y regreso.',
  },
  {
    id: '20',
    categoria: 'Automatización',
    pregunta: '¿Esta automatización beneficia mi calificación dentro de Dropi?',
    respuesta: 'Sí. Al acelerar la solución de novedades y reducir devoluciones, los tiempos promedio de entrega mejoran, elevando la reputación de tu bodega frente a la red de afiliados.',
  },

  // Categoría 5: Planes, Pagos y Facturación DIAN
  {
    id: '21',
    categoria: 'Planes y Facturación',
    pregunta: '¿Cómo se integra la facturación electrónica DIAN con ATOM?',
    respuesta: 'Genera reportes consolidados y archivos planos estructurados según la normativa DIAN, preparando tu operación para la facturación directa y automática de ventas e intermediaciones.',
  },
  {
    id: '22',
    categoria: 'Planes y Facturación',
    pregunta: '¿Qué distingue al plan CONTROL frente a los demás?',
    respuesta: 'Es la versión full suite para bodegas de alto volumen: incluye automatización masiva de novedades, soporte dedicado 1:1, multibodega avanzada y auditoría financiera sin restricciones.',
  },
  {
    id: '23',
    categoria: 'Planes y Facturación',
    pregunta: '¿Puedo actualizar o cambiar de plan en cualquier momento?',
    respuesta: 'Sí. Puedes iniciar en un plan base y migrar a un nivel superior desde tu panel en cualquier momento a medida que escala tu volumen de despachos.',
  },
  {
    id: '24',
    categoria: 'Planes y Facturación',
    pregunta: '¿Es segura la conexión mediante API y el manejo de credenciales?',
    respuesta: 'Completamente. ATOM implementa encriptación de grado bancario y opera bajo protocolos de auditoría de solo lectura y gestión autorizada, garantizando privacidad absoluta.',
  },
  {
    id: '25',
    categoria: 'Planes y Facturación',
    pregunta: '¿Existen cláusulas de permanencia o contratos forzosos?',
    respuesta: 'Ninguna. Opera bajo suscripción SaaS mensual o anual sin amarres. Te mantienes en la plataforma por la rentabilidad que recuperas mes a mes.',
  },
];

interface Seccion2Props {
  variante?: TipoFondo;
}

export default function Seccion2({ variante = 'gridCyber' }: Seccion2Props) {
  const [categoriaActiva, setCategoriaActiva] = useState<string>('Todas');
  const [busqueda, setBusqueda] = useState<string>('');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const categorias = [
    'Todas',
    'Integración',
    'Inventario',
    'Auditoría Financiera',
    'Automatización',
    'Planes y Facturación',
  ];

  // FILTRADO DINÁMICO POR CATEGORÍA Y BÚSQUEDA
  const faqsFiltradas = useMemo(() => {
    return FAQS_OFICIALES.filter((f: FAQItem) => {
      const coincideCategoria =
        categoriaActiva === 'Todas' || f.categoria === categoriaActiva;

      const termino = busqueda.toLowerCase().trim();
      const coincideBusqueda =
        termino === '' ||
        f.pregunta.toLowerCase().includes(termino) ||
        f.respuesta.toLowerCase().includes(termino) ||
        f.categoria.toLowerCase().includes(termino);

      return coincideCategoria && coincideBusqueda;
    });
  }, [categoriaActiva, busqueda]);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section className="relative z-10 py-16 lg:py-24 px-6 overflow-hidden w-full border-t border-[#0DEDC0]/10">
      {/* CAPA DE FONDO DINÁMICO */}
      <Fondos variante={variante} modo="absolute" />

      {/* CONTENEDOR PRINCIPAL EXTENDIDO A PANTALLA */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* CABECERA CON COMPONENTES DE TIPOGRAFÍA */}
        <div className="text-center mb-8">
          <Kicker>RESOLUCIÓN DE DUDAS</Kicker>

          <H2 className="text-balance mb-4 max-w-4xl mx-auto">
            Centro de <Highlight>Inteligencia Operativa.</Highlight>
          </H2>

          <Subtitulo className="max-w-3xl mx-auto">
            Encuentra la respuesta exacta para destrabar tu logística, blindar tu operación y mantener tu capital circulando.
          </Subtitulo>
        </div>

        {/* BARRA DE BÚSQUEDA TÁCTICA */}
        <div className="w-full max-w-2xl mb-8 relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar pregunta o palabra clave (ej: Dropi, fletes, stock, DIAN...)"
              className="w-full bg-[#102935]/80 border-2 border-[#6884C5]/30 focus:border-[#0DEDC0] rounded-2xl py-3.5 pl-12 pr-10 text-white placeholder-slate-400 text-xs sm:text-sm outline-none backdrop-blur-md transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            />
            {/* ICONO LUPA */}
            <svg
              className="absolute left-4 w-5 h-5 text-[#0DEDC0]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            {/* BOTÓN LIMPIAR BÚSQUEDA */}
            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda('')}
                className="absolute right-4 text-slate-400 hover:text-white bg-transparent border-none cursor-pointer text-xs font-bold font-mono"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* FILTROS DE CATEGORÍA DE ANCHO COMPLETO */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 w-full">
          {categorias.map((cat) => {
            const isActive = categoriaActiva === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoriaActiva(cat)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 border cursor-pointer ${
                  isActive
                    ? 'bg-[#0DEDC0] text-[#091A23] border-[#0DEDC0] shadow-[0_0_20px_rgba(13,237,192,0.4)]'
                    : 'bg-[#102935]/60 text-slate-400 border-[#6884C5]/20 hover:text-white hover:bg-[#102935] hover:border-[#0DEDC0]/30'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* MENSAJE DE BÚSQUEDA SIN RESULTADOS */}
        {faqsFiltradas.length === 0 && (
          <div className="text-center py-10 px-6 bg-[#102935]/40 border border-[#6884C5]/20 rounded-2xl max-w-lg w-full mb-8">
            <p className="text-white font-bold text-sm mb-1">
              No se encontraron coincidencias para &quot;{busqueda}&quot;
            </p>
            <p className="text-slate-400 text-xs mb-4">
              Intenta buscar con palabras más generales o selecciona otra categoría.
            </p>
            <button
              type="button"
              onClick={() => {
                setBusqueda('');
                setCategoriaActiva('Todas');
              }}
              className="bg-[#0DEDC0] text-[#091A23] font-bold text-xs px-4 py-2 rounded-xl border-none cursor-pointer"
            >
              Restablecer búsqueda
            </button>
          </div>
        )}

        {/* ACORDEÓN DE PREGUNTAS FRECUENTES DESPLEGADO */}
        <div className="flex flex-col gap-3.5 w-full max-w-5xl mx-auto">
          {faqsFiltradas.map((faq: FAQItem) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border backdrop-blur-md transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#102935]/80 border-[#0DEDC0]/50 shadow-[0_10px_25px_rgba(13,237,192,0.12)]'
                    : 'bg-[#102935]/50 border-[#6884C5]/20 hover:border-[#0DEDC0]/40'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex justify-between items-center text-sm sm:text-base font-extrabold text-white bg-transparent border-none cursor-pointer gap-4"
                >
                  <span className="tracking-tight leading-snug">{faq.pregunta}</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0DEDC0"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {/* RESPUESTA DESPLEGABLE */}
                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-300 border-t border-white/10 pt-3.5 leading-relaxed font-medium">
                    <span className="text-[#0DEDC0] text-[10px] sm:text-xs font-mono font-extrabold uppercase tracking-wider block mb-2">
                      {faq.categoria}
                    </span>
                    {faq.respuesta}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}