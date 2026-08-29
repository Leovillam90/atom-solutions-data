export interface MonedaConfig {
  codigo: string;
  nombre: string;
  simbolo: string;
  locale: string;
  decimales: number; // ⚡ Movido a la config para evitar condicionales quemados
}

export interface TarifaImpuesto {
  valor: number;
  label: string;
}

export const MONEDAS: readonly MonedaConfig[] = Object.freeze([
  { codigo: 'COP', nombre: 'Colombia (COP)', simbolo: '$', locale: 'es-CO', decimales: 0 },
  { codigo: 'USD', nombre: 'Estados Unidos (USD)', simbolo: '$', locale: 'en-US', decimales: 2 },
  { codigo: 'MXN', nombre: 'México (MXN)', simbolo: '$', locale: 'es-MX', decimales: 2 },
  { codigo: 'GTQ', nombre: 'Guatemala (GTQ)', simbolo: 'Q', locale: 'es-GT', decimales: 2 },
  { codigo: 'PEN', nombre: 'Perú (PEN)', simbolo: 'S/', locale: 'es-PE', decimales: 2 },
  { codigo: 'CLP', nombre: 'Chile (CLP)', simbolo: '$', locale: 'es-CL', decimales: 0 },
  { codigo: 'BRL', nombre: 'Brasil (BRL)', simbolo: 'R$', locale: 'pt-BR', decimales: 2 },
  { codigo: 'EUR', nombre: 'Europa (EUR)', simbolo: '€', locale: 'es-ES', decimales: 2 },
  { codigo: 'VES', nombre: 'Venezuela (VES)', simbolo: 'Bs', locale: 'es-VE', decimales: 2 },
]);

// ⚡ BÚSQUEDA O(1): Objeto inmutable generado sin callback reduce
const MAPA_MONEDAS: Readonly<Record<string, MonedaConfig>> = Object.freeze(
  Object.fromEntries(MONEDAS.map((m) => [m.codigo, m]))
);

export const MAPA_INDICATIVO_MONEDA: Readonly<Record<string, string>> = Object.freeze({
  '+57': 'COP',
  '+593': 'USD',
  '+52': 'MXN',
  '+595': 'USD',
  '+51': 'PEN',
  '+56': 'CLP',
  '+507': 'USD',
  '+502': 'GTQ',
  '+55': 'BRL',
  '+54': 'USD',
  '+58': 'VES',
});

export const IMPUESTOS_POR_MONEDA: Readonly<Record<string, readonly TarifaImpuesto[]>> = Object.freeze({
  COP: [
    { valor: 19, label: '19% - IVA Tarifa General' },
    { valor: 5, label: '5% - IVA Tarifa Reducida' },
    { valor: 8, label: '8% - Impuesto Consumo (INC)' },
    { valor: 0, label: '0% - Exento / Excluido' }
  ],
  MXN: [
    { valor: 16, label: '16% - IVA Tarifa General' },
    { valor: 8, label: '8% - Tasa Estímulo Fronterizo' },
    { valor: 0, label: '0% - Exento / Tasa 0%' }
  ],
  CLP: [
    { valor: 19, label: '19% - IVA Tarifa General Única' },
    { valor: 0, label: '0% - Exento' }
  ],
  PEN: [
    { valor: 18, label: '18% - IGV + IPM (General)' },
    { valor: 10, label: '10% - Tasa Especial MYPEs' },
    { valor: 0, label: '0% - Exento' }
  ],
  GTQ: [
    { valor: 12, label: '12% - IVA Régimen General' },
    { valor: 5, label: '5% - Pequeño Contribuyente' },
    { valor: 0, label: '0% - Exento' }
  ],
  BRL: [
    { valor: 18, label: '18% - ICMS Estándar (SP)' },
    { valor: 20, label: '20% - ICMS Estatal Máximo' },
    { valor: 9.25, label: '9.25% - PIS + COFINS' },
    { valor: 26.5, label: '26.5% - IVA Unificado (Reforma)' },
    { valor: 0, label: '0% - Exento' }
  ],
  VES: [
    { valor: 16, label: '16% - IVA Tarifa General' },
    { valor: 8, label: '8% - IVA Tarifa Reducida' },
    { valor: 3, label: '3% - IGTF Adicional Divisas' },
    { valor: 0, label: '0% - Exento' }
  ],
  EUR: [
    { valor: 21, label: '21% - IVA Tarifa General' },
    { valor: 10, label: '10% - IVA Tarifa Reducida' },
    { valor: 4, label: '4% - IVA Superreducido' },
    { valor: 0, label: '0% - Exento' }
  ],
  USD: [
    { valor: 15, label: '15% - Ecuador (IVA General)' },
    { valor: 13, label: '13% - Ecuador (Construcción)' },
    { valor: 8, label: '8% - Ecuador (Turismo)' },
    { valor: 15, label: '15% - Panamá (Tabaco)' },
    { valor: 10, label: '10% - Panamá (Hoteles/Alcohol) / Paraguay' },
    { valor: 7, label: '7% - Panamá ITBMS General' },
    { valor: 5, label: '5% - Paraguay IVA Reducido' },
    { valor: 21, label: '21% - Argentina (General)' },
    { valor: 10.5, label: '10.5% - Argentina (Reducida)' },
    { valor: 27, label: '27% - Argentina (Servicios)' },
    { valor: 0, label: '0% - Exento / Sin Impuesto' }
  ]
});

export const obtenerMonedaPorIndicativo = (indicativo: string): string => {
  return MAPA_INDICATIVO_MONEDA[indicativo] ?? 'COP';
};

export const obtenerTarifasImpuesto = (codigoMoneda: string = 'COP'): readonly TarifaImpuesto[] => {
  return IMPUESTOS_POR_MONEDA[codigoMoneda] ?? IMPUESTOS_POR_MONEDA['COP'];
};

// ⚡ CACHÉ EN MEMORIA PARA INSTANCIAS DE INTL.NUMBERFORMAT
const CACHE_FORMATO = new Map<string, Intl.NumberFormat>();

export const formatearMonedaGlobal = (monto: number = 0, codigoMoneda: string = 'COP'): string => {
  const config = MAPA_MONEDAS[codigoMoneda] ?? MONEDAS[0];
  
  let formatter = CACHE_FORMATO.get(config.codigo);
  if (!formatter) {
    formatter = new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.codigo,
      minimumFractionDigits: config.decimales,
      maximumFractionDigits: config.decimales
    });
    CACHE_FORMATO.set(config.codigo, formatter);
  }

  // Protección contra valores no numéricos (NaN, Infinity)
  const valorValido = Number.isFinite(monto) ? monto : 0;
  return formatter.format(valorValido);
};