// src/lib/queryClient.ts

import { QueryClient } from '@tanstack/react-query';
import { CACHE_TIME, STALE_TIME } from './constants';

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME.RECOMMENDATIONS,
        gcTime: CACHE_TIME.RECOMMENDATIONS,
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  });
};

export const queryClient = createQueryClient();
