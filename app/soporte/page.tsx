'use client';

import React, { useState } from 'react';
import Pagina1 from '@/app/soporte/paginas/Pagina1';
import Pagina2 from './paginas/Pagina2';
import Pagina3 from '@/app/soporte/paginas/Pagina3';
import CancelacionModal from '@/app/soporte/paginas/CancelacionModal';

// Componente separador neón reutilizable
function SeparadorNeon() {
  return (                                                        
    <div className="relative max-w-6xl mx-auto px-6 my-6">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#0DEDC0]/30 to-transparent" />
    </div>
  );
}

export default function SoportePage() {
  const [modalCancelacionAbierto, setModalCancelacionAbierto] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#070B14]">
      {/* SECCIÓN 1 */}
      <Pagina1 variante="hexGrid" />

      {/* SEPARADOR 1 */}
      <SeparadorNeon />

      {/* SECCIÓN 2 */}
      <Pagina2 variante="hexGrid" />

      {/* SEPARADOR 2 */}
      <SeparadorNeon />

      {/* SECCIÓN 3: RECIBE EL TRIGGER PARA ABRIR EL MODAL */}
      <Pagina3 
        variante="hexGrid" 
        onAbrirCancelacion={() => setModalCancelacionAbierto(true)} 
      />

      {/* RENDER DEL MODAL DE CANCELACIÓN */}
      <CancelacionModal 
        isOpen={modalCancelacionAbierto} 
        onClose={() => setModalCancelacionAbierto(false)} 
      />
    </div>
  );
}