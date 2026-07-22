# ArcBank — Digital Banking on Stablecoin Rails

> Programmable Money Hackathon — Arc × Encode Club

ArcBank is a full-featured digital banking application built on **Arc Testnet** with **USDC** as the native currency. Inspired by modern fintech super-apps like MoMo, ArcBank provides a seamless banking experience on blockchain rails.

## Features

### 🏦 ArcPay (Banking)
- **Dashboard** — Balance overview, service grid, transaction stats
- **Send Money** — 3-step wizard with contact search, memo, and instant confirmation
- **Receive** — QR code generation + wallet address sharing
- **History** — Filterable transaction list with ArcScan links

### 👥 ArcSplit (Bill Splitting)
- **Groups** — Create and manage expense groups
- **New Expense** — Split bills equally among group members
- **Settlement tracking** — See who owes what

### 🌍 ArcRemit (Cross-Border Transfer)
- **7 destination countries** — US, UK, Germany, Japan, South Korea, Singapore, Australia
- **Live FX rates** — USDC ↔ EURC conversion in real-time
- **Transfer summary** — Fee, finality, and rate breakdown

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite 8 |
| Styling | Tailwind CSS 3 (MoMo-inspired light theme) |
| Blockchain | viem + wagmi (Arc Testnet) |
| Routing | React Router 7 |
| Icons | Lucide React |
| QR | qrcode.react |
| PWA | Web App Manifest (Android installable) |

## Arc Network Details

| Property | Value |
|----------|-------|
| Network | Arc Testnet |
| Chain ID | 5042002 |
| RPC | `https://rpc.testnet.arc.network` |
| Explorer | `https://testnet.arcscan.app` |
| Gas Token | USDC |
| Finality | Sub-second, deterministic |
| Fee | ~$0.01 per transaction |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── config/          # Arc Testnet chain config
├── types/           # TypeScript interfaces
├── utils/           # Formatters (currency, address, time)
├── hooks/           # useStore (data + business logic)
├── components/      # Layout, Sidebar, Header, UI components
└── pages/
    ├── Dashboard.tsx
    ├── Send.tsx
    ├── Receive.tsx
    ├── History.tsx
    ├── Split/
    │   ├── SplitGroups.tsx
    │   └── NewExpense.tsx
    └── Remit/
        ├── RemitTransfer.tsx
        └── RemitHistory.tsx
```

## Circle Developer Tools Used

- **Circle Wallets** — Email-based wallet creation (no seed phrase)
- **Arc Testnet** — EVM-compatible L1 with USDC gas
- **App Kit SDK** — Send, Bridge, Swap, Unified Balance
- **CCTP** — Cross-chain USDC transfers
- **Gateway** — Unified cross-chain balance
- **Paymaster** — Gas sponsorship for seamless UX

## Hackathon Submission

- **Track**: DeFi (Payments + Stablecoin FX)
- **Working prototype** deployed on Arc Testnet
- **Clear use of Circle's developer tools**
- **Real use case**: Digital banking for stablecoin economy
- **Quality of execution**: MoMo-inspired UX, clean design, responsive

## License

MIT
