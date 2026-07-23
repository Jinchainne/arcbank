import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useShop, MERCHANT_ADDRESS } from '../../hooks/useShop';
import { useSendUSDC, useUSDCBalance } from '../../hooks/useOnChain';
import { formatCurrency, shortenAddress } from '../../utils/format';
import WalletConnect from '../../components/WalletConnect';
import { ArrowLeft, Check, ExternalLink, AlertCircle, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';

export default function ShopCheckout() {
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  const { cart, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart, saveOrder, updateOrderStatus } = useShop();
  const { balance } = useUSDCBalance();
  const { send, hash, isPending, isConfirming, isSuccess, error: sendError } = useSendUSDC();
  const [step, setStep] = useState<'review' | 'pay' | 'done'>('review');
  const [orderId, setOrderId] = useState('');

  const insufficientBalance = cartTotal > balance;

  const handlePay = () => {
    const id = `ORD-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(id);
    saveOrder({
      id,
      items: cart,
      total: cartTotal,
      status: 'pending',
      timestamp: Date.now(),
      merchantAddress: MERCHANT_ADDRESS,
    });
    send(MERCHANT_ADDRESS, cartTotal.toFixed(6));
    setStep('pay');
  };

  useEffect(() => {
    if (isSuccess && orderId) {
      updateOrderStatus(orderId, 'confirmed', hash);
      clearCart();
      setStep('done');
    }
    if (sendError && orderId) {
      updateOrderStatus(orderId, 'failed');
    }
  }, [isSuccess, sendError, orderId, hash]);

  if (!isConnected) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="card p-8 text-center max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Connect Wallet</h3>
            <WalletConnect />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
        {/* Back button */}
        <button onClick={() => navigate('/shop')} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </button>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Checkout</h1>
        <p className="text-sm text-slate-400 mb-6">Review your order and pay with USDC</p>

        {/* Step 1: Review */}
        {step === 'review' && (
          <div className="space-y-4">
            {cart.length === 0 ? (
              <div className="card p-8 text-center">
                <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500 mb-4">Your cart is empty</p>
                <button onClick={() => navigate('/shop')} className="btn-primary">Browse Menu</button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="card p-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-4">Order Items ({cartCount})</h3>
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item.product.id} className="flex items-center gap-3">
                        <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900">{item.product.name}</p>
                          <p className="text-xs text-slate-400">${item.product.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Plus className="w-3 h-3 text-blue-600" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-slate-900 w-16 text-right">${(item.product.price * item.quantity).toFixed(2)}</span>
                        <button onClick={() => removeFromCart(item.product.id)} className="text-slate-300 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="card p-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Payment Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Network Fee</span>
                      <span className="text-emerald-600 font-semibold">~$0.01</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Network</span>
                      <span className="text-slate-700">Arc Testnet</span>
                    </div>
                    <div className="border-t border-slate-100 pt-2 mt-2 flex justify-between">
                      <span className="text-sm font-bold text-slate-900">Total</span>
                      <span className="text-lg font-extrabold text-blue-600">${cartTotal.toFixed(2)} USDC</span>
                    </div>
                  </div>
                </div>

                {/* Balance Check */}
                <div className={`card p-3 ${insufficientBalance ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'}`}>
                  <div className="flex justify-between text-sm">
                    <span className={insufficientBalance ? 'text-red-700' : 'text-emerald-700'}>Your USDC Balance</span>
                    <span className={`font-bold ${insufficientBalance ? 'text-red-700' : 'text-emerald-700'}`}>{formatCurrency(balance)}</span>
                  </div>
                  {insufficientBalance && <p className="text-xs text-red-600 mt-1">Insufficient balance. Need {formatCurrency(cartTotal - balance)} more.</p>}
                </div>

                {/* Merchant Info */}
                <div className="card p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Pay to</span>
                    <span className="font-mono text-slate-700">{shortenAddress(MERCHANT_ADDRESS)}</span>
                  </div>
                </div>

                <button onClick={handlePay} disabled={insufficientBalance || cartTotal <= 0} className="btn-primary w-full">
                  Pay ${cartTotal.toFixed(2)} USDC
                </button>
              </>
            )}
          </div>
        )}

        {/* Step 2: Paying */}
        {step === 'pay' && (
          <div className="space-y-4">
            <div className={`card p-6 border-2 ${isSuccess ? 'border-emerald-200 bg-emerald-50' : sendError ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
              {isPending && (
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm font-bold text-blue-900">Waiting for MetaMask...</p>
                  <p className="text-xs text-blue-600 mt-1">Confirm the transaction in your wallet</p>
                </div>
              )}
              {isConfirming && (
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm font-bold text-blue-900">Confirming on Arc Testnet...</p>
                  <p className="text-xs text-blue-600 mt-1">Usually takes &lt;1 second</p>
                </div>
              )}
              {sendError && (
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                  <p className="text-sm font-bold text-red-900">Payment Failed</p>
                  <p className="text-xs text-red-600 mt-1">{sendError.message?.slice(0, 120)}</p>
                </div>
              )}
            </div>

            {sendError && (
              <div className="flex gap-3">
                <button onClick={() => setStep('review')} className="btn-secondary flex-1">Back</button>
                <button onClick={handlePay} className="btn-primary flex-1">Retry Payment</button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Done */}
        {step === 'done' && (
          <div className="space-y-4">
            <div className="card p-8 text-center border-2 border-emerald-200 bg-emerald-50">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-extrabold text-emerald-900 mb-1">Payment Successful!</h3>
              <p className="text-sm text-emerald-700 mb-4">Your order has been confirmed</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-600">Order ID</span>
                  <span className="font-mono font-bold text-emerald-900">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-600">Amount Paid</span>
                  <span className="font-bold text-emerald-900">${cartTotal.toFixed(2)} USDC</span>
                </div>
                {hash && (
                  <a href={`https://testnet.arcscan.app/tx/${hash}`} target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-1 text-emerald-600 hover:underline mt-3">
                    View on ArcScan <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            <button onClick={() => navigate('/shop')} className="btn-primary w-full">
              Order Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
