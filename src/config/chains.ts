import { defineChain } from 'viem';

export const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.arc.network'],
      webSocket: ['wss://rpc.testnet.arc.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ArcScan',
      url: 'https://testnet.arcscan.app',
    },
  },
  testnet: true,
});

export const USDC_ADDRESS_ARC = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';
export const EURC_ADDRESS_ARC = '0x868b3BF6d3E4B4f4B3b0C2e6c2D7f8b1a5E9d3C7';
