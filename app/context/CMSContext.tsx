'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export const ESTRUCTURA_CMS_DEFAULT = {
  cabecera: {
    kicker: 'HERRAMIENTA PARA GERENCIA B2B',
    titulo_normal: 'Arquitectura de ',
    titulo_resaltado: 'Precios & Sensibilidad.',
    subtitulo: 'Audita matemáticamente tus costos logísticos inversos. Analiza los 4 escenarios de sensibilidad operativa y emite la propuesta comercial definitiva.'
  },
  menu_y_enlaces: {
    boton_portal_texto: 'ACCESO PORTAL',
    boton_portal_link: '/atomapp',
    link_lobostock: 'https://lobostock.vercel.app/',
    link_soporte: '/soporte',
    link_academy: '/academy'
  },
  alertas: {
    mermas_activa: true,
    mermas_titulo: 'Condición de Entrega Operativa',
    mermas_texto: 'Nota: Este valor solo se puede entregar si se cumple estrictamente con las condiciones especificadas en la tarjeta de propuesta.'
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
    const docRef = doc(db, 'configuracion_web', 'calculadora_b2b');

    // Escucha en tiempo real de cambios en la base de datos
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const dataBD = docSnap.data();
          setCms({
            cabecera: { ...ESTRUCTURA_CMS_DEFAULT.cabecera, ...(dataBD.cabecera || {}) },
            menu_y_enlaces: { ...ESTRUCTURA_CMS_DEFAULT.menu_y_enlaces, ...(dataBD.menu_y_enlaces || {}) },
            alertas: { ...ESTRUCTURA_CMS_DEFAULT.alertas, ...(dataBD.alertas || {}) }
          });
        }
        setCargando(false);
      },
      (error) => {
        console.error('Error al escuchar cambios CMS:', error);
        setCargando(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <CMSContext.Provider value={{ cms, cargando }}>
      {children}
    </CMSContext.Provider>
  );
}

export const useCMS = () => useContext(CMSContext);