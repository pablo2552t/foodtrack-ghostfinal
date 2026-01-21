
import React, { useState, useEffect } from 'react';
import { Tab, User } from '../types';
import { ShoppingBag, ClipboardList, Ghost, LogOut, Clock, LayoutDashboard, ChefHat, Menu as MenuIcon, X } from 'lucide-react';

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  cartCount: number;
  user: User | null;
  onLogout: () => void;
  soulsCollected?: number;
  isGuest?: boolean;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, cartCount, user, onLogout, soulsCollected = 0, isGuest = false }) => {
  const [animateCart, setAnimateCart] = useState(false);
  const [animateSouls, setAnimateSouls] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (cartCount > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  useEffect(() => {
    if (soulsCollected > 0) {
      setAnimateSouls(true);
      const timer = setTimeout(() => setAnimateSouls(false), 500); // Longer animation for souls
      return () => clearTimeout(timer);
    }
  }, [soulsCollected]);

  const isAdmin = user?.role === 'admin';
  const isCook = user?.role === 'cook';
  const isClient = user?.role === 'client' || isGuest;

  const getNavItems = () => {
    if (isAdmin) {
      return [
        { id: 'admin', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'menu', label: 'Vista Menú', icon: ShoppingBag },
      ] as const;
    }
    if (isCook) {
      return [
        { id: 'kitchen', label: 'Comandas', icon: ChefHat },
        { id: 'menu', label: 'Vista Menú', icon: ShoppingBag },
      ] as const;
    }
    return [
      { id: 'menu', label: 'Menú', icon: ShoppingBag },
      ...(isGuest ? [] : [
        { id: 'status', label: 'Rastrear', icon: ClipboardList },
        { id: 'history', label: 'Historial', icon: Clock },
      ])
    ] as const;
  };

  const navItems = getNavItems();

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || mobileMenuOpen
          ? 'bg-[var(--bg-deep)]/90 backdrop-blur-md shadow-lg border-b border-white/5 py-3'
          : 'bg-transparent py-6'
          }`}
      >
        <div className="max-w-[98%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/5 shadow-2xl">

            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer group px-4"
              onClick={() => onTabChange(isAdmin ? 'admin' : isCook ? 'kitchen' : 'menu')}
            >
              <div className="bg-[var(--neon-orange)] p-2 rounded-xl text-white group-hover:bg-white group-hover:text-black transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                <Ghost size={20} className="animate-pulse" />
              </div>
              <span className="text-xl font-black tracking-widest text-white italic font-display hidden sm:block">
                FOOD<span className="text-[var(--neon-orange)]">TRACK</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                const isCartItem = item.id === 'menu' && !isAdmin && !isCook;

                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id as Tab)}
                    className={`
                      relative px-6 py-3 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 uppercase tracking-widest font-display
                      ${isActive
                        ? 'bg-[var(--neon-orange)] text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon
                      size={16}
                      className={`${isActive ? 'text-white' : ''} ${isCartItem && animateCart ? 'scale-125 text-[var(--neon-orange)]' : ''}`}
                    />
                    <span>{item.label}</span>

                    {/* Notification Badge */}
                    {isCartItem && cartCount > 0 && isClient && (
                      <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-black animate-bounce relative z-10">
                        {cartCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* User Profile & Souls - Desktop */}
            <div className="hidden md:flex items-center gap-4 pr-3">

              {/* Soul Collector Widget */}
              {isClient && (
                <div className="flex items-center gap-2 px-4 py-2 bg-black/60 rounded-full border border-white/5 group hover:border-[var(--neon-purple)]/50 transition-colors cursor-help" title="Almas Recolectadas">
                  <Ghost
                    size={16}
                    className={`text-[var(--neon-purple)] transition-transform ${animateSouls ? 'scale-150 rotate-12 text-white' : 'group-hover:animate-bounce'}`}
                  />
                  <div className="flex flex-col items-start leading-none">
                    <span className={`text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-colors ${animateSouls ? 'text-[var(--neon-orange)]' : ''}`}>Almas</span>
                    <span className="text-sm font-black text-white font-mono">{soulsCollected}</span>
                  </div>
                </div>
              )}

              <div className="text-right hidden xl:block">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--neon-purple)]">
                  {isAdmin ? 'Sistema' : isCook ? 'Cocina' : isGuest ? 'Espectador' : 'Conectado'}
                </p>
                <p className="text-xs font-bold text-white leading-none font-mono">{user?.name?.split(' ')[0] || 'Invitado'}</p>
              </div>
              <button
                onClick={onLogout}
                className="p-3 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-slate-400 transition-colors border border-white/5"
                title="Cerrar Sesión"
              >
                <LogOut size={18} />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-white p-3 hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--bg-deep)]/95 backdrop-blur-xl md:hidden pt-24 px-6 animate-fadeIn">

          {/* Mobile Souls Stats */}
          {isClient && (
            <div className="mb-6 bg-black/40 p-4 rounded-xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[var(--neon-purple)]/20 p-2 rounded-full">
                  <Ghost className="text-[var(--neon-purple)]" size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Almas Recolectadas</p>
                  <p className="text-xl font-black text-white">{soulsCollected}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id as Tab);
                  setMobileMenuOpen(false);
                }}
                className={`p-4 rounded-xl flex items-center gap-4 text-sm font-bold border transition-all uppercase tracking-widest font-display ${activeTab === item.id
                  ? 'bg-[var(--neon-orange)] border-[var(--neon-orange)] text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                  : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'}`}
              >
                <item.icon className={activeTab === item.id ? 'text-white' : 'text-slate-500'} size={20} />
                {item.label}
              </button>
            ))}
            <div className="h-px bg-white/10 my-4"></div>
            <button
              onClick={onLogout}
              className="p-4 rounded-xl flex items-center gap-4 text-sm font-bold text-red-500 hover:bg-red-500/10 border border-red-500/20 uppercase tracking-widest"
            >
              <LogOut size={20} /> Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
