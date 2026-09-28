import { db } from '@/app/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface CancelacionPayload {
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

export async function registrarSolicitudCancelacion(payload: CancelacionPayload) {
  try {
    // 1. Apuntar a la colección 'solicitudes_cancelacion'
    const cancelacionesRef = collection(db, 'solicitudes_cancelacion');

    // 2. Guardar el documento en Firestore con marca de tiempo del servidor
    const docRef = await addDoc(cancelacionesRef, {
      ...payload,
      creadoEn: serverTimestamp(),
      estado: 'PENDIENTE_REVISION',
    });

    return {
      success: true,
      id: docRef.id,
    };
  } catch (error: any) {
    console.error('Error al registrar la cancelación en Firestore:', error);

    return {
      success: false,
      error: error.message || 'Error de permisos o conexión con Firebase Firestore.',
    };
  }
}