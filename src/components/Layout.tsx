import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50">
      <button onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-3 left-3 z-[60] p-2 rounded-xl bg-white shadow-sm border border-slate-200 text-slate-600">
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {mobileOpen && <div className="lg:hidden sidebar-overlay" onClick={() => setMobileOpen(false)} />}
      <div className={`lg:block ${mobileOpen ? 'block' : 'hidden'}`}><Sidebar onClose={() => setMobileOpen(false)} /></div>
      <main className="lg:ml-64 min-h-screen"><Outlet /></main>
    </div>
  );
}
