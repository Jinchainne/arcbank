import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAccount } from 'wagmi';
import WalletConnect from '../../components/WalletConnect';
import { formatCurrency, formatTime } from '../../utils/format';
import { Globe, ArrowRight, TrendingUp, ExternalLink, Wallet } from 'lucide-react';

interface RemitRecord {
  id: string;
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  recipient: string;
  country: string;
  rate: number;
  txHash: string;
  timestamp: number;
  status: 'confirmed' | 'pending';
}

export default function RemitHistory() {
  const { isConnected } = useAccount();
  const [remits] = useLocalStorage<RemitRecord[]>('remits', [
    { id: '1', fromAmount: 500, fromCurrency: 'USDC', toAmount: 438.35, toCurrency: 'EUR', recipient: 'David Kim', country: 'Germany', rate: 0.876691, txHash: '0xabc123def456', timestamp: Date.now() - 86400000, status: 'confirmed' },
    { id: '2', fromAmount: 1000, fromCurrency: 'USDC', toAmount: 163013, toCurrency: 'JPY', recipient: 'Yuki Tanaka', country: 'Japan', rate: 163.013, txHash: '0xdef789ghi012', timestamp: Date.now() - 172800000, status: 'confirmed' },
    { id: '3', fromAmount: 250, fromCurrency: 'USDC', toAmount: 186.77, toCurrency: 'GBP', recipient: 'Emma Johnson', country: 'United Kingdom', rate: 0.747063, txHash: '0xjkl345mno678', timestamp: Date.now() - 604800000, status: 'confirmed' },
  ]);

  const totalSent = remits.reduce((sum, r) => sum + r.fromAmount, 0);
  const avgRate = remits.length ? (remits.reduce((sum, r) => sum + r.rate, 0) / remits.length).toFixed(4) : '0';

  if (!isConnected) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">FX History</h1>
          <p className="text-sm text-slate-400 mb-8">Cross-border transfer records</p>
          <div className="card p-8 text-center max-w-md mx-auto">
            <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Connect Wallet</h3>
            <WalletConnect />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">FX History</h1>
        <p className="text-sm text-slate-400 mb-6">Your cross-border transfer records on Arc Testnet</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
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

        {/* List */}
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
                  <p className="text-[11px] text-slate-400">{r.country} · {formatTime(r.timestamp)}</p>
                </div>
                <span className="badge badge-success">Confirmed</span>
              </div>
              <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                <div className="text-center">
                  <p className="text-[10px] text-slate-400">Sent</p>
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(r.fromAmount)} {r.fromCurrency}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300" />
                <div className="text-center">
                  <p className="text-[10px] text-slate-400">Received</p>
                  <p className="text-sm font-bold text-emerald-600">{r.toAmount.toLocaleString()} {r.toCurrency}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400">Rate</p>
                  <p className="text-xs font-mono text-slate-600">{r.rate}</p>
                </div>
                <a href={`https://testnet.arcscan.app/tx/${r.txHash}`} target="_blank" rel="noreferrer"
                  className="text-[10px] text-blue-500 hover:underline flex items-center gap-0.5">
                  Tx <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
