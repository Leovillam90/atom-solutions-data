'use client';

import React from 'react';
import Seccion1 from './paginas/Seccion1';

export default function AtomAppPage() {
  return (
    <main className="fixed inset-0 w-screen h-screen h-[100dvh] bg-[#070B14] overflow-hidden z-[99999]">
      <Seccion1 />
    </main>
  );
}