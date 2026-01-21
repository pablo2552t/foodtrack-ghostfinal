import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { Search, ChefHat, AlertCircle, History, ChevronRight, FileText, Printer, X, Ghost } from 'lucide-react';

interface StatusSectionProps {
  orders: Order[];
  initialCode?: string | null;
}

const StatusSection: React.FC<StatusSectionProps> = ({ orders, initialCode }) => {
  const [code, setCode] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [simulatedStatus, setSimulatedStatus] = useState<OrderStatus | null>(null);
  const [progress, setProgress] = useState(0);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      searchOrder(initialCode);
    }
  }, [initialCode]);

  const recentOrders = [...orders].sort((a, b) => b.createdAt - a.createdAt);

  useEffect(() => {
    if (!foundOrder) {
      setSimulatedStatus(null);
      setProgress(0);
      return;
    }

    const updateStatus = () => {
      const now = Date.now();
      const createdTime = new Date(foundOrder.createdAt).getTime();
      const elapsedSeconds = (now - createdTime) / 1000;

      let currentStatus = OrderStatus.PREPARING;
      let currentProgress = 33;

      if (elapsedSeconds > 20 && elapsedSeconds <= 60) {
        currentStatus = OrderStatus.READY;
        currentProgress = 100;
      } else if (elapsedSeconds > 60) {
        currentStatus = OrderStatus.DELIVERED;
        currentProgress = 100;
      } else {
        const prepProgress = 33 + (elapsedSeconds / 20) * 57;
        currentProgress = Math.min(prepProgress, 90);
      }

      setSimulatedStatus(currentStatus);
      setProgress(currentProgress);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, [foundOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchOrder(code);
  };

  const searchOrder = (searchCode: string) => {
    setError('');
    setFoundOrder(null);
    setShowInvoice(false);

    const normalizedCode = searchCode.trim().toUpperCase();
    if (!normalizedCode) return;

    const order = orders.find(o => o.code === normalizedCode);
    if (order) {
      setFoundOrder(order);
      setCode(normalizedCode);
    } else {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        fetch(`${API_URL}/orders/code/${normalizedCode}`)
          .then(res => {
            if (res.ok) return res.json();
            throw new Error('Not found');
          })
          .then(data => {
            setFoundOrder(data);
            setCode(normalizedCode);
          })
          .catch(() => {
            setError('Código espectral no detectado. Verifica tus runas.');
          });
      } catch (e) {
        setError('Código espectral no detectado. Verifica tus runas.');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PREPARING:
        return {
          color: 'text-[var(--neon-orange)]',
          stroke: 'stroke-[var(--neon-orange)]',
          bg: 'bg-[var(--neon-orange)]/10',
          shadow: 'shadow-[0_0_30px_rgba(249,115,22,0.3)]',
          icon: <ChefHat size={32} className="text-[var(--neon-orange)] animate-bounce" />,
          title: 'Materializando...',
          message: 'Nuestros espectros cocinan tu pedido.',
          subMessage: 'La espera es parte del ritual.'
        };
      case OrderStatus.READY:
        return {
          color: 'text-[var(--neon-cyan)]',
          stroke: 'stroke-[var(--neon-cyan)]',
          bg: 'bg-[var(--neon-cyan)]/10',
          shadow: 'shadow-[0_0_30px_rgba(6,182,212,0.3)]',
          icon: <Ghost size={32} className="text-[var(--neon-cyan)] animate-pulse" />,
          title: '¡Aparición Exitosa!',
          message: 'Tu pedido flota sobre el mostrador.',
          subMessage: 'Antes de que desaparezca...'
        };
      case OrderStatus.DELIVERED:
        return {
          color: 'text-[var(--neon-purple)]',
          stroke: 'stroke-[var(--neon-purple)]',
          bg: 'bg-[var(--neon-purple)]/10',
          shadow: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]',
          icon: <Ghost size={32} className="text-[var(--neon-purple)] animate-spin-slow" />,
          title: 'Almas Entregadas',
          message: 'El pacto ha sido sellado.',
          subMessage: 'Hasta la próxima invocación.'
        };
      default:
        return {
          color: 'text-slate-400',
          stroke: 'stroke-slate-400',
          bg: 'bg-white/5',
          shadow: 'shadow-none',
          icon: <Search size={32} className="text-slate-400" />,
          title: 'Buscando Señal...',
          message: '',
          subMessage: ''
        };
    }
  };

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const safeProgress = Number.isNaN(progress) ? 0 : progress;

  return (
    <div className="max-w-6xl mx-auto py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Search Column */}
      <div className="lg:col-span-2 space-y-8">
        <div className="text-center lg:text-left">
          <h2 className="text-4xl font-bold text-white mb-2 font-display tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            Rastrea tu Invocación
          </h2>
          <p className="text-slate-400 font-light">Introduce el código rúnico de 4 dígitos para localizar tu pedido.</p>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--neon-purple)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <form onSubmit={handleSearch} className="flex gap-4 mb-8 relative z-10">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="CÓDIGO: A1B2"
              className="flex-1 bg-black/50 border border-white/20 rounded-xl px-6 py-4 text-xl text-white uppercase tracking-[0.3em] font-mono focus:border-[var(--neon-orange)] focus:ring-1 focus:ring-[var(--neon-orange)] focus:outline-none transition-all placeholder:text-slate-600 focus:shadow-[0_0_20px_rgba(249,115,22,0.2)]"
              maxLength={4}
            />
            <button
              type="submit"
              className="bg-[var(--neon-orange)] hover:bg-white hover:text-black text-white font-black px-8 py-4 rounded-xl transition-all flex items-center gap-2 font-display tracking-widest uppercase shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
            >
              <Search size={20} />
              <span className="hidden sm:inline">Invocar</span>
            </button>
          </form>

          {error && (
            <div className="bg-red-900/20 text-red-400 p-4 rounded-xl flex items-center gap-3 border border-red-500/30 animate-fadeIn mb-6">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {foundOrder && simulatedStatus && (
            <div className="animate-fadeIn relative z-10">
              {/* WHEEL ANIMATION */}
              <div className="flex flex-col items-center justify-center py-8">
                {(() => {
                  const config = getStatusConfig(simulatedStatus);
                  return (
                    <>
                      <div className="relative w-72 h-72 mb-8 flex items-center justify-center">
                        {/* Outer Glow Ring */}
                        <div className={`absolute inset-0 rounded-full blur-xl opacity-20 ${config.bg.replace('/10', '')}`}></div>

                        <svg className="w-full h-full transform -rotate-90 absolute inset-0">
                          {/* Track */}
                          <circle
                            cx="144"
                            cy="144"
                            r={radius * 1.5}
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-white/5"
                          />
                          {/* Progress */}
                          <circle
                            cx="144"
                            cy="144"
                            r={radius * 1.5}
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeLinecap="round"
                            className={`${config.stroke} transition-all duration-1000 ease-out`}
                            style={{
                              strokeDasharray: 2 * Math.PI * (radius * 1.5),
                              strokeDashoffset: (2 * Math.PI * (radius * 1.5)) - (safeProgress / 100) * (2 * Math.PI * (radius * 1.5)),
                              filter: 'drop-shadow(0 0 4px currentColor)'
                            }}
                          />
                        </svg>

                        <div className={`w-40 h-40 rounded-full ${config.bg} flex items-center justify-center border border-white/10 ${config.shadow} transition-all duration-500`}>
                          {config.icon}
                        </div>
                      </div>

                      <h3 className={`text-3xl md:text-5xl font-black mb-3 ${config.color} text-center animate-pulse font-display tracking-widest uppercase drop-shadow-lg`}>
                        {config.title}
                      </h3>
                      <p className="text-white font-bold text-xl text-center mb-1">
                        {config.message}
                      </p>
                      <p className="text-slate-400 text-sm text-center font-mono">
                        {config.subMessage}
                      </p>
                    </>
                  );
                })()}
              </div>

              {/* Order Details Panel */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 mt-6 backdrop-blur-md">
                <div className="flex justify-between items-end mb-6 border-b border-white/5 pb-4">
                  <h4 className="font-bold text-white font-display tracking-wider uppercase flex items-center gap-2">
                    <Ghost size={16} className="text-[var(--neon-purple)]" />
                    Detalle #{foundOrder.code}
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(foundOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <ul className="space-y-3 mb-6">
                  {foundOrder.items.map((item: any, idx: number) => (
                    <li key={idx} className="flex justify-between text-sm text-slate-300 items-center">
                      <span className="flex items-center gap-2">
                        <span className="font-bold text-[var(--neon-orange)] font-mono text-lg">{item.quantity}x</span>
                        {item.product?.name || item.name || 'Producto'}
                      </span>
                      <span className="font-mono">${Number(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-between font-black text-xl text-white border-t border-white/10 pt-4 mb-6">
                  <span className="font-display tracking-widest uppercase text-sm">Ofrenda Total</span>
                  <span className="font-mono text-[var(--neon-orange)] text-shadow-neon">${Number(foundOrder.total).toFixed(2)}</span>
                </div>

                <button
                  onClick={() => setShowInvoice(true)}
                  className="w-full border border-white/20 hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10 text-slate-300 font-bold py-4 px-4 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm font-display"
                >
                  <FileText size={18} />
                  Ver Comprobante
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent History Sidebar */}
      <div className="lg:col-span-1">
        <div className="glass-panel bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden sticky top-24 shadow-2xl">
          <div className="bg-white/5 p-5 border-b border-white/5 flex items-center gap-3">
            <History className="text-[var(--neon-purple)]" size={20} />
            <h3 className="font-bold text-white font-display tracking-widest uppercase text-sm">Historial Espectral</h3>
          </div>

          <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm font-mono">
                El vacío reina aquí.<br />No has invocado nada aún.
              </div>
            ) : (
              <ul className="divide-y divide-white/5">
                {recentOrders.map(order => (
                  <li
                    key={order.id}
                    onClick={() => searchOrder(order.id)}
                    className={`p-4 hover:bg-white/5 cursor-pointer transition-colors group ${foundOrder?.id === order.id ? 'bg-[var(--neon-orange)]/10 border-l-2 border-[var(--neon-orange)] pl-[14px]' : ''}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono font-bold text-slate-200 group-hover:text-[var(--neon-orange)] transition-colors text-xs">
                        {order.id.split('-')[0]}...
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 group-hover:text-white transition-colors">
                        {order.items.length} items
                      </span>
                      <span className="font-bold text-white font-mono">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* INVOICE MODAL (STYLED FOR PRINT BUT DARK MODE VIEW) */}
      {showInvoice && foundOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          {/* Global Print Styles injected here for isolation */}
          <style>{`
            @media print {
              body * { visibility: hidden; }
              #invoice-content, #invoice-content * { visibility: visible; }
              #invoice-content {
                position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0;
                background: white !important; color: black !important;
                box-shadow: none; border: none;
              }
              .no-print { display: none !important; }
            }
          `}</style>

          <div id="invoice-content" className="bg-white text-black w-full max-w-sm rounded-none md:rounded-lg shadow-2xl overflow-hidden relative animate-scaleIn font-mono">
            <div className="no-print absolute top-2 right-2 z-10">
              <button onClick={() => setShowInvoice(false)} className="p-2 text-slate-400 hover:text-black rounded-full hover:bg-slate-100 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 pb-4 text-center border-b-2 border-dashed border-black">
              <h1 className="text-3xl font-black uppercase tracking-widest mb-1">FOODTRACK</h1>
              <p className="text-xs uppercase tracking-[0.2em] font-bold mb-4">Ghost Kitchen Operations</p>
              <div className="text-[10px] space-y-0.5">
                <p>Nube Digital, Sector 7G</p>
                <p>RUC: 20666666666</p>
                <p>{new Date().toLocaleDateString()} - {new Date().toLocaleTimeString()}</p>
              </div>
            </div>

            <div className="p-8 py-6">
              <div className="flex justify-between text-sm mb-6 border-b border-black pb-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Orden #</p>
                  <p className="font-bold text-xl">{foundOrder.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Cliente</p>
                  <p className="font-bold">{foundOrder.customerName || 'Anónimo'}</p>
                </div>
              </div>

              <table className="w-full text-xs mb-6">
                <thead>
                  <tr className="border-b border-black">
                    <th className="text-left py-1">Cant</th>
                    <th className="text-left py-1">Desc</th>
                    <th className="text-right py-1">Total</th>
                  </tr>
                </thead>
                <tbody className="font-medium">
                  {foundOrder.items.map((item, i) => (
                    <tr key={i}>
                      <td className="py-2">{item.quantity}</td>
                      <td className="py-2">{item.product?.name || item.name}</td>
                      <td className="py-2 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t-2 border-black pt-4 space-y-1">
                <div className="flex justify-between text-lg font-black">
                  <span>TOTAL</span>
                  <span>${Number(foundOrder.total).toFixed(2)}</span>
                </div>
                <p className="text-center text-[10px] pt-4 uppercase">
                  *** Gracias por su invocación ***
                </p>
              </div>
            </div>

            <div className="no-print p-4 bg-slate-100 flex justify-center">
              <button
                onClick={handlePrint}
                className="bg-black text-white hover:bg-slate-800 font-bold py-3 px-8 rounded-full shadow-lg flex items-center gap-2 transition-all uppercase tracking-wider text-xs"
              >
                <Printer size={16} />
                Imprimir Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusSection;