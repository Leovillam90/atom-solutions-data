export interface FAQItem {
  id: string;
  categoria: 'Integración' | 'Inventario' | 'Auditoría Financiera' | 'Automatización' | 'Planes y Facturación';
  pregunta: string;
  respuesta: string;
}

export const FAQS_OFICIALES: FAQItem[] = [
  // 🔌 Categoría 1: Integración y Primeros Pasos
  {
    id: '1',
    categoria: 'Integración',
    pregunta: '¿Cómo integro mi cuenta de Dropi con ATOM?',
    respuesta: 'En solo 5 minutos y un par de clics. Conectas la API desde tu panel y el sistema comenzará a sincronizar tu inventario y el historial de tus guías en tiempo real, sin procesos manuales.',
  },
  {
    id: '2',
    categoria: 'Integración',
    pregunta: '¿Cuánto tarda el sistema en mostrar mis datos después de conectarme?',
    respuesta: 'Es casi inmediato. Una vez enlazas tu cuenta, nuestro algoritmo escanea tu historial y en minutos tendrás tu primera radiografía logística lista para empezar a auditar.',
  },
  {
    id: '3',
    categoria: 'Integración',
    pregunta: '¿ATOM sirve para dropshippers sin stock propio?',
    respuesta: 'No. Somos un escudo financiero diseñado exclusivamente para proteger el capital de proveedores, dueños de inventario, fabricantes e importadores.',
  },
  {
    id: '4',
    categoria: 'Integración',
    pregunta: '¿Funciona solo con Dropi o puedo conectar otros canales?',
    respuesta: 'ATOM es omnicanal. Puedes centralizar tus despachos de Dropi, Véndelo, Shopify e incluso las ventas directas de tus tiendas físicas en un solo centro de mando.',
  },
  {
    id: '5',
    categoria: 'Integración',
    pregunta: '¿Necesito conocimientos técnicos o un programador para usar ATOM?',
    respuesta: 'Cero. La plataforma es "Plug & Play" (conectar y usar). Está diseñada para que un gerente, o tú como dueño de la bodega, tomen el control total sin tocar una sola línea de código.',
  },

  // 📦 Categoría 2: Inventario (ATOM STOCK)
  {
    id: '6',
    categoria: 'Inventario',
    pregunta: '¿Qué es exactamente ATOM STOCK?',
    respuesta: 'Es tu suite operativa. El centro de mando que te permite centralizar tus bodegas, automatizar despachos y blindar tu stock en tiempo real en todos tus canales.',
  },
  {
    id: '7',
    categoria: 'Inventario',
    pregunta: '¿Puedo manejar múltiples bodegas y sedes físicas?',
    respuesta: 'Sí. Tienes control total multibodega. Puedes separar tu inventario por ubicaciones y saber exactamente, hasta la última unidad, dónde está tu capital.',
  },
  {
    id: '8',
    categoria: 'Inventario',
    pregunta: '¿El stock se descuenta en automático en Dropi?',
    respuesta: 'Correcto. Si vendes una unidad en tu punto físico o en otro canal integrado, ATOM actualiza el stock en Dropi automáticamente para que nunca sobrevendas sin inventario real.',
  },
  {
    id: '9',
    categoria: 'Inventario',
    pregunta: '¿Puedo crear usuarios para mis empleados con permisos limitados?',
    respuesta: 'Sí. Puedes asignar roles precisos (Administradores, Gerentes de Bodega y Cajeros/Vendedores), garantizando que la información sensible de tu negocio esté protegida.',
  },
  {
    id: '10',
    categoria: 'Inventario',
    pregunta: '¿Cómo aparezco en el Directorio de Proveedores Élite?',
    respuesta: 'Solo los clientes activos de ATOM acceden a esta vitrina exclusiva. Allí exponemos tus altas métricas de despacho para que los grandes dropshippers del mercado decidan escalar tu catálogo.',
  },

  // 💰 Categoría 3: Auditoría Financiera y Fugas
  {
    id: '11',
    categoria: 'Auditoría Financiera',
    pregunta: '¿Qué es una "devolución fantasma"?',
    respuesta: 'Es mercancía que la transportadora reporta como "devuelta al remitente", pero que físicamente nunca regresó a las puertas de tu bodega. Es dinero perdido si no lo auditas con ATOM.',
  },
  {
    id: '12',
    categoria: 'Auditoría Financiera',
    pregunta: '¿Cómo recupero el dinero de las guías estancadas?',
    respuesta: 'ATOM rastrea tu logística y genera un reporte con el número exacto de pesos y guías retenidas en la calle. Te damos la evidencia para que exijas a la transportadora el dinero que es tuyo.',
  },
  {
    id: '13',
    categoria: 'Auditoría Financiera',
    pregunta: '¿La plataforma calcula mi utilidad real por producto?',
    respuesta: 'Sí. Cruzamos tus costos de manufactura/importación con tus despachos efectivos para mostrarte el margen líquido: qué referencias te dan ganancia real y cuáles te desangran.',
  },
  {
    id: '14',
    categoria: 'Auditoría Financiera',
    pregunta: '¿Puedo auditar qué transportadora me pierde más paquetes?',
    respuesta: 'Por supuesto. Tendrás un ranking de eficiencia logística en tiempo real para saber quién te cumple, quién retiene tu dinero y a quién debes dejar de usar.',
  },
  {
    id: '15',
    categoria: 'Auditoría Financiera',
    pregunta: '¿ATOM hace el cobro directamente a la transportadora por mí?',
    respuesta: 'Nosotros te entregamos la munición (la data exacta, las guías y los montos). Con este reporte irrefutable, tu equipo hace la reclamación directa, garantizando que el dinero entre sin desvíos a tus cuentas.',
  },

  // ⚙️ Categoría 4: Automatización y Novedades
  {
    id: '16',
    categoria: 'Automatización',
    pregunta: '¿Tengo que seguir rogándole a los vendedores por las novedades?',
    respuesta: 'Se acabó ese dolor. ATOM notifica de forma 100% automática a los dropshippers sobre sus novedades sin solucionar. Nosotros hacemos la presión operativa por ti.',
  },
  {
    id: '17',
    categoria: 'Automatización',
    pregunta: '¿Cómo funciona la actualización masiva de guías?',
    respuesta: 'En lugar de perder horas guía por guía, seleccionas cientos de pedidos estancados y los movilizas o actualizas su estado en bloque con un par de clics.',
  },
  {
    id: '18',
    categoria: 'Automatización',
    pregunta: '¿Cómo mido a los dropshippers que venden mi producto?',
    respuesta: 'ATOM te muestra quién es realmente rentable. No solo verás quién vende más, sino quién tiene la mejor tasa de entrega efectiva. Así sabes a quién darle prioridad de stock.',
  },
  {
    id: '19',
    categoria: 'Automatización',
    pregunta: '¿Qué pasa si un dropshipper tiene demasiadas devoluciones?',
    respuesta: 'Nuestra data te permite identificar rápidamente a los vendedores "tóxicos" que inflan tus costos logísticos, permitiéndote bloquear su acceso a tu catálogo antes de perder más dinero.',
  },
  {
    id: '20',
    categoria: 'Automatización',
    pregunta: '¿Esta automatización me ayuda a mejorar mi ranking en Dropi?',
    respuesta: 'Totalmente. Al despachar más rápido y solucionar novedades en piloto automático, tu calificación de proveedor sube, atrayendo a los mejores vendedores de la red.',
  },

  // 💳 Categoría 5: Planes y Facturación
  {
    id: '21',
    categoria: 'Planes y Facturación',
    pregunta: '¿Cómo funciona la facturación electrónica DIAN con ATOM?',
    respuesta: 'Actualmente, el sistema genera un archivo con los datos exactos listos para facturar. Próximamente, las facturas para los dropshippers se generarán de forma 100% automática cumpliendo la normativa DIAN.',
  },
  {
    id: '22',
    categoria: 'Planes y Facturación',
    pregunta: '¿Qué diferencia al plan CONTROL de los demás?',
    respuesta: 'El plan CONTROL es nuestra suite para operaciones de alto volumen. Incluye acceso total a las automatizaciones masivas y reportes avanzados que no están disponibles en los planes de entrada.',
  },
  {
    id: '23',
    categoria: 'Planes y Facturación',
    pregunta: '¿Puedo empezar en un plan básico y subir después?',
    respuesta: 'Por supuesto. Puedes iniciar en un plan DESPEGUE o ESCALA y, cuando veas todo el capital que la plataforma te está recuperando, pasarte al nivel CONTROL con un solo clic.',
  },
  {
    id: '24',
    categoria: 'Planes y Facturación',
    pregunta: '¿Es seguro conectar mi API o entregar mis credenciales?',
    respuesta: 'Totalmente seguro. ATOM funciona como un auditor externo bajo protocolos estrictos de encriptación. Tu dinero y transacciones siguen ocurriendo y protegiéndose dentro de tu ecosistema.',
  },
  {
    id: '25',
    categoria: 'Planes y Facturación',
    pregunta: '¿Hay cláusulas de permanencia o contratos obligatorios?',
    respuesta: 'Ninguna. Operamos bajo un modelo SaaS de suscripción mensual libre. Los proveedores se quedan en ATOM por la cantidad de plata que recuperan mes a mes, no porque un contrato los obligue.',
  },
];