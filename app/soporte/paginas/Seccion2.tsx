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
    pregunta: '¿ATOM es exclusivo para proveedores o sirve para dropshippers sin stock?',
    respuesta: 'Es exclusivo para proveedores, fabricantes e importadores con inventario propio. Nuestro motor de auditoría está diseñado para proteger activos físicos, detectar devoluciones no devueltas a bodega y auditar mercancía retenida.',
  },
  {
    id: '2',
    categoria: 'Integración',
    pregunta: '¿Necesito conocimientos de programación o copiar códigos de API para activar ATOM?',
    respuesta: 'Ninguno. Plataforma 100% Plug & Play. Integrada de forma nativa en Dropi: ingresas a tu cuenta, activas el módulo de ATOM en dos clics y el sistema sincroniza tus datos automáticamente.',
  },
  {
    id: '3',
    categoria: 'Integración',
    pregunta: '¿Cómo me registro y cómo se protegen mis accesos?',
    respuesta: 'Al hacer clic en el módulo de ATOM dentro de Dropi, el sistema crea tu acceso de forma automática. Por seguridad, recibes un correo con credenciales encriptadas bajo seguridad de nivel bancario para que gestiones tu contraseña.',
  },
  {
    id: '4',
    categoria: 'Integración',
    pregunta: '¿Tengo algún periodo de prueba para auditar mi bodega?',
    respuesta: 'Sí. Cuentas con 30 días de acceso para auditar mermas, rastrear mercancía en la calle y evaluar el rendimiento de tus transportadoras antes de tomar una decisión.',
  },
  {
    id: '5',
    categoria: 'Integración',
    pregunta: 'Si vendo por Dropi pero también tengo almacén físico o Shopify, ¿puedo usar ATOM?',
    respuesta: 'Es el escenario ideal. ATOM STOCK centraliza el inventario de tus bodegas físicas, Shopify y Dropi en una sola pantalla, actualizando existencias en tiempo real para evitar sobreventas.',
  },

  // Categoría 2: ATOM STOCK y Control de Inventario
  {
    id: '6',
    categoria: 'Inventario',
    pregunta: '¿Qué es exactamente una "devolución fantasma"?',
    respuesta: 'Mercancía que la transportadora cobra y reporta como "devuelta", pero que jamás reingresa físicamente a tu estante. Es una merma invisible que destruye el capital de tu bodega si no se audita.',
  },
  {
    id: '7',
    categoria: 'Inventario',
    pregunta: '¿Cómo sé si las transportadoras me están entregando todos los paquetes devueltos?',
    respuesta: 'A través del módulo de Detalle de Guías, el sistema cruza la trazabilidad del envío con el ingreso real a tu almacén, marcando con exactitud el indicador "Devolución en Bodega: Sí / No".',
  },
  {
    id: '8',
    categoria: 'Inventario',
    pregunta: '¿Qué evidencia me entrega ATOM para reclamar dinero a las transportadoras?',
    respuesta: 'Genera un reporte analítico irrefutable que cruza ID de orden, fecha de despacho, trazabilidad de la transportadora y validación de bodega. Es la prueba definitiva para exigir reembolsos por pérdidas o siniestros.',
  },
  {
    id: '9',
    categoria: 'Inventario',
    pregunta: '¿Cuál es la diferencia entre una merma operativa y una devolución fantasma?',
    respuesta: 'La merma operativa es un daño físico interno en tu bodega. La devolución fantasma es mercancía pérdida o retenida por el operador logístico que se da por "devuelta" sin estar en tu estante.',
  },
  {
    id: '10',
    categoria: 'Inventario',
    pregunta: '¿Qué sucede con el stock congelado en tránsito por semanas?',
    respuesta: 'ATOM detecta el estancamiento y emite alertas de liberación de inventario para forzar la devolución inmediata o la entrega efectiva, evitando que tu mercancía quede inmovilizada sin rotar.',
  },

  // Categoría 3: Auditoría Financiera y Fugas de Dinero
  {
    id: '11',
    categoria: 'Auditoría Financiera',
    pregunta: '¿Cómo evalúo qué transportadora me cumple mejor en cada zona?',
    respuesta: 'Accedes a un ranking dinámico que compara la tasa de efectividad de cada transportadora en tu cuenta contra el promedio nacional, identificando quién entrega a tiempo y quién genera mermas.',
  },
  {
    id: '12',
    categoria: 'Auditoría Financiera',
    pregunta: '¿Cómo determina ATOM el Top 3 de transportadoras por destino?',
    respuesta: 'Evalúa el histórico de entregas efectivas y el volumen de muestra en el ecosistema para recomendarte las tres mejores opciones logísticas por ciudad o departamento.',
  },
  {
    id: '13',
    categoria: 'Auditoría Financiera',
    pregunta: '¿Por qué se requiere un mínimo de despachos para calificar una transportadora?',
    respuesta: 'Para garantizar representatividad estadística. Exigimos una muestra mínima de guías cerradas para evitar que una sola entrega aislada genere una falsa tasa del 100%.',
  },
  {
    id: '14',
    categoria: 'Auditoría Financiera',
    pregunta: '¿Cómo puedo saber cuánto dinero exacto tengo retenido en la calle?',
    respuesta: 'El panel de Rendimiento y Riesgo te muestra el valor acumulado en dinero ($) de guías atascadas, mercancía devuelta no recibida y paquetes en riesgo en tiempo real.',
  },
  {
    id: '15',
    categoria: 'Auditoría Financiera',
    pregunta: '¿Cuánto tiempo toma ver resultados en la recuperación de inventario?',
    respuesta: 'La primera radiografía toma minutos. En los primeros 60 días de auditoría activa, las bodegas logran rastrear y exigir la restitución de hasta un 30% del inventario dado por perdido.',
  },

  // Categoría 4: Automatización Operativa y Novedades
  {
    id: '16',
    categoria: 'Automatización',
    pregunta: '¿Cómo funciona el Score de Vendedores nativo en Dropi?',
    respuesta: 'Es un algoritmo que mide la efectividad histórica de entrega de cada dropshipper. Te permite identificar a los mejores vendedores para priorizarles stock y restringir a quienes generan exceso de devoluciones.',
  },
  {
    id: '17',
    categoria: 'Automatización',
    pregunta: '¿A qué hora y cómo se envían las alertas de novedades a los dropshippers?',
    respuesta: 'El sistema ejecuta un barrido automático todos los días a las 10:00 AM. Agrupa las guías retenidas por vendedor y les envía un único reporte consolidado vía Email y WhatsApp para no saturarlos.',
  },
  {
    id: '18',
    categoria: 'Automatización',
    pregunta: '¿Qué son los comandos de movilización automática a transportadoras?',
    respuesta: 'Son instrucciones masivas programadas que ATOM envía a los sistemas logísticos al detectar guías estancadas, destrabando los paquetes sin que tu equipo pase horas negociando en chat.',
  },
  {
    id: '19',
    categoria: 'Automatización',
    pregunta: '¿Qué es el "Candado de Seguridad (Cero Basura)" en las alertas?',
    respuesta: 'Antes de enviar una notificación, ATOM verifica el estado de la guía en vivo. Si la transportadora ya movilizó el paquete, cancela la alerta automáticamente para evitar falsas alarmas.',
  },
  {
    id: '20',
    categoria: 'Automatización',
    pregunta: '¿Cómo sé que ATOM ya gestionó las novedades por mi bodega?',
    respuesta: 'Tu panel actualiza la Tarjeta de Movilización Exitosa, mostrándote el total de guías gestionadas, la fecha, hora exacta y el estado de entrega actualizado.',
  },

  // Categoría 5: Planes, Pagos y Facturación DIAN
  {
    id: '21',
    categoria: 'Planes y Facturación',
    pregunta: '¿Por qué si vendo mucho en Dropi siento que no me queda liquidez en la cuenta?',
    respuesta: 'Porque mermas invisibles, devoluciones no ingresadas a bodega y retenciones de capital absorben la ganancia. ATOM calcula tu Ganancia Líquida Real, mostrando el dinero neto libre de costos ocultos.',
  },
  {
    id: '22',
    categoria: 'Planes y Facturación',
    pregunta: '¿Cómo identifico qué productos dejan ganancia real y cuáles me hacen perder dinero?',
    respuesta: 'En la sección de Productos, ATOM clasifica tu catálogo por utilidad neta real, descontando automáticamente mermas, devoluciones acumuladas y costos de producción por artículo.',
  },
  {
    id: '23',
    categoria: 'Planes y Facturación',
    pregunta: '¿ATOM tiene acceso para retirar o mover saldo de mi Wallet en Dropi?',
    respuesta: 'No. La integración opera estrictamente bajo protocolos de lectura de datos y gestión de guías. Tu dinero y tus retiros se controlan 100% desde tu cuenta en Dropi.',
  },
  {
    id: '24',
    categoria: 'Planes y Facturación',
    pregunta: '¿Cómo se cobra la suscripción si mi bodega opera fuera de Colombia?',
    respuesta: 'Las cuentas internacionales (México, Perú, Panamá, Chile, etc.) facturan exclusivamente en Dólares (USD), aplicando de forma automática los impuestos tributarios locales de tu país.',
  },
  {
    id: '25',
    categoria: 'Planes y Facturación',
    pregunta: '¿Cómo ayuda ATOM con la facturación electrónica DIAN u homologados?',
    respuesta: 'Genera reportes de pre-facturación consolidados agrupando las órdenes con estado confirmado ENTREGADO, listos para cargar en tu proveedor tecnológico sin discrepancias de inventario.',
  },

  // Extra: Operación Multibodega
  {
    id: '26',
    categoria: 'Integración', // O podrías crear una categoría extra
    pregunta: 'Si administro varios almacenes o marcas en Dropi, ¿puedo ver todo en un solo lugar?',
    respuesta: 'Sí. El panel de Negocios consolida la información operativa, tasa de mermas y rendimiento financiero de múltiples bodegas bajo un solo tablero centralizado.',
  },
  {
    id: '27',
    categoria: 'Integración',
    pregunta: '¿ATOM reemplaza mi ERP o software contable actual?',
    respuesta: 'No. Funciona como un centro de mando y auditor logístico especializado en e-commerce que trabaja en paralelo con tu sistema contable tradicional.',
  },
  {
    id: '28',
    categoria: 'Integración',
    pregunta: '¿Cómo evita ATOM las sobreventas (overselling) entre canales?',
    respuesta: 'Cada vez que se procesa una venta en cualquier canal conectado, ATOM descuenta y ajusta las existencias en milisegundos en Dropi y demás plataformas integradas.',
  },
  {
    id: '29',
    categoria: 'Integración',
    pregunta: '¿Mi personal de bodega necesita capacitación técnica para operar la plataforma?',
    respuesta: 'No. La interfaz es intuitiva y cuenta con acceso directo a ATOM Academy, donde tu equipo encuentra videotutoriales de 3 a 5 minutos para dominar la herramienta.',
  },
  {
    id: '30',
    categoria: 'Integración',
    pregunta: '¿ATOM Academy tiene algún costo adicional a la suscripción?',
    respuesta: 'Ninguno. El centro de entrenamiento táctico está 100% incluido de forma abierta para que tu equipo operativo y administrativo se capacite de manera continua.',
  }
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