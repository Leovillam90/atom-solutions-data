import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db } from '@/app/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nombreSolicitante,
      correo,
      cuentaAtom,
      planActual,
      rolProveeduria,
      motivo,
      detalles,
      aceptoOfertaRetencion,
      fechaSolicitud,
    } = body;

    // 1. Guardar la solicitud en Firestore desde el backend
    await addDoc(collection(db, 'solicitudes_cancelacion'), {
      nombreSolicitante: nombreSolicitante || 'Sin Nombre',
      correo: correo || 'sin-correo@atom.com',
      cuentaAtom: cuentaAtom || 'Sin Cuenta',
      planActual,
      rolProveeduria,
      motivo,
      detalles,
      aceptoOfertaRetencion,
      fechaSolicitud,
      creadoEn: serverTimestamp(),
      estado: 'PENDIENTE_REVISION',
    });

    // 2. Configurar Transporter de Nodemailer optimizado para Vercel (Puerto 587 / TLS)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 587,
      secure: false, // false para puerto 587 (TLS)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Permite la conexión segura desde instancias Serverless
      },
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
    });

    // 3. Lista de destinatarios (Envía a info@ y al correo del director)
    const destinatarios = [
      'info@atomsolutionsdata.com',
      process.env.CORREO_DIRECTOR || 'director@atomsolutionsdata.com',
    ];

    const mailOptions = {
      from: `"ATOM App - Notificaciones" <${process.env.SMTP_USER}>`,
      to: destinatarios.join(', '),
      replyTo: correo,
      subject: `🚨 [SOLICITUD CANCELACIÓN] - ${cuentaAtom} (${planActual})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #1f2937; background-color: #0d1117; color: #f3f4f6; padding: 24px; border-radius: 8px;">
          <h2 style="color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 8px; margin-top: 0;">
            Nueva Solicitud de Cancelación
          </h2>
          <p style="font-size: 14px; color: #9ca3af;">Se ha recibido una nueva solicitud desde la plataforma web.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 8px 0; color: #9ca3af; width: 140px;"><strong>Cliente:</strong></td>
              <td style="padding: 8px 0; color: #ffffff;">${nombreSolicitante} (${correo})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;"><strong>Cuenta / Bodega:</strong></td>
              <td style="padding: 8px 0; color: #ffffff;">${cuentaAtom}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;"><strong>Plan Actual:</strong></td>
              <td style="padding: 8px 0; color: #38bdf8;">${planActual}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;"><strong>Rol Proveeduría:</strong></td>
              <td style="padding: 8px 0; color: #ffffff;">${rolProveeduria}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;"><strong>Motivo:</strong></td>
              <td style="padding: 8px 0; color: #f59e0b;">${motivo}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;"><strong>Oferta Retención:</strong></td>
              <td style="padding: 8px 0; color: ${aceptoOfertaRetencion ? '#10b981' : '#ef4444'}; font-weight: bold;">
                ${aceptoOfertaRetencion ? 'Aceptó descuento del 50%' : 'Solicitó baja definitiva'}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;"><strong>Observaciones:</strong></td>
              <td style="padding: 8px 0; color: #ffffff;">${detalles || 'Sin observaciones adicionales'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;"><strong>Fecha:</strong></td>
              <td style="padding: 8px 0; color: #ffffff;">${fechaSolicitud}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #374151; font-size: 12px; color: #6b7280; text-align: center;">
            Sistema de Notificaciones Automáticas - ATOM Solutions Data
          </div>
        </div>
      `,
    };

    // 4. Enviar el correo electrónico
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Notificación por correo enviada exitosamente.',
    });
  } catch (error: any) {
    console.error('Error en servidor /api/notificar-cancelacion:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error procesando la solicitud en el servidor.',
      },
      { status: 500 }
    );
  }
}