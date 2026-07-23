import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import React, { useState, useRef, useEffect } from 'react';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Check, AlertTriangle, X, Loader2 } from 'lucide-react';
import { arcTestnet } from '../config/chains';

function shortenAddress(addr: string) {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

// Inline SVG logos for each wallet (no external dependencies)
function WalletIcon({ name, size = 44 }: { name: string; size?: number }) {
  const s = size;
  const r = 10; // border radius

  const logos: Record<string, React.ReactNode> = {
    MetaMask: (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx={r} fill="#F6851B"/>
        <path d="M82 25L55 42l5-12z" fill="#E2761B" stroke="#E2761B" strokeWidth=".5"/>
        <path d="M18 25l27 17-5-12z" fill="#E4761B" stroke="#E4761B" strokeWidth=".5"/>
        <path d="M78 62l-7 10 15 4 4-14z" fill="#E4761B" stroke="#E4761B" strokeWidth=".5"/>
        <path d="M8 62l4 14 15-4-7-10z" fill="#E4761B" stroke="#E4761B" strokeWidth=".5"/>
        <path d="M47 46l-4 6 14 6 14-6-4-6z" fill="#E4761B" stroke="#E4761B" strokeWidth=".5"/>
        <path d="M39 72l7-10-6-3H60l-6 3 7 10z" fill="#D7C1B3"/>
        <path d="M18 25l-3 2 17 46 6-4-1 14 13 13 20-13 1-14 6 4L85 27z" fill="#763D16"/>
        <path d="M82 25l-17 4-5-12zM25 29l-5 12-17-4z" fill="#E4751F"/>
        <path d="M65 72l-1 14 13 13 4-2zM35 72l-1 14-13 13-4-2z" fill="#F5841F"/>
        <path d="M60 52l-14 6 5 10 3 10h5l3-10 5-10z" fill="#763D16"/>
        <path d="M55 42l-4 8 4 14 8-14 4-8z" fill="#763D16"/>
      </svg>
    ),
    WalletConnect: (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx={r} fill="#3396FF"/>
        <path d="M30 42c12-12 31-12 43 0l2 2c1 1 1 3 0 4l-5 5c-1 1-2 1-3 0l-2-2c-8-8-21-8-29 0l-2 2c-1 1-2 1-3 0l-5-5c-1-1-1-3 0-4z" fill="white"/>
        <path d="M70 52l3 3c1 1 1 2 0 3l-12 12c-1 1-2 1-3 0l-8-8c-.5-.5-1.4-.5-2 0l-8 8c-1 1-2 1-3 0L24 58c-1-1-1-2 0-3l3-3c1-1 2-1 3 0l8 8c.5.5 1.4.5 2 0l8-8c1-1 2-1 3 0z" fill="white"/>
      </svg>
    ),
    'Coinbase Wallet': (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx={r} fill="#0052FF"/>
        <circle cx="50" cy="50" r="28" fill="white"/>
        <rect x="38" y="38" width="24" height="24" rx="4" fill="#0052FF"/>
        <path d="M46 50h8v4h-8z" fill="white"/>
      </svg>
    ),
    OKX: (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx={r} fill="#000000"/>
        <rect x="18" y="18" width="26" height="26" rx="5" fill="white"/>
        <rect x="56" y="18" width="26" height="26" rx="5" fill="white"/>
        <rect x="18" y="56" width="26" height="26" rx="5" fill="white"/>
        <rect x="56" y="56" width="26" height="26" rx="5" fill="white"/>
      </svg>
    ),
    Rabby: (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx={r} fill="#6C5CE7"/>
        <ellipse cx="38" cy="30" rx="8" ry="14" fill="white"/>
        <ellipse cx="62" cy="30" rx="8" ry="14" fill="white"/>
        <circle cx="50" cy="55" r="22" fill="white"/>
        <circle cx="42" cy="50" r="4" fill="#6C5CE7"/>
        <circle cx="58" cy="50" r="4" fill="#6C5CE7"/>
        <ellipse cx="50" cy="58" rx="3" ry="2" fill="#6C5CE7"/>
        <path d="M44 62c2 3 10 3 12 0" stroke="#6C5CE7" strokeWidth="2" fill="none"/>
      </svg>
    ),
    'Binance Wallet': (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx={r} fill="#F0B90B"/>
        <path d="M50 22l-8 8-12-12-8 8 20 20 20-20-8-8-12 12z" fill="white"/>
        <path d="M20 50l8-8 8 8-8 8z" fill="white"/>
        <path d="M64 42l8 8-8 8-8-8z" fill="white"/>
        <path d="M42 42l8-8 8 8-8 8z" fill="white"/>
        <path d="M50 58l-8 8-12-12-8 8 20 20 20-20-8-8-12 12z" fill="white"/>
      </svg>
    ),
    'Base Account': (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx={r} fill="#0052FF"/>
        <circle cx="50" cy="50" r="25" fill="white"/>
        <path d="M50 25a25 25 0 010 50V25z" fill="#0052FF"/>
      </svg>
    ),
    Injected: (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx={r} fill="#6366F1"/>
        <path d="M50 25l20 35H30z" fill="white"/>
        <circle cx="50" cy="48" r="5" fill="#6366F1"/>
      </svg>
    ),
  };

  const logo = logos[name];
  if (logo) return <div className="rounded-xl overflow-hidden" style={{ width: s, height: s }}>{logo}</div>;

  // Fallback: first letter
  return (
    <div style={{ width: s, height: s }} className="rounded-xl bg-slate-100 flex items-center justify-center">
      <span className="text-xl font-bold text-slate-500">{name.charAt(0)}</span>
    </div>
  );
}

const WALLET_DESC: Record<string, string> = {
  MetaMask: 'Browser extension wallet',
  'Coinbase Wallet': 'Coinbase mobile or extension',
  WalletConnect: 'Scan QR with any mobile wallet',
  OKX: 'OKX Web3 wallet extension',
  Rabby: 'Rabby browser extension',
  'Binance Wallet': 'Binance Web3 wallet',
  'Base Account': 'Base network wallet',
  Injected: 'Browser injected wallet',
};

// Force add + switch to Arc Testnet
async function forceSwitchToArc() {
  const ethereum = (window as any).ethereum;
  if (!ethereum) return;
  const arcChainId = '0x4cf3a2';
  try {
    await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: arcChainId }] });
  } catch (e: any) {
    if (e.code === 4902 || e.message?.includes('Unrecognized') || e.message?.includes('not found')) {
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: arcChainId,
            chainName: 'Arc Testnet',
            nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
            rpcUrls: ['https://rpc.testnet.arc.network'],
            blockExplorerUrls: ['https://testnet.arcscan.app'],
          }],
        });
      } catch (addErr) {
        console.error('Failed to add Arc Testnet:', addErr);
      }
    }
  }
}

