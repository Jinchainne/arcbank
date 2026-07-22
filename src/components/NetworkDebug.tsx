import { useAccount, useBalance, useReadContract } from 'wagmi';
import { USDC_ADDRESS, EURC_ADDRESS, ERC20_ABI } from '../config/chains';
import { useState } from 'react';

export default function NetworkDebug() {
  const { address, isConnected, chain } = useAccount();
  const { data: nativeBalance } = useBalance({ address });
  const { data: usdcRaw, error: usdcError } = useReadContract({
    address: USDC_ADDRESS, abi: ERC20_ABI, functionName: 'balanceOf',
    args: address ? [address] : undefined, query: { enabled: !!address },
  });
  const { data: eurcRaw, error: eurcError } = useReadContract({
    address: EURC_ADDRESS, abi: ERC20_ABI, functionName: 'balanceOf',
    args: address ? [address] : undefined, query: { enabled: !!address },
  });
  const [open, setOpen] = useState(false);
  if (!isConnected) return null;
  return (
    <div className="fixed bottom-20 left-4 z-40">
      <button onClick={() => setOpen(!open)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-mono hover:bg-slate-700">
        {open ? 'Hide' : 'Debug'}
      </button>
      {open && (
        <div className="mt-2 p-4 bg-slate-900 rounded-xl text-[11px] font-mono text-slate-300 w-80 shadow-xl">
          <p className="text-emerald-400 font-bold mb-2">On-Chain Debug</p>
          <p>Wallet: {address?.slice(0, 16)}...</p>
          <p>Chain: {chain?.name} ({chain?.id})</p>
          <p>Gas: {nativeBalance ? (Number(nativeBalance.value) / 1e18).toFixed(6) : '...'} {nativeBalance?.symbol}</p>
          <p className="text-blue-400 mt-1">USDC ({USDC_ADDRESS.slice(0, 10)}...)</p>
          <p>  Raw: {usdcRaw?.toString() || '...'}</p>
          <p>  Human: {(Number(usdcRaw || 0) / 1e6).toFixed(6)}</p>
          {usdcError && <p className="text-red-400">  Err: {usdcError.message.slice(0, 60)}</p>}
          <p className="text-blue-400 mt-1">EURC ({EURC_ADDRESS.slice(0, 10)}...)</p>
          <p>  Raw: {eurcRaw?.toString() || '...'}</p>
          <p>  Human: {(Number(eurcRaw || 0) / 1e6).toFixed(6)}</p>
          {eurcError && <p className="text-red-400">  Err: {eurcError.message.slice(0, 60)}</p>}
        </div>
      )}
    </div>
  );
}
