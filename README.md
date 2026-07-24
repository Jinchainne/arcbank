<p align="center">
  <img src="public/logo.png" alt="COFFEE HOUSE" width="120" />
</p>

<h1 align="center">☕ COFFEE HOUSE</h1>
<p align="center">
  <strong>The Coffee of the World</strong><br/>
  Premium e-commerce platform · Pay with USDC on Arc Testnet
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-purple?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Wagmi-2-orange?logo=ethereum" alt="Wagmi" />
  <img src="https://img.shields.io/badge/Arc_Testnet-5042002-green" alt="Arc Testnet" />
</p>

<p align="center">
  <a href="https://coffeehouse-shop.vercel.app">🌐 Live Demo</a> ·
  <a href="https://github.com/Jinchainne/COFFEEHOUSE">📦 GitHub</a> ·
  <a href="#-getting-started">🚀 Quick Start</a>
</p>

---

## 📸 Screenshots

| Shop Menu | Checkout | Payment Receipt |
|-----------|----------|-----------------|
| ![Menu](https://img.shields.io/badge/92_Products-21_Categories-amber) | ![Pay](https://img.shields.io/badge/USDC_Payment-QR_%26_Wallet-blue) | ![Receipt](https://img.shields.io/badge/Full_Invoice-TX_%26_QR-green) |

| Admin Dashboard | AI Agent | Feedback |
|-----------------|----------|----------|
| ![Admin](https://img.shields.io/badge/9_Tabs-Full_Management-slate) | ![AI](https://img.shields.io/badge/MiMo_AI-Business_Agent-purple) | ![Feedback](https://img.shields.io/badge/Star_Rating-63_Reviews-amber) |

---

## ✨ Features

### 🛒 Customer-Facing
- **Product Catalog** — 92 products across 21 categories (Starbucks, McDonald's, Dunkin', Vietnamese cuisine)
- **Size & Temperature** — M/L sizes with price modifiers, Hot/Iced options
- **Shopping Cart** — Add, remove, quantity management
- **Dual Payment** — Wallet sign (USDC direct) + POS QR scan
- **Payment Receipt** — Full invoice with wallet address, TX hash, merchant QR code
- **Order Tracking** — Real-time status: Pending → Confirmed → Preparing → Shipping → Delivered
- **Customer Feedback** — 1-5 star ratings + text comments per product
- **Promo Codes** — WELCOME10 (10%), SAVE5 ($5 off), FREESHIP, COFFEE20 (20%)
- **Recently Viewed** — Track browsing history
- **63 Store Branches** — All provinces of Vietnam with map integration
- **Smart Shipping** — Free ≤10km from nearest store, $0.1/km after

### 🔗 Blockchain
- **Multi-Wallet** — MetaMask, OKX, Rabby, Binance, Coinbase
- **Auto Chain Switch** — `wallet_addEthereumChain` for Arc Testnet (5042002)
- **USDC Payments** — 6-decimal stablecoin on Arc Testnet
- **QR Payment** — EIP-681 format for POS-style scan-to-pay
- **TX Explorer** — Direct links to ArcScan block explorer

### 🤖 AI & Automation
- **AI Business Agent** — MiMo v2.5 Pro for profit analysis, order insights, recommendations
- **AI Chat** — Customer-facing assistant for financial advice
- **Agent Economy** — 4 autonomous agents with wallets + nanopayments

### 🌍 Internationalization
- **15 Languages** — EN, VI, 中文, 日本語, 한국어, ภาษาไทย, ID, ES, FR, PT, AR, HI, DE, RU, MS
- **Real Flag Icons** — Country flags in language selector dropdown

### 👨‍💼 Admin Panel (9 Tabs)
| Tab | Features |
|-----|----------|
| **Dashboard** | Revenue, expenses, profit, orders overview |
| **Orders** | Full order management with status updates |
| **Finance** | Income/expense tracking, categories, P&L |
| **Tax** | VAT (10%), corporate tax (20%), tax reference table |
| **Products** | CRUD, stock management, image upload, pricing |
| **AI Agent** | Business analytics, profit analysis, AI chat |
| **Shipping** | Configurable free radius, price/km, max fee cap |
| **POS Terminal** | Terminal connection config, webhook, activity logs |
| **Backup** | Export/import data, publish to live site |

### 🎨 UX & PWA
- **Responsive** — Mobile-first design, works on all screen sizes
- **PWA** — Installable as app, offline support
- **Social Sharing** — Facebook, Zalo, Twitter/X, Copy Link
- **Error Boundary** — Crash recovery with friendly fallback
- **Dark Navy Theme** — Vietnamese e-commerce aesthetic (Highlands Coffee inspired)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (Vite + React + TS)         │
├──────────┬──────────┬──────────┬──────────┬─────────────────┤
│  Shop    │  Cart    │ Checkout │  Orders  │   Feedback      │
│  Menu    │  + Size  │ QR+Wallet│ Tracking │   Stars+Text    │
├──────────┴──────────┴──────────┴──────────┴─────────────────┤
│                    STATE MANAGEMENT                         │
│  useShop · useAdmin · useSocial · useAgent · usePOSConfig  │
├─────────────────────────────────────────────────────────────┤
│                    BLOCKCHAIN LAYER                          │
│  Wagmi + Viem → Arc Testnet (5042002) → USDC Contract      │
├─────────────────────────────────────────────────────────────┤
│                    AI LAYER                                  │
│  MiMo v2.5 Pro API → Business Analysis + Customer Chat     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
arcbank/
├── public/
│   ├── logo.png                    # COFFEE HOUSE crest logo
│   ├── favicon.png                 # Browser favicon
│   ├── manifest.json               # PWA manifest
│   └── wallets/                    # Wallet brand logos
│       ├── binance.png
│       ├── coinbase.png
│       ├── metamask.jpg
│       ├── okx.png
│       ├── rabby.png
│       └── walletconnect.png
├── src/
│   ├── components/
│   │   ├── AIChat.tsx              # Customer AI assistant
│   │   ├── ErrorBoundary.tsx       # Crash recovery
│   │   ├── Layout.tsx              # App shell + footer
│   │   ├── Navbar.tsx              # Navigation + i18n + wallet
│   │   ├── PaymentReceipt.tsx      # Invoice/receipt component
│   │   ├── SocialShare.tsx         # Share buttons (FB, Zalo, X)
│   │   └── WalletConnect.tsx       # Multi-wallet connection
│   ├── config/
│   │   ├── chains.ts               # Arc Testnet chain config
│   │   ├── mimo.ts                 # MiMo AI API config
│   │   └── wagmi.ts                # Wagmi + connectors config
│   ├── data/
│   │   └── storeLocations.ts       # 63 Vietnamese store branches
│   ├── hooks/
│   │   ├── useAdmin.tsx            # Admin auth + finance CRUD
│   │   ├── useAgent.tsx            # AI agent state
│   │   ├── useOnChain.ts           # USDC balance + send
│   │   ├── usePOSConfig.ts         # POS terminal configuration
│   │   ├── useShop.tsx             # Products, cart, orders, promo
│   │   └── useSocial.tsx           # Comments, ratings, wishlist
│   ├── i18n/
│   │   └── index.ts                # 15-language translation system
│   ├── pages/
│   │   ├── Admin/
│   │   │   ├── AdminDashboard.tsx   # 9-tab admin panel
│   │   │   ├── AdminLogin.tsx       # Admin authentication
│   │   │   └── AgentDashboard.tsx   # AI agent + business analytics
│   │   └── Shop/
│   │       ├── DeliveryPage.tsx     # Address + map + 63 stores
│   │       ├── OrderTracking.tsx    # Real-time order status
│   │       ├── POSCheckout.tsx      # QR scan payment flow
│   │       ├── ShopCheckout.tsx     # Wallet payment flow
│   │       ├── ShopFeedback.tsx     # Reviews + star ratings
│   │       ├── ShopMenu.tsx         # Product grid + categories
│   │       └── ShopOrders.tsx       # Order history + refund
│   ├── App.tsx                      # Route definitions
│   ├── main.tsx                     # App entry point
│   └── index.css                    # Global styles + Tailwind
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── index.html
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** or **yarn**
- **MetaMask** or any Web3 wallet browser extension

### Installation

```bash
# Clone the repository
git clone https://github.com/Jinchainne/COFFEEHOUSE.git
cd COFFEEHOUSE

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup

The app works out of the box — no `.env` file needed. All configuration is inline:

| Config | Location | Value |
|--------|----------|-------|
| Arc Testnet RPC | `src/config/wagmi.ts` | `https://rpc.testnet.arc.network` |
| Chain ID | `src/config/chains.ts` | `5042002` |
| USDC Contract | `src/hooks/useOnChain.ts` | `0x3600...0000` |
| Merchant Wallet | `src/hooks/useShop.tsx` | `0x3637...34bd` |
| MiMo AI API | `src/config/mimo.ts` | `api.xiaomimimo.com` |
| WalletConnect | `src/config/wagmi.ts` | Free tier project ID |

---

## 💰 Payment Flow

```
Customer                    App                       Blockchain
   │                          │                           │
   ├─ Browse Menu ──────────►│                           │
   ├─ Add to Cart ──────────►│                           │
   ├─ Select Address ───────►│ (63 stores + map)         │
   ├─ Apply Promo ──────────►│ (WELCOME10, etc.)         │
   │                          │                           │
   ├─ Pay with Wallet ───────┼──► send USDC ────────────►│
   │                          │◄── TX hash ──────────────┤
   │◄── Receipt ─────────────┤                           │
   │                          │                           │
   ├─ OR Scan QR ────────────┼──► Poll balance ─────────►│
   │                          │◄── Balance increased ────┤
   │◄── Receipt ─────────────┤                           │
```

---

## 🤖 AI Agent

The embedded MiMo v2.5 Pro AI Agent provides:

- **Profit & Loss Analysis** — Automated P&L with recommendations
- **Order Intelligence** — Flag issues, predict demand
- **Shipping Optimization** — Cost reduction suggestions
- **Customer Insights** — Retention analysis, feedback patterns
- **Natural Language Chat** — Ask anything about your business

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) for automatic deployments on every push.

### Manual Deploy

```bash
npm run build
# Upload the `dist/` folder to any static hosting
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 8 (Rolldown bundler) |
| **Styling** | Tailwind CSS 3 |
| **Blockchain** | Wagmi + Viem (EVM) |
| **Network** | Arc Testnet (Chain 5042002) |
| **Payment** | USDC Stablecoin |
| **AI** | Xiaomi MiMo v2.5 Pro |
| **Maps** | Leaflet + OpenStreetMap |
| **QR Codes** | qrcode.react |
| **Hosting** | Vercel |
| **Icons** | Lucide React |

---

## 📄 License

MIT License © 2026 [Jinchainne](https://github.com/Jinchainne)

---

<p align="center">
  <strong>☕ COFFEE HOUSE</strong> — Built with ❤️ on <a href="https://arc.io">Arc Testnet</a><br/>
  <sub>Encode Club Blockchain Hackathon · Circle × Arc</sub>
</p>
