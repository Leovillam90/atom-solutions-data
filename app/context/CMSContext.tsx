'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export const ESTRUCTURA_CMS_DEFAULT = {
  landing: {
    seccion1_hero: {
      kicker: 'SISTEMA DE AUDITORÍA PARA PROVEEDORES',
      titulo_base: 'Deja de regalarle tu dinero a las ',
      titulo_destacado: 'transportadoras.',
      subtitulo: 'ATOM audita tu cuenta Dropi 24/7 y detecta mercancía "devuelta" que jamás reingresó a tu bodega o en "curso" que sigue en la calle.',
      check_1: 'Integración nativa a Dropi LATAM',
      check_2: 'Detecta tus pedidos estancados',
      check_3: 'Audita devoluciones fantasma en tiempo real',
      cta_texto: 'DESCUBRIR MI CAPITAL ESTANCADO →',
      cta_link: 'https://atomapp.com.co/register',
      video_url: '/video-landing.mp4'
    },
    seccion3_diagnosticos: {
      kicker: 'DIAGNÓSTICO OPERATIVO',
      subtitulo: 'El descontrol logístico no es un error de cálculo, es la pérdida directa de tu dinero.',
      tarjetas: [
        {
          id: 'descontrol-guias',
          titulo: 'Descontrol de Guías',
          descripcion: 'Dejas de rastrear el estado real de tus envíos y las devoluciones que jamás reingresan a tus estantes.',
          ctaText: 'Radar de auditoría en tiempo real →',
          ctaLink: 'https://atomapp.com.co/register'
        },
        {
          id: 'novedades-manuales',
          titulo: 'Novedades Manuales',
          descripcion: 'Pierdes horas al día chateando con soporte Dropi y transportadoras para destrabar envíos uno por uno.',
          ctaText: 'Sistema de resolución automatizado →',
          ctaLink: 'https://atomapp.com.co/register'
        },
        {
          id: 'margenes-ciegas',
          titulo: 'Márgenes a Ciegas',
          descripcion: 'Adivinas tu ganancia real sin conocer el costo exacto de la mercancía no devuelta.',
          ctaText: 'Tablero exacto de ROI operativo →',
          ctaLink: 'https://atomapp.com.co/register'
        }
      ]
    },
    seccion4_metricas: {
      metricas: [
        { valor: '$4.5M+', kicker: 'CAPITAL PROTEGIDO' },
        { valor: '99.9%', kicker: 'TRAZABILIDAD FINANCIERA' },
        { valor: '15K+', kicker: 'GUÍAS AUDITADAS AL DÍA' }
      ]
    },
    seccion5_precios: {
      kicker: 'INVERSIÓN TRANSPARENTE',
      subtitulo: 'Elige el nivel de auditoría que tu bodega necesita hoy y recupera tu capital sin contratos de permanencia.',
      planes: [
        {
          id: 'despegue',
          nombre: 'DESPEGUE',
          badge: '',
          perfil: 'Bodegas nacientes en fase de pruebas',
          precioCOP: '$55.000',
          precioUSD: '$15 USD',
          cta: 'Iniciar con Despegue →',
          ctaLink: 'https://atomapp.com.co/register',
          caracteristicas: ['1 Conexión Nativa a Dropi', 'Hasta 700 guías auditadas/mes']
        },
        {
          id: 'escala',
          nombre: 'ESCALA',
          badge: '',
          perfil: 'Bodegas en aceleración intermedia',
          precioCOP: '$150.000',
          precioUSD: '$49 USD',
          cta: 'Escalar mi Bodega →',
          ctaLink: 'https://atomapp.com.co/register',
          caracteristicas: ['1 Conexión Nativa a Dropi', 'Hasta 1.500 guías auditadas/mes']
        },
        {
          id: 'experto',
          nombre: 'EXPERTO',
          badge: '🔥 MÁS ELEGIDO POR LOS PROVEEDORES',
          perfil: 'Operaciones de venta a gran escala',
          precioCOP: '$250.000',
          precioUSD: '$69 USD',
          cta: 'Activar Operación Masiva →',
          ctaLink: 'https://atomapp.com.co/register',
          caracteristicas: ['Guías auditadas Ilimitadas/mes', 'Detección de Devoluciones Fantasma']
        },
        {
          id: 'control',
          nombre: 'CONTROL',
          badge: '👑 MULTI-BODEGA & HOLDING',
          perfil: 'Redes de bodegas o grupos empresariales',
          precioCOP: '$350.000',
          precioUSD: '$97 USD',
          cta: 'Activar Multi-Cuenta →',
          ctaLink: 'https://atomapp.com.co/register',
          caracteristicas: ['Hasta 5 Cuentas Centralizadas', 'Asistente Dedicado 1:1']
        }
      ]
    },
    seccion6_cierre: {
      kicker: 'AUDITORÍA FINANCIERA',
      titulo: 'ATOM no te cuesta dinero, te lo multiplica.',
      subtitulo: 'Nuestros proveedores recuperan en promedio un 15% de ganancia real en sus primeros 30 días.',
      cta_texto: 'VER CUÁNTO DINERO PUEDO RECUPERAR →',
      cta_link: 'https://atomapp.com.co/register'
    }
  },
  noticias: {
    hero: {
      kicker: 'INTELIGENCIA & CONTENIDO',
      titulo_base: 'Noticias del Ecosistema ',
      titulo_destacado: 'E-Commerce LATAM.',
      subtitulo: 'Información estratégica, métricas operativas y actualizaciones logísticas para proveedores, importadores y dropshippers.'
    },
    articulo_principal: {
      id: 1,
      categoria: 'ESTRATEGIA COMERCIAL',
      tagColor: '#0DEDC0',
      fecha: 'Agosto 26 del 2026',
      tiempoLectura: 'Evento Oficial',
      titulo: '¿Por qué los Dropshippers Élite buscarán los stand de proveedores de Alto Rendimiento ATOM en Expo Winners?',
      resumen: 'Durante el 12 y 13 de septiembre en Ágora Bogotá, los vendedores con mayor volumen de ventas filtrarán a sus aliados a través de la App del evento.',
      autor: 'Equipo Comercial ATOM',
      linkCta: 'https://wa.me/573122521130?text=Hola,%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20la%20estrategia%20Expo%20Winners',
      textoCta: 'SABER MÁS SOBRE EL EVENTO EXPO WINNERS →',
      historias: ['/noticias/Expo.mp4', '/noticias/Rendimiento.jpeg']
    },
    articulosecundarios: [
      {
        id: 2,
        categoria: 'ALIANZAS ESTRATÉGICAS',
        tagColor: '#6884C5',
        badge: 'IMPORTANTE',
        fecha: '12 y 13 de Septiembre | Ágora Bogotá',
        tiempoLectura: 'Proveedores ATOM',
        titulo: 'EVENTO PRESENCIAL ✕ EXPO WINNERS BY DROPI',
        resumen: 'En Expo Winners, los verdaderos top sellers no buscan cualquier proveedor: buscan Proveedores de Alto Rendimiento ATOM.',
        link: 'https://wa.me/573122521130?text=Hola,%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20la%20estrategia%20Expo%20Winners',
        textoCta: 'SABER MÁS DEL EVENTO →'
      },
      {
        id: 3,
        categoria: 'DROKO',
        tagColor: '#0DEDC0',
        badge: '',
        fecha: 'Agosto 25 del 2026',
        tiempoLectura: 'Línea Comercial',
        titulo: 'El puente directo entre grandes importadores y compradores VIP.',
        resumen: 'Una línea comercial exclusiva donde ambas partes ganan.',
        link: 'https://app.droko.app/login',
        textoCta: 'VER DROKO →'
      }
    ],
    comunidad_whatsapp: {
      kicker: 'COMUNIDAD EXCLUSIVA',
      titulo: 'Recibe métricas e inteligencia directamente en WhatsApp.',
      subtitulo: 'Accede en tiempo real a reportes de efectividad, alertas de transportadoras y estrategias de escalamiento en nuestro grupo exclusivo.',
      whatsappGroupUrl: 'https://chat.whatsapp.com/LseNRlRrS4zFpRKst3lPTp',
      cta_texto: 'Unirme al Grupo de WhatsApp →'
    }
  },
  academy: {
    cabecera: {
      kicker: 'CENTRO DE ENTRENAMIENTO TÁCTICO',
      titulo_base: 'Domina la infraestructura de tu ',
      titulo_destacado: 'bodega.',
      subtitulo: 'Entrénate con tácticas avanzadas para automatizar tu logística en Dropi, blindar tu inventario y multiplicar la rentabilidad real de tu negocio.'
    },
    lecciones: [
      {
        id: '0',
        titulo: '¿Qué es ATOM? El Centro de Mando de la Élite Logística',
        duracion: '00:40',
        categoria: 'Integraciones',
        badge: 'Táctica Rápida',
        descripcion: 'Descubre en 40 segundos cómo ATOM se conecta a tu cuenta de Dropi para auditar cada guía en tiempo real.',
        youtubeId: 'feDbKxnh50k'
      },
      {
        id: '1',
        titulo: 'Cómo integrar ATOM a tu negocio en Dropi',
        duracion: '01:04',
        categoria: 'Integraciones',
        badge: 'Táctica Rápida',
        descripcion: 'Sincroniza tu cuenta en simples pasos y descubre exactamente dónde está la plata atrapada en tus guías.',
        youtubeId: '2Wz4_tpgF6M'
      }
    ],
    materiales_cabecera: {
      kicker: 'BIBLIOTECA & RECURSOS TÁCTICOS',
      titulo: 'Material de apoyo táctico.',
      subtitulo: 'Accede a la documentación técnica, guías de operación en PDF, simuladores web y tutoriales tácticos para tu bodega.'
    },
    materiales: [
      {
        id: '1',
        titulo: 'Calculadora de Fuga de Fletes y Devoluciones',
        tipo: 'WEB',
        categoria: 'HERRAMIENTA FINANCIERA',
        metaInfo: 'Link Web',
        descripcion: 'Matriz automatizada para simular el impacto real de las devoluciones en tu margen.',
        textoBoton: 'ABRIR CALCULADORA ↗',
        urlDestino: '/calculadora',
        esDescargaDirecta: false
      },
      {
        id: '2',
        titulo: 'Usabilidad de EcomScanner para Bodegas',
        tipo: 'PDF',
        categoria: 'GUÍA OPERATIVA',
        metaInfo: 'PDF - 2.4 MB',
        descripcion: 'Manual técnico para integrar el escáner a tu flujo de trabajo.',
        textoBoton: '↓ DESCARGAR DOCUMENTO',
        urlDestino: '/apoyo/ecomscanner-usabilidad-bodegas.pdf',
        esDescargaDirecta: true
      }
    ]
  },
  soporte: {
    seccion1_cards: {
      kicker: 'SOPORTE & ESTRATEGIA',
      titulo_base: 'Toma el control total de tu ',
      titulo_destacado: 'operación.',
      subtitulo: 'Conecta directamente con nuestro Equipo ATOM para blindar tu operación, o accede a nuestra base táctica para destrabar cualquier fricción logística en segundos.',
      card1_calendar_url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1NLADoKo98JZGZMrlOPGvfIDoFwBklUgysMkLBhFl4YFhxruab4t-0ijwVyiPkHTt3CBUDtiFo?gv=true',
      card2_wa_url: 'https://wa.me/573122521130?text=Hola,%20necesito%20soporte%20operativo%20para%20mi%20bodega',
      card3_academy_url: '/academy'
    },
    seccion2_faq: {
      kicker: 'RESOLUCIÓN DE DUDAS',
      titulo_base: 'Centro de ',
      titulo_destacado: 'Inteligencia Operativa.',
      subtitulo: 'Encuentra la respuesta exacta para destrabar tu logística, blindar tu operación y mantener tu capital circulando.',
      faqs: [
        {
          id: '1',
          categoria: 'Integración',
          pregunta: '¿Cómo se conecta ATOM con mi cuenta de Dropi?',
          respuesta: 'Inicias sesión en tu panel ATOM, vas a la sección de Configuración/Integraciones y pegas el Token API de tu cuenta Dropi.'
        },
        {
          id: '2',
          categoria: 'Auditoría Financiera',
          pregunta: '¿Cómo detecta ATOM las devoluciones fantasma?',
          respuesta: 'ATOM cruza en tiempo real el historial de transportadoras contra los reingresos escaneados en tu bodega.'
        }
      ]
    },
    seccion3_cancelaciones: {
      kicker: 'GESTIÓN DE SUSCRIPCIÓN',
      titulo: '¿Necesitas pausar o gestionar la desconexión de tu cuenta?',
      subtitulo: 'Si estás experimentando inconvenientes operativos o deseas congelar tu membresía temporalmente, nuestro equipo está listo para asistirte.',
      boton_texto: 'SOLICITAR DESCONEXIÓN O PAUSA DE CUENTA →'
    }
  }
};

