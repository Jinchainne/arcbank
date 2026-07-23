import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';
import { ShoppingBag, Plus, Minus, Search, ShoppingCart, Heart } from 'lucide-react';

const CATEGORY_LIST = [
  { name: 'Hot Coffee', icon: '☕', count: 0 },
  { name: 'Cold Coffee', icon: '🧊', count: 0 },
  { name: 'Tea', icon: '🍵', count: 0 },
  { name: 'Juice', icon: '🍊', count: 0 },
  { name: 'Burgers', icon: '🍔', count: 0 },
  { name: 'Chicken', icon: '🍗', count: 0 },
  { name: 'Sandwiches', icon: '🥪', count: 0 },
  { name: 'Pizza', icon: '🍕', count: 0 },
  { name: 'Pasta', icon: '🍝', count: 0 },
  { name: 'Sides', icon: '🍟', count: 0 },
  { name: 'Breakfast', icon: '🥞', count: 0 },
  { name: 'Bakery', icon: '🥐', count: 0 },
  { name: 'Desserts', icon: '🍰', count: 0 },
  { name: 'Drinks', icon: '🥤', count: 0 },
  { name: 'Phở & Bún', icon: '🍜', count: 0 },
  { name: 'Cơm', icon: '🍚', count: 0 },
  { name: 'Lẩu', icon: '🫕', count: 0 },
  { name: 'Đồ Uống Việt', icon: '☕', count: 0 },
  { name: 'Tráng Miệng', icon: '🍮', count: 0 },
];

export default function ShopMenu() {
  const navigate = useNavigate();
  const { products, cart, cartTotal, cartCount, addToCart, removeFromCart, updateQuantity } = useShop();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const getCategoryCount = (cat: string) => products.filter(p => cat === 'All' || p.category === cat).length;

  return (
    <div className="bg-white min-h-screen">
      {/* ═══════ TOP BANNER ═══════ */}
      <div className="bg-slate-900 text-white text-center py-2 text-xs font-medium">
        <span className="text-slate-400">Official e-commerce site of</span> <span className="font-bold">Coffee House</span>
        <span className="text-slate-400 ml-2">· Pay with USDC on Arc Testnet</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* ═══════ HEADER ═══════ */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden shadow-md">
                <img src="/logo.png" alt="Coffee House" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">COFFEE HOUSE</h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">The Coffee of the World</p>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <button onClick={() => navigate('/shop/track')} className="text-xs text-slate-500 hover:text-blue-600 mr-4">Track Order</button>
            <button onClick={() => navigate('/shop/orders')} className="text-xs text-slate-500 hover:text-blue-600 mr-4">My Orders</button>
          </div>
        </div>

        {/* ═══════ SEARCH BAR ═══════ */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search for countless genuine products from Coffee House..."
            className="pl-12 w-full h-12 rounded-lg border-slate-300 text-sm"
          />
        </div>

        {/* ═══════ CATEGORY MENU BAR ═══════ */}
        <div className="bg-slate-900 rounded-lg px-4 py-2.5 mb-6 flex items-center justify-between">
          <span className="text-white text-sm font-bold">PRODUCT CATEGORIES</span>
          <span className="text-slate-400 text-xs">{products.length} products</span>
        </div>

        {/* ═══════ MAIN LAYOUT: SIDEBAR + GRID ═══════ */}
        <div className="flex gap-6">
          {/* ═══════ LEFT SIDEBAR ═══════ */}
          <div className="w-56 flex-shrink-0 hidden lg:block">
            <div className="sticky top-20">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Categories</h3>
              <div className="space-y-0.5">
                <button
                  onClick={() => setActiveCategory('All')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                    activeCategory === 'All' ? 'bg-amber-50 text-amber-700 font-bold border-l-3 border-amber-600' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2"><span>🍽️</span> All Products</span>
                  <span className="text-xs text-slate-400">{products.length}</span>
                </button>
                {CATEGORY_LIST.map(cat => {
                  const count = getCategoryCount(cat.name);
                  if (count === 0) return null;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                        activeCategory === cat.name ? 'bg-amber-50 text-amber-700 font-bold border-l-3 border-amber-600' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2"><span>{cat.icon}</span> {cat.name}</span>
                      <span className="text-xs text-slate-400">{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Cart Summary */}
              {cartCount > 0 && (
                <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Your Cart ({cartCount})</h4>
                  <div className="space-y-2 mb-3 max-h-40 overflow-y-auto scroll-hide">
                    {cart.map(item => (
                      <div key={item.product.id} className="flex items-center gap-2 text-xs">
                        <span className="flex-1 truncate text-slate-700">{item.product.name}</span>
                        <span className="text-slate-400">×{item.quantity}</span>
                        <span className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-200 pt-2 mb-3 flex justify-between">
                    <span className="text-xs font-medium text-slate-600">Total</span>
                    <span className="text-sm font-extrabold text-amber-700">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button onClick={() => navigate('/shop/delivery')} className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-2.5 rounded-lg transition-colors">
                    Checkout →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ═══════ PRODUCT GRID ═══════ */}
          <div className="flex-1 min-w-0">
            {/* Breadcrumb + Sort */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-slate-400">
                Home &gt; <span className="text-slate-700 font-medium">{activeCategory === 'All' ? 'All Products' : activeCategory}</span>
              </p>
              <p className="text-xs text-slate-500">
                <span className="font-bold text-slate-900">{filtered.length}</span> products
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product, idx) => {
                const cartItem = cart.find(c => c.product.id === product.id);
                return (
                  <div key={product.id} className="group bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-slate-200 transition-all duration-300"
                    style={{ animationDelay: `${Math.min(idx * 20, 200)}ms` }}>
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-slate-50">
                      <img src={product.image} alt={product.name} loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {/* Wishlist */}
                      <button className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                        <Heart className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                    {/* Info */}
                    <div className="p-3">
                      <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1">{product.name}</h3>
                      <p className="text-[11px] text-slate-400 leading-snug mb-2.5 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-extrabold text-red-600">${product.price.toFixed(2)}</span>
                        {cartItem ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => cartItem.quantity <= 1 ? removeFromCart(product.id) : updateQuantity(product.id, cartItem.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-red-50">
                              <Minus className="w-3 h-3 text-slate-600" />
                            </button>
                            <span className="text-sm font-bold w-6 text-center">{cartItem.quantity}</span>
                            <button onClick={() => addToCart(product)}
                              className="w-7 h-7 rounded-lg bg-amber-600 flex items-center justify-center hover:bg-amber-700">
                              <Plus className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(product)}
                            className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-amber-700 transition-colors">
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-lg font-semibold text-slate-400">No products found</p>
                <p className="text-sm text-slate-300 mt-1">Try a different category or search term</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Cart Bar */}
        {cartCount > 0 && (
          <div className="fixed bottom-0 left-0 right-0 lg:hidden z-40 p-3 bg-white border-t border-slate-200 shadow-lg">
            <button onClick={() => navigate('/shop/delivery')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-xl flex items-center justify-between px-5 font-bold text-sm">
              <span className="flex items-center gap-2"><ShoppingCart className="w-4 h-4" /> {cartCount} items</span>
              <span>${cartTotal.toFixed(2)} · Checkout →</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
