import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BattlePage } from '../pages/BattlePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BattlePage />
      <ToastContainer />
    </QueryClientProvider>
  );
}