type CMSDataType = typeof ESTRUCTURA_CMS_DEFAULT;

interface CMSContextType {
  cms: CMSDataType;
  cargando: boolean;
}

const CMSContext = createContext<CMSContextType>({
  cms: ESTRUCTURA_CMS_DEFAULT,
  cargando: true
});

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [cms, setCms] = useState<CMSDataType>(ESTRUCTURA_CMS_DEFAULT);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'configuracion_web', 'plataforma_cms');

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const bd = docSnap.data();

          // Fusión profunda (Deep Merge) subsección por subsección para evitar valores undefined
          setCms({
            landing: {
              seccion1_hero: { ...ESTRUCTURA_CMS_DEFAULT.landing.seccion1_hero, ...(bd.landing?.seccion1_hero || {}) },
              seccion3_diagnosticos: { ...ESTRUCTURA_CMS_DEFAULT.landing.seccion3_diagnosticos, ...(bd.landing?.seccion3_diagnosticos || {}) },
              seccion4_metricas: { ...ESTRUCTURA_CMS_DEFAULT.landing.seccion4_metricas, ...(bd.landing?.seccion4_metricas || {}) },
              seccion5_precios: { ...ESTRUCTURA_CMS_DEFAULT.landing.seccion5_precios, ...(bd.landing?.seccion5_precios || {}) },
              seccion6_cierre: { ...ESTRUCTURA_CMS_DEFAULT.landing.seccion6_cierre, ...(bd.landing?.seccion6_cierre || {}) },
            },
            noticias: {
              hero: { ...ESTRUCTURA_CMS_DEFAULT.noticias.hero, ...(bd.noticias?.hero || {}) },
              articulo_principal: { ...ESTRUCTURA_CMS_DEFAULT.noticias.articulo_principal, ...(bd.noticias?.articulo_principal || {}) },
              articulosecundarios: bd.noticias?.articulosecundarios || ESTRUCTURA_CMS_DEFAULT.noticias.articulosecundarios,
              comunidad_whatsapp: { ...ESTRUCTURA_CMS_DEFAULT.noticias.comunidad_whatsapp, ...(bd.noticias?.comunidad_whatsapp || {}) },
            },
            academy: {
              cabecera: { ...ESTRUCTURA_CMS_DEFAULT.academy.cabecera, ...(bd.academy?.cabecera || {}) },
              lecciones: bd.academy?.lecciones || ESTRUCTURA_CMS_DEFAULT.academy.lecciones,
              materiales_cabecera: { ...ESTRUCTURA_CMS_DEFAULT.academy.materiales_cabecera, ...(bd.academy?.materiales_cabecera || {}) },
              materiales: bd.academy?.materiales || ESTRUCTURA_CMS_DEFAULT.academy.materiales,
            },
            soporte: {
              seccion1_cards: { ...ESTRUCTURA_CMS_DEFAULT.soporte.seccion1_cards, ...(bd.soporte?.seccion1_cards || {}) },
              seccion2_faq: {
                ...ESTRUCTURA_CMS_DEFAULT.soporte.seccion2_faq,
                ...(bd.soporte?.seccion2_faq || {}),
                faqs: bd.soporte?.seccion2_faq?.faqs || ESTRUCTURA_CMS_DEFAULT.soporte.seccion2_faq.faqs,
              },
              seccion3_cancelaciones: { ...ESTRUCTURA_CMS_DEFAULT.soporte.seccion3_cancelaciones, ...(bd.soporte?.seccion3_cancelaciones || {}) },
            }
          });
        }
        setCargando(false);
      },
      (error) => {
        console.error('Error cargando el CMS:', error);
        setCargando(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const value = useMemo(() => ({ cms, cargando }), [cms, cargando]);

  return (
    <CMSContext.Provider value={value}>
      {children}
    </CMSContext.Provider>
  );
}

export const useCMS = () => useContext(CMSContext);