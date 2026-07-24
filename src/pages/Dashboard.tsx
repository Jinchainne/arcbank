import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useUSDCBalance, useEURCBalance, useNativeBalance } from '../hooks/useOnChain';
import { useRecentTransactions } from '../hooks/useTransactions';
import WalletConnect from '../components/WalletConnect';
import {
  Send, QrCode, ArrowDownLeft, ArrowUpRight, Users, Globe,
  Activity, Clock, ExternalLink, Wallet, Zap, Shield
} from 'lucide-react';

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { balance: usdcBalance, isLoading: usdcLoading } = useUSDCBalance();
  const { balance: eurcBalance, isLoading: eurcLoading } = useEURCBalance();
  const { balance: nativeBalance } = useNativeBalance();
  const { transactions: onChainTxs, loading: txLoading } = useRecentTransactions(20);
  const navigate = useNavigate();

  const total = usdcBalance + eurcBalance;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl font-extrabold text-white mb-2">COFFEE HOUSE</h1>
          <p className="text-blue-100 text-sm mb-8">Order coffee & food, pay with USDC on Arc Testnet</p>

          {/* Balance */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-xl">
            <div className="flex items-center justify-between mb-1">
              <p className="text-blue-100 text-xs">Total Balance</p>
              {isConnected && <span className="text-[10px] text-emerald-300 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" /> Live on-chain</span>}
            </div>
            <p className="text-3xl font-extrabold text-white mb-4">
              {isConnected ? `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '--'}
            </p>
            <div className="flex gap-4 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-400/30 flex items-center justify-center text-[10px] font-bold text-white">$</div>
                <div><p className="text-[10px] text-blue-200">USDC</p><p className="text-sm font-bold text-white">{isConnected ? (usdcLoading ? '...' : usdcBalance.toFixed(3)) : '--'}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-400/30 flex items-center justify-center text-[10px] font-bold text-white">€</div>
                <div><p className="text-[10px] text-blue-200">EURC</p><p className="text-sm font-bold text-white">{isConnected ? (eurcLoading ? '...' : eurcBalance.toFixed(3)) : '--'}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-400/30 flex items-center justify-center text-[10px] text-white">⛽</div>
                <div><p className="text-[10px] text-blue-200">Gas</p><p className="text-sm font-bold text-white">{isConnected ? nativeBalance.toFixed(4) : '--'}</p></div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate('/send')} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors">
                <Send className="w-4 h-4" /> Send
              </button>
              <button onClick={() => navigate('/receive')} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors">
                <QrCode className="w-4 h-4" /> Receive
              </button>
              <button onClick={() => navigate('/split')} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors">
                <Users className="w-4 h-4" /> Split
              </button>
              <button onClick={() => navigate('/remit')} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors">
                <Globe className="w-4 h-4" /> Remit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Connect prompt */}
        {!isConnected && (
          <div className="card p-6 border-2 border-dashed border-blue-200 bg-blue-50/50 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Wallet className="w-10 h-10 text-blue-400" />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-sm font-bold text-slate-900">Connect wallet to get started</h3>
                <p className="text-xs text-slate-500">Connect MetaMask to send/receive USDC on Arc Testnet. Get testnet USDC from <a href="https://faucet.circle.com" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">faucet.circle.com</a></p>
              </div>
              <WalletConnect />
            </div>
          </div>
        )}

        {/* On-chain Transactions */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              On-Chain Transactions
              {isConnected && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Live</span>}
            </h2>
            {isConnected && (
              <a href={`https://testnet.arcscan.app/address/${address}`} target="_blank" rel="noreferrer"
                className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                View on ArcScan <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {!isConnected ? (
            <div className="text-center py-12">
              <Wallet className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Connect wallet to view transactions</p>
            </div>
          ) : txLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm text-slate-400">Loading from Arc Testnet...</p>
            </div>
          ) : onChainTxs.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-400">No transactions on this wallet</p>
              <div className="flex gap-2 justify-center mt-4">
                <button onClick={() => navigate('/send')} className="btn-primary !text-xs !py-2">Send USDC →</button>
                <a href="https://faucet.circle.com" target="_blank" rel="noreferrer" className="btn-secondary !text-xs !py-2">Get Testnet USDC ↗</a>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {onChainTxs.slice(0, 10).map(tx => {
                const isSent = tx.from.toLowerCase() === address?.toLowerCase();
                return (
                  <div key={tx.hash} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSent ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                      {isSent ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-slate-900 truncate font-mono">
                        {isSent ? `To ${tx.to}` : `From ${tx.from}`}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-[11px] text-slate-400">{new Date(tx.timestamp).toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400">Block #{tx.blockNumber}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-[13px] font-bold ${isSent ? 'text-slate-900' : 'text-emerald-600'}`}>
                        {isSent ? '-' : '+'}{(Number(tx.value) / 1e18).toFixed(4)} USDC
                      </p>
                      <a href={`https://testnet.arcscan.app/tx/${tx.hash}`} target="_blank" rel="noreferrer"
                        className="text-[10px] text-blue-500 hover:underline flex items-center gap-0.5 justify-end">
                        {tx.hash.slice(0, 8)}... <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Network Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <div className="card p-4 flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-500" />
            <div><p className="text-xs font-bold text-slate-700">Arc L1</p><p className="text-[10px] text-slate-400">Sub-second finality</p></div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <Zap className="w-5 h-5 text-amber-500" />
            <div><p className="text-xs font-bold text-slate-700">~$0.01 Fee</p><p className="text-[10px] text-slate-400">USDC gas token</p></div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <Globe className="w-5 h-5 text-emerald-500" />
            <div><p className="text-xs font-bold text-slate-700">CCTP v2</p><p className="text-[10px] text-slate-400">Cross-chain USDC</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
