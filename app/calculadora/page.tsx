'use client';

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import Registro from '@/app/complementos/Registro';
import Seccion1 from './paginas/Seccion1';
import Seccion2 from './paginas/Seccion2';

export default function CalculadoraPage() {
  const [autenticado, setAutenticado] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    // Escucha la sesión de Firebase y verifica el acceso en localStorage
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const registroLocal = localStorage.getItem('atom_user_registered') === 'true';

      if (user && registroLocal) {
        setAutenticado(true);
      } else {
        setAutenticado(false);
      }
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  // Spinner mientras se verifica la sesión inicial
  if (cargando) {
    return (
      <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-[#0DEDC0] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-[#0DEDC0] uppercase tracking-widest">
          Verificando credenciales...
        </span>
      </div>
    );
  }

  // Si NO está autenticado, muestra el formulario de Registro/SMS
  if (!autenticado) {
    return (
      <Registro 
        onLoginSuccess={() => setAutenticado(true)} 
        variante="gridCyber" 
      />
    );
  }

  // Si YA está autenticado, muestra la calculadora completa
  return (
    <main className="min-h-screen bg-[#0B171C] text-white relative">
      <Seccion1 variante="darkNoise" />
      <Seccion2 variante="darkNoise" />
    </main>
  );
}