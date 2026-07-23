import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// ═══════════════════════════════════════════════════════
// AGENTIC ECONOMY - Agents with wallets, autonomous payments
// ═══════════════════════════════════════════════════════

export interface AgentWallet {
  address: string;
  balance: number; // USDC
  label: string;
}

export interface Agent {
  id: string;
  name: string;
  role: 'order' | 'merchant' | 'delivery' | 'ai_advisor';
  wallet: AgentWallet;
  status: 'active' | 'idle' | 'processing';
  decisions: AgentDecision[];
  transactions: AgentTransaction[];
  createdAt: number;
}

export interface AgentDecision {
  id: string;
  agentId: string;
  type: 'recommendation' | 'payment' | 'settlement' | 'routing' | 'risk_check';
  description: string;
  signal: string; // The real signal that triggered the decision
  result: string;
  confidence: number; // 0-100
  timestamp: number;
}

export interface AgentTransaction {
  id: string;
  from: string; // agent id or wallet address
  to: string;
  amount: number;
  currency: 'USDC';
  type: 'nanopayment' | 'settlement' | 'service_fee' | 'delivery_fee';
  description: string;
  status: 'pending' | 'confirmed' | 'failed';
  txHash?: string;
  timestamp: number;
}

export interface NanoPayment {
  id: string;
  fromAgent: string;
  toAgent: string;
  amount: number;
  service: string;
  status: 'pending' | 'paid';
  timestamp: number;
}

interface AgentCtx {
  agents: Agent[];
  nanoPayments: NanoPayment[];
  totalAgentBalance: number;
  totalTransactions: number;
  totalDecisions: number;
  // Agent actions
  processOrder: (orderItems: string[], total: number) => void;
  settlePayment: (fromAgent: string, toAgent: string, amount: number, desc: string) => void;
  dispatchDelivery: (orderId: string, address: string) => void;
  getAgentById: (id: string) => Agent | undefined;
  addDecision: (agentId: string, decision: Omit<AgentDecision, 'id' | 'timestamp'>) => void;
  sendNanoPayment: (from: string, to: string, amount: number, service: string) => void;
}

const AgentContext = createContext<AgentCtx | null>(null);

// Default agent wallets (simulated on-chain addresses)
const DEFAULT_AGENTS: Agent[] = [
  {
    id: 'agent-order',
    name: 'Order Agent',
    role: 'order',
    wallet: { address: '0xA1B2...order', balance: 50.00, label: 'Order Processing Wallet' },
    status: 'active',
    decisions: [],
    transactions: [],
    createdAt: Date.now(),
  },
  {
    id: 'agent-merchant',
    name: 'Merchant Agent',
    role: 'merchant',
    wallet: { address: '0xC3D4...merch', balance: 500.00, label: 'Merchant Settlement Wallet' },
    status: 'active',
    decisions: [],
    transactions: [],
    createdAt: Date.now(),
  },
  {
    id: 'agent-delivery',
    name: 'Delivery Agent',
    role: 'delivery',
    wallet: { address: '0xE5F6...deliv', balance: 25.00, label: 'Delivery Routing Wallet' },
    status: 'idle',
    decisions: [],
    transactions: [],
    createdAt: Date.now(),
  },
  {
    id: 'agent-ai',
    name: 'AI Advisor Agent',
    role: 'ai_advisor',
    wallet: { address: '0xG7H8...advisor', balance: 100.00, label: 'AI Service Wallet' },
    status: 'active',
    decisions: [],
    transactions: [],
    createdAt: Date.now(),
  },
];

