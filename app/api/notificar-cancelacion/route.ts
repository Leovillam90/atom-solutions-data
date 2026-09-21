import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      nombreSolicitante, 
      correo, 
      cuentaAtom, 
      planActual, 
      rolProveeduria, 
      motivo, 
      detalles, 
      aceptoOfertaRetencion,
      fechaSolicitud 
    } = body;

    const fechaFormateada = new Date(fechaSolicitud).toLocaleString('es-CO', {
      dateStyle: 'long',
      timeStyle: 'short',
    });

    const htmlEmail = `
      <div style="font-family: Arial, sans-serif; background-color: #070B14; color: #ffffff; padding: 30px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #0DEDC0;">
        <h2 style="color: #FF4D4D; border-bottom: 2px solid #FF4D4D; padding-bottom: 10px; margin-top: 0;">
          ⚠️ ALERTA DE CANCELACIÓN DE CUENTA
        </h2>
        
        <p style="color: #cbd5e1; font-size: 14px;">
          Se ha recibido una nueva solicitud de baja desde el panel de control de ATOM:
        </p>
        
        <table style="width: 100%; color: #ffffff; border-collapse: collapse; margin-top: 20px; font-size: 13px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b; font-weight: bold; color: #0DEDC0;">Cuenta / Bodega:</td>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b; font-weight: bold;">${cuentaAtom}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b; font-weight: bold; color: #0DEDC0;">Solicitante:</td>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b;">${nombreSolicitante}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b; font-weight: bold; color: #0DEDC0;">Correo de Contacto:</td>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b;">${correo}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b; font-weight: bold; color: #0DEDC0;">Plan / Rol:</td>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b;">${planActual} (${rolProveeduria})</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b; font-weight: bold; color: #FF4D4D;">Motivo Principal:</td>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b; font-weight: bold; color: #FF4D4D;">${motivo || 'No especificado'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b; font-weight: bold; color: #0DEDC0;">¿Aceptó 50% Desc?</td>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b; font-weight: bold; color: ${aceptoOfertaRetencion ? '#0DEDC0' : '#FF4D4D'};">
              ${aceptoOfertaRetencion ? 'SÍ (RETIENE CUENTA CON DESCUENTO)' : 'NO (SOLICITA BAJA DEFINITIVA)'}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b; font-weight: bold; color: #0DEDC0;">Detalles Adicionales:</td>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b;">${detalles || 'Sin observaciones'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b; font-weight: bold; color: #0DEDC0;">Fecha Solicitud:</td>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b;">${fechaFormateada}</td>
          </tr>
        </table>

        <div style="margin-top: 30px; text-align: center;">
          <a href="https://atomsolutionsdata.com/admin" style="background-color: #0DEDC0; color: #070B14; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">
            Abrir Consola Admin ATOM →
          </a>
        </div>
      </div>
    `;

    // Envío vía API de Resend (o reemplaza con tu servicio SMTP si usas Nodemailer)
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'ATOM Alertas <notificaciones@atomsolutionsdata.com>',
        to: ['info@atomsolutionsdata.com'],
        subject: `⚠️ ALERTA CANCELACIÓN: ${cuentaAtom} (${nombreSolicitante})`,
        html: htmlEmail,
      }),
    });

    if (!resendResponse.ok) {
      console.warn('Alerta enviada a Firestore pero fallo envío de mail vía Resend');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error enviando correo de cancelación:', error);
    return NextResponse.json({ success: false, error: 'Error enviando correo' }, { status: 500 });
  }
}