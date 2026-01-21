import React from 'react';
import { Order, OrderStatus } from '../types';
import { Clock, Calendar, ArrowRight, Receipt, Ghost, ChefHat, CheckCircle, Truck } from 'lucide-react';

interface HistorySectionProps {
  orders: Order[];
  onViewDetails: (orderId: string) => void;
}

const HistorySection: React.FC<HistorySectionProps> = ({ orders, onViewDetails }) => {
  // Sort orders by date (newest first)
  const sortedOrders = [...orders].sort((a, b) => b.createdAt - a.createdAt);

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PREPARING:
        return {
          color: 'text-[var(--neon-orange)]',
          bg: 'bg-[var(--neon-orange)]/10',
          border: 'border-[var(--neon-orange)]/30',
          icon: <ChefHat size={14} className="animate-bounce" />,
          label: 'Cocinando'
        };
      case OrderStatus.READY:
        return {
          color: 'text-[var(--neon-cyan)]',
          bg: 'bg-[var(--neon-cyan)]/10',
          border: 'border-[var(--neon-cyan)]/30',
          icon: <Ghost size={14} className="animate-pulse" />,
          label: 'Listo'
        };
      case OrderStatus.DELIVERED:
        return {
          color: 'text-[var(--neon-purple)]',
          bg: 'bg-[var(--neon-purple)]/10',
          border: 'border-[var(--neon-purple)]/30',
          icon: <Truck size={14} />,
          label: 'Entregado'
        };
      default:
        return {
          color: 'text-slate-400',
          bg: 'bg-white/5',
          border: 'border-white/10',
          icon: <Clock size={14} />,
          label: status
        };
    }
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <div className="glass-panel bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>

          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
            <Ghost className="text-slate-500 w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 font-display tracking-wider uppercase">Sin historial</h2>
          <p className="text-slate-400">Tu grimorio de pedidos está vacío... por ahora.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-4 font-display tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
        <HistoryIcon />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Historial de Invocaciones
        </span>
      </h2>

      <div className="grid gap-6">
        {sortedOrders.map((order) => {
          const statusConfig = getStatusConfig(order.status);

          return (
            <div
              key={order.id}
              className="glass-panel bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-white/30 hover:bg-black/70 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-300 group"
            >
              <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-black/80 text-white border border-white/20 px-3 py-1.5 rounded-lg font-mono font-bold text-sm tracking-wider shadow-inner">
                    #{order.id.split('-')[0]}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-mono">
                    <Calendar size={14} className="text-[var(--neon-purple)]" />
                    <span className="text-slate-300">{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border flex items-center gap-2 ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} shadow-[0_0_10px_rgba(0,0,0,0.2)]`}>
                  {statusConfig.icon}
                  {statusConfig.label}
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <Receipt size={14} /> Ofrendas
                    </h4>
                    <ul className="space-y-3">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-slate-300 group-hover:text-white transition-colors">
                          <span className="bg-[var(--neon-orange)]/10 text-[var(--neon-orange)] border border-[var(--neon-orange)]/20 text-xs font-mono font-bold px-2 py-1 rounded-md min-w-[2rem] text-center">
                            {item.quantity}x
                          </span>
                          <span className="font-medium tracking-wide text-sm">{item.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 gap-6 min-w-[220px]">
                    <div className="text-right">
                      <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Total</p>
                      <p className="text-3xl font-black text-white font-mono tracking-tighter drop-shadow-md">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => onViewDetails(order.id)}
                      className="group flex items-center gap-2 text-black font-black bg-white hover:bg-[var(--neon-cyan)] hover:text-black transition-all px-6 py-3 rounded-xl w-full md:w-auto justify-center uppercase tracking-wider text-xs shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                    >
                      Ver Estado
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Simple internal icon component for stylistic consistency
const HistoryIcon = () => (
  <div className="bg-[var(--neon-purple)]/20 p-2 rounded-lg border border-[var(--neon-purple)]/30">
    <Clock className="text-[var(--neon-purple)]" size={24} />
  </div>
);

export default HistorySection;