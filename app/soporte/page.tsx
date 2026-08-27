'use client';

import React, { useState } from 'react';
import Seccion1 from '@/app/soporte/paginas/Seccion1';
import Seccion2 from '@/app/soporte/paginas/Seccion2';
import Seccion3 from '@/app/soporte/paginas/Seccion3';
import CancelacionModal from '@/app/soporte/paginas/CancelacionModal';

export default function SoportePage() {
  const [modalCancelacionAbierto, setModalCancelacionAbierto] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#091A23]">
      <Seccion1 variante="darkNoise" />
      <Seccion2 variante="darkNoise" />
      
      {/* Seccion3 recibe el trigger para abrir el modal */}
      <Seccion3 
        variante="darkNoise" 
        onAbrirCancelacion={() => setModalCancelacionAbierto(true)} 
      />

      {/* Render del modal controlado por estado */}
      <CancelacionModal 
        isOpen={modalCancelacionAbierto} 
        onClose={() => setModalCancelacionAbierto(false)} 
      />
    </div>
  );
}