'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { PostHogProvider } from './posthog-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <PostHogProvider>
        {children}
        <Analytics />
      </PostHogProvider>
    </QueryClientProvider>
  );
}
