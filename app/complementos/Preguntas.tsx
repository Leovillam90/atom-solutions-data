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
    pregunta: '¿Funciona solo con Dropi o puedo conectar otras plataformas?',
    respuesta: 'ATOM puede conectar únicamente con cuentas Dropi y marca blanca Dropi, en todos los países donde Dropi tiene presencia en LATAM.',
  },
  {
    id: '5',
    categoria: 'Integración',
    pregunta: '¿Necesito conocimientos técnicos o un programador para usar ATOM?',
    respuesta: 'Cero. La plataforma es "Plug & Play" (conectar y usar). Está diseñada para que un gerente, o tú como dueño de la bodega, tomen el control total sin tocar una sola línea de código.',
  },

  // 📦 Categoría 2: Inventario
  {
    id: '6',
    categoria: 'Inventario',
    pregunta: '¿Puedo manejar múltiples bodegas y sedes físicas?',
    respuesta: 'Sí. Tienes control total multibodega. Puedes separar tu inventario por ubicaciones y saber exactamente, hasta la última unidad, dónde está tu capital.',
  },
  {
    id: '7',
    categoria: 'Inventario',
    pregunta: '¿Cómo aparezco en el Directorio de Proveedores Élite?',
    respuesta: 'Solo los clientes activos de ATOM acceden a esta vitrina exclusiva. Allí exponemos tus altas métricas de despacho para que los grandes dropshippers del mercado decidan escalar tu catálogo.',
  },

  // 💰 Categoría 3: Auditoría Financiera
  {
    id: '8',
    categoria: 'Auditoría Financiera',
    pregunta: '¿Qué es una “devolución fantasma”?',
    respuesta: 'Es mercancía que la transportadora reporta como “devuelta al remitente”, pero que físicamente nunca regresó a las puertas de tu bodega. Lo identificas a un click con ATOM y es dinero perdido si no lo auditas hoy.',
  },
  {
    id: '9',
    categoria: 'Auditoría Financiera',
    pregunta: '¿Cómo recupero el dinero de las guías estancadas?',
    respuesta: 'ATOM rastrea tu logística e identifica el número exacto de guías y dinero estancado por las transportadoras, para que puedas realizar el proceso de movilización de guías directamente con Dropi.',
  },
  {
    id: '10',
    categoria: 'Auditoría Financiera',
    pregunta: '¿Puedo auditar qué transportadora me pierde más paquetes?',
    respuesta: 'Por supuesto. Tendrás un ranking de eficiencia logística en tiempo real para saber quién te cumple, quién retiene tu dinero y a quién debes dejar de usar.',
  },

  // ⚙️ Categoría 4: Automatización y Novedades
  {
    id: '11',
    categoria: 'Automatización',
    pregunta: '¿Tengo que seguir rogándole a los vendedores por las novedades?',
    respuesta: 'Se acabó ese dolor. Próximamente ATOM notificará de forma 100% automática a los dropshippers sobre sus novedades sin solucionar. Por el momento puedes identificar a un click las guías con novedad comercial con más de 3 días para remitir a tus Dropshippers.',
  },
  {
    id: '12',
    categoria: 'Automatización',
    pregunta: '¿Cómo mido a los dropshippers que venden mi producto?',
    respuesta: 'ATOM te muestra quién es realmente rentable. No solo verás quién vende más, sino quién tiene la mejor tasa de entrega efectiva. Así sabes a quién darle prioridad de stock.',
  },
  {
    id: '13',
    categoria: 'Automatización',
    pregunta: '¿Qué pasa si un dropshipper tiene demasiadas devoluciones?',
    respuesta: 'Nuestra data te permite identificar rápidamente a los vendedores en “Intervención” para que puedas analizar su tendencia de ventas y entregar las recomendaciones que ayuden a mejorar su efectivdad de entrega.',
  },
  {
    id: '14',
    categoria: 'Automatización',
    pregunta: '¿Esta automatización me ayuda a mejorar mi ranking en Dropi?',
    respuesta: 'Totalmente. Al despachar más rápido, movilizar guías estancadas, remitir las novedades y pistolear las devoluciones, tu proveeduría obtendrá un score ATOM de Alto Rendimiento, atrayendo a los mejores vendedores de la red.',
  },

  // 💳 Categoría 5: Planes y Facturación
  {
    id: '15',
    categoria: 'Planes y Facturación',
    pregunta: '¿Cómo funciona la facturación electrónica DIAN con ATOM?',
    respuesta: 'Actualmente, el sistema genera un archivo con los datos exactos listos para facturar. Próximamente, las facturas para los dropshippers se generarán de forma 100% automática cumpliendo la normativa DIAN.',
  },
  {
    id: '16',
    categoria: 'Planes y Facturación',
    pregunta: '¿Qué diferencia al plan CONTROL de los demás?',
    respuesta: 'El plan CONTROL es nuestra suite para operaciones de alto volumen. Incluye acceso total a las automatizaciones masivas y reportes avanzados que no están disponibles en los planes de entrada.',
  },
  {
    id: '17',
    categoria: 'Planes y Facturación',
    pregunta: '¿Puedo empezar en un plan básico y subir después?',
    respuesta: 'Por supuesto. Puedes iniciar en un plan DESPEGUE o ESCALA y, cuando veas todo el capital que la plataforma te está recuperando, pasarte al nivel CONTROL con un solo clic.',
  },
  {
    id: '18',
    categoria: 'Planes y Facturación',
    pregunta: '¿Es seguro conectar mi token en ATOM o entregar mis credenciales?',
    respuesta: 'Totalmente seguro. ATOM funciona dentro del ecosistema Dropi bajo protocolos estrictos de encriptación, somos el único auditor logistico para Proveedores y Dueños del Producto.',
  },
  {
    id: '19',
    categoria: 'Planes y Facturación',
    pregunta: '¿Hay cláusulas de permanencia o contratos obligatorios?',
    respuesta: 'Ninguna. Operamos bajo un modelo SaaS de suscripción mensual libre. Los proveedores se quedan en ATOM por la cantidad de plata que recuperan mes a mes, no porque un contrato los obligue.',
  },
];