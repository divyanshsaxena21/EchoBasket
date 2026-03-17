// API_INTEGRATION_EXAMPLES.md

# API Integration Examples and Patterns

## Overview

This document provides detailed examples and patterns for integrating with the EchoBasket backend API.

## Cart API Integration

### Example 1: Fetching Cart

```typescript
// src/hooks/useCart.ts - Already implemented
import { useQuery } from '@tanstack/react-query';
import { cartService } from '@/services/cartService';

const { data: cart, isLoading, error } = useQuery({
  queryKey: ['cart'],
  queryFn: cartService.getCart,
});
```

### Example 2: Adding to Cart with Optimistic Update

```typescript
const addToCartMutation = useMutation({
  mutationFn: ({ product, quantity }) =>
    cartService.addItem(product, quantity),

  // Update UI immediately before server responds
  onMutate: async ({ product, quantity }) => {
    // Cancel ongoing queries
    await queryClient.cancelQueries({ queryKey: ['cart'] });

    // Get previous cart state
    const previousCart = queryClient.getQueryData(['cart']);

    // Optimistically update cache
    queryClient.setQueryData(['cart'], (old: any) => ({
      ...old,
      items: [...(old?.items || []), { ...product, quantity }],
    }));

    // Return context for rollback
    return { previousCart };
  },

  // Revert on error
  onError: (error, variables, context: any) => {
    if (context?.previousCart) {
      queryClient.setQueryData(['cart'], context.previousCart);
    }
  },

  // Refetch fresh data after success
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
  },
});
```

### Example 3: Removing from Cart

```typescript
const removeFromCartMutation = useMutation({
  mutationFn: (productId: string) => cartService.removeItem(productId),

  onMutate: async (productId) => {
    await queryClient.cancelQueries({ queryKey: ['cart'] });
    const previousCart = queryClient.getQueryData(['cart']);

    queryClient.setQueryData(['cart'], (old: any) => ({
      ...old,
      items: old?.items.filter((item: any) => item.id !== productId) || [],
    }));

    return { previousCart };
  },

  onError: (error, variables, context: any) => {
    if (context?.previousCart) {
      queryClient.setQueryData(['cart'], context.previousCart);
    }
  },
});
```

## Recommendations API Integration

### Example 1: Fetching Recommendations

```typescript
// src/hooks/useSuggestions.ts - Already implemented
import { useQuery } from '@tanstack/react-query';
import { suggestionsService } from '@/services/suggestionsService';

const { data: suggestions, isLoading } = useQuery({
  queryKey: ['recommendations', cartItems.map(i => i.id).join(',')],
  queryFn: () => suggestionsService.getRecommendations(cartItems),
  enabled: cartItems.length > 0, // Only fetch when cart has items
  staleTime: 2 * 60 * 1000, // 2 minutes
});
```

### Example 2: Automatic Refetch on Cart Change

```typescript
// Recommendations automatically refetch when cart changes
// because the query key includes cart item IDs

useEffect(() => {
  // When cart items change, React Query automatically:
  // 1. Detects the query key has changed
  // 2. Marks previous data as stale
  // 3. Refetches recommendations
}, [cartItems]);
```

## Voice Input Integration

### Example 1: Processing Voice Input

```typescript
'use client';

import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useCart } from '@/hooks/useCart';

export const VoiceInput: React.FC = () => {
  const { addToCart } = useCart();
  const { startListening, transcript } = useVoiceInput({
    onResult: (result) => {
      // Process the voice input
      const product = parseVoiceInput(result.text);
      if (product) {
        addToCart(product, 1);
      }
    },
  });

  return (
    <button onClick={startListening}>
      🎤 Start Recording
    </button>
  );
};
```

### Example 2: Voice Command Parsing

```typescript
// Parse "add 2 apples" into { productName: "apples", quantity: 2 }
const parseVoiceInput = (input: string) => {
  const match = input.match(/(?:add\s+)?(\d+)\s+(.+)/i);
  if (match) {
    return {
      quantity: parseInt(match[1], 10),
      productName: match[2],
    };
  }
  return null;
};
```

## Error Handling

### Example 1: API Error Handling

```typescript
import { ApiError } from '@/types';

try {
  await cartService.addItem(product, quantity);
} catch (error) {
  const apiError = error as ApiError;
  console.error(`Error: ${apiError.message}`);
  toast.error(apiError.message || 'An error occurred');
}
```

### Example 2: Query Error Handling

```typescript
const { data, error, isLoading } = useQuery({
  queryKey: ['recommendations'],
  queryFn: suggestionsService.getRecommendations,
  onError: (error: any) => {
    toast.error(error.message || 'Failed to fetch recommendations');
  },
});

if (error) {
  return <ErrorState message={error.message} onRetry={() => refetch()} />;
}
```

## Advanced Patterns

### Pattern 1: Dependent Queries

