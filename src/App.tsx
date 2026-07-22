import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Send from './pages/Send';
import Receive from './pages/Receive';
import History from './pages/History';
import SplitGroups from './pages/Split/SplitGroups';
import NewExpense from './pages/Split/NewExpense';
import RemitTransfer from './pages/Remit/RemitTransfer';
import RemitHistory from './pages/Remit/RemitHistory';

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="send" element={<Send />} />
              <Route path="receive" element={<Receive />} />
              <Route path="history" element={<History />} />
              <Route path="split" element={<SplitGroups />} />
              <Route path="split/new" element={<NewExpense />} />
              <Route path="remit" element={<RemitTransfer />} />
              <Route path="remit/history" element={<RemitHistory />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
