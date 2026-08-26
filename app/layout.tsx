import React from 'react';
import Menu from './paginas/general/Menu';
import Contacto from './paginas/general/Contacto';
import './globals.css';

export const metadata = {
  title: 'ATOM Solutions Data - Centro de Mando Operativo',
  description: 'Sistema de auditoría y control financiero para proveedores.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#091A23] text-white antialiased m-0 p-0">
        
        {/* 1. Menú con su propio fondo independiente */}
        <Menu variante="spotlightCyan" />

        {/* 2. El contenido central de las páginas */}
        <main>{children}</main>
        
        {/* 3. Footer de Contacto con su propio fondo independiente */}
        <Contacto variante="spotlightCyan" />

      </body>
    </html>
  );
}