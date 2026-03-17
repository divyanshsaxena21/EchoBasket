# EchoBasket - AI-Powered Smart Shopping Assistant

A modern, production-ready frontend for an intelligent shopping assistant with voice input, smart recommendations, and cart management.

## Tech Stack

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Zustand** for global state management
- **TanStack Query v5** for server state
- **Axios** for API requests
- **Web Speech API** for voice input
- **React Hot Toast** for notifications

## Project Structure

```
echobasket-frontend/
├── public/                    # Static assets
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/           # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── voice/            # Voice input
│   │   │   ├── VoiceInput.tsx
│   │   │   └── VoiceButton.tsx
│   │   ├── cart/             # Cart related
│   │   │   ├── CartPanel.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── CartSummary.tsx
│   │   ├── suggestions/      # Recommendations
│   │   │   ├── SuggestionsPanel.tsx
│   │   │   ├── SuggestionCard.tsx
│   │   │   └── SkeletonLoader.tsx
│   │   └── common/           # Reusable components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Loading.tsx
│   │       └── ErrorState.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useCart.ts
│   │   ├── useSuggestions.ts
│   │   ├── useVoiceInput.ts
│   │   └── useToast.ts
│   ├── store/                # Zustand stores
│   │   ├── cartStore.ts
│   │   └── appStore.ts
│   ├── services/             # API layer
│   │   ├── api.ts            # Axios instance
│   │   ├── cartService.ts
│   │   ├── suggestionsService.ts
│   │   └── types.ts
│   ├── lib/                  # Utilities
│   │   ├── queryClient.ts
│   │   └── constants.ts
│   └── types/                # Global TypeScript types
│       └── index.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Features

### 1. Voice Input Component
- Speech-to-text conversion using Web Speech API
- Fallback to text input
- Real-time feedback during recording
- Automatic product extraction from voice

### 2. Shopping Cart
- Add/remove/update quantities
- Optimistic updates for better UX
- Persistent state with Zustand
- Real-time sync with backend

### 3. Smart Suggestions
- AI-powered recommendations based on cart
- Automatic refresh when cart changes
- Cached with React Query
- Loading skeletons

### 4. Toast Notifications
- Action feedback
- Error handling
- Success confirmations

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## Environment Variables

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## API Endpoints

- `POST /cart/add` - Add item to cart
- `GET /cart` - Get cart items
- `DELETE /cart/remove` - Remove item from cart
- `GET /recommendations` - Get product suggestions

## Architecture Highlights

- **Clean Separation of Concerns**: Services, stores, hooks, and components are clearly separated
- **No Prop Drilling**: Zustand and React Query eliminate need for prop passing
- **Custom Hooks**: Reusable logic abstracted into custom hooks
- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Graceful error states and fallbacks
- **Optimistic Updates**: Instant UI feedback without waiting for server
- **Scalable**: Easy to add new features and components

## Performance Optimizations

- React Query caching strategies
- Code splitting with Next.js
- Lazy loading for components
- Optimistic updates reduce perceived latency
- Proper dependency arrays in hooks

## Development Notes

- Use `npm run dev` for hot reload during development
- Check browser console for detailed error messages
- Mock API responses in development if backend isn't available
- Use React Query DevTools for state debugging (can be enabled in dev)

## Production Deployment

- Run `npm run build` to create optimized bundle
- Test with `npm start`
- Deploy to Vercel, Netlify, or your preferred hosting
