import { http, createConfig } from 'wagmi';
import { arcTestnet } from './chains';

export const config = createConfig({
  chains: [arcTestnet],
  transports: {
    [arcTestnet.id]: http('https://rpc.testnet.arc.network'),
  },
});
