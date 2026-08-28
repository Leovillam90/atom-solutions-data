import React from 'react';
import type { Metadata, Viewport } from 'next';
import Menu from '@/app/Menu_Contacto/paginas/Menu';
import Contacto from '@/app/Menu_Contacto/paginas/Contacto';
import './globals.css';

export const metadata: Metadata = {
  title: 'ATOM Solutions Data - Centro de Mando Operativo',
  description: 'Sistema de auditoría y control financiero para proveedores y dropshippers.',
};

export const viewport: Viewport = {
  themeColor: '#091A23',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="bg-[#091A23] text-white antialiased m-0 p-0 min-h-screen flex flex-col justify-between selection:bg-[#0DEDC0] selection:text-[#061217]">
        
        {/* 1. Menú principal / Navegación */}
        <header className="w-full">
          <Menu variante="spotlightCyan" />
        </header>

        {/* 2. Contenedor semántico principal (se expande dinámicamente) */}
        <main className="flex-1 w-full">
          {children}
        </main>
        
        {/* 3. Pie de página de Contacto */}
        <footer className="w-full">
          <Contacto variante="spotlightCyan" />
        </footer>

      </body>
    </html>
  );
}