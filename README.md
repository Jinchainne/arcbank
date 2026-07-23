<p align="center">
  <img src="public/logo.png" alt="Coffee House" width="80" height="80" style="border-radius:50%">
</p>

<h1 align="center">COFFEE HOUSE</h1>

<p align="center">
  <strong>On-chain coffee shop POS system</strong><br>
  Order food · Pay with USDC on Arc Testnet · Track delivery in real-time
</p>

<p align="center">
  <a href="https://coffeehouse-shop.vercel.app/shop">🔗 Live Demo</a> ·
  <a href="https://github.com/Jinchainne/COFFEEHOUSE">📦 GitHub</a> ·
  <a href="https://testnet.arcscan.app">⛓️ Arc Explorer</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Arc_Testnet-5042002-blue?style=flat-square" alt="Arc Testnet">
  <img src="https://img.shields.io/badge/Payment-USDC_✓-green?style=flat-square" alt="USDC">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT">
</p>

---

## Why Arc Testnet?

**COFFEE HOUSE** demonstrates how a real-world food business can operate entirely on-chain using **Arc Testnet** — Circle's stablecoin-native Layer 1 designed for USDC payments.

| Feature | What It Means |
|---|---|
| **USDC Native** | Payments in stablecoin — $1 = $1, no crypto volatility |
| **~$0.01 Gas** | Transaction fees cheaper than a credit card swipe |
| **Fast Finality** | Payments confirm in seconds, not minutes |
| **EVM Compatible** | Works with MetaMask, OKX, WalletConnect, Coinbase, Rabby |
| **Programmable** | Smart contracts for auto-settlement, agent payments, escrow |

---

## Features

### Shop (`/shop`)

- **92 products** across 21 categories — Starbucks, McDonald's, Jollibee, Pizza Hut, Subway, Vietnamese cuisine
- Category sidebar with product counts and emoji icons
- Product search, wishlist hearts, star ratings & comments
- Cart with quantity controls and running total

### Payment

| Mode | How It Works |
|---|---|
| **Wallet Sign** | Connect wallet → sign USDC transfer on Arc Testnet → instant confirmation |
| **QR Scan (POS)** | Shop shows QR → customer scans with ANY wallet → system polls blockchain → auto-confirm |

- Merchant: `0x363700d10ca9c4809ad7034f5b21650a9a5e34bd`
- Chain ID: `5042002`
- Auto chain-switch for new wallets (`wallet_addEthereumChain`)

### Delivery

- Interactive map (Leaflet + OpenStreetMap)
- Address search with Nominatim geocoding
- Vietnam 63 provinces shipping (Haversine distance formula)
- Real-time order status tracking (Pending → Confirmed → Preparing → Shipping → Delivered)

### Admin Panel (`/admin`)

| Tab | Function |
|---|---|
| **Dashboard** | Revenue, expenses, profit, order stats, category revenue chart |
| **Orders** | Full order list with status management and delivery info |
| **Finance** | Income/expense CRUD with categories and filtering |
| **Tax** | VAT (10%), Corporate Tax (20%), Vietnam tax reference table |
| **Products** | CRUD with **local image upload** (auto-compress to 600px JPEG), inline name/price editing |
| **AI Agent** | AI business analyst with order pipeline, P&L statement, shipping analysis, AI chat |
| **Backup** | Export JSON/CSV, import backup, data summary with storage usage |

- **Server-side auth** — password stored as Vercel env var, never exposed to client
- **Publish to Site** — commit products.json to GitHub → Vercel auto-deploys

### AI Agent (`/admin/dashboard → AI Agent tab`)

- **Insights** — Key metrics, automated alerts, top products, P&L summary
- **Orders** — Status pipeline, category revenue, detailed order list
- **Finance** — Income/expense breakdown, profit margin, COGS estimation
- **Shipping** — Delivery adoption rate, shipping revenue vs cost, profit analysis
- **AI Chat** — Business analyst powered by MiMo AI with full data context (orders, revenue, products, expenses, customers)

### AI Chat Assistant

- Floating chat widget with cyber cat avatar
- Powered by MiMo v2.5 Pro API
- Menu recommendations, price lookups, order help

### Agent Economy

- 4 autonomous agents with blockchain wallets
- Nanopayments between agents for services
- Decision logging with confidence scores

---

## Architecture

