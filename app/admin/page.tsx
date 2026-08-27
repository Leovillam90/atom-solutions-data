'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Registro from './Registro';
import Seccion1 from './Seccion1';
import { TipoFondo } from '@/app/complementos/Fondos';

export default function AdminPage() {
  const [autenticado, setAutenticado] = useState<boolean>(false);
  const [verificandoSesion, setVerificandoSesion] = useState<boolean>(true);

  // Control central del fondo para el módulo Admin
  const varianteFondo: TipoFondo = 'hexGrid';

  useEffect(() => {
    const adminSession = sessionStorage.getItem('atom_admin_session');
    if (adminSession) {
      try {
        const { expiry } = JSON.parse(adminSession);
        if (Date.now() < parseInt(expiry, 10)) {
          setAutenticado(true);
        } else {
          sessionStorage.removeItem('atom_admin_session');
        }
      } catch (e) {
        sessionStorage.removeItem('atom_admin_session');
      }
    }
    setVerificandoSesion(false);
  }, []);

  const cerrarSesion = useCallback(() => {
    sessionStorage.removeItem('atom_admin_session');
    setAutenticado(false);
  }, []);

  const manejarExitoLogin = useCallback(() => {
    setAutenticado(true);
  }, []);

  if (verificandoSesion) {
    return (
      <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center gap-3 font-mono text-white">
        <div className="w-10 h-10 border-4 border-[#0DEDC0] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-[#0DEDC0] uppercase tracking-widest font-bold">
          Validando Sesión Directiva...
        </span>
      </div>
    );
  }

  if (!autenticado) {
    return <Registro onLoginSuccess={manejarExitoLogin} />;
  }

  return <Seccion1 onLogout={cerrarSesion} variante={varianteFondo} />;
}