import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { useAccount } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { USDC_ADDRESS, EURC_ADDRESS, ERC20_ABI } from '../config/chains';

// Read USDC balance (ERC-20 interface, 6 decimals)
export function useUSDCBalance() {
  const { address } = useAccount();
  const { data, isLoading, refetch } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 5000 },
  });

  return {
    balance: data ? parseFloat(formatUnits(data, 6)) : 0,
    raw: data,
    isLoading,
    refetch,
  };
}

// Read EURC balance (6 decimals)
export function useEURCBalance() {
  const { address } = useAccount();
  const { data, isLoading, refetch } = useReadContract({
    address: EURC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 5000 },
  });

  return {
    balance: data ? parseFloat(formatUnits(data, 6)) : 0,
    raw: data,
    isLoading,
    refetch,
  };
}

// Read native USDC balance (18 decimals, used for gas)
export function useNativeBalance() {
  const { address } = useAccount();
  const { data, isLoading, refetch } = useBalance({
    address,
    query: { enabled: !!address, refetchInterval: 5000 },
  });

  return {
    balance: data ? parseFloat(formatUnits(data.value, data.decimals)) : 0,
    raw: data?.value,
    isLoading,
    refetch,
  };
}

// Send USDC via ERC-20 transfer
export function useSendUSDC() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const send = (to: string, amount: string) => {
    const parsedAmount = parseUnits(amount, 6); // USDC ERC-20 = 6 decimals
    writeContract({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [to as `0x${string}`, parsedAmount],
    });
  };

  return { send, hash, isPending, isConfirming, isSuccess, error };
}

// Send EURC via ERC-20 transfer
export function useSendEURC() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const send = (to: string, amount: string) => {
    const parsedAmount = parseUnits(amount, 6);
    writeContract({
      address: EURC_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [to as `0x${string}`, parsedAmount],
    });
  };

  return { send, hash, isPending, isConfirming, isSuccess, error };
}
