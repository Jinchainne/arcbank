import Header from '../components/Header';
import { useStore } from '../hooks/useStore';
import { StatusBadge } from '../components/UI';
import { formatCurrency, formatTime, shortenAddress } from '../utils/format';
import { ArrowUpRight, ArrowDownLeft, Users, Globe, Search, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function History() {
  const { transactions } = useStore();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = transactions.filter(tx => {
    if (filter !== 'all' && tx.type !== filter) return false;
    if (searchQuery) { const q = searchQuery.toLowerCase(); return tx.to.toLowerCase().includes(q) || tx.from.toLowerCase().includes(q) || tx.memo?.toLowerCase().includes(q); }
    return true;
  });

  const getIcon = (type: string) => {
    const map: Record<string, any> = { send: ArrowUpRight, receive: ArrowDownLeft, split: Users, remit: Globe };
    const colors: Record<string, string> = { send: 'bg-red-50 text-red-500', receive: 'bg-emerald-50 text-emerald-500', split: 'bg-violet-50 text-violet-500', remit: 'bg-blue-50 text-blue-500' };
    const Icon = map[type] || ArrowUpRight;
    return <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[type]}`}><Icon className="w-5 h-5" /></div>;
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header title="Transaction History" subtitle={`${transactions.length} transactions`} />
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search transactions..." className="pl-11" />
          </div>
          <div className="tab-bar">
            {['all', 'send', 'receive', 'split', 'remit'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`tab-item ${filter === f ? 'active' : ''}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="card divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">No transactions found</div>
          ) : filtered.map(tx => (
            <div key={tx.id} className="tx-row">
              {getIcon(tx.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[13px] font-semibold text-slate-900 truncate">
                    {tx.type === 'send' ? `Sent to ${tx.to}` : tx.type === 'receive' ? `Received from ${tx.from}` : tx.type === 'split' ? tx.to : `Remitted to ${tx.to}`}
                  </p>
                  <StatusBadge status={tx.status} />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{formatTime(tx.timestamp)}{tx.memo ? ` · ${tx.memo}` : ''}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-[13px] font-bold ${tx.type === 'receive' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {tx.type === 'receive' ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
                {tx.hash && (
                  <a href={`https://testnet.arcscan.app/tx/${tx.hash}`} target="_blank" rel="noreferrer"
                    className="text-[10px] text-blue-500 hover:text-blue-600 flex items-center gap-0.5 justify-end mt-0.5">
                    {shortenAddress(tx.hash)} <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
