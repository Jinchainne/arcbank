import { useAccount } from 'wagmi';
import { useState } from 'react';
import { ExternalLink, ChevronRight, AlertCircle } from 'lucide-react';
import WalletConnect from './WalletConnect';

const ARC_NETWORK = {
  chainId: '0x4CE552', // 5042002 in hex
  chainName: 'Arc Testnet',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
  rpcUrls: ['https://rpc.testnet.arc.network'],
  blockExplorerUrls: ['https://testnet.arcscan.app'],
};

export default function Onboarding() {
  const { isConnected } = useAccount();
  const [dismissed, setDismissed] = useState(false);
  const [addingNetwork, setAddingNetwork] = useState(false);

  if (dismissed || isConnected) return null;

  const addArcNetwork = async () => {
    setAddingNetwork(true);
    try {
      await (window as any).ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [ARC_NETWORK],
      });
    } catch (err) {
      console.error('Failed to add network:', err);
    }
    setAddingNetwork(false);
  };

  return (
    <div className="px-4 sm:px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="card p-6 border-2 border-amber-200 bg-amber-50">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Get Started with COFFEE HOUSE</h3>
                <p className="text-xs text-slate-500">Follow these steps to use real USDC on Arc Testnet</p>
              </div>
            </div>
            <button onClick={() => setDismissed(true)} className="text-xs text-slate-400 hover:text-slate-600">Dismiss</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Step 1: Install MetaMask */}
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">1</div>
                <span className="text-xs font-bold text-slate-900">Install MetaMask</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">Browser extension wallet</p>
              <a href="https://metamask.io/download/" target="_blank" rel="noreferrer"
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
                Download <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Step 2: Add Arc Network */}
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">2</div>
                <span className="text-xs font-bold text-slate-900">Add Arc Testnet</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">Chain ID: 5042002</p>
              <button onClick={addArcNetwork} disabled={addingNetwork}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
                {addingNetwork ? 'Adding...' : 'Add to MetaMask'} <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Step 3: Get Testnet USDC */}
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">3</div>
                <span className="text-xs font-bold text-slate-900">Get Testnet USDC</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">Free from Circle Faucet</p>
              <a href="https://faucet.circle.com" target="_blank" rel="noreferrer"
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
                Open Faucet <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Step 4: Connect Wallet */}
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">4</div>
                <span className="text-xs font-bold text-slate-900">Connect Wallet</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">Click below to connect</p>
              <WalletConnect />
            </div>
          </div>

          {/* Network Details */}
          <div className="mt-4 p-3 bg-white rounded-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Arc Testnet Network Details</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
              <div><span className="text-slate-400">Chain ID:</span> <span className="font-mono font-bold text-slate-700">5042002</span></div>
              <div><span className="text-slate-400">RPC:</span> <span className="font-mono text-slate-700">rpc.testnet.arc.network</span></div>
              <div><span className="text-slate-400">Currency:</span> <span className="font-bold text-slate-700">USDC (18 dec)</span></div>
              <div><span className="text-slate-400">Explorer:</span> <a href="https://testnet.arcscan.app" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">arcscan.app</a></div>
              <div><span className="text-slate-400">Faucet:</span> <a href="https://faucet.circle.com" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">faucet.circle.com</a></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
