// DEVELOPER_GUIDE.md

# EchoBasket Frontend - Developer Guide

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Architecture Overview

### State Management

#### Zustand Stores
- **cartStore.ts**: Global cart state with optimistic updates
- **appStore.ts**: Global UI state (sidebar, dark mode, etc.)

```typescript
// Example: Using cart store
import { useCartStore } from '@/store/cartStore';

function MyComponent() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);

  return <div>{items.length} items</div>;
}
```

#### React Query
- Handles server state (API data)
- Automatic caching and invalidation
- Prefixed query keys for organization

```typescript
// Example: Using React Query
import { useSuggestions } from '@/hooks/useSuggestions';

function Recommendations() {
  const { suggestions, isLoading } = useSuggestions(cartItems);
  // ...
}
```

### API Integration

All API calls go through the service layer:

```typescript
// src/services/cartService.ts
export const cartService = {
  async getCart(): Promise<Cart> { /* ... */ },
  async addItem(product, quantity): Promise<Cart> { /* ... */ },
  async removeItem(productId): Promise<Cart> { /* ... */ },
};
```

### Custom Hooks

#### useCart
Comprehensive cart management with optimistic updates:

```typescript
const {
  items,
  total,
  itemCount,
  isLoading,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = useCart();

// Add item with optimistic update
addToCart(product, 2);

// Update quantity
updateQuantity(cartItem, 5);

// Remove from cart
removeFromCart(productId);
```

#### useSuggestions
Fetch AI recommendations based on cart:

```typescript
const { suggestions, isLoading, error } = useSuggestions(cartItems);

// Only fetch when cart has items
const { suggestions } = useSuggestions(cartItems, { enabled: cartItems.length > 0 });
```

#### useVoiceInput
Web Speech API integration with fallback:

```typescript
const {
  isListening,
  isSupported,
  transcript,
  startListening,
  stopListening,
} = useVoiceInput({
  onResult: (result) => {
    console.log(`User said: ${result.text}`);
  },
});
```

#### useToast
Toast notifications:

```typescript
const toast = useToast();

toast.success('Item added!');
toast.error('Something went wrong');
toast.info('Please wait...');
toast.warning('Are you sure?');
```

## Component Structure

### Layout Components
- **Header.tsx**: Top navigation with cart badge and theme toggle
- **Sidebar.tsx**: Navigation and cart summary
- **MainLayout.tsx**: Wrapper combining header and sidebar

### Cart Components
- **CartPanel.tsx**: Main cart container
- **CartItem.tsx**: Individual item with quantity controls
- **CartSummary.tsx**: Totals and checkout button

### Voice Components
- **VoiceInput.tsx**: Voice recording and text fallback

### Suggestions Components
- **SuggestionsPanel.tsx**: Recommendation grid
- **SuggestionCard.tsx**: Individual product recommendation

### Common Components
- **Button.tsx**: Reusable button with variants
- **Input.tsx**: Text input with error handling
- **SkeletonLoader.tsx**: Loading placeholders
- **ErrorState.tsx**: Error display with retry

## Adding a New Feature

### 1. Add Types
```typescript
// src/types/index.ts
export interface MyNewType {
  id: string;
  name: string;
  // ...
}
```

### 2. Create API Service
```typescript
// src/services/myService.ts
export const myService = {
  async fetchData(): Promise<MyData> {
    const response = await apiClient.get('/my-endpoint');
    return response.data;
  },
};
```

### 3. Create Custom Hook
```typescript
// src/hooks/useMyFeature.ts
export const useMyFeature = () => {
  return useQuery({
    queryKey: ['myFeature'],
    queryFn: myService.fetchData,
  });
};
```

### 4. Use in Component
```typescript
// src/components/MyComponent.tsx
export const MyComponent: React.FC = () => {
  const { data, isLoading } = useMyFeature();
  
  if (isLoading) return <SkeletonLoader />;
  
  return <div>{/* ... */}</div>;
};
```

## Styling Guidelines

### Using Tailwind CSS
- Use utility classes directly in components
- Create custom utilities in `globals.css` for complex styles
- Use `cn()` utility for conditional class merging

```typescript
const className = cn(
  'base classes',
  condition && 'conditional classes',
);
```

### Dark Mode
- Tailwind dark mode is configured
- Use `dark:` prefix for dark mode styles
- Automatically applied based on `html.dark` class

```tsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content
</div>
```

### Component Variants
```typescript
// Button component with variants
<Button variant="primary" size="lg">
  Click me
</Button>
```

## Error Handling

### API Errors
```typescript
try {
  await cartService.addItem(product, quantity);
} catch (error: any) {
  toast.error(error.message || 'Failed to add item');
  // Error is automatically logged
}
```

### Component Error Boundaries
Use React error boundaries for component-level errors (can be added):
```typescript
<ErrorBoundary fallback={<ErrorState />}>
  <Component />
</ErrorBoundary>
```

## Performance Optimization

### Code Splitting
Next.js automatically code-splits by route and component.

### Query Caching
React Query automatically caches API responses:
- `staleTime`: 2-5 minutes (adjust in `constants.ts`)
- `gcTime`: 5-10 minutes (garbage collection)

### Image Optimization
- Use Next.js Image component for product images
- Already configured for local and external domains

### Optimistic Updates
Cart mutations use optimistic updates for instant feedback:

```typescript
const addToCartMutation = useMutation({
  mutationFn: (data) => cartService.addItem(data.product, data.quantity),
  onMutate: ({ product, quantity }) => {
    // Update UI immediately
    cartStore.addItem(product, quantity);
  },
  onError: () => {
    // Revert on error
    refetch();
  },
});
```

## Testing

### Unit Tests (TODO)
Add Jest and React Testing Library:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

### Example Test
```typescript
import { render, screen } from '@testing-library/react';
import { CartItem } from '@/components/cart/CartItem';

test('renders cart item with name and price', () => {
  const item = { id: '1', name: 'Apple', price: 2.5, quantity: 2 };
  render(<CartItem item={item} onQuantityChange={() => {}} onRemove={() => {}} />);
  
  expect(screen.getByText('Apple')).toBeInTheDocument();
  expect(screen.getByText('$2.50 each')).toBeInTheDocument();
});
```

## Debugging

### React Query DevTools
Uncomment in `providers.tsx` to enable:
```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<ReactQueryDevtools initialIsOpen={false} />
```

### Zustand DevTools
Available in Redux DevTools browser extension.

### Browser Console
- Check for API errors
- Verify store updates
- Monitor React Query cache

## Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
Set `NEXT_PUBLIC_API_BASE_URL` to your production API:
```
NEXT_PUBLIC_API_BASE_URL=https://api.production.com
```

### Deployment Platforms
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker** (custom deployment)

## Troubleshooting

### "Cannot find module @/*"
- Check `tsconfig.json` paths alias
- Restart development server

### Cart not updating
- Check Zustand store (enable devtools)
- Verify React Query cache settings
- Check browser network tab for API errors

### Voice input not working
- Check browser support (Chrome, Edge, Safari 14.1+)
- Check microphone permissions
- Verify `useVoiceInput` hook setup

### Slow API responses
- Check network tab in DevTools
- Increase React Query `staleTime` if appropriate
- Verify backend is running on correct port

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and test
3. Format code: `npm run format`
4. Type check: `npm run type-check`
5. Push and create pull request

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Query](https://tanstack.com/query/latest)
- [TypeScript](https://www.typescriptlang.org/docs/)
