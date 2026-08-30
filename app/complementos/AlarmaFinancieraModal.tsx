'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  AlertCircle,
  ArrowRight, 
  X, 
  Sparkles, 
  Clock, 
  ChevronDown,
  Check,
  MessageCircle
} from 'lucide-react';
import { MONEDAS, MonedaConfig, formatearMonedaGlobal } from '@/app/lib/moneda';

interface AlarmaFinancieraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OBTENER_COSTO_DEVOLUCION_MONEDA = (codigo: string): number => {
  const mapaCostos: Record<string, number> = {
    COP: 3000,
    USD: 0.75,
    MXN: 15,
    PEN: 3.0,
    CLP: 700,
    BRL: 4.0,
    ARS: 750,
    PYG: 5500,
    GTQ: 6.0,
    ECU: 0.75,
    PAN: 0.75,
  };
  return mapaCostos[codigo] ?? 0.75;
};

const WHATSAPP_OFICIAL = '573138712634';

export default function AlarmaFinancieraModal({ isOpen, onClose }: AlarmaFinancieraModalProps) {
  // Estado para hidratación segura con React Portal
  const [mounted, setMounted] = useState<boolean>(false);
  const [monedaSeleccionada, setMonedaSeleccionada] = useState<MonedaConfig>(MONEDAS[0]);
  const [selectorMonedaAbierto, setSelectorMonedaAbierto] = useState<boolean>(false);

  // VALORES CONFIGURADOS POR EL USUARIO
  const [despachosMes, setDespachosMes] = useState<number>(3500);
  const [ticketPromedio, setTicketPromedio] = useState<number>(35000);
  const [porcentajeDevolucion, setPorcentajeDevolucion] = useState<number>(28);
  const [porcentajeMerma, setPorcentajeMerma] = useState<number>(10);
  const [diasRetornoWallet, setDiasRetornoWallet] = useState<number>(18);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Bloqueo de scroll en el body mientras el modal esté activo
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const formatoMoneda = (monto: number) => 
    formatearMonedaGlobal(monto, monedaSeleccionada.codigo);

  const esMermaFalsa = porcentajeMerma === 0;
  const esLentaRetorno = diasRetornoWallet >= 12;
  const esDevolucionAlta = porcentajeDevolucion > 25;

  const diagnostico = useMemo(() => {
    const desp = Math.max(1, Number(despachosMes) || 0);
    const ticket = Math.max(0, Number(ticketPromedio) || 0);
    const pDev = Math.min(60, Math.max(0, Number(porcentajeDevolucion) || 0)) / 100;
    
    const mermaRealCalculada = esMermaFalsa ? 0.02 : Math.min(30, Math.max(0, Number(porcentajeMerma) || 0)) / 100;
    const diasWallet = Math.max(1, Number(diasRetornoWallet) || 15);

    const ventasMensualesTotales = desp * ticket;
    const costoUnitarioDevolucion = OBTENER_COSTO_DEVOLUCION_MONEDA(monedaSeleccionada.codigo);

    // 1. UNIDADES DEVUELTAS Y PÉRDIIDA EN PROCESAMIENTO
    const unidadesDevueltas = desp * pDev;
    const perdidaDevolucionesMensual = unidadesDevueltas * costoUnitarioDevolucion;

    // 2. MERMA CALCULADA SOBRE LAS UNIDADES DEVUELTAS MULTIPLICADA POR EL TICKET
    const unidadesMermadas = unidadesDevueltas * mermaRealCalculada;
    const perdidaMermasMensual = unidadesMermadas * ticket;

    // 3. CAPITAL RETENIDO EN WALLET
    const capitalCongeladoEnCaja = ventasMensualesTotales * (diasWallet / 30);

    // TOTALES
    const perdidaDirectaMensual = perdidaDevolucionesMensual + perdidaMermasMensual;
    const perdidaDirectaAnual = perdidaDirectaMensual * 12;

    return {
      ventasMensualesTotales,
      unidadesDevueltas,
      costoUnitarioDevolucion,
      perdidaDevolucionesMensual,
      unidadesMermadas,
      perdidaMermasMensual,
      capitalCongeladoEnCaja,
      perdidaDirectaMensual,
      perdidaDirectaAnual,
    };
  }, [despachosMes, ticketPromedio, porcentajeDevolucion, porcentajeMerma, esMermaFalsa, diasRetornoWallet, monedaSeleccionada.codigo]);

  const waLink = useMemo(() => {
    const textoMensaje = `Hola equipo ATOM ⚡, acabo de realizar la simulación de mi bodega en la Alarma Financiera:

📦 Despachos: ${despachosMes} pedidos/mes
💰 Moneda: ${monedaSeleccionada.codigo}
🚨 Pérdida Estimada: ${formatoMoneda(diagnostico.perdidaDirectaMensual)} / mes

Me gustaría agendar una auditoría estratégica para frenar la fuga de capital de mi operación.`;

    return `https://wa.me/${WHATSAPP_OFICIAL}?text=${encodeURIComponent(textoMensaje)}`;
  }, [despachosMes, monedaSeleccionada.codigo, diagnostico.perdidaDirectaMensual, formatoMoneda]);

  if (!isOpen || !mounted) return null;

  // TELETRANSPORTA EL MODAL A DOCUMENT.BODY CON SUPER CAPA Z-999999
  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 font-sans overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl bg-[#090D16] border-2 border-[#0DEDC0] rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_0_60px_rgba(13,237,192,0.35)] text-white space-y-3.5 my-auto max-h-[85vh] overflow-y-auto custom-scrollbar"
        >
          {/* LUZ DE RESPLANDOR AMBIENTAL */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-20 bg-[#0DEDC0]/15 rounded-full blur-2xl pointer-events-none" />

          {/* BOTÓN CERRAR */}
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors cursor-pointer z-30"
          >
            <X className="w-4 h-4" />
          </button>

          {/* ENCABEZADO */}
          <div className="text-center space-y-1 relative z-10 pt-1">
            <span className="text-[9px] font-mono font-black uppercase tracking-widest text-[#0DEDC0] bg-[#0DEDC0]/10 border border-[#0DEDC0]/30 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-[0_0_10px_rgba(13,237,192,0.25)]">
              <Sparkles className="w-3 h-3" /> SIMULADOR DE PÉRDIDAS LOGÍSTICAS
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Alarma Financiera para Bodegas
            </h3>
            <p className="text-[11px] text-slate-300 max-w-md mx-auto leading-tight">
              Calcula en tiempo real las fugas invisibles que afectan tu utilidad mensual.
            </p>
          </div>

          {/* FORMULARIO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 relative z-20 bg-[#102935]/60 p-3 rounded-xl border border-slate-800 text-[11px]">
            
            {/* SELECTOR DIVISA */}
            <div className={`relative ${selectorMonedaAbierto ? 'z-50' : 'z-10'}`}>
              <label className="block text-[9px] font-mono font-bold text-slate-300 uppercase mb-0.5">
                Moneda
              </label>
              <button
                type="button"
                onClick={() => setSelectorMonedaAbierto(!selectorMonedaAbierto)}
                className="w-full bg-[#090D16] border border-slate-700 text-white text-[11px] font-bold rounded-lg p-1.5 flex items-center justify-between cursor-pointer hover:border-[#0DEDC0]/60 transition-colors"
              >
                <span className="font-mono text-[#0DEDC0]">{monedaSeleccionada.codigo}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${selectorMonedaAbierto ? 'rotate-180' : ''}`} />
              </button>

              {selectorMonedaAbierto && (
                <div className="absolute top-full left-0 w-60 sm:w-64 mt-1 bg-[#090D16] border-2 border-[#0DEDC0]/70 rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.95)] z-50 overflow-hidden">
                  <div className="max-h-44 overflow-y-auto py-1 divide-y divide-slate-800/80 custom-scrollbar">
                    {MONEDAS.map((m) => {
                      const esSeleccionada = m.codigo === monedaSeleccionada.codigo;
                      return (
                        <button
                          key={m.codigo}
                          type="button"
                          onClick={() => {
                            setMonedaSeleccionada(m);
                            setSelectorMonedaAbierto(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-[11px] font-mono flex items-center justify-between cursor-pointer transition-colors ${
                            esSeleccionada 
                              ? 'bg-[#102935] text-[#0DEDC0] font-bold' 
                              : 'text-slate-300 hover:bg-[#102935]/80 hover:text-[#0DEDC0]'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-bold text-[#0DEDC0]">{m.codigo}</span>
                            <span className="text-slate-400 text-[10px] truncate">{m.nombre}</span>
                          </div>
                          {esSeleccionada && <Check className="w-3.5 h-3.5 text-[#0DEDC0] shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* DESPACHOS MES */}
            <div>
              <label className="block text-[9px] font-mono font-bold text-slate-300 uppercase mb-0.5">
                Despachos / Mes
              </label>
              <input
                type="number"
                min="1"
                value={despachosMes}
                onChange={(e) => setDespachosMes(Math.max(1, Number(e.target.value)))}
                className="w-full bg-[#090D16] border border-slate-700 rounded-lg p-1.5 font-mono text-white text-[11px] font-bold focus:border-[#0DEDC0] outline-none"
              />
            </div>

            {/* TICKET PROMEDIO */}
            <div>
              <label className="block text-[9px] font-mono font-bold text-slate-300 uppercase mb-0.5">
                Ticket Venta Prom.
              </label>
              <input
                type="number"
                min="0"
                value={ticketPromedio}
                onChange={(e) => setTicketPromedio(Number(e.target.value))}
                className="w-full bg-[#090D16] border border-slate-700 rounded-lg p-1.5 font-mono text-white text-[11px] font-bold focus:border-[#0DEDC0] outline-none"
              />
            </div>

            {/* % DEVOLUCIÓN */}
            <div>
              <div className="flex justify-between text-[9px] font-mono font-bold text-slate-300 uppercase mb-0.5">
                <span>% Devolución</span>
                <span className={esDevolucionAlta ? "text-red-400 font-black" : "text-slate-200"}>{porcentajeDevolucion}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={porcentajeDevolucion}
                onChange={(e) => setPorcentajeDevolucion(Number(e.target.value))}
                className="w-full accent-red-500 cursor-pointer h-1"
              />
            </div>

            {/* % MERMA / PERDIDA */}
            <div>
              <div className="flex justify-between text-[9px] font-mono font-bold text-slate-300 uppercase mb-0.5">
                <span>% Merma / Perdida</span>
                <span className="text-amber-400">{porcentajeMerma}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={porcentajeMerma}
                onChange={(e) => setPorcentajeMerma(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1"
              />
            </div>

            {/* CICLO RETORNO WALLET */}
            <div>
              <div className="flex justify-between text-[9px] font-mono font-bold text-slate-300 uppercase mb-0.5">
                <span>Retorno Wallet</span>
                <span className="text-blue-400">{diasRetornoWallet} Días</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={diasRetornoWallet}
                onChange={(e) => setDiasRetornoWallet(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-1"
              />
            </div>

          </div>

          {/* ALERTAS REACTIVAS INTELIGENTES */}
          <div className="space-y-1.5 relative z-0">
            {esDevolucionAlta && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-2 bg-red-950/60 border border-red-500/80 rounded-lg flex items-center gap-2 text-[10px] text-red-200 font-medium shadow-[0_0_12px_rgba(239,68,68,0.3)]"
              >
                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>
                  <strong>Alerta de Tasa Crítica:</strong> Un {porcentajeDevolucion}% de devolución supera el máximo sano de la industria (25%). Estás multiplicando exponencialmente tu pérdida logística.
                </span>
              </motion.div>
            )}

            {esMermaFalsa && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-2 bg-amber-950/40 border border-amber-500/60 rounded-lg flex items-center gap-2 text-[10px] text-amber-200 font-medium"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  <strong>Alerta:</strong> Asumir 0% de merma ignora pérdidas por empaque destruido o mercancía retenida. Calculamos sobre el <strong>2% técnico de las devoluciones</strong>.
                </span>
              </motion.div>
            )}

            {esLentaRetorno && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-2 bg-blue-950/40 border border-blue-500/60 rounded-lg flex items-center gap-2 text-[10px] text-blue-200 font-medium"
              >
                <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>
                  <strong>Aviso:</strong> Tardar {diasRetornoWallet} días en recuperar el dinero inmoviliza tu capital. El promedio saludable debe ser menor a 8 días.
                </span>
              </motion.div>
            )}
          </div>

          {/* RESULTADO DE LA ALARMA FINANCIERA */}
          <div className="relative z-0 bg-gradient-to-b from-[#170B0F] via-[#12070A] to-[#090D16] p-3.5 sm:p-4 rounded-xl border-2 border-red-500/80 shadow-[0_0_25px_rgba(239,68,68,0.25)] text-center space-y-2">
            <div>
              <span className="text-[9px] font-mono font-black uppercase text-red-400 tracking-widest block">
                PÉRDIDA DIRECTA ESTIMADA (MENSUAL)
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-mono font-black text-red-500 block drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]">
                {formatoMoneda(diagnostico.perdidaDirectaMensual)}
              </span>
              <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                Equivalente a <strong className="text-white">{formatoMoneda(diagnostico.perdidaDirectaAnual)}</strong> al año.
              </span>
            </div>

            {/* DESGLOSE EN 3 TARJETAS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-left pt-1">
              <div className="bg-[#090D16]/90 p-2 rounded-lg border border-red-900/50">
                <span className="text-[8px] text-red-400 uppercase font-bold block">Gasto Devoluciones</span>
                <span className="text-xs font-black text-slate-200 block">{formatoMoneda(diagnostico.perdidaDevolucionesMensual)}</span>
              </div>

              <div className="bg-[#090D16]/90 p-2 rounded-lg border border-amber-900/50">
                <span className="text-[8px] text-amber-400 uppercase font-bold block">Mermas ({porcentajeMerma}%)</span>
                <span className="text-xs font-black text-slate-200 block">{formatoMoneda(diagnostico.perdidaMermasMensual)}</span>
              </div>

              <div className="bg-[#090D16]/90 p-2 rounded-lg border border-blue-900/50">
                <span className="text-[8px] text-blue-400 uppercase font-bold block">Capital Congelado</span>
                <span className="text-xs font-black text-slate-200 block">{formatoMoneda(diagnostico.capitalCongeladoEnCaja)}</span>
              </div>
            </div>
          </div>

          {/* BOTÓN CTA FINAL A WHATSAPP */}
          <div className="relative z-0 text-center space-y-1">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-5 bg-[#0DEDC0] text-[#090D16] font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(13,237,192,0.4)] hover:bg-white hover:shadow-[0_0_35px_rgba(255,255,255,0.8)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>DETENER FUGA AHORA MISMO</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <p className="text-[9px] font-mono text-slate-400">
              ⚡ Atención prioritaria · Envía tus datos simulados a un especialista 1:1
            </p>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}