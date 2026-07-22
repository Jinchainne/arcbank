import Header from '../components/Header';
import { useToast } from '../components/UI';
import { Copy, Share2, QrCode as QrIcon, Wallet } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const WALLET_ADDRESS = '0xb3351234567890abcdef1234567890abcdefc544';

export default function Receive() {
  const { showToast, ToastUI } = useToast();
  const copyAddress = () => { navigator.clipboard.writeText(WALLET_ADDRESS); showToast('Address copied!'); };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header title="Receive" subtitle="Share your address to receive USDC" />
      <div className="p-4 sm:p-6 max-w-md mx-auto">
        <div className="card p-6 text-center">
          <div className="bg-white p-4 rounded-2xl inline-block mb-5 border border-slate-100 shadow-sm">
            <QRCodeSVG value={WALLET_ADDRESS} size={200} bgColor="#ffffff" fgColor="#0f172a" level="H" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Your Wallet Address</h3>
          <p className="text-xs text-slate-400 mb-4">On Arc Testnet (Chain ID: 5042002)</p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
            <p className="font-mono text-xs text-slate-600 break-all">{WALLET_ADDRESS}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={copyAddress} className="btn-primary flex-1"><Copy className="w-4 h-4" /> Copy Address</button>
            <button className="btn-secondary flex-1"><Share2 className="w-4 h-4" /> Share</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="card p-4 text-center">
            <Wallet className="w-5 h-5 text-blue-500 mx-auto mb-2" />
            <p className="text-[11px] text-slate-400">Accepted Tokens</p>
            <p className="text-sm font-semibold text-slate-900">USDC, EURC</p>
          </div>
          <div className="card p-4 text-center">
            <QrIcon className="w-5 h-5 text-blue-500 mx-auto mb-2" />
            <p className="text-[11px] text-slate-400">Network</p>
            <p className="text-sm font-semibold text-slate-900">Arc Testnet</p>
          </div>
        </div>

        <div className="card p-4 mt-4">
          <p className="text-xs font-bold text-slate-900 mb-2">How to receive</p>
          <ol className="text-xs text-slate-500 space-y-2 list-decimal list-inside">
            <li>Share your wallet address or QR code with the sender</li>
            <li>Sender transfers USDC on Arc Testnet</li>
            <li>Transaction confirms in under 1 second</li>
            <li>Your balance updates automatically</li>
          </ol>
        </div>
        {ToastUI}
      </div>
    </div>
  );
}
