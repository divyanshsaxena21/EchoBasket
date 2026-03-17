// src/mocks/mockHandlers.ts

import { mockProducts, generateMockRecommendations } from './mockData';
import { Cart, CartItem, CartResponse, SuggestionsResponse } from '@/types';

/**
 * In-memory cart storage for development
 */
let mockCartState: CartItem[] = [];

/**
 * Mock cart service handlers
 */
export const mockCartHandlers = {
  /**
   * GET /cart
   */
  getCart: (): CartResponse => {
    const total = mockCartState.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const itemCount = mockCartState.reduce((sum, item) => sum + item.quantity, 0);

    return {
      success: true,
      data: {
        items: mockCartState,
        total,
        itemCount,
      },
    };
  },

  /**
   * POST /cart/add
   */
  addToCart: (product: any, quantity: number = 1) => {
    const existingItem = mockCartState.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      mockCartState.push({
        ...product,
        quantity,
      });
    }

    return mockCartHandlers.getCart();
  },

  /**
   * DELETE /cart/remove
   */
  removeFromCart: (productId: string) => {
    mockCartState = mockCartState.filter((item) => item.id !== productId);
    return mockCartHandlers.getCart();
  },

  /**
   * PUT /cart/update-quantity
   */
  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return mockCartHandlers.removeFromCart(productId);
    }

    const item = mockCartState.find((item) => item.id === productId);
    if (item) {
      item.quantity = quantity;
    }

    return mockCartHandlers.getCart();
  },

  /**
   * Clear cart for testing
   */
  clearCart: () => {
    mockCartState = [];
    return mockCartHandlers.getCart();
  },

  /**
   * Get current cart state (for testing)
   */
  getCartState: () => mockCartState,
};

/**
 * Mock suggestions service handlers
 */
export const mockSuggestionsHandlers = {
  /**
   * GET /recommendations
   */
  getRecommendations: (cartItems: CartItem[]): SuggestionsResponse => {
    // Simulate network delay
    const delay = 300 + Math.random() * 200;

    return {
      success: true,
      data: generateMockRecommendations(cartItems, 8),
    };
  },
};

/**
 * Setup mock handlers for development
 * This can be replaced with MSW (Mock Service Worker) for more advanced scenarios
 */
export const setupMockHandlers = () => {
  // Override axios in development if no backend is available
  // This is a simple implementation - use MSW for production-like testing
};

/**
 * Mock delay utility
 */
export const mockDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
