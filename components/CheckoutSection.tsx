
import React, { useState } from 'react';
import { CartItem } from '../types';
import { ArrowLeft, CheckCircle, Receipt, CreditCard, Lock, Calendar, User, Ghost, ShieldCheck } from 'lucide-react';

interface CheckoutSectionProps {
  cart: CartItem[];
  total: number;
  onConfirm: () => void;
  onBack: () => void;
}

const CheckoutSection: React.FC<CheckoutSectionProps> = ({ cart, total, onConfirm, onBack }) => {
  const [step, setStep] = useState<'summary' | 'payment'>('summary');
  const [isProcessing, setIsProcessing] = useState(false);

  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formato simple para número de tarjeta
    if (name === 'number') {
      formattedValue = value.replace(/\D/g, '').slice(0, 16);
      formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    // Formato para fecha
    if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
      if (formattedValue.length >= 3) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
      }
    }

    // Limitar CVC
    if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setCardData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simular tiempo de red bancaria (más rápido)
    setTimeout(() => {
      onConfirm();
    }, 1500);
  };

  if (isProcessing) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-12 glass-panel bg-black/60 rounded-3xl border border-[var(--neon-orange)]/30 animate-fadeIn relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--neon-orange)]/5 animate-pulse"></div>
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[var(--neon-orange)] rounded-full border-t-transparent animate-spin"></div>
          <Ghost className="absolute inset-0 m-auto text-[var(--neon-orange)] animate-bounce" size={32} />
        </div>
        <h2 className="text-2xl font-black text-white mb-2 font-display uppercase tracking-widest">Invocando Pago...</h2>
        <p className="text-slate-400 font-mono text-sm">Transferencia de almas en proceso.</p>
        <p className="text-xs text-slate-500 mt-6 uppercase tracking-widest animate-pulse">No rompas el círculo (no cierres)</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn pb-12">
      <div className="mb-8">
        <button
          onClick={step === 'payment' ? () => setStep('summary') : onBack}
          className="text-slate-400 hover:text-white flex items-center gap-3 font-bold transition-all uppercase tracking-widest text-xs group"
        >
          <div className="p-2 bg-white/5 rounded-full border border-white/10 group-hover:border-white/30 transition-colors">
            <ArrowLeft size={16} />
          </div>
          {step === 'payment' ? 'Volver al resumen' : 'Regresar al Menú'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA: RESUMEN O PAGO */}
        <div className="lg:col-span-2 space-y-6">

          {step === 'summary' ? (
            <div className="glass-panel bg-black/60 rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
              <div className="bg-black/40 p-6 border-b border-white/10 flex justify-between items-center backdrop-blur-md">
                <h2 className="text-xl font-black text-white flex items-center gap-3 font-display uppercase tracking-wide">
                  <Receipt className="text-[var(--neon-orange)]" />
                  Resumen del Ritual
                </h2>
                <span className="bg-[var(--neon-orange)]/10 text-[var(--neon-orange)] text-xs px-3 py-1 rounded-full border border-[var(--neon-orange)]/20 font-mono font-bold">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)} OFRENDAS
                </span>
              </div>

              <div className="p-6">
                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                      <div className="h-16 w-16 rounded-lg bg-black overflow-hidden flex-shrink-0 border border-white/10 relative">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white group-hover:text-[var(--neon-orange)] transition-colors">{item.name}</h3>
                        <p className="text-xs text-slate-500 truncate max-w-[200px] font-mono mt-1">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-white font-mono text-lg text-shadow-neon">${(item.price * item.quantity).toFixed(2)}</div>
                        <div className="text-xs text-slate-500 font-mono">{item.quantity} x ${item.price.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel bg-black/60 rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-slideUp">
              <div className="bg-black/40 p-6 border-b border-white/10 backdrop-blur-md">
                <h2 className="text-xl font-black text-white flex items-center gap-3 font-display uppercase tracking-wide">
                  <CreditCard className="text-[var(--neon-purple)]" />
                  Tributo Final
                </h2>
              </div>

              <div className="p-8">
                {/* TARJETA VISUAL */}
                <div className="mb-10 relative w-full max-w-sm mx-auto aspect-[1.58/1] rounded-2xl bg-gradient-to-br from-slate-900 via-black to-slate-900 border border-white/10 p-6 shadow-2xl shadow-[var(--neon-purple)]/10 flex flex-col justify-between transform transition-transform hover:scale-105 duration-500 group overflow-hidden">

                  {/* Neon Glow effect inside card */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--neon-purple)]/20 blur-3xl rounded-full pointer-events-none"></div>
                  <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[var(--neon-cyan)]/20 blur-3xl rounded-full pointer-events-none"></div>

                  <div className="flex justify-between items-start relative z-10">
                    <div className="w-12 h-9 bg-gradient-to-br from-yellow-100 to-yellow-600 rounded-md relative overflow-hidden shadow-lg border border-white/20">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-30"></div>
                    </div>
                    <span className="font-display font-black text-xl tracking-widest text-white/50 group-hover:text-white transition-colors">GHOST</span>
                  </div>

                  <div className="mt-4 relative z-10">
                    <div className="text-[8px] text-white/40 mb-1 uppercase tracking-widest font-mono">Número de Tarjeta</div>
                    <div className="font-mono text-2xl tracking-wider text-white text-shadow group-hover:text-[var(--neon-cyan)] transition-colors">
                      {cardData.number || '•••• •••• •••• ••••'}
                    </div>
                  </div>

                  <div className="flex justify-between items-end mt-4 relative z-10">
                    <div>
                      <div className="text-[8px] text-white/40 uppercase tracking-widest font-mono">Titular</div>
                      <div className="font-bold tracking-widest uppercase truncate max-w-[160px] text-sm text-white">
                        {cardData.name || 'TU NOMBRE'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[8px] text-white/40 uppercase tracking-widest font-mono">Expira</div>
                      <div className="font-mono font-bold text-white">
                        {cardData.expiry || 'MM/YY'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* FORMULARIO */}
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Número de Tarjeta</label>
                    <div className="relative group">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--neon-purple)]" size={18} />
                      <input
                        required
                        type="text"
                        name="number"
                        placeholder="0000 0000 0000 0000"
                        value={cardData.number}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl focus:border-[var(--neon-purple)] focus:ring-1 focus:ring-[var(--neon-purple)] outline-none transition-all font-mono font-bold text-white placeholder:text-slate-700"
                        maxLength={19}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nombre del Titular</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--neon-purple)]" size={18} />
                      <input
                        required
                        type="text"
                        name="name"
                        placeholder="COMO APARECE EN LA TARJETA"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                        className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl focus:border-[var(--neon-purple)] focus:ring-1 focus:ring-[var(--neon-purple)] outline-none transition-all uppercase font-bold text-white placeholder:text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Expiración</label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--neon-purple)]" size={18} />
                        <input
                          required
                          type="text"
                          name="expiry"
                          placeholder="MM/YY"
                          value={cardData.expiry}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl focus:border-[var(--neon-purple)] focus:ring-1 focus:ring-[var(--neon-purple)] outline-none transition-all font-mono font-bold text-white placeholder:text-slate-700"
                          maxLength={5}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">CVV / CVC</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--neon-purple)]" size={18} />
                        <input
                          required
                          type="password"
                          name="cvc"
                          placeholder="123"
                          value={cardData.cvc}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl focus:border-[var(--neon-purple)] focus:ring-1 focus:ring-[var(--neon-purple)] outline-none transition-all font-mono font-bold text-white placeholder:text-slate-700"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 bg-white hover:bg-[var(--neon-purple)] text-black hover:text-white text-lg font-black uppercase tracking-widest py-5 px-6 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all transform active:scale-95 flex justify-center items-center gap-3"
                  >
                    <CheckCircle size={24} />
                    Pagar ${total.toFixed(2)}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: TOTALES */}
        <div className="lg:col-span-1">
          <div className="glass-panel bg-black/60 rounded-2xl shadow-xl border border-white/10 p-8 sticky top-24">
            <h3 className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mb-6 border-b border-white/10 pb-2">Detalle de Cobro</h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-400 font-medium text-sm">
                <span>Subtotal</span>
                <span className="text-white font-mono">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 font-medium text-sm">
                <span>Servicio Ghost</span>
                <span className="text-[var(--neon-cyan)] font-mono">$0.00</span>
              </div>
              <div className="flex justify-between text-slate-400 font-medium text-sm">
                <span>Impuestos</span>
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-wide">Incluidos</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8 pt-6 border-t border-white/10 border-dashed">
              <span className="text-xl font-black text-white font-display tracking-widest uppercase">Total</span>
              <span className="text-4xl font-black text-[var(--neon-orange)] font-mono drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">${total.toFixed(2)}</span>
            </div>

            {step === 'summary' && (
              <>
                <button
                  onClick={() => setStep('payment')}
                  className="w-full bg-[var(--neon-orange)] hover:bg-white hover:text-black text-white font-black py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] flex justify-center items-center gap-3 mb-6 uppercase tracking-widest text-sm"
                >
                  Proceder al Pago <CreditCard size={18} />
                </button>
                <p className="text-[10px] text-center text-slate-500 leading-relaxed font-mono">
                  Aceptamos todas las tarjetas espectrales y criptomonedas del inframundo. <br />Transacciones seguras con encriptación 256-bit.
                </p>
              </>
            )}

            {step === 'payment' && (
              <div className="bg-emerald-900/10 rounded-xl p-4 text-[10px] text-emerald-400/80 flex gap-3 items-start border border-emerald-500/20">
                <ShieldCheck size={16} className="flex-shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">
                  Tus datos están protegidos por hechizos de alto nivel. No guardamos información sensible de tu tarjeta real en nuestros servidores fantasma.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSection;
