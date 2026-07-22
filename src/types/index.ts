export interface Contact {
  id: string;
  name: string;
  address: string;
  avatar?: string;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'split' | 'remit';
  amount: number;
  currency: 'USDC' | 'EURC';
  to: string;
  from: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: number;
  hash?: string;
  memo?: string;
}

export interface SplitGroup {
  id: string;
  name: string;
  members: Contact[];
  totalExpenses: number;
  currency: 'USDC' | 'EURC';
  createdAt: number;
}

export interface SplitExpense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: string;
  splitAmong: string[];
  timestamp: number;
}

export interface RemitTransfer {
  id: string;
  fromCurrency: 'USDC' | 'EURC';
  toCurrency: 'USDC' | 'EURC';
  fromAmount: number;
  toAmount: number;
  recipient: string;
  recipientCountry: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: number;
  rate: number;
}
