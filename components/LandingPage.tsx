
import React, { useState, useEffect, useRef } from 'react';
import { Ghost, User, Lock, ArrowRight, ChefHat, Sparkles, Utensils, MapPin, X, Info, Flame, Crown, Volume2, VolumeX, Star, Zap } from 'lucide-react';
import { Role, UserAccount } from '../types';

interface LandingPageProps {
  onLogin: (name: string, role: Role, username?: string) => void;
  onVerifyStaff: (username: string, password: string) => Promise<UserAccount | null>;
}

const GHOST_REVIEWS = [
  { text: "La hamburguesa está de muerte...", author: "Conde Drácula", role: "Vampiro VIP" },
  { text: "Me quemé la lengua, ¡me encantó!", author: "Demonio Menor", role: "Cliente Frecuente" },
  { text: "Un sabor que atraviesa paredes.", author: "Casper", role: "Fantasma Amigable" },
  { text: "¡Por fin comida con alma!", author: "La Llorona", role: "Crítica Gastronómica" },
  { text: "5 estrellas oscuras.", author: "Grim Reaper", role: "Gerente de Logística" },
];

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onVerifyStaff }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showStory, setShowStory] = useState(false);

  // New Features State
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [currentReview, setCurrentReview] = useState(0);
  const [showReview, setShowReview] = useState(true);

  const audioRef = useRef<HTMLAudioElement>(null);
  const holdIntervalRef = useRef<number | null>(null);

  // Audio Control
  useEffect(() => {
    if (audioRef.current) {
      if (audioEnabled) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
        audioRef.current.volume = 0.3; // Ambiental suave
      } else {
        audioRef.current.pause();
      }
    }
  }, [audioEnabled]);

  // Review Rotator
  useEffect(() => {
    const interval = setInterval(() => {
      setShowReview(false);
      setTimeout(() => {
        setCurrentReview(prev => (prev + 1) % GHOST_REVIEWS.length);
        setShowReview(true);
      }, 500);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Submit Logic
  const executeLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // Audio Effect: Portal Sound
      if (audioEnabled) {
        const portalSound = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_298455799a.mp3');
        portalSound.volume = 0.5;
        portalSound.play().catch(() => { });
      }

      await new Promise(r => setTimeout(r, 1500)); // Dramatic Entry Delay

      if (isLoginMode) {
        if (!username || !password) {
          throw new Error('Por favor completa todos los campos.');
        }

        const user = await onVerifyStaff(username, password);
        if (user) {
          onLogin(user.name, user.role, user.username);
          // Don't reset loading here - let the parent component handle transition
        } else {
          throw new Error('Credenciales incorrectas. Intenta de nuevo.');
        }
      } else {
        if (!guestName.trim()) {
          throw new Error('Por favor ingresa tu nombre para continuar.');
        }
        onLogin(guestName, 'guest');
        // Don't reset loading here - let the parent component handle transition
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || 'Error desconocido al iniciar sesión');
      setLoading(false);
      setHoldProgress(0);
    }
  };

  // Hold Button Logic
  const startHold = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent default click immediately
    if (loading) return;
    setIsHolding(true);

    // Reset if starting over
    setHoldProgress(0);

    const startTime = Date.now();
    const duration = 1200; // 1.2 seconds to charge

    holdIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        stopHold();
        executeLogin();
        // Vibration effect if supported
        if (navigator.vibrate) navigator.vibrate(200);
      }
    }, 16);
  };

  const stopHold = () => {
    setIsHolding(false);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    // If not complete, dramatic drop back to 0
    if (holdProgress < 100) {
      const dropInterval = setInterval(() => {
        setHoldProgress(prev => {
          if (prev <= 0) {
            clearInterval(dropInterval);
            return 0;
          }
          return prev - 5;
        });
      }, 10);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[var(--bg-deep)] font-sans text-[var(--text-primary)] select-none">

      {/* AUDIO ELEMENT */}
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3" />

      {/* --- LAYER 1: VIDEO BACKGROUND --- */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60 scale-105 filter contrast-125 grayscale-[30%]"
          src="https://videos.pexels.com/video-files/3129671/3129671-hd_1920_1080_25fps.mp4"
        />
        {/* Overlays for atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)] via-[var(--bg-deep)]/40 to-black/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-[var(--neon-orange)] opacity-5 mix-blend-overlay"></div>
      </div>

      {/* --- LAYER 2: INTERACTIVE PARTICLES --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-[var(--neon-orange)]/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-pulse-neon"></div>
      </div>

      {/* --- LAYER 3: UI CONTROLS (Top Corners) --- */}
      <div className="absolute top-6 left-6 z-20 flex gap-4">
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className="glass-panel flex items-center gap-2 hover:bg-white/5 px-4 py-2 rounded-full transition-all duration-300 group border border-white/5"
        >
          {audioEnabled ? <Volume2 size={18} className="text-[var(--neon-orange)] group-hover:animate-pulse" /> : <VolumeX size={18} className="text-slate-500" />}
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest hidden md:inline font-display">Ambiente</span>
        </button>
      </div>

      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setShowStory(true)}
          className="glass-panel group flex items-center gap-2 hover:bg-white/5 px-4 py-2 rounded-full transition-all duration-300 border border-white/5"
        >
          <div className="relative">
            <Ghost size={20} className="text-slate-300 group-hover:text-white transition-colors" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--neon-orange)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--neon-orange)]"></span>
            </span>
          </div>
          <span className="text-xs font-bold text-slate-300 group-hover:text-white tracking-widest uppercase font-display">La Leyenda</span>
        </button>
      </div>

      {/* --- FLOATING REVIEWS (Left Side Absolute) --- */}
      <div className="fixed top-24 left-8 md:left-12 z-20 hidden lg:block max-w-[320px] perspective-1000">
        <div
          className={`transition-all duration-700 transform ${showReview ? 'opacity-100 rotate-y-0 translate-x-0' : 'opacity-0 rotate-y-90 -translate-x-12'}`}
        >
          {/* SPECTRAL CARD DESIGN */}
          <div className="relative group cursor-default">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-cyan)] rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative glass-panel p-6 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">

              {/* Verified Badge */}
              <div className="absolute -top-3 -right-3 bg-black border border-[var(--neon-green)] text-[var(--neon-green)] p-1.5 rounded-full shadow-[0_0_10px_rgba(0,255,0,0.3)] animate-pulse-slow">
                <Sparkles size={14} className="text-[#4ade80]" />
              </div>

              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={12} className="fill-[var(--neon-orange)] text-[var(--neon-orange)]" />
                  ))}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold font-mono text-right">Verificado<br />por Ouija</span>
              </div>

              <p className="text-slate-200 italic font-serif mb-6 leading-relaxed text-lg relative z-10">
                <span className="text-4xl absolute -top-4 -left-2 text-white/10 font-serif">"</span>
                {GHOST_REVIEWS[currentReview].text}
                <span className="text-4xl absolute -bottom-6 -right-1 text-white/10 font-serif">"</span>
              </p>

              <div className="flex items-center gap-4 mt-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-black p-[1px] relative overflow-hidden group-hover:scale-105 transition-transform">
                  <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                  <Ghost size={24} className="absolute inset-0 m-auto text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-black text-white font-display tracking-wide uppercase">{GHOST_REVIEWS[currentReview].author}</p>
                  <p className="text-[10px] font-bold text-[var(--neon-cyan)] uppercase tracking-[0.2em]">{GHOST_REVIEWS[currentReview].role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT CENTER --- */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 p-6 min-h-screen items-center">

        {/* BRANDING */}
        <div className="text-center lg:text-left space-y-8 flex flex-col items-center lg:items-start animate-slideIn">
          <div className="inline-flex items-center justify-center p-6 bg-[var(--neon-orange)]/5 rounded-full border border-[var(--neon-orange)]/20 backdrop-blur-md animate-pulse-neon group cursor-pointer hover:bg-[var(--neon-orange)]/10 transition-colors">
            <Flame size={64} className="text-[var(--neon-orange)] filter drop-shadow-[0_0_15px_rgba(249,115,22,0.8)] group-hover:scale-110 transition-transform duration-500" fill="currentColor" fillOpacity={0.2} />
          </div>

          <h1 className="text-7xl md:text-9xl font-black text-white leading-none tracking-tighter drop-shadow-2xl font-display cursor-default glitch-text" data-text="FOOD TRACK">
            FOOD<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-orange)] to-red-600 filter drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              TRACK
            </span>
          </h1>

          <div className="flex flex-col gap-4 text-slate-300 text-xl font-medium max-w-lg mx-auto lg:mx-0">
            <p className="flex items-center justify-center lg:justify-start gap-3">
              <Crown size={24} className="text-[var(--neon-orange)]" />
              <span className="font-display tracking-widest text-sm uppercase">Por orden del Rey Fantasma</span>
            </p>
            <p className="text-base text-slate-400 italic glass-panel p-4 rounded-xl border border-white/5">
              "Sabores tan intensos que despertarían a los muertos."
            </p>
          </div>
        </div>

        {/* LOGIN FORM */}
        <div className="w-full max-w-md mx-auto perspective-1000">
          <div className="glass-panel rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group hover:border-[var(--neon-orange)]/30 transition-all duration-500">

            {/* Form Header */}
            <div className="flex bg-black/40 rounded-xl p-1 mb-8 relative border border-white/5 backdrop-blur-sm">
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-[var(--neon-orange)] to-red-600 rounded-lg transition-all duration-300 ease-out shadow-[var(--neon-orange-glow)] ${isLoginMode ? 'left-1' : 'left-[calc(50%+4px)]'}`}
              ></div>
              <button
                onClick={() => { setIsLoginMode(true); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg relative z-10 font-bold text-sm tracking-wide transition-colors duration-300 font-display ${isLoginMode ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <ChefHat size={16} /> CLIENTE
              </button>
              <button
                onClick={() => { setIsLoginMode(false); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg relative z-10 font-bold text-sm tracking-wide transition-colors duration-300 font-display ${!isLoginMode ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Sparkles size={16} /> INVITADO
              </button>
            </div>

            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight font-display">
                {isLoginMode ? 'Acceso Privado' : 'Solo Mirar'}
              </h2>
              <p className="text-slate-400 text-sm">
                {isLoginMode ? 'Ingresa tus credenciales de ultratumba.' : 'Si entras como invitado, no podrás invocar comida.'}
              </p>
            </div>

            {/* Form Inputs */}
            <div className="space-y-6 mb-8">
              {isLoginMode ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--neon-orange)] uppercase tracking-[0.2em] ml-1">Usuario</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--neon-orange)] transition-colors z-10">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-[var(--neon-orange)] focus:bg-black/60 transition-all font-medium font-mono text-sm shadow-inner"
                        placeholder="NOMBRE DE USUARIO"
                      />
                      {/* Glow effect on focus */}
                      <div className="absolute inset-0 rounded-xl bg-[var(--neon-orange)]/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none blur-md"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--neon-orange)] uppercase tracking-[0.2em] ml-1">Contraseña</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--neon-orange)] transition-colors z-10">
                        <Lock size={18} />
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-[var(--neon-orange)] focus:bg-black/60 transition-all font-medium font-mono text-sm shadow-inner"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--neon-orange)] uppercase tracking-[0.2em] ml-1">Tu Nombre Mortal</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--neon-orange)] transition-colors z-10">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-[var(--neon-orange)] focus:bg-black/60 transition-all font-medium font-mono text-sm shadow-inner"
                        placeholder="NOMBRE COMPLETO"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500/50 text-red-200 text-xs p-4 rounded-xl text-center flex items-center justify-center gap-3 mb-6 animate-[pulse_3s_ease-in-out_infinite]">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block shadow-[0_0_10px_red]"></span>
                <span className="font-bold tracking-wide">{error}</span>
              </div>
            )}

            {/* GAMIFIED HOLD BUTTON */}
            <div className="relative group/btn">
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--neon-orange)] to-red-600 rounded-xl blur opacity-20 group-hover/btn:opacity-50 transition duration-1000 group-hover/btn:duration-200"></div>
              <button
                onMouseDown={startHold}
                onMouseUp={stopHold}
                onMouseLeave={stopHold}
                onTouchStart={startHold}
                onTouchEnd={stopHold}
                disabled={loading}
                className={`w-full relative overflow-hidden rounded-xl font-bold py-5 transition-all transform select-none uppercase tracking-widest font-display text-sm ${loading ? 'bg-slate-800 cursor-not-allowed' :
                  isHolding ? 'scale-[0.98]' : 'hover:-translate-y-0.5'
                  } ${isHolding ? 'shadow-[var(--neon-orange-glow)]' : 'shadow-xl'}`}
                style={{
                  background: loading ? '#0f172a' : 'black',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                {/* Progress Bar background */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-[var(--neon-orange)] to-red-600 transition-all duration-75 ease-linear origin-left opacity-100"
                  style={{ width: `${holdProgress}%` }}
                ></div>

                <div className="relative z-10 flex items-center justify-center gap-3 text-white mix-blend-plus-lighter">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Abriendo Portal...</span>
                    </>
                  ) : holdProgress > 10 ? (
                    <>
                      <Zap size={18} className={`animate-pulse ${isHolding ? 'text-yellow-300' : ''} fill-current`} />
                      <span>¡MANTÉN PARA ENTRAR! {Math.floor(holdProgress)}%</span>
                    </>
                  ) : (
                    <>
                      <span>MANTENER PARA ENTRAR</span>
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>

              {!loading && holdProgress === 0 && (
                <p className="text-center text-[9px] text-slate-500 mt-3 uppercase tracking-[0.2em] opacity-40 group-hover/btn:opacity-80 transition-opacity">
                  (El ritual requiere permanencia)
                </p>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* --- STORY MODAL OVERLAY --- */}
      {showStory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fadeIn">
          <div className="glass-panel border border-[var(--neon-orange)]/30 w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative flex flex-col max-h-[90vh]">
            <button
              onClick={() => setShowStory(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-black/60 hover:bg-white/20 p-2 rounded-full transition-colors z-10 backdrop-blur-sm border border-white/10"
            >
              <X size={20} />
            </button>
            <div className="h-56 bg-cover bg-center relative" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop")' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)] via-[var(--bg-deep)]/60 to-transparent"></div>
              <div className="absolute bottom-6 left-8">
                <div className="flex items-center gap-2 text-[var(--neon-orange)] mb-2">
                  <Crown size={20} />
                  <span className="uppercase tracking-[0.3em] font-bold text-[10px]">La Leyenda</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white italic font-display">El Capricho del Rey</h2>
              </div>
            </div>
            <div className="p-8 overflow-y-auto text-slate-300 space-y-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3 font-display">
                  <Ghost size={24} className="text-[var(--neon-orange)]" />
                  El Hambre Eterna
                </h3>
                <p className="leading-relaxed text-sm text-slate-400 font-light">
                  Hace eones, el <strong>Rey Fantasma</strong> se aburrió de los banquetes de niebla y ceniza.
                  Deseaba el <em>crunsh</em> de una fritura perfecta y el calor del fuego vivo que sentía en su vida mortal.
                </p>
              </div>
              <div className="border-l-2 border-[var(--neon-orange)] pl-6 py-2 my-6 bg-[var(--neon-orange)]/5 rounded-r-xl">
                <p className="text-white font-medium italic font-serif text-lg">
                  "Si no puedo ir al mundo de los vivos a comer, traeré sus sabores a mi reino."
                </p>
              </div>
              <div>
                <p className="leading-relaxed text-sm text-slate-400 font-light">
                  Así nació FoodTrack. Ubicada en una grieta dimensional, servimos tanto a espectros hambrientos
                  como a mortales lo suficientemente valientes para atravesar el portal.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
