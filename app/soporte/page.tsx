'use client';

import React, { useState } from 'react';
import Pagina1 from '@/app/soporte/paginas/Pagina1';
import Pagina2 from '@/app/soporte/paginas/Pagina2';
import Pagina3 from '@/app/soporte/paginas/Pagina3';
import CancelacionModal from '@/app/soporte/paginas/CancelacionModal';

// SEPARADOR DE NEÓN ENTRE SECCIONES
function SeparadorNeon() {
  return (
    <div className="relative max-w-6xl mx-auto px-6 my-6 pointer-events-none">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#0DEDC0]/30 to-transparent" />
      <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rounded-full bg-[#0DEDC0] shadow-[0_0_10px_#0DEDC0] animate-pulse" />
    </div>
  );
}

export default function SoportePage() {
  const [modalCancelacionAbierto, setModalCancelacionAbierto] = useState<boolean>(false);

  return (
    <main className="min-h-screen bg-[#070B14] text-white w-full overflow-x-hidden font-sans">
      
      {/* SECCIÓN 1: CANALES TÁCTICOS Y AGENDA 1:1 */}
      <Pagina1 variante="perspectiveGrid" />


      {/* SECCIÓN 2: CENTRO DE INTELIGENCIA OPERATIVA & FAQS */}
      <Pagina2 variante="perspectiveGrid" />

      {/* SECCIÓN 3: TRIGGER DE GESTIÓN DE SUSCRIPCIÓN */}
      <Pagina3 
        variante="perspectiveGrid" 
        onAbrirCancelacion={() => setModalCancelacionAbierto(true)} 
      />

      {/* MODAL REACT PORTAL DE DESCONEXIÓN / RETENCIÓN */}
      <CancelacionModal 
        isOpen={modalCancelacionAbierto} 
        onClose={() => setModalCancelacionAbierto(false)} 
      />

    </main>
  );
}