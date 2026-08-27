import React from 'react';
import type { Metadata, Viewport } from 'next';
import Menu from './paginas/general/Menu';
import Contacto from './paginas/general/Contacto';
import './globals.css';

export const metadata: Metadata = {
  title: 'ATOM Solutions Data - Centro de Mando Operativo',
  description: 'Sistema de auditoría y control financiero para proveedores.',
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
      <body className="bg-[#091A23] text-white antialiased m-0 p-0">
        
        {/* 1. Menú principal */}
        <Menu variante="spotlightCyan" />

        {/* 2. Contenedor semántico principal único */}
        <main>{children}</main>
        
        {/* 3. Pie de página de Contacto */}
        <Contacto variante="spotlightCyan" />

      </body>
    </html>
  );
}