```typescript
// Only fetch recommendations after cart is loaded
const { data: cart } = useQuery({
  queryKey: ['cart'],
  queryFn: cartService.getCart,
});

const { data: recommendations } = useQuery({
  queryKey: ['recommendations', cart?.items],
  queryFn: () => suggestionsService.getRecommendations(cart?.items || []),
  enabled: !!cart?.items.length, // Only fetch when cart has items
});
```

### Pattern 2: Mutation with Refetch

```typescript
const mutation = useMutation({
  mutationFn: cartService.addItem,
  onSuccess: () => {
    // Refetch cart and recommendations
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    queryClient.invalidateQueries({ queryKey: ['recommendations'] });
  },
});
```

### Pattern 3: Batch Operations

```typescript
// Add multiple items efficiently
const addMultipleItems = async (items: Array<{ product: Product; quantity: number }>) => {
  for (const { product, quantity } of items) {
    await cartService.addItem(product, quantity);
  }
  // Refetch once after all additions
  queryClient.invalidateQueries({ queryKey: ['cart'] });
};
```

## Backend Expected Response Format

### Cart Response

```json
{
  "success": true,
  "cart": {
    "items": [
      {
        "id": "apples",
        "name": "Fresh Apples",
        "price": 3.99,
        "quantity": 2
      }
    ],
    "total": 7.98,
    "itemCount": 2
  }
}
```

### Recommendations Response

```json
{
  "success": true,
  "data": [
    {
      "id": "cheese",
      "name": "Cheddar Cheese",
      "price": 7.99,
      "category": "Dairy",
      "relevance": 0.9,
      "reason": "Pairs well with apples"
    }
  ]
}
```

## Testing with Mock API

### Enable Mock API for Development

```typescript
// src/app/providers.tsx
import { enableMockApi } from '@/lib/mockApiIntegration';
import { apiClient } from '@/services/api';

// Enable mock API if backend is not available
if (process.env.NODE_ENV === 'development') {
  enableMockApi(apiClient);
}
```

### Mock API Data

```typescript
// src/mocks/mockData.ts
import { mockCartHandlers } from '@/mocks/mockHandlers';

// Get mock cart
const mockCart = mockCartHandlers.getCart();

// Add item to mock cart
const updatedCart = mockCartHandlers.addToCart(product, 1);

// Remove item from mock cart
const cartAfterRemoval = mockCartHandlers.removeFromCart(productId);
```

## Debugging API Integration

### Browser DevTools

1. **Network Tab**
   - Monitor all API requests
   - Check response status codes
   - Inspect request/response payloads

2. **Console Tab**
   - Check for errors and warnings
   - Log API responses
   - Debug hook logic

### React Query DevTools

Enable in development:

```typescript
// src/app/providers.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Zustand DevTools

Use Redux DevTools browser extension to inspect store state.

## Performance Optimization

### Query Caching Strategy

```typescript
// Aggressive caching for recommendations
staleTime: 5 * 60 * 1000,  // 5 minutes
gcTime: 10 * 60 * 1000,    // 10 minutes

// Less aggressive for cart
staleTime: 30 * 1000,       // 30 seconds
gcTime: 1 * 60 * 1000,      // 1 minute
```

### Request Deduplication

React Query automatically deduplicates requests:
- Same query key within `dedupeInterval` (default 0ms)
- Prevents duplicate API calls

### Pagination (Future Enhancement)

```typescript
// Example for paginated recommendations
const { data, hasNextPage, fetchNextPage } = useInfiniteQuery({
  queryKey: ['recommendations'],
  queryFn: ({ pageParam = 0 }) =>
    suggestionsService.getRecommendations(cartItems, pageParam),
  getNextPageParam: (lastPage, pages) => pages.length,
});
```

## Common Issues and Solutions

### Issue 1: Cart Not Updating

**Solution**: Check React Query cache:
```typescript
// Enable React Query DevTools to inspect cache
const cache = queryClient.getQueryData(['cart']);
console.log('Current cache:', cache);
```

### Issue 2: Recommendations Not Refreshing

**Solution**: Ensure query key includes cart items:
```typescript
// ❌ Wrong - query key is always the same
queryKey: ['recommendations']

// ✅ Correct - includes cart items
queryKey: ['recommendations', cartItems.map(i => i.id).join(',')]
```

### Issue 3: Optimistic Update Fails

**Solution**: Always provide rollback in error handler:
```typescript
onError: (error, variables, context) => {
  if (context?.previousState) {
    queryClient.setQueryData(['cart'], context.previousState);
  }
}
```

## Production Considerations

1. **API Authentication**
   - Add JWT token handling in interceptors
   - Refresh token on 401 response

2. **Error Tracking**
   - Send errors to Sentry or similar
   - Log important API events

3. **Rate Limiting**
   - Implement exponential backoff
   - Cache responses appropriately

4. **Monitoring**
   - Track API response times
   - Monitor error rates
   - Set up alerts for failures
