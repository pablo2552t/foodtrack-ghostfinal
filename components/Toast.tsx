import React, { useEffect, useState } from 'react';
import { CheckCircle, X, Info, AlertCircle, Ghost } from 'lucide-react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShow(false), 300); // Wait for exit animation
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!show && !isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return <Ghost className="h-6 w-6 text-[var(--neon-orange)] animate-bounce" />;
      case 'error': return <AlertCircle className="h-6 w-6 text-red-500 animate-pulse" />;
      default: return <Info className="h-6 w-6 text-[var(--neon-purple)]" />;
    }
  };

  const borderColor = type === 'success' ? 'border-[var(--neon-orange)]' :
    type === 'error' ? 'border-red-600' : 'border-[var(--neon-purple)]';

  const shadowColor = type === 'success' ? 'shadow-[0_0_20px_rgba(249,115,22,0.4)]' :
    type === 'error' ? 'shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 'shadow-[0_0_20px_rgba(168,85,247,0.4)]';

  return (
    <div className={`fixed top-24 right-4 z-[100] pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl border ${borderColor} bg-black/90 backdrop-blur-xl ${shadowColor} transition-all duration-500 ease-in-out transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}`}>
      <div className="p-4 relative overflow-hidden group">
        {/* Background Glow */}
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl -translate-y-10 translate-x-10`}></div>

        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-bold font-display tracking-wide uppercase ${type === 'success' ? 'text-[var(--neon-orange)]' : type === 'error' ? 'text-red-500' : 'text-[var(--neon-purple)]'}`}>
              {type === 'success' ? '¡Invocación Exitosa!' : type === 'error' ? 'Fallo en el Ritual' : 'Mensaje del Más Allá'}
            </p>
            <p className="mt-1 text-sm text-slate-300 font-light">{message}</p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md bg-transparent text-slate-400 hover:text-white focus:outline-none transition-colors"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar (Optional visual flair) */}
        {isVisible && (
          <div className={`absolute bottom-0 left-0 h-1 ${type === 'success' ? 'bg-[var(--neon-orange)]' : type === 'error' ? 'bg-red-600' : 'bg-[var(--neon-purple)]'} animate-[width_3s_linear_forwards]`} style={{ width: '100%' }}></div>
        )}
      </div>
    </div>
  );
};

export default Toast;