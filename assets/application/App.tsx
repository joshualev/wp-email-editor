/**
 * App.tsx - Application Root Component
 *
 * This is the main entry point for the React application. It sets up:
 * - TanStack Query (React Query) for server state management
 * - Toast notifications via react-hot-toast
 * - Global layout structure
 *
 * Architecture:
 * -------------
 * The app follows a layered architecture:
 *
 * application/     - UI components, pages, and state management
 * ├── components/  - Reusable React components
 * ├── pages/       - Page-level components
 * └── store/       - Zustand state management
 *
 * domain/          - Business logic and type definitions
 * ├── blocks/      - Email block components and schemas
 * └── document/    - Document structure utilities
 *
 * infrastructure/  - External service communication
 * ├── newsletter/  - HubSpot API integration
 * └── wordpress/   - WordPress REST API integration
 *
 * @module Application
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { Box } from '@mui/material';
import Newsletter from './pages/Newsletter'

/**
 * TanStack Query client configuration.
 *
 * We disable automatic refetching because:
 * - Data is manually saved/synced via user action
 * - Prevents unexpected overwrites of local changes
 * - staleTime: Infinity means data never goes stale automatically
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: Infinity,
    },
  },
});

/**
 * Root application component.
 *
 * Provides global context providers and layout wrapper.
 * The 160px left margin accommodates the WordPress admin sidebar.
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#059669',
              secondary: '#fff',
            },
          },
          error: {
            duration: 6000,
            iconTheme: {
              primary: '#DC2626',
              secondary: '#fff',
            },
          },
        }}
      />
      <Box sx={{ marginLeft: '160px', width: 'calc(100% - 160px)' }}>
        <Newsletter />
      </Box>
    </QueryClientProvider>
  );
}
