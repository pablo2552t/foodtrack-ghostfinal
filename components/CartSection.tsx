
import React from 'react';
import { CartItem } from '../types';
import { Trash2, ArrowRight, Minus, ShoppingBag, Ghost } from 'lucide-react';

interface CartSectionProps {
  cart: CartItem[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const CartSection: React.FC<CartSectionProps> = ({ cart, onRemove, onCheckout }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 border border-white/5 text-center sticky top-24 shadow-[0_0_30px_rgba(0,0,0,0.5)] bg-black/60 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[var(--neon-orange)]/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>

        <div className="w-20 h-20 bg-[var(--neon-orange)]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--neon-orange)]/20 animate-pulse-slow">
          <Ghost className="text-[var(--neon-orange)] w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 font-display tracking-widest uppercase">Portal Vacío</h3>
        <p className="text-slate-400 text-sm font-light font-mono leading-relaxed">
          El Rey Fantasma exige ofrendas.<br />
          <span className="text-[var(--neon-orange)] font-bold">Invoca algo del menú.</span>
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl shadow-2xl border border-white/10 overflow-hidden sticky top-24 bg-black/60 backdrop-blur-xl">
      <div className="bg-white/5 p-6 border-b border-white/5 backdrop-blur-md flex items-center justify-between">
        <h2 className="text-lg font-black text-white font-display tracking-widest uppercase flex items-center gap-2">
          <ShoppingBag size={18} className="text-[var(--neon-orange)]" />
          Ritual Actual
        </h2>
        <span className="bg-[var(--neon-orange)]/10 text-[var(--neon-orange)] border border-[var(--neon-orange)]/30 text-[10px] font-bold py-1 px-3 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.2)] font-mono uppercase tracking-wider">
          {cart.reduce((acc, item) => acc + item.quantity, 0)} Almas
        </span>
      </div>

      <div className="p-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
        <ul className="space-y-4">
          {cart.map((item) => (
            <li key={item.id} className="flex gap-4 items-center group bg-black/40 p-3 rounded-xl border border-white/5 hover:border-[var(--neon-orange)]/30 transition-all hover:bg-white/5">
              <div className="w-16 h-16 rounded-lg bg-black overflow-hidden flex-shrink-0 border border-white/10 relative">
                <img src={item.image} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-200 truncate group-hover:text-[var(--neon-orange)] transition-colors font-display tracking-wide">{item.name}</h4>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  ${item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-black text-white font-mono text-shadow-neon">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => onRemove(item.id)}
                  className={`transition-all p-1.5 rounded-md ${item.quantity > 1
                    ? 'text-slate-400 hover:text-white hover:bg-white/10'
                    : 'text-slate-400 hover:text-red-500 hover:bg-red-500/10'
                    }`}
                >
                  {item.quantity > 1 ? <Minus size={14} /> : <Trash2 size={14} />}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-black/40 p-6 border-t border-white/5 backdrop-blur-lg">
        <div className="flex justify-between items-center mb-6">
          <span className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Ofrenda Total</span>
          <span className="text-3xl font-black text-white font-mono drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={onCheckout}
          className="w-full bg-[var(--neon-orange)] hover:bg-white hover:text-black text-white font-black py-4 px-4 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all active:scale-[0.98] flex justify-center items-center gap-2 group font-display tracking-widest uppercase text-sm"
        >
          CONFIRMAR RITUAL
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default CartSection;
