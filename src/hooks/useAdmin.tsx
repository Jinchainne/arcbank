import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface FinanceEntry {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  note: string;
}

interface AdminCtx {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  finances: FinanceEntry[];
  addFinance: (entry: Omit<FinanceEntry, 'id'>) => void;
  removeFinance: (id: string) => void;
  totalIncome: number;
  totalExpense: number;
  profit: number;
}

const ADMIN_PASSWORD = 'admin123'; // Demo password

const AdminContext = createContext<AdminCtx | null>(null);

const EXPENSE_CATEGORIES = ['Nguyên liệu', 'Lương nhân viên', 'Thuê mặt bằng', 'Điện/Nước/Internet', 'Vận chuyển', 'Marketing', 'Thiết bị', 'Thuế', 'Khác'];
const INCOME_CATEGORIES = ['Bán hàng', 'Ship fee', 'Tip', 'Khác'];

export { EXPENSE_CATEGORIES, INCOME_CATEGORIES };

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('arcbank_admin') === 'true';
  });

  const [finances, setFinances] = useState<FinanceEntry[]>(() => {
    try {
      const saved = localStorage.getItem('arcbank_finances');
      return saved ? JSON.parse(saved) : getDefaultFinances();
    } catch { return getDefaultFinances(); }
  });

  const login = useCallback((password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      sessionStorage.setItem('arcbank_admin', 'true');
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    sessionStorage.removeItem('arcbank_admin');
  }, []);

  const addFinance = useCallback((entry: Omit<FinanceEntry, 'id'>) => {
    setFinances(prev => {
      const newEntry = { ...entry, id: `FIN-${Date.now().toString(36)}` };
      const updated = [newEntry, ...prev];
      localStorage.setItem('arcbank_finances', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFinance = useCallback((id: string) => {
    setFinances(prev => {
      const updated = prev.filter(f => f.id !== id);
      localStorage.setItem('arcbank_finances', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const totalIncome = finances.filter(f => f.type === 'income').reduce((s, f) => s + f.amount, 0);
  const totalExpense = finances.filter(f => f.type === 'expense').reduce((s, f) => s + f.amount, 0);
  const profit = totalIncome - totalExpense;

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, finances, addFinance, removeFinance, totalIncome, totalExpense, profit }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}

function getDefaultFinances(): FinanceEntry[] {
  const today = new Date();
  const d = (daysAgo: number) => {
    const dt = new Date(today);
    dt.setDate(dt.getDate() - daysAgo);
    return dt.toISOString().split('T')[0];
  };
  return [
    { id: 'f1', type: 'income', category: 'Bán hàng', description: 'Doanh thu ngày 23/07', amount: 245.50, date: d(0), note: '15 đơn hàng' },
    { id: 'f2', type: 'income', category: 'Bán hàng', description: 'Doanh thu ngày 22/07', amount: 189.25, date: d(1), note: '12 đơn hàng' },
    { id: 'f3', type: 'income', category: 'Bán hàng', description: 'Doanh thu ngày 21/07', amount: 312.00, date: d(2), note: '20 đơn hàng' },
    { id: 'f4', type: 'income', category: 'Ship fee', description: 'Phí ship tuần này', amount: 87.50, date: d(0), note: 'Tổng phí vận chuyển' },
    { id: 'f5', type: 'expense', category: 'Nguyên liệu', description: 'Mua cà phê hạt', amount: 120.00, date: d(1), note: '5kg robusta + 3kg arabica' },
    { id: 'f6', type: 'expense', category: 'Nguyên liệu', description: 'Mua thực phẩm tươi', amount: 85.00, date: d(1), note: 'Rau, thịt, hải sản' },
    { id: 'f7', type: 'expense', category: 'Lương nhân viên', description: 'Lương tuần NV #1', amount: 150.00, date: d(0), note: 'Part-time' },
    { id: 'f8', type: 'expense', category: 'Điện/Nước/Internet', description: 'Hóa đơn điện tháng 7', amount: 95.00, date: d(5), note: '' },
    { id: 'f9', type: 'expense', category: 'Thuê mặt bằng', description: 'Tiền thuê tháng 7', amount: 500.00, date: d(7), note: 'Trả trước' },
    { id: 'f10', type: 'expense', category: 'Marketing', description: 'Quảng cáo Facebook', amount: 50.00, date: d(3), note: 'Boost post' },
    { id: 'f11', type: 'expense', category: 'Vận chuyển', description: 'Phí ship bên thứ 3', amount: 35.00, date: d(2), note: 'Đơn ngoài' },
    { id: 'f12', type: 'income', category: 'Tip', description: 'Tip khách', amount: 15.00, date: d(0), note: 'Tiền tip' },
  ];
}
