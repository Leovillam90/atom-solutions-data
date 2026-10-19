// src/app/layout.tsx
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
        {/* Preconexión DNS anticipada para que el Pixel no demore la carga móvil */}
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
      </head>
      
      <body className="bg-[#091A23] text-white antialiased m-0 p-0 min-h-screen flex flex-col justify-between selection:bg-[#0DEDC0] selection:text-[#061217]">
        
        {/* SCRIPT DE META PIXEL: Correctamente ubicado dentro de body con strategy afterInteractive */}
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

        {/* RESPALDO NOSCRIPT: Garantiza registrar visitas sin bloquear navegación */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>

        {/* 1. MENÚ GLOBAL */}
        <Menu />

        {/* 2. CONTENIDO PRINCIPAL */}
        <main className="flex-1 w-full relative z-10">
          {children}
        </main>
        
        {/* 3. PIE DE PÁGINA GLOBAL */}
        <Contacto />

      </body>
    </html>
  );
}