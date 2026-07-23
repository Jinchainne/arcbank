import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgent } from '../../hooks/useAgent';
import { Bot, Wallet, Activity, Zap, ArrowRight, Cpu, Truck, Store, Brain } from 'lucide-react';

const ROLE_CONFIG: Record<string, { icon: any; color: string; bg: string; desc: string }> = {
  order: { icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Processes orders, checks risk, routes to merchant' },
  merchant: { icon: Store, color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Receives payments, confirms orders, dispatches delivery' },
  delivery: { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Routes deliveries, optimizes paths, updates status' },
  ai_advisor: { icon: Brain, color: 'text-amber-600', bg: 'bg-amber-50', desc: 'Recommends items, analyzes patterns, provides insights' },
};

import { ShoppingCart } from 'lucide-react';

export default function AgentDashboard() {
  const navigate = useNavigate();
  const { agents, nanoPayments, totalAgentBalance, totalTransactions, totalDecisions } = useAgent();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const selected = agents.find(a => a.id === selectedAgent);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">Agent Economy</h1>
            </div>
            <p className="text-sm text-slate-400">Autonomous agents with wallets, payments & settlement on Arc Testnet</p>
          </div>
          <button onClick={() => navigate('/shop')} className="text-sm text-slate-500 hover:text-blue-600">← Back to Shop</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Bot} label="Active Agents" value={agents.filter(a => a.status === 'active').length.toString()} color="violet" />
          <StatCard icon={Wallet} label="Total Agent Balance" value={`$${totalAgentBalance.toFixed(2)}`} color="blue" />
          <StatCard icon={Activity} label="Transactions" value={totalTransactions.toString()} color="emerald" />
          <StatCard icon={Zap} label="Decisions Made" value={totalDecisions.toString()} color="amber" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent List */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Agents</h2>
            {agents.map(agent => {
              const config = ROLE_CONFIG[agent.role];
              const Icon = config.icon;
              const isSelected = selectedAgent === agent.id;
              return (
                <button key={agent.id} onClick={() => setSelectedAgent(agent.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected ? 'border-blue-300 bg-blue-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                  }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900">{agent.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{agent.wallet.address}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-emerald-500' : agent.status === 'processing' ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}`} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Balance</span>
                    <span className="font-bold text-slate-900">${agent.wallet.balance.toFixed(2)} USDC</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-slate-500">Decisions</span>
                    <span className="text-slate-700">{agent.decisions.length}</span>
                  </div>
                </button>
              );
            })}

            {/* Nanopayments */}
            <div className="mt-6">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Nanopayments</h2>
              <div className="card p-3 space-y-2 max-h-60 overflow-y-auto scroll-hide">
                {nanoPayments.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No nanopayments yet</p>
                ) : nanoPayments.slice(0, 10).map(np => (
                  <div key={np.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <Zap className="w-3 h-3 text-amber-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-slate-600 truncate">{np.service}</p>
                      <p className="text-[9px] text-slate-400">{np.fromAgent} → {np.toAgent}</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-900">${np.amount.toFixed(4)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Agent Detail */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="space-y-4">
                {/* Agent Header */}
                <div className="card p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl ${ROLE_CONFIG[selected.role].bg} flex items-center justify-center`}>
                      {(() => { const I = ROLE_CONFIG[selected.role].icon; return <I className={`w-7 h-7 ${ROLE_CONFIG[selected.role].color}`} />; })()}
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900">{selected.name}</h2>
                      <p className="text-xs text-slate-400">{ROLE_CONFIG[selected.role].desc}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-xs text-slate-400">Wallet Balance</p>
                      <p className="text-2xl font-extrabold text-blue-600">${selected.wallet.balance.toFixed(2)}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{selected.wallet.address}</p>
                    </div>
                  </div>

                  {/* Decision Logic */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Cpu className="w-3 h-3" /> Decision Logic
                    </h3>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-lg font-extrabold text-slate-900">{selected.decisions.length}</p>
                        <p className="text-[10px] text-slate-400">Total Decisions</p>
                      </div>
                      <div>
                        <p className="text-lg font-extrabold text-emerald-600">{selected.transactions.filter(t => t.status === 'confirmed').length}</p>
                        <p className="text-[10px] text-slate-400">Confirmed TXs</p>
                      </div>
                      <div>
                        <p className="text-lg font-extrabold text-amber-600">{selected.decisions.length > 0 ? Math.round(selected.decisions.reduce((s, d) => s + d.confidence, 0) / selected.decisions.length) : 0}%</p>
                        <p className="text-[10px] text-slate-400">Avg Confidence</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Decisions */}
                <div className="card p-5">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-amber-500" /> Recent Decisions
                  </h3>
                  {selected.decisions.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-8">No decisions yet. Place an order to see agents in action.</p>
                  ) : (
                    <div className="space-y-3">
                      {selected.decisions.slice(0, 10).map(d => (
                        <div key={d.id} className="p-3 bg-slate-50 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              d.type === 'recommendation' ? 'bg-amber-100 text-amber-700' :
                              d.type === 'payment' ? 'bg-blue-100 text-blue-700' :
                              d.type === 'settlement' ? 'bg-emerald-100 text-emerald-700' :
                              d.type === 'routing' ? 'bg-purple-100 text-purple-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>{d.type}</span>
                            <span className="text-[10px] text-slate-400">{new Date(d.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-900 mb-1">{d.description}</p>
                          <p className="text-[11px] text-slate-500 mb-1"><span className="font-medium">Signal:</span> {d.signal}</p>
                          <p className="text-[11px] text-slate-700"><span className="font-medium">Result:</span> {d.result}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                              <div className={`h-full rounded-full ${d.confidence >= 90 ? 'bg-emerald-500' : d.confidence >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                                style={{ width: `${d.confidence}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-600">{d.confidence}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Transactions */}
                <div className="card p-5">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" /> Agent Transactions
                  </h3>
                  {selected.transactions.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-8">No transactions yet</p>
                  ) : (
                    <div className="space-y-2">
                      {selected.transactions.slice(0, 10).map(tx => (
                        <div key={tx.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            tx.from === selected.id ? 'bg-red-50' : 'bg-emerald-50'
                          }`}>
                            {tx.from === selected.id ?
                              <ArrowRight className="w-4 h-4 text-red-500" /> :
                              <ArrowRight className="w-4 h-4 text-emerald-500 rotate-180" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900">{tx.description}</p>
                            <p className="text-[10px] text-slate-400">{tx.type} · {new Date(tx.timestamp).toLocaleTimeString()}</p>
                          </div>
                          <span className={`text-xs font-bold ${tx.from === selected.id ? 'text-red-600' : 'text-emerald-600'}`}>
                            {tx.from === selected.id ? '-' : '+'}${tx.amount.toFixed(4)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center">
                <Bot className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-lg font-semibold text-slate-400">Select an agent to view details</p>
                <p className="text-sm text-slate-300 mt-1">Click on any agent from the list to see their decisions, transactions, and wallet</p>
              </div>
            )}
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-8 card p-6">
          <h3 className="text-lg font-extrabold text-slate-900 mb-4">How the Agent Economy Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FlowStep step="1" title="Customer Orders" desc="Customer places order via QR code or wallet payment" icon={ShoppingCart} />
            <FlowStep step="2" title="Order Agent Processes" desc="Analyzes order, checks risk signals, routes to merchant" icon={Cpu} />
            <FlowStep step="3" title="Merchant Settles" desc="Confirms payment on-chain, dispatches delivery agent" icon={Store} />
            <FlowStep step="4" title="Delivery Routes" desc="Optimizes delivery path, updates status in real-time" icon={Truck} />
          </div>
          <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-xs text-amber-800">
              <span className="font-bold">Nanopayments:</span> Agents pay each other tiny USDC amounts (0.001-0.01) for services like order processing, AI recommendations, and delivery routing. All settled on Arc Testnet with sub-second finality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    violet: 'bg-violet-50 text-violet-600', blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600', amber: 'bg-amber-50 text-amber-600',
  };
  return (
    <div className="card p-4">
      <div className={`w-8 h-8 rounded-lg ${colors[color]} flex items-center justify-center mb-2`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-xl font-extrabold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function FlowStep({ step, title, desc, icon: Icon }: { step: string; title: string; desc: string; icon: any }) {
  return (
    <div className="text-center">
      <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 text-white text-sm font-bold">{step}</div>
      <Icon className="w-6 h-6 text-slate-400 mx-auto mb-1" />
      <p className="text-sm font-bold text-slate-900">{title}</p>
      <p className="text-[11px] text-slate-400">{desc}</p>
    </div>
  );
}
