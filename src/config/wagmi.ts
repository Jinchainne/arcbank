import { http, createConfig } from 'wagmi';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';
import { arcTestnet } from './chains';

// WalletConnect Project ID (free tier)
const WC_PROJECT_ID = 'c4f79cc821944d9680842e34466bfb';

export const config = createConfig({
  chains: [arcTestnet],
  connectors: [
    injected({ shimDisconnect: true }),
    walletConnect({ projectId: WC_PROJECT_ID, showQrModal: true }),
    coinbaseWallet({ appName: 'ArcPay Shop' }),
  ],
  transports: {
    [arcTestnet.id]: http('https://rpc.testnet.arc.network'),
  },
});
