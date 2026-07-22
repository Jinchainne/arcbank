import { useLocalStorage } from './useLocalStorage';

export interface Contact {
  id: string;
  name: string;
  address: string;
  createdAt: number;
}

const DEFAULT_CONTACTS: Contact[] = [
  { id: '1', name: 'Alice Chen', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18', createdAt: Date.now() - 86400000 * 30 },
  { id: '2', name: 'Bob Martinez', address: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72', createdAt: Date.now() - 86400000 * 25 },
  { id: '3', name: 'Carol Wang', address: '0xAb5801a7D398351b8bE11C439e05C5b3259aeC9B', createdAt: Date.now() - 86400000 * 20 },
  { id: '4', name: 'David Kim', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', createdAt: Date.now() - 86400000 * 15 },
  { id: '5', name: 'Emma Johnson', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', createdAt: Date.now() - 86400000 * 10 },
];

export function useContacts() {
  const [contacts, setContacts] = useLocalStorage<Contact[]>('contacts', DEFAULT_CONTACTS);

  const addContact = (name: string, address: string) => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name,
      address,
      createdAt: Date.now(),
    };
    setContacts(prev => [newContact, ...prev]);
    return newContact;
  };

  const removeContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const updateContact = (id: string, name: string, address: string) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, name, address } : c));
  };

  return { contacts, addContact, removeContact, updateContact };
}
