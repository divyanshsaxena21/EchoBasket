// src/hooks/useSuggestions.ts

import { useQuery } from '@tanstack/react-query';
import { suggestionsService } from '@/services/suggestionsService';
import { QUERY_KEYS, STALE_TIME, CACHE_TIME } from '@/lib/constants';
import { CartItem, Recommendation } from '@/types';

interface UseSuggestionsOptions {
  enabled?: boolean;
}

export const useSuggestions = (
  cartItems: CartItem[],
  options: UseSuggestionsOptions = {},
) => {
  const { enabled = true } = options;

  const {
    data: suggestions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [...QUERY_KEYS.RECOMMENDATIONS, cartItems.map((item) => item.id).join(',')],
    queryFn: () => suggestionsService.getRecommendations(cartItems),
    staleTime: STALE_TIME.RECOMMENDATIONS,
    gcTime: CACHE_TIME.RECOMMENDATIONS,
    enabled: enabled && cartItems.length > 0,
    retry: 1,
    onError: (error: any) => {
      console.error('Failed to fetch suggestions:', error);
    },
  });

  return {
    suggestions: suggestions as Recommendation[],
    isLoading,
    error,
    refetch,
    isEmpty: suggestions.length === 0,
  };
};
