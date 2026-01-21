
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MenuSection from './components/MenuSection';
import CartSection from './components/CartSection';
import StatusSection from './components/StatusSection';
import CheckoutSection from './components/CheckoutSection';
import HistorySection from './components/HistorySection';
import AdminDashboard from './components/AdminDashboard';
import CookDashboard from './components/CookDashboard';
import LandingPage from './components/LandingPage';
import Toast from './components/Toast';
import { Product, CartItem, Order, OrderStatus, Tab, Role, UserAccount, User } from './types';
import { Utensils, ArrowRight, ShoppingBag, Receipt, Lock } from 'lucide-react';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('menu');
  const [cart, setCart] = useState<CartItem[]>([]);
  // Guest mode state
  const [isGuest, setIsGuest] = useState(false);
  const [soulsCollected, setSoulsCollected] = useState(0);

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('ghost_kitchen_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse orders from localStorage", e);
      return [];
    }
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('ghost_kitchen_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse users from localStorage", e);
    }
    return [
      { id: '1', name: 'Administrador', username: 'admin', password: 'admin123', role: 'admin' },
      { id: '2', name: 'Chef Principal', username: 'cocinero', password: '123', role: 'cook' }
    ];
  });

  const [lastOrderCode, setLastOrderCode] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<any | null>(null);
  const [orderToTrack, setOrderToTrack] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [animateCart, setAnimateCart] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const currentTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    localStorage.setItem('ghost_kitchen_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ghost_kitchen_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (totalItems > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const verifyStaffCredentials = async (username: string, password: string): Promise<UserAccount | null> => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        let role: Role = 'guest';
        if (data.user.role === 'ADMINISTRADOR') role = 'admin';
        if (data.user.role === 'COCINERO') role = 'cook';
        if (data.user.role === 'CLIENTE') role = 'client';

        localStorage.setItem('auth_token', data.access_token);

        return {
          id: data.user.id || 'api_user',
          name: data.user.name,
          username: data.user.username,
          role: role
        };
      }
    } catch (e) {
      console.warn("Backend login failed or unreachable", e);
      addToast(`Error de conexión al servidor: ${e instanceof Error ? e.message : 'Desconocido'}`, 'error');
    }

    await new Promise(resolve => setTimeout(resolve, 800));
    const foundUser = users.find(u => u.username === username && u.password === password);
    return foundUser || null;
  };

  const handleRegister = async (name: string, username: string, password: string): Promise<UserAccount | null> => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password })
      });

      if (res.ok) {
        const data = await res.json();
        // Register returns the user, we can auto-login or ask to login.
        // Let's auto-login (return the user object similar to verifyStaffCredentials)
        // Usually register returns just the user or a message.
        // If it returns user, we might need to login separately or if it returns token.
        // Assuming it works similar to login or we call login afterwards.

        // Let's call login immediately
        return verifyStaffCredentials(username, password);
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Error al registrarse');
      }
    } catch (e) {
      console.warn("Registration failed", e);
      addToast(`Error: ${e instanceof Error ? e.message : 'Fallo en registro'}`, 'error');
      return null;
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsGuest(false);
    setCart([]);
    setActiveTab('menu');
  };

  const addToCart = (product: Product) => {
    if (isGuest) {
      addToast('¡Solo ver y quedarse con las ganas! El Rey prohíbe comer a los invitados.', 'error');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setSoulsCollected(prev => prev + 1); // Increment souls
    setToast({ message: "¡Invocación Exitosa! (+1 Alma)", type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item) => item.id !== productId);
    });
  };

  const goToCheckout = () => {
    if (cart.length > 0 && user?.role === 'client') {
      setActiveTab('checkout');
      window.scrollTo(0, 0);
    }
  };

  // Poll for orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/orders`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          const sanitizedOrders = Array.isArray(data) ? data.map((order: any) => ({
            ...order,
            total: Number(order.total || 0),
            items: (order.items || []).map((item: any) => ({
              ...item,
              price: Number(item.price || 0),
              name: item.product?.name || item.name || 'Producto Desconocido'
            })),
            customerName: order.customer?.name || order.customerName || 'Anónimo'
          })) : [];
          setOrders(sanitizedOrders);
        }
      } catch (error) {
        console.error("Error polling orders", error);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 4000);
    return () => clearInterval(interval);
  }, []);

  const confirmOrder = async () => {
    if (isGuest) return;

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          customerId: user?.id,
          items: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
          }))
        })
      });

      if (res.ok) {
        const newOrder = await res.json();
        setCart([]);
        setLastOrderCode(newOrder.code);
        const fullOrder = {
          ...newOrder,
          items: cart.map(c => ({
            ...c,
            product: { name: c.name },
            price: c.price
          })),
          total: total
        };
        setLastOrder(fullOrder);
        addToast('¡Pedido confirmado con éxito!', 'success');
      } else {
        addToast('Error al crear pedido', 'error');
      }
    } catch (error) {
      console.error("Error creating order", error);
      addToast('Error de conexión', 'error');
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        addToast(`Orden #${orderId} actualizada a ${newStatus}`, 'info');
      } else {
        addToast('Error al actualizar estado', 'error');
      }
    } catch (e) {
      console.error("Error updating status", e);
      addToast('Error de conexión', 'error');
    }
  };

  const closeConfirmation = () => {
    if (lastOrderCode) setOrderToTrack(lastOrderCode);
    setLastOrderCode(null);
    setLastOrder(null);
    setActiveTab('status');
  };

  const handlePrintReceipt = () => window.print();

  const handleViewOrderHistory = (orderId: string) => {
    setOrderToTrack(orderId);
    setActiveTab('status');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-[var(--text-primary)] font-sans selection:bg-orange-500 selection:text-white relative pb-20 md:pb-0 overflow-x-hidden">
      <Toast
        message={toast?.message || ''}
        type={toast?.type || 'success'}
        isVisible={!!toast}
        onClose={() => setToast(null)}
      />

      {/* GLOBAL PRINT STYLES */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-modal, #receipt-modal * { visibility: visible; }
          #receipt-modal {
            position: absolute; left: 0; top: 0; width: 100%; height: auto;
            margin: 0; padding: 0; background: white; box-shadow: none;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* LOGIN / LANDING SCREEN */}
      {(!user && !isGuest) && (
        <LandingPage
          onLogin={(name, role, username) => {
            const newUser: User = { name, role, username };
            setUser(newUser);
            // If it's a guest, we handle isGuest separate or just rely on role
            if (role === 'guest') {
              setIsGuest(true);
              setActiveTab('menu');
            } else {
              setIsGuest(false);
              if (role === 'admin') setActiveTab('admin');
              else if (role === 'cook') setActiveTab('kitchen');
              else setActiveTab('menu');
            }
          }}
          onVerifyStaff={verifyStaffCredentials}
          onRegister={handleRegister}
        />
      )}

      {/* MAIN APP CONTENT */}
      {(user || isGuest) && (
        <>
          <Header
            user={user}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
            cartCount={totalItems}
            soulsCollected={soulsCollected}
            isGuest={isGuest}
          />

          <main className="pt-24 pb-8 px-4 md:px-8 w-full max-w-[98%] mx-auto">
            <div className="animate-fadeIn">

              {/* Guest Warning */}
              {isGuest && activeTab === 'menu' && (
                <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 mb-8 rounded-r-xl shadow-sm flex items-center gap-4 backdrop-blur-md">
                  <div className="bg-orange-500/20 p-2 rounded-full">
                    <Lock className="text-orange-500" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-orange-500">Zona de Espectadores</p>
                    <p className="text-sm text-slate-300">
                      Estás aquí para ver el menú y quedarte con las ganas. Solo el personal o clientes registrados pueden pedir.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'admin' && user?.role === 'admin' && (
                <AdminDashboard
                  products={[]}
                  orders={orders}
                  users={users}
                  onAddUser={(u: any) => { setUsers(prev => [...prev, u]); addToast("User added"); }}
                  onDeleteUser={(id: string) => { setUsers(prev => prev.filter(u => u.id !== id)); addToast("User deleted"); }}
                  onUpdateStatus={updateOrderStatus}
                />
              )}

              {activeTab === 'kitchen' && user?.role === 'cook' && (
                <CookDashboard orders={orders} onUpdateStatus={updateOrderStatus} />
              )}

              {activeTab === 'menu' && (
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className={isGuest || user?.role === 'admin' || user?.role === 'cook' ? "w-full" : "w-full lg:w-3/4"}>
                    <MenuSection onAddToCart={addToCart} isGuest={isGuest} />
                  </div>
                  {user?.role === 'client' && (
                    <div className="hidden lg:block lg:w-1/4 min-w-[350px]">
                      <div className="sticky top-24">
                        <CartSection
                          cart={cart}
                          onRemove={removeFromCart}
                          onCheckout={goToCheckout}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'checkout' && user?.role === 'client' && (
                <CheckoutSection
                  cart={cart}
                  total={currentTotal}
                  onConfirm={confirmOrder}
                  onBack={() => setActiveTab('menu')}
                />
              )}

              {activeTab === 'status' && (
                <StatusSection orders={orders} initialCode={orderToTrack} />
              )}

              {activeTab === 'history' && (
                <HistorySection orders={orders} onViewDetails={handleViewOrderHistory} />
              )}
            </div>
          </main>
        </>
      )}

      {/* Mobile Floating Cart */}
      {activeTab === 'menu' && user?.role === 'client' && cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 lg:hidden no-print">
          <button
            onClick={goToCheckout}
            className={`bg-orange-600 text-white rounded-full shadow-xl shadow-orange-600/30 p-4 flex items-center gap-4 hover:bg-orange-700 transition-all active:scale-95 ${animateCart ? 'ring-4 ring-orange-200 scale-105' : ''}`}
          >
            <div className="relative">
              <ShoppingBag className={`text-white transition-transform ${animateCart ? 'scale-125' : ''}`} size={24} />
              <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-orange-200">
                {totalItems}
              </span>
            </div>
            <div className="flex flex-col items-start mr-2">
              <span className="text-[10px] text-orange-100 font-bold uppercase tracking-wider">Total</span>
              <span className="text-xl font-black leading-none">${currentTotal.toFixed(2)}</span>
            </div>
            <ArrowRight size={20} className="text-orange-100" />
          </button>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {lastOrderCode && lastOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 print:bg-white print:static print:h-auto">
          <div id="receipt-modal" className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center relative overflow-hidden print:shadow-none print:w-full print:max-w-full">
            <div className="no-print">
              <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Utensils className="w-10 h-10 text-orange-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase italic tracking-tight">¡Orden Recibida!</h2>
              <p className="text-slate-500 mb-6 font-medium">La cocina fantasma ha comenzado.</p>
            </div>

            {/* Receipt */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 text-left font-mono text-sm print:border-none print:bg-white print:p-0">
              <div className="text-center border-b border-dashed border-slate-300 pb-4 mb-4">
                <h3 className="font-black text-xl uppercase">FOODTRACK GHOST</h3>
                <p className="text-xs text-slate-500">{new Date().toLocaleString()}</p>
              </div>
              <div className="space-y-2 mb-4">
                {(lastOrder.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.quantity}x {item.product?.name || item.name || 'Item'}</span>
                    <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-slate-300 pt-4 space-y-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>TOTAL</span>
                  <span>${Number(lastOrder.total).toFixed(2)}</span>
                </div>
                <div className="text-center mt-4">
                  <p className="uppercase tracking-widest text-xs text-slate-400">Código</p>
                  <p className="text-4xl font-black text-slate-900 my-2">{lastOrder.code}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 no-print">
              <button onClick={handlePrintReceipt} className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                <Receipt size={20} /> Imprimir Factura
              </button>
              <button onClick={closeConfirmation} className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg">
                Rastrear Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {(user || isGuest) && (
        <footer className="bg-slate-900/50 text-slate-400 py-12 mt-auto border-t border-white/5 no-print">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-xs font-mono">&copy; {new Date().getFullYear()} Ghost Kitchens.</p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
