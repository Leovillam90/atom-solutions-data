import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();

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
    } = data;

    // Configuración del servidor SMTP emisor
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465, // true para puerto 465 (SSL), false para 587 (TLS)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Lista de correos receptores
    const destinatarios = [
      'info@atomsolutionsdata.com',
      process.env.CORREO_DIRECTOR || 'director@atomsolutionsdata.com',
    ];

    // Formateo de fecha para el reporte
    const fechaFormateada = fechaSolicitud 
      ? new Date(fechaSolicitud).toLocaleString('es-CO', { timeZone: 'America/Bogota' })
      : new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });

    // Plantilla HTML del correo electrónico
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #070B14; color: #e2e8f0; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #091A23; border: 1px solid #0DEDC033; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .header { background-color: #102935; padding: 24px; text-align: center; border-bottom: 2px solid #0DEDC0; }
          .header h1 { color: #0DEDC0; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 1px; }
          .header p { color: #94a3b8; font-size: 12px; margin-top: 4px; }
          .content { padding: 24px; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
          .badge-danger { background-color: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
          .badge-success { background-color: rgba(13, 237, 192, 0.15); color: #0DEDC0; border: 1px solid rgba(13, 237, 192, 0.3); }
          .table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          .table td { padding: 12px 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 13px; }
          .table td.label { font-weight: bold; color: #94a3b8; width: 40%; }
          .table td.value { color: #ffffff; font-weight: 600; }
          .box-obs { margin-top: 20px; padding: 16px; background-color: #102935; border-left: 3px solid #6884C5; border-radius: 8px; font-size: 12px; line-height: 1.5; color: #cbd5e1; }
          .footer { background-color: #070B14; padding: 16px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid rgba(255, 255, 255, 0.05); }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ATOM SOLUTIONS DATA</h1>
            <p>NOTIFICACIÓN OFICIAL DE CANCELACIÓN / RETENCIÓN</p>
          </div>

          <div class="content">
            <div style="text-align: center; margin-bottom: 16px;">
              ${aceptoOfertaRetencion 
                ? '<span class="badge badge-success">🎉 ACEPTÓ RETENCIÓN (50% DESCUENTO)</span>' 
                : '<span class="badge badge-danger">🚨 SOLICITUD DE BAJA DEFINITIVA</span>'
              }
            </div>

            <table class="table">
              <tr>
                <td class="label">Cuenta / Bodega:</td>
                <td class="value" style="color: #0DEDC0; font-size: 15px;">${cuentaAtom}</td>
              </tr>
              <tr>
                <td class="label">Gestor / Solicitante:</td>
                <td class="value">${nombreSolicitante}</td>
              </tr>
              <tr>
                <td class="label">Correo Corporativo:</td>
                <td class="value"><a href="mailto:${correo}" style="color: #6884C5; text-decoration: none;">${correo}</a></td>
              </tr>
              <tr>
                <td class="label">Plan Contratado:</td>
                <td class="value">${planActual}</td>
              </tr>
              <tr>
                <td class="label">Rol Proveeduría:</td>
                <td class="value">${rolProveeduria}</td>
              </tr>
              <tr>
                <td class="label">Motivo Principal:</td>
                <td class="value" style="color: #fca5a5;">${motivo}</td>
              </tr>
              <tr>
                <td class="label">Aceptó Plan Retención:</td>
                <td class="value">${aceptoOfertaRetencion ? 'SÍ (Aplica 50% desc. próx. 2 meses)' : 'NO (Solicita cancelación)'}</td>
              </tr>
              <tr>
                <td class="label">Fecha y Hora Solicitud:</td>
                <td class="value">${fechaFormateada}</td>
              </tr>
            </table>

            <div class="box-obs">
              <strong style="color: #ffffff; display: block; margin-bottom: 4px;">Observaciones del cliente:</strong>
              ${detalles ? detalles : '<em>Sin detalles o comentarios adicionales proporcionados.</em>'}
            </div>
          </div>

          <div class="footer">
            Este es un correo automático generado por la plataforma <strong>ATOM App</strong>.<br>
            © 2026 ATOM Solutions Data. Todos los derechos reservados.
          </div>
        </div>
      </body>
      </html>
    `;

    // Opciones del envío
    const mailOptions = {
      from: `"ATOM App - Notificaciones" <${process.env.SMTP_USER}>`,
      to: destinatarios.join(', '),
      subject: `🚨 [SOLICITUD CANCELACIÓN] - ${cuentaAtom} (${planActual})`,
      html: htmlContent,
      replyTo: correo,
    };

    // Envío del correo vía SMTP
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Notificación por correo enviada exitosamente.',
    });
  } catch (error: any) {
    console.error('Error enviando notificación por correo:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error interno al procesar el envío de correo.',
      },
      { status: 500 }
    );
  }
}