'use server';

import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export interface PayloadCancelacion {
  nombreSolicitante: string;
  correo: string;
  cuentaAtom: string;
  planActual: string;
  rolProveeduria: string;
  motivo: string;
  detalles: string;
  aceptoOfertaRetencion: boolean;
  fechaSolicitud: string;
}

export async function registrarSolicitudCancelacion(data: PayloadCancelacion) {
  try {
    const docId = `${Date.now()}_${(data.cuentaAtom || 'anon').replace(/\s+/g, '_')}`;
    const estadoInicial = data.aceptoOfertaRetencion ? 'RETENIDO_DESCUENTO' : 'PENDIENTE_BAJA';

    // 1. Guardar siempre en Firestore desde el servidor
    const docRef = doc(db, 'solicitudes_baja', docId);
    await setDoc(docRef, {
      nombreSolicitante: data.nombreSolicitante || 'Sin Nombre',
      correo: data.correo || 'sin-correo@atom.com',
      cuentaAtom: data.cuentaAtom || 'Bodega Sin Nombre',
      planActual: data.planActual || 'EXPERTO',
      rolProveeduria: data.rolProveeduria || 'Importador Directo',
      motivo: data.motivo || 'Sin especificar',
      detalles: data.detalles || '',
      aceptoOfertaRetencion: Boolean(data.aceptoOfertaRetencion),
      fechaSolicitud: data.fechaSolicitud || new Date().toISOString(),
      estado: estadoInicial,
    });

    // 2. Intentar despacho de correo con Resend
    const apiKey = process.env.RESEND_API_KEY;

    if (apiKey) {
      try {
        const htmlEmail = `
          <div style="font-family: Arial, sans-serif; background-color: #090D16; color: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #0DEDC0;">
            <h2 style="color: #0DEDC0; margin-top: 0;">🚨 SOLICITUD DE DESCONEXIÓN / BAJA EN ATOM</h2>
            <p><strong>Bodega:</strong> ${data.cuentaAtom}</p>
            <p><strong>Solicitante:</strong> ${data.nombreSolicitante} (${data.correo})</p>
            <p><strong>Plan:</strong> ${data.planActual} | <strong>Rol:</strong> ${data.rolProveeduria}</p>
            <p><strong>Motivo:</strong> ${data.motivo}</p>
            <p><strong>Retención Aceptada:</strong> ${data.aceptoOfertaRetencion ? 'SÍ (50% desc)' : 'NO'}</p>
            <p><strong>Observaciones:</strong> ${data.detalles || 'Sin observaciones'}</p>
          </div>
        `;

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: 'onboarding@resend.dev',
            to: ['info@atomsolutionsdata.com', 'director@atomsolutionsdata.com'],
            subject: `🚨 Cancelación ATOM: ${data.cuentaAtom}`,
            html: htmlEmail,
          }),
        });
      } catch (emailErr) {
        console.warn('⚠️ No se pudo despachar el correo, pero la solicitud quedó guardada en Bases de Datos:', emailErr);
      }
    }

    return { success: true, docId };

  } catch (error: any) {
    console.error('❌ Error en Server Action cancelaciones.ts:', error);
    return { success: false, error: error.message || 'Error guardando en Bases de Datos.' };
  }
}