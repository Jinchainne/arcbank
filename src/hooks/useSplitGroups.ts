import { useLocalStorage } from './useLocalStorage';

export interface SplitMember {
  name: string;
  address: string;
}

export interface SplitGroup {
  id: string;
  name: string;
  members: SplitMember[];
  createdAt: number;
}

export interface SplitExpense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: string; // member name
  splitAmong: string[]; // member names
  timestamp: number;
  settled: boolean;
  txHash?: string;
}

export function useSplitGroups() {
  const [groups, setGroups] = useLocalStorage<SplitGroup[]>('split-groups', [
    {
      id: '1',
      name: 'Team Lunch',
      members: [
        { name: 'You', address: '' },
        { name: 'Alice Chen', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18' },
        { name: 'Bob Martinez', address: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72' },
      ],
      createdAt: Date.now() - 604800000,
    },
    {
      id: '2',
      name: 'Weekend Trip',
      members: [
        { name: 'You', address: '' },
        { name: 'Carol Wang', address: '0xAb5801a7D398351b8bE11C439e05C5b3259aeC9B' },
        { name: 'David Kim', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984' },
        { name: 'Emma Johnson', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
      ],
      createdAt: Date.now() - 1209600000,
    },
  ]);

  const [expenses, setExpenses] = useLocalStorage<SplitExpense[]>('split-expenses', [
    { id: '1', groupId: '1', description: 'Sushi restaurant', amount: 156.50, paidBy: 'You', splitAmong: ['You', 'Alice Chen', 'Bob Martinez'], timestamp: Date.now() - 86400000, settled: false },
    { id: '2', groupId: '1', description: 'Bubble tea', amount: 40.00, paidBy: 'Alice Chen', splitAmong: ['You', 'Alice Chen', 'Bob Martinez'], timestamp: Date.now() - 172800000, settled: true, txHash: '0xabc123' },
    { id: '3', groupId: '2', description: 'Airbnb', amount: 800.00, paidBy: 'You', splitAmong: ['You', 'Carol Wang', 'David Kim', 'Emma Johnson'], timestamp: Date.now() - 604800000, settled: false },
    { id: '4', groupId: '2', description: 'Activities', amount: 400.00, paidBy: 'David Kim', splitAmong: ['You', 'Carol Wang', 'David Kim', 'Emma Johnson'], timestamp: Date.now() - 518400000, settled: false },
  ]);

  const addGroup = (name: string, members: SplitMember[]) => {
    const group: SplitGroup = { id: Date.now().toString(), name, members, createdAt: Date.now() };
    setGroups(prev => [group, ...prev]);
    return group;
  };

  const addExpense = (expense: Omit<SplitExpense, 'id' | 'timestamp' | 'settled'>) => {
    const newExpense: SplitExpense = { ...expense, id: Date.now().toString(), timestamp: Date.now(), settled: false };
    setExpenses(prev => [newExpense, ...prev]);
    return newExpense;
  };

  const settleExpense = (expenseId: string, txHash: string) => {
    setExpenses(prev => prev.map(e => e.id === expenseId ? { ...e, settled: true, txHash } : e));
  };

  const getGroupExpenses = (groupId: string) => expenses.filter(e => e.groupId === groupId);

  const getGroupTotal = (groupId: string) => expenses.filter(e => e.groupId === groupId).reduce((sum, e) => sum + e.amount, 0);

  const getOwedAmount = (groupId: string, memberName: string) => {
    const groupExpenses = expenses.filter(e => e.groupId === groupId);
    let owes = 0;
    let isOwed = 0;
    for (const exp of groupExpenses) {
      const perPerson = exp.amount / exp.splitAmong.length;
      if (exp.paidBy === memberName) {
        isOwed += exp.amount - perPerson;
      }
      if (exp.splitAmong.includes(memberName) && exp.paidBy !== memberName) {
        owes += perPerson;
      }
    }
    return { owes: parseFloat(owes.toFixed(2)), isOwed: parseFloat(isOwed.toFixed(2)), net: parseFloat((isOwed - owes).toFixed(2)) };
  };

  return { groups, expenses, addGroup, addExpense, settleExpense, getGroupExpenses, getGroupTotal, getOwedAmount };
}
