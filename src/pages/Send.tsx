import { useStore } from '../hooks/useStore';
import { useToast } from '../components/UI';
import { formatCurrency, shortenAddress } from '../utils/format';
import { useSendUSDC } from '../hooks/useOnChain';
import { useAccount } from 'wagmi';
import { isAddress } from 'viem';
import WalletConnect from '../components/WalletConnect';
import { Send as SendIcon, Search, Zap, Clock, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function Send() {
  const { contacts } = useStore();
  const { isConnected } = useAccount();
  const { send, hash, isPending, isConfirming, isSuccess, error: sendError } = useSendUSDC();
  const { showToast, ToastUI } = useToast();
  const [step, setStep] = useState<'recipient' | 'amount' | 'confirm'>('recipient');
  const [selectedContact, setSelectedContact] = useState<typeof contacts[0] | null>(null);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectContact = (contact: typeof contacts[0]) => {
    setSelectedContact(contact);
    setAddress(contact.address);
    setStep('amount');
  };

  const handleSend = () => {
    if (!address || !amount) return;
    send(address, amount);
    setStep('confirm');
  };

  // Watch for success
  if (isSuccess && !showSuccess && hash) {
    setShowSuccess(true);
  }

  const reset = () => {
    setStep('recipient');
    setSelectedContact(null);
    setAddress('');
    setAmount('');
    setMemo('');
    setShowSuccess(false);
  };

  if (!isConnected) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Send Money</h1>
          <p className="text-sm text-slate-400 mb-8">Transfer USDC on Arc Testnet</p>
          <div className="card p-8 text-center max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Connect Wallet First</h3>
            <p className="text-sm text-slate-500 mb-5">You need to connect your wallet to send USDC on Arc Testnet.</p>
            <WalletConnect />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Send Money</h1>
        <p className="text-sm text-slate-400 mb-6">Transfer USDC instantly on Arc Testnet</p>

        <div className="max-w-lg mx-auto">
          {/* Progress */}
          <div className="flex items-center gap-1 mb-6">
            {['Recipient', 'Amount', 'Confirm'].map((label, i) => {
              const active = i === 0 || (i === 1 && step !== 'recipient') || (i === 2 && step === 'confirm');
              return (
                <div key={label} className="flex items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    active ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {active && i < (step === 'confirm' ? 3 : step === 'amount' ? 2 : 1) ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-xs ml-2 font-medium ${active ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
                  {i < 2 && <div className={`flex-1 h-0.5 mx-2 rounded ${active ? 'bg-blue-200' : 'bg-slate-100'}`} />}
                </div>
              );
            })}
          </div>

          {/* Step 1: Recipient */}
          {step === 'recipient' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search contacts or paste address..." className="pl-11" />
              </div>
              <div className="card p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Contacts</p>
                <div className="space-y-1">
                  {filteredContacts.map(contact => (
                    <button key={contact.id} onClick={() => handleSelectContact(contact)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{contact.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{shortenAddress(contact.address)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="card p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Or Enter Manually</p>
                <div className="flex gap-2">
                  <input value={address} onChange={e => setAddress(e.target.value)} placeholder="0x..." className="flex-1 font-mono text-sm" />
                  <button onClick={() => { if (isAddress(address)) setStep('amount'); else showToast('Invalid address', 'error'); }}
                    disabled={!address} className="btn-primary !px-5">Next</button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Amount */}
          {step === 'amount' && (
            <div className="space-y-4">
              <div className="card p-6 text-center">
                <p className="text-xs text-slate-400 mb-2">Sending to</p>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {selectedContact ? selectedContact.name.split(' ').map(n => n[0]).join('') : address.slice(2, 4).toUpperCase()}
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{selectedContact?.name || shortenAddress(address)}</p>
                </div>
                <div className="mb-2">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">$</span>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                      placeholder="0.00" className="!border-0 !bg-transparent !text-center !text-4xl !font-extrabold !text-slate-900 !p-0 !w-48 focus:!shadow-none" />
                  </div>
                  <p className="text-sm text-slate-400 mt-1">USDC</p>
                </div>
              </div>
              <input value={memo} onChange={e => setMemo(e.target.value)} placeholder="Add a note (optional)" />
              <div className="flex gap-3">
                <button onClick={() => setStep('recipient')} className="btn-secondary flex-1">Back</button>
                <button onClick={() => {
                  const num = parseFloat(amount);
                  if (num > 0 && num <= 100000) setStep('confirm');
                  else showToast('Enter a valid amount', 'error');
                }} disabled={!amount || parseFloat(amount) <= 0} className="btn-primary flex-1">Continue</button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm & Send (REAL on-chain) */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="card p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Transaction Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Recipient</span>
                    <span className="text-sm font-medium text-slate-900 font-mono">{shortenAddress(address)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Amount</span>
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(parseFloat(amount))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Token</span>
                    <span className="text-sm text-slate-700">USDC (ERC-20, 6 decimals)</span>
                  </div>
                  {memo && <div className="flex justify-between"><span className="text-xs text-slate-500">Memo</span><span className="text-sm text-slate-600">{memo}</span></div>}
                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-500">Network</span>
                      <span className="text-sm text-slate-700">Arc Testnet (5042002)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-500">Network Fee</span>
                      <span className="text-sm text-emerald-600 flex items-center gap-1"><Zap className="w-3 h-3" /> ~$0.01 USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-500">Finality</span>
                      <span className="text-sm text-slate-700 flex items-center gap-1"><Clock className="w-3 h-3" /> &lt;1 second</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Status */}
              {(isPending || isConfirming || isSuccess || sendError) && (
                <div className={`card p-5 border-2 ${
                  isSuccess ? 'border-emerald-200 bg-emerald-50' :
                  sendError ? 'border-red-200 bg-red-50' :
                  'border-blue-200 bg-blue-50'
                }`}>
                  {isPending && (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                      <div>
                        <p className="text-sm font-bold text-blue-900">Waiting for wallet confirmation...</p>
                        <p className="text-xs text-blue-600">Please approve the transaction in your wallet</p>
                      </div>
                    </div>
                  )}
                  {isConfirming && (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                      <div>
                        <p className="text-sm font-bold text-blue-900">Transaction submitted!</p>
                        <p className="text-xs text-blue-600">Waiting for Arc Testnet confirmation...</p>
                        {hash && (
                          <a href={`https://testnet.arcscan.app/tx/${hash}`} target="_blank" rel="noreferrer"
                            className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1">
                            View on ArcScan <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  {isSuccess && (
                    <div className="flex items-center gap-3">
                      <Check className="w-6 h-6 text-emerald-500" />
                      <div>
                        <p className="text-sm font-bold text-emerald-900">Transaction confirmed!</p>
                        <p className="text-xs text-emerald-600">{formatCurrency(parseFloat(amount))} sent to {shortenAddress(address)}</p>
                        {hash && (
                          <a href={`https://testnet.arcscan.app/tx/${hash}`} target="_blank" rel="noreferrer"
                            className="text-xs text-emerald-500 hover:underline flex items-center gap-1 mt-1">
                            View on ArcScan <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  {sendError && (
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-red-500" />
                      <div>
                        <p className="text-sm font-bold text-red-900">Transaction failed</p>
                        <p className="text-xs text-red-600">{sendError.message?.slice(0, 100)}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep('amount')} disabled={isPending || isConfirming} className="btn-secondary flex-1">Back</button>
                {!isSuccess && !sendError && (
                  <button onClick={handleSend} disabled={isPending || isConfirming} className="btn-primary flex-1">
                    {isPending ? '⏳ Confirm in wallet...' : isConfirming ? '⏳ Confirming...' : <><SendIcon className="w-4 h-4" /> Send USDC on Arc</>}
                  </button>
                )}
                {isSuccess && (
                  <button onClick={reset} className="btn-primary flex-1">Send Another</button>
                )}
              </div>
            </div>
          )}
        </div>
        {ToastUI}
      </div>
    </div>
  );
}
