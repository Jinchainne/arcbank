import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'failed';
  txHash?: string;
  timestamp: number;
  merchantAddress: string;
}

export const MERCHANT_ADDRESS = '0x363700d10ca9c4809ad7034f5b21650a9a5e34bd';

const PRODUCTS: Product[] = [
  { id: 'cf1', name: 'Espresso', price: 3.50, category: 'Coffee', image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=300&h=300&fit=crop', description: 'Strong & bold single shot' },
  { id: 'cf2', name: 'Americano', price: 4.00, category: 'Coffee', image: 'https://images.unsplash.com/photo-1459755417340-5ee3a2572279?w=300&h=300&fit=crop', description: 'Classic black coffee' },
  { id: 'cf3', name: 'Cappuccino', price: 5.00, category: 'Coffee', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=300&fit=crop', description: 'Espresso with steamed milk foam' },
  { id: 'cf4', name: 'Latte', price: 5.50, category: 'Coffee', image: 'https://images.unsplash.com/photo-1561882468-958319edf79c?w=300&h=300&fit=crop', description: 'Smooth espresso & milk' },
  { id: 'cf5', name: 'Mocha', price: 6.00, category: 'Coffee', image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=300&h=300&fit=crop', description: 'Chocolate espresso delight' },
  { id: 'cf6', name: 'Cold Brew', price: 5.00, category: 'Coffee', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop', description: 'Slow steeped 24 hours' },
  { id: 't1', name: 'Green Tea', price: 3.00, category: 'Tea', image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=300&h=300&fit=crop', description: 'Japanese matcha style' },
  { id: 't2', name: 'Earl Grey', price: 3.50, category: 'Tea', image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=300&h=300&fit=crop', description: 'Bergamot infused black tea' },
  { id: 't3', name: 'Thai Tea', price: 4.50, category: 'Tea', image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=300&h=300&fit=crop', description: 'Creamy spiced orange tea' },
  { id: 't4', name: 'Matcha Latte', price: 5.50, category: 'Tea', image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=300&h=300&fit=crop', description: 'Premium matcha with milk' },
  { id: 'j1', name: 'Orange Juice', price: 4.00, category: 'Juice', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=300&fit=crop', description: 'Freshly squeezed' },
  { id: 'j2', name: 'Mango Smoothie', price: 5.50, category: 'Juice', image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=300&h=300&fit=crop', description: 'Tropical mango blend' },
  { id: 'j3', name: 'Berry Blast', price: 6.00, category: 'Juice', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&h=300&fit=crop', description: 'Mixed berry superfood' },
  { id: 'j4', name: 'Lemon Mint', price: 4.00, category: 'Juice', image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=300&h=300&fit=crop', description: 'Refreshing citrus mint' },
  { id: 'f1', name: 'Croissant', price: 3.50, category: 'Food', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=300&h=300&fit=crop', description: 'Buttery French pastry' },
  { id: 'f2', name: 'Avocado Toast', price: 7.00, category: 'Food', image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=300&h=300&fit=crop', description: 'Sourdough with fresh avo' },
  { id: 'f3', name: 'Club Sandwich', price: 8.50, category: 'Food', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=300&fit=crop', description: 'Triple-decker classic' },
  { id: 'f4', name: 'Pasta Carbonara', price: 10.00, category: 'Food', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300&h=300&fit=crop', description: 'Creamy Italian favorite' },
  { id: 'd1', name: 'Tiramisu', price: 6.50, category: 'Dessert', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=300&fit=crop', description: 'Classic Italian dessert' },
  { id: 'd2', name: 'Cheesecake', price: 5.50, category: 'Dessert', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&h=300&fit=crop', description: 'New York style' },
  { id: 'd3', name: 'Brownie', price: 4.00, category: 'Dessert', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=300&fit=crop', description: 'Fudgy chocolate goodness' },
];

export const CATEGORIES = ['All', 'Coffee', 'Tea', 'Juice', 'Food', 'Dessert'];

interface ShopCtx {
  products: Product[];
  categories: string[];
  cart: CartItem[];
  orders: Order[];
  cartTotal: number;
  cartCount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  saveOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], txHash?: string) => void;
}

const ShopContext = createContext<ShopCtx | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('arcbank_orders');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCart(prev => prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      ));
    }
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const saveOrder = useCallback((order: Order) => {
    setOrders(prev => {
      const updated = [order, ...prev];
      localStorage.setItem('arcbank_orders', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status'], txHash?: string) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? { ...o, status, txHash } : o);
      localStorage.setItem('arcbank_orders', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <ShopContext.Provider value={{
      products: PRODUCTS, categories: CATEGORIES, cart, orders,
      cartTotal, cartCount, addToCart, removeFromCart, updateQuantity,
      clearCart, saveOrder, updateOrderStatus,
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
}
