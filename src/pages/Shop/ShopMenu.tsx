import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';
import { ShoppingBag, Plus, Minus, Trash2, Search, ShoppingCart, ChevronLeft, ChevronRight, Coffee, Star, Truck, Zap } from 'lucide-react';

const CATEGORY_CONFIG: Record<string, { icon: string; color: string; gradient: string; desc: string }> = {
  'Hot Coffee': { icon: '☕', color: 'from-amber-500 to-orange-600', gradient: 'bg-gradient-to-br from-amber-50 to-orange-50', desc: 'Rich espresso-based drinks, brewed fresh to order' },
  'Cold Coffee': { icon: '🧊', color: 'from-blue-500 to-cyan-600', gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50', desc: 'Refreshing iced coffee, cold brew, and frappes' },
  'Tea': { icon: '🍵', color: 'from-green-500 to-emerald-600', gradient: 'bg-gradient-to-br from-green-50 to-emerald-50', desc: 'Premium teas, matcha, and bubble tea' },
  'Juice': { icon: '🍊', color: 'from-orange-400 to-yellow-500', gradient: 'bg-gradient-to-br from-orange-50 to-yellow-50', desc: 'Fresh-squeezed juices and tropical smoothies' },
  'Burgers': { icon: '🍔', color: 'from-red-500 to-orange-600', gradient: 'bg-gradient-to-br from-red-50 to-orange-50', desc: 'Juicy beef and chicken burgers from top brands' },
  'Chicken': { icon: '🍗', color: 'from-yellow-500 to-amber-600', gradient: 'bg-gradient-to-br from-yellow-50 to-amber-50', desc: 'Crispy fried chicken, nuggets, and wings' },
  'Pizza': { icon: '🍕', color: 'from-red-500 to-rose-600', gradient: 'bg-gradient-to-br from-red-50 to-rose-50', desc: 'Hand-tossed pizzas with premium toppings' },
  'Phở & Bún': { icon: '🍜', color: 'from-amber-500 to-red-600', gradient: 'bg-gradient-to-br from-amber-50 to-red-50', desc: 'Traditional Vietnamese noodle soups, slow-cooked broth' },
  'Cơm': { icon: '🍚', color: 'from-yellow-500 to-orange-600', gradient: 'bg-gradient-to-br from-yellow-50 to-orange-50', desc: 'Vietnamese broken rice with grilled meats' },
  'Bánh Mì': { icon: '🥖', color: 'from-amber-400 to-yellow-600', gradient: 'bg-gradient-to-br from-amber-50 to-yellow-50', desc: 'Crusty baguettes with Vietnamese fillings' },
  'Desserts': { icon: '🍰', color: 'from-pink-500 to-rose-600', gradient: 'bg-gradient-to-br from-pink-50 to-rose-50', desc: 'Sweet treats, cakes, and frozen desserts' },
  'Drinks': { icon: '🥤', color: 'from-cyan-400 to-blue-500', gradient: 'bg-gradient-to-br from-cyan-50 to-blue-50', desc: 'Refreshing beverages and milkshakes' },
};

function ProductCard({ product, cartItem, onAdd, onRemove }: any) {
  return (
    <div className="flex-shrink-0 w-48 sm:w-56 group">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-slate-100">
          <img src={product.image} alt={product.name} loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        {/* Info */}
        <div className="p-3">
          <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1">{product.name}</h3>
          <p className="text-[11px] text-slate-400 leading-snug mb-2.5 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-base font-extrabold text-blue-600">${product.price.toFixed(2)}</span>
            {cartItem ? (
              <div className="flex items-center gap-1 bg-slate-50 rounded-xl px-1 py-0.5">
                <button onClick={() => onRemove(product.id)} className="w-6 h-6 rounded-lg bg-white flex items-center justify-center hover:bg-red-50 shadow-sm">
                  <Minus className="w-3 h-3 text-slate-600" />
                </button>
                <span className="text-xs font-bold w-5 text-center">{cartItem.quantity}</span>
                <button onClick={() => onAdd(product)} className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center hover:bg-blue-600 shadow-sm">
                  <Plus className="w-3 h-3 text-white" />
                </button>
              </div>
            ) : (
              <button onClick={() => onAdd(product)}
                className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center hover:bg-blue-700 shadow-md shadow-blue-200 hover:shadow-lg hover:scale-110 transition-all">
                <Plus className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CategorySection({ category, products, cart, onAdd, onRemove }: any) {
  const config = CATEGORY_CONFIG[category] || { icon: '🍽️', color: 'from-slate-500 to-slate-600', gradient: 'bg-slate-50', desc: 'Delicious food and drinks' };
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-10">
      {/* Category Header */}
      <div className={`${config.gradient} rounded-2xl p-5 mb-4 relative overflow-hidden`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{config.icon}</span>
          <h2 className="text-2xl font-extrabold text-slate-900">{category}</h2>
        </div>
        <p className="text-sm text-slate-600 max-w-lg">{config.desc}</p>
      </div>

      {/* Horizontal Scroll */}
      <div className="relative group/scroll">
        {/* Scroll buttons */}
        <button onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity -ml-2 hover:bg-white">
          <ChevronLeft className="w-5 h-5 text-slate-700" />
        </button>
        <button onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity -mr-2 hover:bg-white">
          <ChevronRight className="w-5 h-5 text-slate-700" />
        </button>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scroll-hide pb-2">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product}
              cartItem={cart.find((c: any) => c.product.id === product.id)}
              onAdd={onAdd} onRemove={onRemove} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ShopMenu() {
  const navigate = useNavigate();
  const { products, cart, cartTotal, cartCount, addToCart, removeFromCart, updateQuantity } = useShop();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart] = useState(true);

  // Group products by category
  const categoryOrder = ['Hot Coffee', 'Cold Coffee', 'Tea', 'Juice', 'Burgers', 'Chicken', 'Pizza', 'Phở & Bún', 'Cơm', 'Desserts', 'Drinks'];
  const grouped = categoryOrder
    .map(cat => ({
      category: cat,
      products: products.filter(p => p.category === cat && (
        !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    }))
    .filter(g => g.products.length > 0);

  const totalFiltered = grouped.reduce((s, g) => s + g.products.length, 0);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ═══════ HERO ═══════ */}
        <div className="hero-banner mb-8">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <span className="text-white/80 text-sm font-medium">ArcPay Shop</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
              Good Food,<br />
              <span className="text-cyan-300">Fast Crypto</span> Payment
            </h1>
            <p className="text-blue-200 text-sm mb-5 max-w-md leading-relaxed">
              {products.length} items from world-famous brands. Pay with USDC on Arc Testnet — instant, cheap, on-chain.
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur rounded-full px-3 py-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-300" />
                <span className="text-white text-xs font-medium">Instant</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur rounded-full px-3 py-1.5">
                <Star className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-white text-xs font-medium">{products.length}+ Items</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur rounded-full px-3 py-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-300" />
                <span className="text-white text-xs font-medium">Delivery</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* ═══════ MAIN CONTENT ═══════ */}
          <div className="flex-1 min-w-0">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for food, drinks, desserts..." className="pl-12 w-full h-12 rounded-2xl border-slate-200 shadow-sm" />
            </div>

            {/* Category Sections */}
            {searchQuery && (
              <p className="text-sm text-slate-500 mb-4">
                Found <span className="font-bold text-slate-900">{totalFiltered}</span> results for "<span className="text-blue-600">{searchQuery}</span>"
              </p>
            )}

            {grouped.map(({ category, products: prods }) => (
              <CategorySection key={category} category={category} products={prods}
                cart={cart} onAdd={addToCart} onUpdate={updateQuantity} onRemove={removeFromCart} />
            ))}

            {grouped.length === 0 && (
              <div className="text-center py-20">
                <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-lg font-semibold text-slate-400">No items found</p>
              </div>
            )}
          </div>

          {/* ═══════ CART SIDEBAR ═══════ */}
          {showCart && (
            <div className="w-80 flex-shrink-0 hidden lg:block">
              <div className="card p-5 sticky top-20 border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-blue-500" /> Your Order
                  <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{cartCount}</span>
                </h3>
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 max-h-80 overflow-y-auto mb-4 scroll-hide">
                      {cart.map(item => (
                        <div key={item.product.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50">
                          <img src={item.product.image} alt="" className="w-11 h-11 rounded-xl object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900 truncate">{item.product.name}</p>
                            <p className="text-[11px] text-slate-400">${item.product.price.toFixed(2)} × {item.quantity}</p>
                          </div>
                          <span className="text-xs font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                          <button onClick={() => removeFromCart(item.product.id)} className="text-slate-300 hover:text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 pt-4 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600">Total</span>
                        <span className="text-xl font-extrabold text-blue-600">${cartTotal.toFixed(2)}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 text-right">USDC on Arc Testnet</p>
                    </div>
                    <button onClick={() => navigate('/shop/delivery')} className="btn-primary w-full h-12">Checkout →</button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Cart */}
        {cartCount > 0 && (
          <div className="fixed bottom-0 left-0 right-0 lg:hidden z-40 p-4 bg-gradient-to-t from-white via-white to-transparent pt-8">
            <button onClick={() => navigate('/shop/delivery')}
              className="w-full btn-primary h-14 !rounded-2xl shadow-xl shadow-blue-200/50 flex items-center justify-between px-6">
              <ShoppingCart className="w-5 h-5" />
              <span>View Cart ({cartCount})</span>
              <span className="font-extrabold">${cartTotal.toFixed(2)}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