export function AgentProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(() => {
    try {
      const saved = localStorage.getItem('coffeehouse_agents');
      return saved ? JSON.parse(saved) : DEFAULT_AGENTS;
    } catch { return DEFAULT_AGENTS; }
  });

  const [nanoPayments, setNanoPayments] = useState<NanoPayment[]>(() => {
    try {
      const saved = localStorage.getItem('coffeehouse_nano');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const saveAgents = (updated: Agent[]) => {
    setAgents(updated);
    localStorage.setItem('coffeehouse_agents', JSON.stringify(updated));
  };

  const addDecision = useCallback((agentId: string, decision: Omit<AgentDecision, 'id' | 'timestamp'>) => {
    saveAgents(agents.map(a => {
      if (a.id !== agentId) return a;
      const newDecision: AgentDecision = { ...decision, id: `D-${Date.now().toString(36)}`, timestamp: Date.now() };
      return { ...a, decisions: [newDecision, ...a.decisions].slice(0, 50) };
    }));
  }, [agents]);

  const addTransaction = useCallback((tx: Omit<AgentTransaction, 'id' | 'timestamp'>) => {
    saveAgents(agents.map(a => {
      if (a.id !== tx.from && a.id !== tx.to) return a;
      const newTx: AgentTransaction = { ...tx, id: `TX-${Date.now().toString(36)}`, timestamp: Date.now() };
      const updated = { ...a, transactions: [newTx, ...a.transactions].slice(0, 50) };
      // Update balance
      if (a.id === tx.from) updated.wallet = { ...a.wallet, balance: a.wallet.balance - tx.amount };
      if (a.id === tx.to) updated.wallet = { ...a.wallet, balance: a.wallet.balance + tx.amount };
      return updated;
    }));
  }, [agents]);

  const sendNanoPayment = useCallback((from: string, to: string, amount: number, service: string) => {
    const payment: NanoPayment = {
      id: `NP-${Date.now().toString(36)}`,
      fromAgent: from,
      toAgent: to,
      amount,
      service,
      status: 'paid',
      timestamp: Date.now(),
    };
    setNanoPayments(prev => {
      const updated = [payment, ...prev];
      localStorage.setItem('coffeehouse_nano', JSON.stringify(updated));
      return updated;
    });
    // Also record as agent transaction
    addTransaction({
      from, to, amount, currency: 'USDC',
      type: 'nanopayment', description: service, status: 'confirmed',
    });
  }, [addTransaction]);

  const processOrder = useCallback((orderItems: string[], total: number) => {
    // Order Agent: analyze order, check risk, recommend
    addDecision('agent-order', {
      agentId: 'agent-order',
      type: 'risk_check',
      description: `Analyzing order of ${orderItems.length} items worth $${total.toFixed(2)} USDC`,
      signal: `Order total: $${total.toFixed(2)}, Items: ${orderItems.join(', ')}`,
      result: total > 100 ? 'Flagged: high-value order, require confirmation' : 'Approved: within normal range',
      confidence: total > 100 ? 75 : 95,
    });

    // AI Advisor: recommend based on order
    addDecision('agent-ai', {
      agentId: 'agent-ai',
      type: 'recommendation',
      description: `Suggesting complementary items for order`,
      signal: `Cart contains: ${orderItems.slice(0, 3).join(', ')}`,
      result: 'Recommendation: Add a beverage to complement food items',
      confidence: 82,
    });

    // Merchant Agent: settle payment
    addDecision('agent-merchant', {
      agentId: 'agent-merchant',
      type: 'settlement',
      description: `Settling payment of $${total.toFixed(2)} USDC for order`,
      signal: `Payment received: $${total.toFixed(2)} USDC from customer wallet`,
      result: 'Payment confirmed on Arc Testnet, order queued for preparation',
      confidence: 99,
    });

    // Nanopayment: Order Agent → Merchant Agent (processing fee)
    sendNanoPayment('agent-order', 'agent-merchant', 0.01, 'Order processing fee');

    // Nanopayment: Merchant → AI Advisor (recommendation fee)
    sendNanoPayment('agent-merchant', 'agent-ai', 0.005, 'AI recommendation service');
  }, [addDecision, sendNanoPayment]);

  const settlePayment = useCallback((fromAgent: string, toAgent: string, amount: number, desc: string) => {
    addTransaction({
      from: fromAgent, to: toAgent, amount, currency: 'USDC',
      type: 'settlement', description: desc, status: 'confirmed',
    });
    addDecision(fromAgent, {
      agentId: fromAgent,
      type: 'payment',
      description: `Settling $${amount.toFixed(4)} USDC to ${toAgent}`,
      signal: `Settlement request: ${desc}`,
      result: 'Transaction confirmed on Arc Testnet',
      confidence: 99,
    });
  }, [addTransaction, addDecision]);

  const dispatchDelivery = useCallback((orderId: string, address: string) => {
    // Delivery Agent: route delivery
    addDecision('agent-delivery', {
      agentId: 'agent-delivery',
      type: 'routing',
      description: `Routing delivery for order ${orderId}`,
      signal: `Delivery address: ${address}`,
      result: 'Delivery dispatched, ETA 25 minutes',
      confidence: 90,
    });

    // Nanopayment: Merchant → Delivery Agent (delivery fee)
    sendNanoPayment('agent-merchant', 'agent-delivery', 0.50, 'Delivery dispatch fee');

    // Update delivery agent status
    saveAgents(agents.map(a => a.id === 'agent-delivery' ? { ...a, status: 'processing' as const } : a));
  }, [agents, addDecision, sendNanoPayment, saveAgents]);

  const getAgentById = useCallback((id: string) => agents.find(a => a.id === id), [agents]);

  const totalAgentBalance = agents.reduce((s, a) => s + a.wallet.balance, 0);
  const totalTransactions = agents.reduce((s, a) => s + a.transactions.length, 0);
  const totalDecisions = agents.reduce((s, a) => s + a.decisions.length, 0);

  return (
    <AgentContext.Provider value={{
      agents, nanoPayments, totalAgentBalance, totalTransactions, totalDecisions,
      processOrder, settlePayment, dispatchDelivery, getAgentById, addDecision, sendNanoPayment,
    }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error('useAgent must be used within AgentProvider');
  return ctx;
}