```
COFFEEHOUSE/
│
├── api/                              # Vercel Serverless Functions
│   ├── auth.ts                       #   POST /api/auth — password verification
│   └── publish.ts                    #   POST /api/publish — commit products.json to GitHub
│
├── public/
│   ├── agent.png                     #   AI assistant avatar (cyber cat, no background)
│   ├── logo.png                      #   Site logo
│   └── data/
│       └── products.json             #   Product catalog (synced via admin publish)
│
├── src/
│   ├── main.tsx                      #   Entry point
│   ├── App.tsx                       #   Router + providers
│   │
│   ├── components/
│   │   ├── AIChat.tsx                #   Floating AI assistant (MiMo API)
│   │   ├── ErrorBoundary.tsx         #   Crash recovery with clear-data reload
│   │   ├── Layout.tsx                #   Shop layout (navbar + footer + AIChat)
│   │   ├── Navbar.tsx                #   Top navigation bar
│   │   ├── Sidebar.tsx               #   Category sidebar
│   │   ├── WalletConnect.tsx         #   Multi-wallet selector modal
│   │   └── UI.tsx                    #   Shared UI components
│   │
│   ├── config/
│   │   ├── wagmi.ts                  #   wagmi v3 multi-wallet config
│   │   ├── chains.ts                 #   Arc Testnet chain definition (5042002)
│   │   ├── vietnamLocations.ts       #   63 provinces with coordinates
│   │   └── mimo.ts                   #   MiMo AI API config
│   │
│   ├── hooks/
│   │   ├── useShop.tsx               #   Products, cart, orders, delivery (Context)
│   │   ├── useAdmin.tsx              #   Admin auth, finances (Context)
│   │   ├── useAgent.tsx              #   Agent economy: wallets, nanopayments
│   │   └── useOnChain.ts             #   Blockchain interaction helpers
│   │
│   ├── pages/
│   │   ├── Admin/
│   │   │   ├── AdminLogin.tsx        #   Password login (server-side auth)
│   │   │   ├── AdminDashboard.tsx    #   7-tab admin panel
│   │   │   └── AgentDashboard.tsx    #   AI Agent embedded panel
│   │   │
│   │   └── Shop/
│   │       ├── ShopMenu.tsx          #   Product grid + category filter
│   │       ├── ShopCheckout.tsx      #   Cart review + crypto payment
│   │       ├── POSCheckout.tsx       #   QR code payment (no wallet needed)
│   │       ├── DeliveryPage.tsx      #   Map-based address selection
│   │       ├── ShopOrders.tsx        #   Order history
│   │       └── OrderTracking.tsx     #   Real-time delivery progress
│   │
│   └── utils/
│       └── format.ts                 #   Currency formatting helpers
│
├── vercel.json                       #   SPA routing + API rewrites
├── package.json
└── tsconfig.json
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 8 (Rolldown), Tailwind CSS 3 |
| **Blockchain** | Arc Testnet (Chain ID 5042002), USDC, wagmi v3 |
| **Wallets** | MetaMask, OKX, WalletConnect, Coinbase, Rabby |
| **Maps** | Leaflet, OpenStreetMap, Nominatim geocoding |
| **AI** | MiMo v2.5 Pro API |
| **Auth** | Vercel Serverless Functions (server-side password) |
| **Hosting** | Vercel (auto-deploy from GitHub) |
| **Data** | localStorage + GitHub-synced JSON |

---

## Getting Started

```bash
# Clone
git clone https://github.com/Jinchainne/COFFEEHOUSE.git
cd COFFEEHOUSE

# Install dependencies
npm install

# Start dev server
npm run dev          # → http://localhost:5173

# Build for production
npm run build        # tsc -b && vite build

# Deploy (auto via GitHub)
git push origin main # Vercel auto-deploys
```

### Environment Variables

Set these in **Vercel Dashboard → Settings → Environment Variables**:

| Variable | Required | Description |
|---|---|---|
| `ADMIN_PASSWORD` | ✅ | Admin panel password (server-side only, never exposed) |
| `GITHUB_TOKEN` | ✅ | GitHub PAT with `contents:write` for publish feature |

---

## Payment Flow

```
┌──────────┐         ┌──────────────┐         ┌─────────────────────┐
│ Customer │         │  Coffee House │         │  Arc Testnet (L1)   │
└────┬─────┘         └──────┬───────┘         └──────────┬──────────┘
     │                      │                            │
     │  1. Browse & Cart    │                            │
     │─────────────────────►│                            │
     │                      │                            │
     │  2. Checkout         │                            │
     │─────────────────────►│                            │
     │                      │                            │
     │  3. Show QR / Sign   │                            │
     │◄─────────────────────│                            │
     │                      │                            │
     │  4. Send USDC        │    5. Tx on-chain          │
     │──────────────────────│───────────────────────────►│
     │                      │                            │
     │                      │    6. Poll balance          │
     │                      │◄───────────────────────────│
     │                      │                            │
     │  7. Order confirmed  │    7. Payment detected     │
     │◄─────────────────────│                            │
     │                      │                            │
     │  8. Track delivery   │                            │
     │◄─────────────────────│                            │
```

---

## Key Design Decisions

### Why localStorage + GitHub Sync?

The app uses a **hybrid data approach**:
- **localStorage** for instant reads/writes (cart, orders, admin changes)
- **GitHub-synced JSON** (`public/data/products.json`) for cross-browser persistence
- Admin "Publish to Site" button commits changes → Vercel auto-deploys → all visitors see updates

### Why Server-Side Auth?

The admin password is stored as a **Vercel environment variable** and verified via a serverless function (`/api/auth`). The password never appears in:
- Client-side JavaScript bundles
- The login page UI
- Git repository

### Why Dual Payment Mode?

- **Wallet Sign** — For crypto-native users with wallets installed
- **QR Scan** — For walk-in customers at a physical cafe who don't have wallets

Both modes detect payment by polling the merchant's USDC balance on-chain.

---

## Screenshots

| Shop | Admin Dashboard | AI Agent |
|---|---|---|
| Product grid with 92 items | 7-tab management panel | Business intelligence |
| Category sidebar | Image upload from computer | Order & shipping analysis |
| Cart + checkout | Publish to live site | AI chat with full data context |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'feat: amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## License

[MIT](LICENSE) © [Jinchainne](https://github.com/Jinchainne)

---

<p align="center">
  Built for the <strong>Circle Encode Club</strong> hackathon on <strong>Arc Testnet</strong><br>
  <img src="https://img.shields.io/badge/Arc_Testnet-5042002-blue?style=flat-square" alt="Arc Testnet">
</p>
