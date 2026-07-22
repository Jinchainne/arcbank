import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useState, useRef, useEffect } from 'react';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Check } from 'lucide-react';

function shortenAddress(addr: string) {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function WalletConnect() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConnectors, setShowConnectors] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setShowConnectors(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // CONNECT BUTTON (not connected)
  if (!isConnected) {
    if (showConnectors) {
      return (
        <div className="relative" ref={dropdownRef}>
          <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Connect Wallet</p>
            <div className="space-y-2">
              {connectors.map(connector => (
                <button
                  key={connector.uid}
                  onClick={() => { connect({ connector }); setShowConnectors(false); }}
                  disabled={isPending}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    {connector.name === 'MetaMask' ? '🦊' :
                     connector.name === 'WalletConnect' ? '🔗' :
                     connector.name === 'Injected' ? '💉' :
                     <Wallet className="w-5 h-5 text-slate-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{connector.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {connector.name === 'MetaMask' ? 'Browser extension' :
                       connector.name === 'WalletConnect' ? 'Scan with mobile wallet' :
                       'Browser wallet'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setShowConnectors(false)} className="w-full mt-3 py-2 text-xs text-slate-400 hover:text-slate-600">
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={() => setShowConnectors(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-semibold shadow-md shadow-blue-200 transition-all hover:shadow-lg hover:-translate-y-0.5"
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </button>
    );
  }

  // CONNECTED — show address with dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white">
          {address ? address.slice(2, 4).toUpperCase() : '??'}
        </div>
        <span className="text-xs font-semibold text-slate-700">{shortenAddress(address || '')}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
          {/* Connected info */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shadow-md">
                {address ? address.slice(2, 4).toUpperCase() : '??'}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Connected</p>
                <p className="text-[11px] text-slate-500">{shortenAddress(address || '')}</p>
              </div>
              <div className="ml-auto flex items-center gap-1 px-2 py-0.5 bg-emerald-100 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-semibold text-emerald-700">Active</span>
              </div>
            </div>
            {chain && (
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-600">{chain.name}</span>
                <span className="ml-auto text-[10px] text-slate-400 font-mono">ID {chain.id}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-2">
            <button onClick={copyAddress}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors">
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span className="text-sm text-slate-700">{copied ? 'Copied!' : 'Copy Address'}</span>
            </button>
            <a href={`https://testnet.arcscan.app/address/${address}`} target="_blank" rel="noreferrer"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors">
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700">View on ArcScan</span>
            </a>
            <div className="border-t border-slate-100 my-1" />
            <button onClick={() => { disconnect(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-left transition-colors">
              <LogOut className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-600 font-medium">Disconnect</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
