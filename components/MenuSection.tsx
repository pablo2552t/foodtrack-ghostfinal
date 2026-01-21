
import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../types';
import { Plus, X, Flame, Search, Zap, Ghost } from 'lucide-react';

interface MenuSectionProps {
  onAddToCart: (product: Product) => void;
  isGuest: boolean;
}

// BACKUP DATA IN CASE API FAILS
const BACKUP_PRODUCTS: Product[] = [
  { id: '1', name: 'Ghost Burger Classic', description: 'Nuestra hamburguesa insignia con queso espectral.', price: 12.50, category: 'Hamburguesas', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60' },
  { id: '2', name: 'Papas Ectoplasma', description: 'Papas fritas con salsa verde neón y bacon.', price: 6.50, category: 'Acompañamientos', image: 'https://images.unsplash.com/photo-1573080496987-a199f8cd4058?auto=format&fit=crop&w=500&q=60' },
  { id: '3', name: 'Bebida Radioactiva', description: 'Refresco energizante color neón.', price: 4.00, category: 'Bebidas', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=60' },
  { id: '4', name: 'Aros del Inframundo', description: 'Aros de cebolla crujientes con tinta de calamar.', price: 7.00, category: 'Entradas', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=500&q=60' },
];

const MenuSection: React.FC<MenuSectionProps> = ({ onAddToCart, isGuest }) => {
  const [products, setProducts] = useState<Product[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) throw new Error("No data");
        const mapped = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: Number(p.price),
          category: p.category,
          image: p.imageUrl ? (p.imageUrl.startsWith('http') ? p.imageUrl : `${API_URL}${p.imageUrl}`) : 'https://placehold.co/400x300?text=No+Image'
        }));
        setProducts(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Failed to load menu from API, using backup", err);
        setProducts(BACKUP_PRODUCTS);
        setLoading(false);
      });
  }, [API_URL]);

  const categories = useMemo(() => {
    if (products.length === 0) return ['Todos'];
    const cats = Array.from(new Set(products.map(i => i.category)));
    return ['Todos', ...cats];
  }, [products]);

  const filteredItems = useMemo(() => {
    let items = products;
    if (selectedCategory !== 'Todos') {
      items = items.filter(item => item.category === selectedCategory);
    }
    if (searchTerm) {
      items = items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return items;
  }, [selectedCategory, searchTerm, products]);

  return (
    <div className="pb-20 w-full">
      {/* HERO BANNER - CINEMATIC HEADER - FULL SCREEN */}
      <div className="relative w-full h-[60vh] min-h-[500px] bg-[var(--bg-deep)] overflow-hidden mb-12 group border-b border-white/5">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-deep)] via-[var(--bg-deep)]/60 to-transparent z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-[4s] group-hover:scale-105 filter saturate-150 contrast-125"
        />

        {/* Hero Content */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-start px-8 md:px-24 max-w-5xl">
          <div className="flex items-center gap-4 mb-6 animate-fadeIn">
            <span className="text-[var(--neon-orange)] font-bold tracking-[0.4em] uppercase font-display text-sm md:text-base border border-[var(--neon-orange)]/50 px-4 py-2 rounded-full backdrop-blur-md bg-black/30 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              #1 Global Trending
            </span>
            <span className="text-white/60 font-mono text-sm tracking-widest hidden md:inline-block">
               // SISTEMA DE INVOCACIÓN ACTIVO
            </span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black text-white mb-8 leading-[0.8] drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] animate-slideIn font-display tracking-tighter mix-blend-overlay opacity-50 absolute top-1/2 right-10 -translate-y-1/2 pointer-events-none select-none hidden lg:block">
            GHOST
          </h1>

          <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-[0.9] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] animate-slideIn font-display relative z-10">
            GHOST <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-orange)] via-red-500 to-purple-600 filter drop-shadow-[0_0_25px_rgba(249,115,22,0.5)]">
              BURGER
            </span>
            <span className="block text-4xl md:text-6xl text-white outline-text">SUPREME V.2</span>
          </h1>

          <p className="text-slate-200 text-xl md:text-2xl mb-12 max-w-xl font-light leading-relaxed border-l-4 border-[var(--neon-orange)] pl-8 bg-gradient-to-r from-black/60 to-transparent py-4 rounded-r-xl backdrop-blur-sm">
            Doble carne smash, queso cheddar radioactivo, cebolla caramelizada en éter y nuestra salsa secreta de ectoplasma.
          </p>

          <div className="flex flex-col md:flex-row gap-6">
            <button
              onClick={() => {
                const burger = products.find(p => p.name.includes('Clásica'));
                if (burger && !isGuest) onAddToCart(burger);
              }}
              className="group/btn relative overflow-hidden bg-white text-black font-black py-5 px-12 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:bg-[var(--neon-orange)] hover:text-white flex items-center gap-4 text-lg tracking-widest uppercase font-display"
            >
              <Flame size={28} className="animate-pulse" />
              <span>{isGuest ? 'VER MENÚ' : 'INVOCAR AHORA'}</span>
            </button>

            <div className="flex items-center gap-4 text-white font-mono text-sm">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-900"></div>)}
              </div>
              <span className="opacity-70">Posesión inminente... <br /><b className="text-[var(--neon-orange)]">124 invocaciones</b> última hora</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & MENU HEADER */}
      <div className="w-full px-4 md:px-12 sticky top-4 z-40 backdrop-blur-none pointer-events-none mb-12">
        {/* Controls Container */}
        <div className="glass-panel p-4 rounded-full flex flex-col md:flex-row gap-4 items-center justify-between border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.6)] pointer-events-auto bg-black/80">

          {/* Title for mobile/desktop context */}
          <div className="hidden md:flex items-center gap-3 border-r border-white/10 pr-6 mr-2">
            <Zap className="text-[var(--neon-orange)]" fill="currentColor" />
            <span className="font-display font-bold text-white tracking-widest">MENÚ</span>
          </div>

          {/* Categories */}
          <div className="flex overflow-x-auto gap-2 w-full md:w-auto no-scrollbar scroll-smooth">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 font-display tracking-wider ${selectedCategory === cat
                  ? 'bg-[var(--neon-orange)] text-white border-[var(--neon-orange)] shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                  : 'bg-black/40 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                  }`}
              >
                {cat === 'Hamburguesas' && '🍔'}
                {cat === 'Bebidas' && '🥤'}
                {cat === 'Aros de Cebolla' && '🧅'}
                {cat === 'Pizzas' && '🍕'}
                {cat}
              </button>
            ))}
          </div>

          {/* Enhanced Search */}
          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--neon-orange)] transition-colors" size={16} />
            <input
              type="text"
              placeholder="BUSCAR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 group-focus-within:border-[var(--neon-orange)]/50 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none transition-all font-mono uppercase placeholder-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 max-w-7xl mx-auto px-4">
        {filteredItems.map((item) => (
          <TiltCard key={item.id} item={item} isGuest={isGuest} onAddToCart={onAddToCart} setSelectedProduct={setSelectedProduct} />
        ))}
      </div>

      {/* Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
          <div className="glass-panel w-full max-w-3xl rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row relative animate-scaleIn border border-[var(--neon-orange)]/20">

            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-white/10 text-white p-2 rounded-full transition-all border border-white/10 backdrop-blur-md"
            >
              <X size={20} />
            </button>

            {/* Image Side */}
            <div className="w-full md:w-1/2 h-64 md:h-auto relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              <img
                src={itemImage(selectedProduct)}
                alt={selectedProduct.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute bottom-4 left-4 z-20">
                <span className="bg-[var(--neon-orange)] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                  {selectedProduct.category}
                </span>
              </div>
            </div>

            {/* Info Side */}
            <div className="w-full md:w-1/2 p-8 flex flex-col bg-gradient-to-b from-[var(--bg-card)] to-black/80">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center gap-1 text-[var(--neon-orange)] text-xs font-bold uppercase tracking-widest animate-pulse">
                  <Flame size={14} fill="currentColor" /> Popular
                </span>
              </div>

              <h2 className="text-4xl font-black text-white mb-4 font-display leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                {selectedProduct.name}
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8 font-light border-l-2 border-white/10 pl-4">
                {selectedProduct.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-widest">Tiempo</p>
                  <p className="text-white font-bold flex items-center gap-2 font-mono"><Zap size={14} className="text-yellow-400" /> 15 MIN</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-widest">Calorías</p>
                  <p className="text-white font-bold flex items-center gap-2 font-mono"><Flame size={14} className="text-red-500" /> ~450</p>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-white/10 flex items-center gap-6">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Precio</p>
                  <p className="text-3xl font-black text-white font-mono">${selectedProduct.price.toFixed(2)}</p>
                </div>

                <button
                  onClick={() => {
                    if (!isGuest) onAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  disabled={isGuest}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold uppercase tracking-widest transition-all transform hover:-translate-y-1 font-display overflow-hidden relative group/btn ${isGuest
                    ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                    : 'bg-[var(--neon-orange)] text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_40px_rgba(249,115,22,0.6)]'
                    }`}
                >
                  {isGuest ? (
                    'BLOQUEADO'
                  ) : (
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      <span>AGREGAR</span>
                      <Plus size={18} />
                    </div>
                  )}
                  {!isGuest && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUBCOMPONENTS FOR EFFECTS ---

// 1. TILT CARD COMPONENT (Updated for Neon Noir)
const TiltCard = ({ item, isGuest, onAddToCart, setSelectedProduct }: { item: Product, isGuest: boolean, onAddToCart: (p: Product) => void, setSelectedProduct: (p: Product) => void }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [showGhost, setShowGhost] = useState(false);

  // Mouse Move for Desktop / Touch Move for Mobile
  const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - box.left;
    const y = clientY - box.top;

    const centerX = box.width / 2;
    const centerY = box.height / 2;

    const rotateX = (y - centerY) / 8; // Increased sensitivity
    const rotateY = (centerX - x) / 8;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovering(false);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGuest) return;

    // Trigger Ghost Animation
    setShowGhost(true);
    setTimeout(() => setShowGhost(false), 1000);

    onAddToCart(item);
  };

  return (
    <div
      className="relative group perspective-1000"
      onMouseMove={(e) => { setIsHovering(true); handleMove(e); }}
      onMouseLeave={handleLeave}
      onTouchMove={(e) => { setIsHovering(true); handleMove(e); }}
      onTouchEnd={handleLeave}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`glass-panel rounded-2xl overflow-hidden border border-white/5 shadow-lg transition-all duration-200 ease-out flex flex-col h-full bg-black/80 ${isHovering ? 'shadow-[0_0_25px_rgba(249,115,22,0.15)] z-10 border-[var(--neon-orange)]/30' : ''}`}
        style={{
          transform: isHovering
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`
            : 'rotateX(0) rotateY(0) scale3d(1, 1, 1)',
          transition: isHovering ? 'none' : 'all 0.5s ease',
        }}
        onClick={() => setSelectedProduct(item)}
      >
        {/* Image Area */}
        <div className="relative h-56 cursor-pointer overflow-hidden">
          <img
            src={item.image || 'https://placehold.co/400x300'} // Fallback safety
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-110 group-hover:filter grayscale-[20%] group-hover:grayscale-0"
          />
          {/* Dark gradient overlay on bottom of image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80"></div>

          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white border border-white/10 px-3 py-1 rounded-lg text-[10px] font-bold shadow-lg uppercase tracking-widest font-display">
            {item.category}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 flex flex-col flex-grow relative">
          {/* Subtle glow background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-[var(--neon-orange)]/50 blur-[20px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-white leading-tight font-display">{item.name}</h3>
            <span className="text-lg font-bold text-[var(--neon-orange)] font-mono drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]">${Number(item.price).toFixed(2)}</span>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-6 flex-grow font-light">
            {item.description}
          </p>

          <button
            onClick={handleAddClick}
            disabled={isGuest}
            className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 relative overflow-hidden font-display tracking-wider text-xs ${isGuest
              ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
              : 'bg-white text-black hover:bg-[var(--neon-orange)] hover:text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]'
              }`}
          >
            {isGuest ? 'SOLO VISTA' : (
              <>
                <span>AGREGAR</span>
                <Plus size={14} />
              </>
            )}

            {/* FLYING GHOST ANIMATION */}
            {showGhost && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ghostFlyUp bg-[var(--neon-orange)] text-white z-20"
              >
                <Ghost size={20} className="fill-white" />
                <span className="ml-1 font-bold">+1</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper for modal image
const itemImage = (item: any) => item.image || item.imageUrl || 'https://placehold.co/400x300';

export default MenuSection;
