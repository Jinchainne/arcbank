import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface TxLog {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'success' | 'pending' | 'failed';
  blockNumber: number;
}

export function useRecentTransactions(limit = 20) {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<TxLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);

    // Fetch from ArcScan API (block explorer)
    fetch(`https://testnet.arcscan.app/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc`)
      .then(r => r.json())
      .then(data => {
        if (data.result && Array.isArray(data.result)) {
          setTransactions(data.result.map((tx: any) => ({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value,
            timestamp: parseInt(tx.timeStamp) * 1000,
            status: tx.isError === '0' ? 'success' : 'failed',
            blockNumber: parseInt(tx.blockNumber),
          })));
        }
      })
      .catch(() => {
        // Fallback: try RPC method
        setTransactions([]);
      })
      .finally(() => setLoading(false));
  }, [address, limit]);

  return { transactions, loading, refetch: () => {} };
}

export function useBlockExplorerUrl() {
  return {
    txUrl: (hash: string) => `https://testnet.arcscan.app/tx/${hash}`,
    addressUrl: (addr: string) => `https://testnet.arcscan.app/address/${addr}`,
    blockUrl: (num: number) => `https://testnet.arcscan.app/block/${num}`,
  };
}
