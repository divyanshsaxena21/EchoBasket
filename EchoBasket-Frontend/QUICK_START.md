// QUICK_START.md

# EchoBasket Frontend - Quick Start Guide

## ⚡ 5-Minute Setup

### Prerequisites
- Node.js 18+ installed
- npm 9+ installed
- Terminal/Command line access

### Step 1: Install Dependencies (2 min)
```bash
cd EchoBasket-Frontend
npm install
```

### Step 2: Set Environment Variables (1 min)
```bash
cp .env.example .env.local
```

**Edit `.env.local`** if your backend is at a different URL:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### Step 3: Start Development Server (1 min)
```bash
npm run dev
```

Visit: `http://localhost:3000`

### Step 4: Test the App (1 min)
- Click "🎤 Start Voice Input" or use text input
- Type "2 apples" or speak it
- Item should appear in cart
- See recommendations update

**Done!** 🎉

---

## 📋 Project Overview in 60 Seconds

### What is EchoBasket?
An AI-powered shopping assistant with:
- **Voice Input**: Say "add 2 apples" to add to cart
- **Smart Cart**: Manage items, quantities, totals
- **AI Recommendations**: Get personalized product suggestions
- **Modern UI**: Beautiful, responsive interface

### Key Technologies
- Next.js 14 (React framework)
- TypeScript (type safety)
- Tailwind CSS (styling)
- Zustand (state management)
- React Query (server state)
- Axios (API calls)

### Folder Organization
```
src/
├── components/    → UI components (Cart, Voice, Suggestions)
├── hooks/         → Business logic (useCart, useSuggestions)
├── store/         → Global state (Zustand)
├── services/      → API layer
├── types/         → TypeScript interfaces
└── mocks/         → Mock data for development
```

---

## 🚀 First Task: Add an Item

### Using Voice Input
1. Open http://localhost:3000
2. Click "🎤 Start Voice Input"
3. Say: "**add 2 apples**"
4. See item appear in cart

### Using Text Input
1. Type: "2 apples"
2. Click "Add"
3. See item in cart

### What Happens
1. Voice input parsed → "2 apples" recognized
2. Item added optimistically (instant UI update)
3. Request sent to backend
4. Recommendations update automatically
5. Cart totals recalculated

---

## 🔧 Common Development Tasks

### Task 1: Modify Cart Display
**File**: `src/components/cart/CartItem.tsx`

```typescript
// Find this section:
<h3 className="font-semibold text-gray-900 dark:text-white truncate">
  {item.name}
</h3>

// Change to add emoji:
<h3 className="font-semibold text-gray-900 dark:text-white truncate">
  🛍️ {item.name}
</h3>

// Save and see live update
```

### Task 2: Change Button Color
**File**: `src/components/common/Button.tsx`

```typescript
// Find "primary" variant:
primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white...'

// Change to green:
primary: 'bg-gradient-to-r from-green-600 to-green-700 text-white...'
```

### Task 3: Add New Product to Mock Data
**File**: `src/mocks/mockData.ts`

```typescript
export const mockProducts: Record<string, Product> = {
  // ... existing products ...
  
  'orange': {
    id: 'orange',
    name: 'Fresh Oranges',
    price: 4.99,
    category: 'Fruits',
    description: 'Juicy citrus oranges',
    image: '🍊',
  },
};
```

### Task 4: Change API Base URL
**File**: `.env.local`

```
# For production backend
NEXT_PUBLIC_API_BASE_URL=https://api.production.com

# For local backend on different port
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

---

## 📱 Using the App

### Voice Commands Examples
```
"add apples"              → adds 1 apple
"add 2 bananas"           → adds 2 bananas
"2 milk"                  → adds 2 milk
"three carrots"           → adds 3 carrots
"add milk"                → adds 1 milk
```

### Cart Operations
- **Increase qty**: Click "+" button or change number
- **Decrease qty**: Click "-" button or change number
- **Remove item**: Click "✕" button
- **Clear cart**: Click "Clear Cart" button at bottom

### Navigation
- **Header**: Cart badge, dark mode toggle
- **Sidebar**: Dashboard, Cart, History, Settings
- **Mobile**: Hamburger menu opens/closes sidebar

---

## 🐛 Troubleshooting

### Issue: Port 3000 Already in Use
```bash
# Use different port
npm run dev -- -p 3001

# Or kill process on port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: Voice Input Not Working
✅ **Solutions**:
1. Check browser support (Chrome, Edge, Safari 14.1+)
2. Check microphone permissions
3. Use text input as fallback
4. Check browser console for errors

### Issue: Items Not Appearing in Cart
✅ **Solutions**:
1. Check browser console for API errors
2. Verify backend is running (if available)
3. Check `.env.local` API URL
4. Open DevTools → Network tab → see API calls

### Issue: Recommendations Not Showing
✅ **Solutions**:
1. Add items to cart first
2. Check React Query DevTools (enable in providers.tsx)
3. Check API responses in Network tab
4. Verify backend /recommendations endpoint

### Issue: Dark Mode Not Working
✅ **Solutions**:
1. Click the moon/sun button in header
2. Check browser DevTools console
3. Verify dark mode class is applied to `<html>`

---

## 📚 Next: Deep Dive Topics

### Want to Add a New Feature?

**Read**: `DEVELOPER_GUIDE.md` → Section "Adding a New Feature"

Steps:
1. Add types in `src/types/index.ts`
2. Create API service in `src/services/`
3. Create hook in `src/hooks/`
4. Use hook in component
5. Add to store if needed

### Want to Connect Real Backend?

**Read**: `API_INTEGRATION_EXAMPLES.md`

