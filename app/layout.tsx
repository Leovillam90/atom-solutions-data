import React from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import Menu from '@/app/Menu_Contacto/paginas/Menu';
import Contacto from '@/app/Menu_Contacto/paginas/Contacto';
import './globals.css';

const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '1464354524587344';

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
      <head>
        {/* SCRIPT DE META PIXEL */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body className="bg-[#091A23] text-white antialiased m-0 p-0 min-h-screen flex flex-col justify-between selection:bg-[#0DEDC0] selection:text-[#061217]">
        
        {/* 1. MENÚ GLOBAL (Usa la variante configurada en Menu.tsx) */}
        <Menu />

        {/* 2. CONTENIDO PRINCIPAL DE LA PÁGINA */}
        <main className="flex-1 w-full relative z-10">
          {children}
        </main>
        
        {/* 3. PIE DE PÁGINA GLOBAL (Usa la variante configurada en Contacto.tsx) */}
        <Contacto />

      </body>
    </html>
  );
}