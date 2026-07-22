import Header from '../../components/Header';
import { useStore } from '../../hooks/useStore';
import { StatusBadge } from '../../components/UI';
import { formatCurrency, formatTime } from '../../utils/format';
import { Globe, ArrowRight, TrendingUp } from 'lucide-react';

export default function RemitHistory() {
  const { remits } = useStore();

  const totalSent = remits.reduce((sum, r) => sum + r.fromAmount, 0);
  const avgRate = remits.length ? (remits.reduce((sum, r) => sum + r.rate, 0) / remits.length).toFixed(4) : '0';

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header title="FX History" subtitle="Cross-border transfer records" />
      <div className="p-4 sm:p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="card p-4 text-center">
            <Globe className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-slate-900">{remits.length}</p>
            <p className="text-[10px] text-slate-400">Transfers</p>
          </div>
          <div className="card p-4 text-center">
            <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-slate-900">{formatCurrency(totalSent)}</p>
            <p className="text-[10px] text-slate-400">Total Sent</p>
          </div>
          <div className="card p-4 text-center">
            <ArrowRight className="w-5 h-5 text-violet-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-slate-900">{avgRate}</p>
            <p className="text-[10px] text-slate-400">Avg Rate</p>
          </div>
        </div>

        {/* Remit List */}
        <div className="card divide-y divide-slate-100">
          {remits.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">No transfers yet</div>
          ) : remits.map(r => (
            <div key={r.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">To {r.recipient}</p>
                  <p className="text-[11px] text-slate-400">{r.recipientCountry} · {formatTime(r.timestamp)}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                <div className="text-center">
                  <p className="text-[10px] text-slate-400">Sent</p>
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(r.fromAmount)} {r.fromCurrency}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300" />
                <div className="text-center">
                  <p className="text-[10px] text-slate-400">Received</p>
                  <p className="text-sm font-bold text-emerald-600">{formatCurrency(r.toAmount)} {r.toCurrency}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400">Rate</p>
                  <p className="text-xs font-mono text-slate-600">{r.rate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