Key Points:
- API calls go through `src/services/`
- Mock API in `src/mocks/` can be disabled
- Modify `cartService.ts` and `suggestionsService.ts`
- Update error handling
- Test with new backend

### Want to Deploy?

**Read**: `PROJECT_SUMMARY.md` → "Deployment Checklist"

Key Steps:
1. Set production API URL in `.env.local`
2. Run `npm run build`
3. Deploy to Vercel, Netlify, or Docker
4. Test in production environment

---

## 🎯 Understanding the Code Flow

### Adding Item to Cart (Complete Flow)

```
User Input (Voice/Text)
    ↓
VoiceInput Component receives text
    ↓
Parse voice command → Extract product name & quantity
    ↓
Call useCart.addToCart(product, quantity)
    ↓
useCart Hook (optimistic update):
  1. Zustand store updates instantly (optimistic)
  2. UI re-renders immediately
  3. API request sent in background
    ↓
cartService.addItem() → Axios call to /cart/add
    ↓
Backend processes request
    ↓
Response returns new cart
    ↓
React Query updates cache
    ↓
useSuggestions hook detects cart changed
    ↓
Fetches new recommendations
    ↓
All UI updated with fresh data
```

### Component Dependency Relationship

```
Page (Dashboard)
├── MainLayout
│   ├── Header (shows cart count)
│   ├── Sidebar (navigation)
│   └── Content Area
│
└── Content Area
    ├── VoiceInput
    │   └── calls useCart.addToCart()
    │
    ├── SuggestionsPanel
    │   └── uses useSuggestions(cartItems)
    │
    └── CartPanel
        ├── uses useCart()
        └── displays items from Zustand store
```

---

## 🔌 API Endpoints (Expected)

Your backend should provide:

```
POST /cart/add
├── Request: { product: Product, quantity: number }
└── Response: { success: true, cart: Cart }

GET /cart
├── Request: none
└── Response: { success: true, data: Cart }

DELETE /cart/remove
├── Request: { productId: string }
└── Response: { success: true, cart: Cart }

GET /recommendations?items=apple,bread
├── Request: cart item IDs as query
└── Response: { success: true, data: Recommendation[] }
```

See `API_INTEGRATION_EXAMPLES.md` for detailed examples.

---

## 💡 Pro Tips

### 1. Use Browser DevTools
```
Chrome/Edge: F12 or Ctrl+Shift+I
- Network Tab: See API calls
- Console: See errors
- Application: Check localStorage
```

### 2. Enable React Query DevTools
**File**: `src/app/providers.tsx`
```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Uncomment to enable
<ReactQueryDevtools initialIsOpen={false} />
```

### 3. Check Zustand Store State
Install Redux DevTools browser extension to see store.

### 4. Use Mock API in Development
Works without backend! Mock data in `src/mocks/mockData.ts`

### 5. Hot Reload Works Automatically
Edit any file and save → Browser updates instantly

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Server running at http://localhost:3000
- [ ] Page loads without errors
- [ ] Can add item to cart (text input)
- [ ] Voice input works (if supported in your browser)
- [ ] Cart updates instantly
- [ ] Recommendations appear
- [ ] Dark mode toggle works
- [ ] Mobile menu works on smaller screens
- [ ] No errors in browser console

---

## 📞 Getting Help

### Check Documentation
1. **README.md** - Project overview
2. **DEVELOPER_GUIDE.md** - Detailed architecture
3. **API_INTEGRATION_EXAMPLES.md** - API patterns
4. **FILE_MANIFEST.md** - File descriptions

### Check Browser Console
```javascript
// Paste in console to see cart state
const cartState = useCartStore.getState();
console.log(cartState);
```

### Check Network Requests
- Open DevTools Network tab
- Perform action (add item, etc.)
- See API request and response
- Check status codes and payloads

### Enable Debug Logging
**File**: `src/services/api.ts`
```typescript
// Add logging to request interceptor
console.log('API Request:', config);

// Add logging to response
console.log('API Response:', response);
```

---

## 🎓 Learning Path

**Day 1 - Setup**
- [ ] Run `npm install`
- [ ] Start dev server
- [ ] Add items to cart
- [ ] Explore UI

**Day 2 - Understanding**
- [ ] Read DEVELOPER_GUIDE.md
- [ ] Review component structure
- [ ] Understand hooks usage
- [ ] Check store setup

**Day 3 - Customization**
- [ ] Modify component styles
- [ ] Add new mock product
- [ ] Change API endpoint
- [ ] Create new hook

**Day 4 - Integration**
- [ ] Read API_INTEGRATION_EXAMPLES.md
- [ ] Connect to real backend
- [ ] Add authentication
- [ ] Deploy to production

---

## 🚀 Commands Reference

```bash
# Development
npm run dev                 # Start dev server (port 3000)
npm run build              # Build for production
npm start                  # Start production server

# Code Quality
npm run lint               # Run ESLint
npm run type-check         # Check TypeScript
npm run format             # Format code with Prettier
npm run format:check       # Check formatting without changes

# Utilities
npm install                # Install dependencies
npm update                 # Update dependencies
npm uninstall <package>    # Remove package
```

---

## 🎉 You're Ready!

You now have a production-ready shopping assistant frontend. 

### Next Steps
1. ✅ Run the app
2. ✅ Explore the code
3. ✅ Connect to your backend
4. ✅ Customize as needed
5. ✅ Deploy to production

**Questions?** Check the documentation files first - they likely have your answer!

Happy coding! 🚀

---

*Last Updated: 2024*  
*Version: 1.0.0*  
*Status: Production Ready*
