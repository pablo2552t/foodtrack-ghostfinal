
import React from 'react';
import { Order, OrderStatus } from '../types';
import { ChefHat, Clock, CheckCircle } from 'lucide-react';

interface CookDashboardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

const CookDashboard: React.FC<CookDashboardProps> = ({ orders = [], onUpdateStatus }) => {
  // Solo mostrar pedidos que no han sido entregados
  // Ordenar: Los más antiguos primero (FIFO - First In First Out) para la cocina
  const kitchenOrders = orders
    .filter(o => o.status !== OrderStatus.DELIVERED)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn pb-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3 font-display uppercase tracking-widest">
            <ChefHat className="text-[var(--neon-orange)]" size={32} />
            Cocina / Comandas
          </h2>
          <p className="text-slate-400 font-mono">
            {kitchenOrders.length === 0
              ? "PORTAL INACTIVO. ESPERANDO INVOCACIONES."
              : `HAY ${kitchenOrders.length} INVOCACIONES PENDIENTES.`}
          </p>
        </div>
        <div className="bg-[var(--neon-orange)]/10 text-[var(--neon-orange)] px-4 py-2 rounded-lg font-bold border border-[var(--neon-orange)]/30 animate-pulse-slow uppercase tracking-widest text-xs font-mono">
          ● Modo Cocina
        </div>
      </div>

      {kitchenOrders.length === 0 ? (
        <div className="text-center py-20 glass-panel bg-black/60 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--neon-orange)]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 relative z-10">
            <CheckCircle className="text-slate-500 w-12 h-12" />
          </div>
          <h3 className="text-xl font-bold text-white relative z-10 font-display uppercase tracking-widest">Todo limpio, Chef.</h3>
          <p className="text-slate-500 relative z-10 font-mono text-sm mt-2">Los espíritus están saciados por ahora...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {kitchenOrders.map((order) => {
            const isReady = order.status === OrderStatus.READY;

            return (
              <div
                key={order.id}
                className={`rounded-2xl shadow-lg overflow-hidden border transition-all duration-300 relative group
                  ${isReady
                    ? 'bg-emerald-900/20 border-emerald-500/30 opacity-75 grayscale-[0.5]'
                    : 'glass-panel bg-black/60 border-white/10 hover:border-[var(--neon-orange)]/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]'}`}
              >
                {/* Header Ticket */}
                <div className={`p-4 border-b flex justify-between items-center relative overflow-hidden
                  ${isReady ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/5'}`}>

                  {/* Neon Stripe for visual pop */}
                  {!isReady && <div className="absolute top-0 left-0 w-1 h-full bg-[var(--neon-orange)] shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>}

                  <div className="pl-3">
                    <span className="block text-2xl font-mono font-black text-white tracking-widest">#{order.id.split('-')[0]}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      {order.customerName || 'Anónimo'}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--neon-orange)] font-mono bg-[var(--neon-orange)]/10 px-2 py-1 rounded">
                      <Clock size={12} />
                      {Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)}m
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider border
                      ${isReady
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-white/10 text-white border-white/20'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-6">
                  <ul className="space-y-4">
                    {order.items?.map((item: any, idx: number) => (
                      <li key={idx} className="flex items-start gap-4">
                        <span className="bg-[var(--neon-orange)] text-black font-black min-w-[28px] h-7 rounded flex items-center justify-center text-sm shadow-[0_0_10px_rgba(249,115,22,0.6)] mt-0.5">
                          {item.quantity}
                        </span>
                        <div>
                          <p className="font-bold text-white text-md leading-tight group-hover:text-[var(--neon-orange)] transition-colors">{item.product?.name || item.name || 'Item'}</p>
                          {/* Notes placeholder */}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="p-4 bg-black/40 border-t border-white/5 backdrop-blur-md">
                  {!isReady ? (
                    <button
                      onClick={() => onUpdateStatus(order.id, OrderStatus.READY)}
                      className="w-full bg-white hover:bg-[var(--neon-orange)] text-black font-black py-4 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-95 uppercase tracking-widest text-sm hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]"
                    >
                      <CheckCircle size={20} />
                      Marcar LISTO
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        disabled
                        className="flex-1 bg-emerald-500/10 text-emerald-500 font-bold py-3 rounded-xl cursor-default border border-emerald-500/20 uppercase tracking-wide text-xs"
                      >
                        ¡Listo!
                      </button>
                      <button
                        onClick={() => onUpdateStatus(order.id, OrderStatus.DELIVERED)}
                        className="px-6 bg-slate-800 hover:bg-white hover:text-black text-slate-300 rounded-xl font-bold text-xs transition-colors border border-white/10 uppercase tracking-wide"
                        title="Marcar como entregado"
                      >
                        Entregar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CookDashboard;