export default function WalletConnect() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [switching, setSwitching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasTriedSwitch = useRef(false);

  useEffect(() => {
    if (isConnected && chain && chain.id !== arcTestnet.id && !hasTriedSwitch.current) {
      hasTriedSwitch.current = true;
      setSwitching(true);
      try { switchChain({ chainId: arcTestnet.id }); } catch {}
      forceSwitchToArc().finally(() => {
        setSwitching(false);
        setTimeout(() => { hasTriedSwitch.current = false; }, 5000);
      });
    }
    if (isConnected && chain && chain.id === arcTestnet.id) {
      setShowModal(false);
    }
  }, [isConnected, chain, switchChain]);

  useEffect(() => {
    if (!isConnected) hasTriedSwitch.current = false;
  }, [isConnected]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isWrongChain = isConnected && chain && chain.id !== arcTestnet.id;

  // ═══════ WALLET SELECTOR MODAL ═══════
  if (showModal) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="px-6 pt-6 pb-4 text-center relative">
            <button onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5 text-slate-400" />
            </button>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-200">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Log in or sign up</h2>
            <p className="text-sm text-slate-400 mt-1">Connect wallet to pay with USDC on Arc Testnet</p>
          </div>

          <div className="px-6 pb-4 space-y-2">
            {connectors.map(connector => (
              <button key={connector.uid}
                onClick={() => { connect({ connector }); }}
                disabled={isPending}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group">
                <WalletIcon name={connector.name} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900">{connector.name}</p>
                  <p className="text-[11px] text-slate-400">{WALLET_DESC[connector.name] || 'Connect wallet'}</p>
                </div>
                {isPending && <Loader2 className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" />}
              </button>
            ))}
          </div>

          <div className="px-6 pb-6 flex items-center gap-2 justify-center">
            <div className="w-4 h-4 rounded bg-emerald-100 flex items-center justify-center">
              <Check className="w-3 h-3 text-emerald-600" />
            </div>
            <p className="text-[11px] text-slate-400">
              By connecting, you agree to our <span className="text-blue-500 underline cursor-pointer">Terms of Service</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ═══════ NOT CONNECTED ═══════
  if (!isConnected) {
    return (
      <button onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-semibold shadow-md shadow-blue-200 transition-all hover:shadow-lg hover:-translate-y-0.5">
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </button>
    );
  }

  // ═══════ WRONG CHAIN ═══════
  if (isWrongChain) {
    return (
      <button onClick={() => {
        setSwitching(true);
        try { switchChain({ chainId: arcTestnet.id }); } catch {}
        forceSwitchToArc().finally(() => setSwitching(false));
      }}
        disabled={switching}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-all">
        {switching ? <Loader2 className="w-4 h-4 text-amber-500 animate-spin" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
        <span className="text-xs font-semibold text-amber-700">
          {switching ? 'Switching to Arc...' : `Switch to Arc (on ${chain?.name})`}
        </span>
      </button>
    );
  }

  // ═══════ CONNECTED ═══════
  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white">
          {address ? address.slice(2, 4).toUpperCase() : '??'}
        </div>
        <span className="text-xs font-semibold text-slate-700">{shortenAddress(address || '')}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
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
