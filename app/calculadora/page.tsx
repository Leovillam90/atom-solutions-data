'use client';

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/app/lib/firebase';
import Registro from '@/app/complementos/Registro';
import Seccion1 from './paginas/Seccion1';
import Seccion2 from './paginas/Seccion2';

export default function CalculadoraPage() {
  const [autenticado, setAutenticado] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    // Función de consulta directa a Firestore
    const verificarAccesoEnFirestore = async (uid?: string, identificador?: string) => {
      try {
        // 1. Consulta por ID directo en colección usuarios
        if (uid) {
          const userSnap = await getDoc(doc(db, 'usuarios', uid));
          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.estadoCuenta === true || data.estadoCuenta === 'activo') {
              return true;
            }
          }
        }

        // 2. Consulta de respaldo por correo electrónico
        if (identificador && identificador.includes('@')) {
          const q = query(
            collection(db, 'usuarios'), 
            where('correo', '==', identificador.toLowerCase().trim())
          );
          const querySnap = await getDocs(q);
          if (!querySnap.empty) {
            const data = querySnap.docs[0].data();
            if (data.estadoCuenta === true || data.estadoCuenta === 'activo') {
              return true;
            }
          }
        }
      } catch (error) {
        console.error('Error al verificar cuenta en Firestore:', error);
      }
      return false;
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      let tieneAccesoValido = false;

      const sessionData = localStorage.getItem('atom_session');
      let sessionObj: { id?: string; identificador?: string; expiry?: string } | null = null;

      if (sessionData) {
        try {
          sessionObj = JSON.parse(sessionData);
          if (sessionObj?.expiry && new Date().getTime() > parseInt(sessionObj.expiry)) {
            localStorage.removeItem('atom_session');
            sessionObj = null;
          }
        } catch (e) {
          localStorage.removeItem('atom_session');
        }
      }

      const targetUid = user?.uid || sessionObj?.id;
      const targetIdentificador = user?.email || sessionObj?.identificador;

      if (targetUid || targetIdentificador) {
        tieneAccesoValido = await verificarAccesoEnFirestore(targetUid, targetIdentificador);
      }

      if (tieneAccesoValido) {
        setAutenticado(true);
      } else {
        localStorage.removeItem('atom_session');
        setAutenticado(false);
      }

      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-[#0DEDC0] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-[#0DEDC0] uppercase tracking-widest">
          Validando registro en Firestore...
        </span>
      </div>
    );
  }

  if (!autenticado) {
    return (
      <Registro 
        onLoginSuccess={() => setAutenticado(true)} 
        variante="gridCyber" 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0B171C] text-white relative">
      <Seccion1 variante="hexGrid" />
      <Seccion2 variante="hexGrid" />
    </div>
  );
}