
import React, { useState } from 'react';
import { Order, OrderStatus, Role, UserAccount } from '../types';
import { DollarSign, Package, CheckCircle, TrendingUp, Users, UserPlus, Trash2, Clock, ChefHat, Shield, User, Ghost, Search, X } from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  users?: UserAccount[];
  onAddUser?: (user: UserAccount) => void;
  onDeleteUser?: (userId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders = [], onUpdateStatus, users = [], onAddUser, onDeleteUser }) => {
  const [activeSection, setActiveSection] = useState<'orders' | 'users' | 'menu' | 'analytics'>('orders');

  /* USER MANAGEMENT STATE */
  const [allUsers, setAllUsers] = useState<UserAccount[]>(users);

  // Fetch users when entering Users section
  React.useEffect(() => {
    if (activeSection === 'users') {
      fetchUsers();
    }
  }, [activeSection]);

  // Sync props if needed, but local fetch takes precedence
  React.useEffect(() => {
    if (users.length > 0 && allUsers.length === 0) setAllUsers(users);
  }, [users]);

  const fetchUsers = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/auth/users`);
      if (res.ok) {
        const data = await res.json();
        setAllUsers(data);
      }
    } catch (e) {
      console.error("Failed to fetch users", e);
    }
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.name && newUser.username && newUser.password) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

        let backendRole = 'CLIENTE';
        if (newUser.role === 'admin') backendRole = 'ADMINISTRADOR';
        if (newUser.role === 'cook') backendRole = 'COCINERO';

        const res = await fetch(`${API_URL}/auth/create-user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newUser.name,
            username: newUser.username,
            password: newUser.password,
            role: backendRole
          })
        });

        if (res.ok) {
          const createdUser = await res.json();
          // Update local list
          setAllUsers(prev => [...prev, {
            id: createdUser.id,
            name: createdUser.name,
            username: createdUser.username,
            password: '', // Don't store password locally
            role: newUser.role
          }]);

          if (onAddUser) {
            onAddUser({
              id: createdUser.id,
              name: createdUser.name,
              username: createdUser.username,
              password: newUser.password,
              role: newUser.role
            });
          }
          setNewUser({ name: '', username: '', password: '', role: 'cook' });
          setUserSuccessMsg(`Usuario ${newUser.name} creado correctamente en el servidor.`);
          setTimeout(() => setUserSuccessMsg(''), 3000);
          fetchUsers(); // Refresh list to be sure
        } else {
          const err = await res.json();
          alert(`Error al crear usuario: ${err.message}`);
        }
      } catch (error) {
        console.error("Error creating user", error);
        alert("Error de conexión al crear usuario.");
      }
    }
  };


  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PREPARING:
        return 'bg-[var(--neon-orange)]/10 text-[var(--neon-orange)] border-[var(--neon-orange)]/30';
      case OrderStatus.READY:
        return 'bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] border-[var(--neon-cyan)]/30';
      case OrderStatus.DELIVERED:
        return 'bg-[var(--neon-purple)]/10 text-[var(--neon-purple)] border-[var(--neon-purple)]/30';
      default:
        return 'bg-white/5 text-slate-400 border-white/10';
    }
  };

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    if (current === OrderStatus.PREPARING) return OrderStatus.READY;
    if (current === OrderStatus.READY) return OrderStatus.DELIVERED;
    return null;
  };

  // Ordenar: Pendientes primero, luego nuevos
  const sortedOrders = [...(orders || [])].sort((a, b) => {
    if (a.status === OrderStatus.DELIVERED && b.status !== OrderStatus.DELIVERED) return 1;
    if (a.status !== OrderStatus.DELIVERED && b.status === OrderStatus.DELIVERED) return -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });


  /* ANALYTICS CALCS */
  const getSalesPerHour = () => {
    const hours = new Array(24).fill(0);
    orders.forEach(o => {
      const date = new Date(o.createdAt);
      const hour = date.getHours();
      hours[hour] += Number(o.total);
    });
    return hours;
  };

  const getTopProducts = () => {
    const counts: { [key: string]: number } = {};
    orders.forEach(o => {
      if (o.items) {
        o.items.forEach(i => {
          // Fallback to name if product.name is missing
          const name = i.product?.name || i.name || 'Unknown';
          counts[name] = (counts[name] || 0) + i.quantity;
        });
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1]) // Sort by quantity desc
      .slice(0, 5); // Top 5
  };

  /* MENU MANAGEMENT STATE */
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'burgers',
    imageUrl: ''
  });

  // Fetch products when entering Menu section
  React.useEffect(() => {
    if (activeSection === 'menu') {
      fetchProducts();
    }
  }, [activeSection]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error("Failed to fetch products", e);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    const payload = {
      ...productFormData,
      price: Number(productFormData.price),
      imageUrl: productFormData.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60'
    };

    try {
      const url = editingProduct ? `${API_URL}/products/${editingProduct.id}` : `${API_URL}/products`;
      const method = editingProduct ? 'PATCH' : 'POST';

      const token = localStorage.getItem('auth_token'); // Assuming we store this on login

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(editingProduct ? "Producto actualizado" : "Producto creado");
        setProductFormOpen(false);
        setProductFormData({ name: '', description: '', price: '', category: 'burgers', imageUrl: '' });
        setEditingProduct(null);
        fetchProducts();
      } else {
        alert("Error al guardar producto");
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const token = localStorage.getItem('auth_token');
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  const openEditProduct = (p: any) => {
    setEditingProduct(p);
    setProductFormData({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.categoryId === 1 ? 'burgers' : 'drinks', // Simplification
      imageUrl: p.imageUrl
    });
    setProductFormOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn pb-20">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-bold text-white mb-2 font-display tracking-widest uppercase">
            Panel de Control
          </h2>
          <p className="text-slate-400">Gestión administrativa y operativa.</p>
        </div>

        {/* Navigation Tabs within Admin */}
        <div className="glass-panel bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10 flex flex-wrap gap-1">
          <button
            onClick={() => setActiveSection('orders')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeSection === 'orders' ? 'bg-[var(--neon-cyan)] text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
          >
            <TrendingUp size={16} /> Pedidos
          </button>
          <button
            onClick={() => setActiveSection('menu')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeSection === 'menu' ? 'bg-[var(--neon-cyan)] text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
          >
            <ChefHat size={16} /> Menú
          </button>
          <button
            onClick={() => setActiveSection('analytics')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeSection === 'analytics' ? 'bg-[var(--neon-cyan)] text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
          >
            <TrendingUp size={16} /> Analíticas
          </button>
          <button
            onClick={() => setActiveSection('users')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeSection === 'users' ? 'bg-[var(--neon-cyan)] text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
          >
            <Users size={16} /> Usuarios
          </button>
        </div>
      </div>

      {activeSection === 'orders' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="glass-panel bg-black/60 p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-[var(--neon-cyan)]/50 transition-colors">
              <div className="bg-[var(--neon-cyan)]/20 p-3 rounded-xl text-[var(--neon-cyan)]">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Ingresos</p>
                <p className="text-2xl font-black text-white glow-text-cyan">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>

            <div className="glass-panel bg-black/60 p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-[var(--neon-purple)]/50 transition-colors">
              <div className="bg-[var(--neon-purple)]/20 p-3 rounded-xl text-[var(--neon-purple)]">
                <Package size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Pedidos</p>
                <p className="text-2xl font-black text-white glow-text-purple">{totalOrders}</p>
              </div>
            </div>

            <div className="glass-panel bg-black/60 p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-[var(--neon-orange)]/50 transition-colors">
              <div className="bg-[var(--neon-orange)]/20 p-3 rounded-xl text-[var(--neon-orange)]">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Activos</p>
                <p className="text-2xl font-black text-white glow-text-orange">{activeOrders}</p>
              </div>
            </div>

            <div className="glass-panel bg-black/60 p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-emerald-500/50 transition-colors">
              <div className="bg-emerald-500/20 p-3 rounded-xl text-emerald-500">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Completados</p>
                <p className="text-2xl font-black text-white">{completedOrders}</p>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="glass-panel bg-black/60 rounded-2xl shadow-xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <h3 className="font-bold text-white text-lg font-display tracking-wide uppercase">Cola de Pedidos</h3>
              <span className="text-xs text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 px-3 py-1 rounded-full border border-[var(--neon-cyan)]/20 font-mono">
                {activeOrders} activos
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4 text-left">Orden</th>
                    <th className="px-6 py-4 text-left">Cliente</th>
                    <th className="px-6 py-4 text-left">Items</th>
                    <th className="px-6 py-4 text-left">Total</th>
                    <th className="px-6 py-4 text-left">Estado Actual</th>
                    <th className="px-6 py-4 text-left">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sortedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-white">#{order.code || order.id.slice(0, 6)}</span>
                          <span className="text-xs text-slate-500">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs border border-white/10">
                            {order.customerName ? order.customerName.charAt(0).toUpperCase() : (order.customer?.name?.charAt(0).toUpperCase() || '?')}
                          </div>
                          <span className="font-medium text-slate-300 text-sm">
                            {order.customerName || order.customer?.name || 'Anónimo'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-400 max-w-[200px]">
                          {(order.items || []).map((i: any) => `${i.quantity}x ${i.product?.name || i.name || 'Item'}`).join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-[var(--neon-orange)] font-mono">
                        ${Number(order.total).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getNextStatus(order.status) ? (
                          <button
                            onClick={() => {
                              const next = getNextStatus(order.status);
                              if (next) onUpdateStatus(order.id, next);
                            }}
                            className="bg-white/10 hover:bg-[var(--neon-cyan)] hover:text-black text-white text-xs font-bold py-2 px-4 rounded-lg border border-white/10 hover:border-transparent transition-all flex items-center gap-2 uppercase tracking-wide"
                          >
                            Avanzar a {getNextStatus(order.status) === OrderStatus.READY ? 'Listo' : 'Entregado'}
                            <CheckCircle size={14} />
                          </button>
                        ) : (
                          <span className="text-slate-500 text-xs italic flex items-center gap-1">
                            <CheckCircle size={14} /> Completado
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {sortedOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        No hay pedidos registrados en el sistema de invocaciones.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* MENU MANAGEMENT SECTION */}
      {activeSection === 'menu' && (
        <div className="animate-slideUp">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white font-display uppercase tracking-widest">Gestión del Menú</h3>
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductFormData({ name: '', description: '', price: '', category: 'burgers', imageUrl: '' });
                setProductFormOpen(true);
              }}
              className="bg-[var(--neon-orange)] hover:bg-white hover:text-black text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 uppercase tracking-wider text-sm transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)]"
            >
              <UserPlus size={18} /> Nuevo Producto
            </button>
          </div>

          {productFormOpen && (
            <div className="glass-panel bg-black/60 p-8 rounded-2xl border border-[var(--neon-orange)]/30 mb-8 animate-fadeIn relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--neon-orange)]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <h4 className="font-bold text-xl mb-6 text-white font-display uppercase tracking-wider flex items-center gap-2">
                <Ghost className="text-[var(--neon-orange)]" />
                {editingProduct ? 'Editar Ofrenda' : 'Nueva Ofrenda'}
              </h4>
              <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  className="bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-[var(--neon-orange)] focus:outline-none focus:ring-1 focus:ring-[var(--neon-orange)] placeholder:text-slate-600 transition-all font-mono"
                  placeholder="Nombre del Producto"
                  value={productFormData.name}
                  onChange={e => setProductFormData({ ...productFormData, name: e.target.value })}
                  required
                />
                <input
                  className="bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-[var(--neon-orange)] focus:outline-none focus:ring-1 focus:ring-[var(--neon-orange)] placeholder:text-slate-600 transition-all font-mono"
                  placeholder="Precio (Ej. 12.50)"
                  type="number"
                  step="0.01"
                  value={productFormData.price}
                  onChange={e => setProductFormData({ ...productFormData, price: e.target.value })}
                  required
                />
                <input
                  className="bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-[var(--neon-orange)] focus:outline-none focus:ring-1 focus:ring-[var(--neon-orange)] placeholder:text-slate-600 transition-all font-mono md:col-span-2"
                  placeholder="Descripción"
                  value={productFormData.description}
                  onChange={e => setProductFormData({ ...productFormData, description: e.target.value })}
                />
                <input
                  className="bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-[var(--neon-orange)] focus:outline-none focus:ring-1 focus:ring-[var(--neon-orange)] placeholder:text-slate-600 transition-all font-mono md:col-span-2"
                  placeholder="URL de Imagen (Opcional)"
                  value={productFormData.imageUrl}
                  onChange={e => setProductFormData({ ...productFormData, imageUrl: e.target.value })}
                />
                <div className="flex gap-4 md:col-span-2 pt-2">
                  <button type="button" onClick={() => setProductFormOpen(false)} className="px-6 py-3 text-slate-400 hover:text-white font-bold uppercase tracking-wider text-sm transition-colors">Cancelar</button>
                  <button type="submit" className="bg-[var(--neon-orange)] hover:bg-white hover:text-black text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all">Guardar Ritual</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingProducts ? <p className="text-white font-mono animate-pulse">Consultando el grimorio...</p> : products.map(p => {
              const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
              const imgSrc = p.imageUrl ? (p.imageUrl.startsWith('http') ? p.imageUrl : `${API_URL}${p.imageUrl}`) : 'https://placehold.co/400x300?text=No+Image';

              return (
                <div key={p.id} className="glass-panel bg-black/60 rounded-2xl border border-white/10 overflow-hidden flex flex-col group hover:border-white/30 transition-all duration-500">
                  <div className="h-48 bg-slate-900 relative overflow-hidden">
                    <img src={imgSrc} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                      <button onClick={() => openEditProduct(p)} className="bg-white text-black p-3 rounded-full hover:bg-[var(--neon-cyan)] hover:scale-110 transition-all shadow-lg"><TrendingUp size={20} /></button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 hover:scale-110 transition-all shadow-lg shadow-red-500/30"><Trash2 size={20} /></button>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      <span className="font-bold text-[var(--neon-orange)] font-mono">${Number(p.price).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h4 className="font-bold text-white text-lg mb-2 font-display uppercase tracking-wide">{p.name}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 font-mono leading-relaxed">{p.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ANALYTICS SECTION */}
      {activeSection === 'analytics' && (
        <div className="animate-slideUp space-y-8">
          <h3 className="text-2xl font-bold text-white font-display uppercase tracking-widest">Analíticas de Invocaciones</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SALES PER HOUR CHARTS */}
            <div className="glass-panel bg-black/60 p-8 rounded-2xl border border-white/10 shadow-lg">
              <h4 className="font-bold text-white mb-8 flex items-center gap-2 font-display tracking-widest uppercase text-sm">
                <Clock size={20} className="text-[var(--neon-cyan)]" /> Invocaciones por Hora
              </h4>
              <div className="flex items-end h-64 gap-2">
                {getSalesPerHour().map((amount, hour) => {
                  const max = Math.max(...getSalesPerHour(), 100); // 100 min avoid div by zero
                  const height = (amount / max) * 100;
                  return (
                    <div key={hour} className="flex-1 flex flex-col justify-end items-center group relative">
                      <div
                        className="w-full bg-[var(--neon-cyan)]/50 hover:bg-[var(--neon-cyan)] rounded-t-sm transition-all relative shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]"
                        style={{ height: `${Math.max(height, 5)}%` }}
                      ></div>
                      <span className="text-[8px] text-slate-500 mt-2 font-mono">{hour}</span>
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 bg-slate-800 border border-white/20 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap font-mono">
                        ${amount.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TOP PRODUCTS CHART */}
            <div className="glass-panel bg-black/60 p-8 rounded-2xl border border-white/10 shadow-lg">
              <h4 className="font-bold text-white mb-8 flex items-center gap-2 font-display tracking-widest uppercase text-sm">
                <TrendingUp size={20} className="text-emerald-500" /> Ofrendas Populares
              </h4>
              <div className="space-y-6">
                {getTopProducts().map(([name, count], idx) => (
                  <div key={idx} className="relative group">
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider group-hover:text-white transition-colors">
                      <span className="flex items-center gap-2">
                        <span className="bg-white/10 w-5 h-5 flex items-center justify-center rounded text-[10px] text-white">#{idx + 1}</span>
                        {name}
                      </span>
                      <span className="font-mono text-[var(--neon-orange)]">{count}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                        style={{ width: `${(count / Math.max(...getTopProducts().map(x => x[1]), 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'users' && (
        /* USER MANAGEMENT SECTION */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slideUp">

          {/* Create User Form */}
          <div className="lg:col-span-1">
            <div className="glass-panel bg-black/60 p-8 rounded-2xl border border-white/10 sticky top-24 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3 font-display uppercase tracking-widest">
                <UserPlus className="text-[var(--neon-purple)]" /> Nueva Alma
              </h3>
              <p className="text-xs text-slate-400 mb-8 font-mono leading-relaxed border-l-2 border-[var(--neon-purple)] pl-3">
                Registra cocineros para el ritual o clientes VIP con acceso especial al portal.
              </p>

              <form onSubmit={handleAddUserSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Rol de Usuario</label>
                  <div className="relative">
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value as Role })}
                      className="w-full px-4 py-4 border border-white/20 rounded-xl focus:ring-1 focus:ring-[var(--neon-purple)] focus:border-[var(--neon-purple)] outline-none bg-black/50 appearance-none font-bold text-white cursor-pointer transition-all"
                    >
                      <option value="cook">👨‍🍳 Cocinero (Staff)</option>
                      <option value="client">👤 Cliente (Registrado)</option>
                      <option value="admin">🛡️ Administrador</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                      <Users className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-[var(--neon-purple)] focus:ring-1 focus:ring-[var(--neon-purple)] outline-none text-white placeholder:text-slate-600 font-mono transition-all"
                    placeholder={newUser.role === 'cook' ? 'Ej. Chef Mario' : 'Ej. Cliente Ana'}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">Usuario (Login)</label>
                  <input
                    type="text"
                    required
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-[var(--neon-purple)] focus:ring-1 focus:ring-[var(--neon-purple)] outline-none text-white placeholder:text-slate-600 font-mono transition-all"
                    placeholder="Sin espacios"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">Contraseña</label>
                  <input
                    type="password"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-[var(--neon-purple)] focus:ring-1 focus:ring-[var(--neon-purple)] outline-none text-white placeholder:text-slate-600 font-mono transition-all"
                    placeholder="••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white hover:bg-[var(--neon-purple)] text-black hover:text-white font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] mt-4 flex justify-center items-center gap-2 uppercase tracking-widest text-sm"
                >
                  <UserPlus size={18} />
                  Crear Usuario
                </button>

                {userSuccessMsg && (
                  <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-xl text-xs font-bold text-center animate-fadeIn border border-emerald-500/30 flex items-center justify-center gap-2 uppercase tracking-wide">
                    <CheckCircle size={16} /> {userSuccessMsg}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* User List */}
          <div className="lg:col-span-2">
            <div className="glass-panel bg-black/60 rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
                <h3 className="font-bold text-white font-display uppercase tracking-wider text-sm">Cuentas Registradas</h3>
                <span className="bg-white/10 px-3 py-1 rounded-md text-[10px] font-bold text-slate-300 border border-white/10 font-mono">
                  {allUsers.length} almas
                </span>
              </div>

              <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto custom-scrollbar">
                {allUsers.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 font-mono text-sm">No hay usuarios configurados.</div>
                ) : (
                  allUsers.map(user => (
                    <div key={user.id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors group">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-black font-bold shadow-[0_0_15px_rgba(0,0,0,0.3)]
                          ${user.role === 'admin' ? 'bg-[var(--neon-purple)] shadow-[0_0_15px_rgba(168,85,247,0.4)]' :
                            user.role === 'cook' ? 'bg-[var(--neon-orange)] shadow-[0_0_15px_rgba(249,115,22,0.4)]' :
                              'bg-[var(--neon-cyan)] shadow-[0_0_15px_rgba(6,182,212,0.4)]'}`}>
                          {user.role === 'admin' && <Shield size={24} />}
                          {user.role === 'cook' && <ChefHat size={24} />}
                          {user.role === 'client' && <User size={24} />}
                        </div>
                        <div>
                          <p className="font-bold text-white text-lg font-display tracking-wide">{user.name}</p>
                          <div className="flex items-center gap-2 text-xs mt-1">
                            <span className="text-slate-400 font-mono">@{user.username}</span>
                            <span className={`uppercase font-bold tracking-wider px-2 py-0.5 rounded-[4px] text-[9px] border border-white/10
                               ${user.role === 'admin' ? 'text-[var(--neon-purple)] bg-[var(--neon-purple)]/10' :
                                user.role === 'cook' ? 'text-[var(--neon-orange)] bg-[var(--neon-orange)]/10' :
                                  'text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10'}`}>
                              {user.role === 'admin' ? 'Administrador' : user.role === 'cook' ? 'Cocinero' : 'Cliente'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Don't allow deleting the last admin */}
                        {user.role !== 'admin' || allUsers.filter(u => u.role === 'admin').length > 1 ? (
                          <button
                            onClick={() => onDeleteUser && onDeleteUser(user.id)}
                            className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 border border-transparent hover:border-red-500/30"
                            title="Eliminar usuario"
                          >
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic px-2 uppercase tracking-widest border border-white/5 rounded py-1">Principal</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
