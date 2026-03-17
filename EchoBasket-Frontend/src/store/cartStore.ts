// src/store/cartStore.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStoreState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  setItems: (items: CartItem[]) => void;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetCart: () => void;
}

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
  error: null,
};

export const useCartStore = create<CartStoreState>()(
  devtools(
    (set) => ({
      ...initialState,

      setItems: (items: CartItem[]) => {
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

        set({ items, total, itemCount });
      },

      addItem: (product: Product, quantity: number) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);

          let updatedItems: CartItem[];

          if (existingItem) {
            updatedItems = state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            );
          } else {
            updatedItems = [...state.items, { ...product, quantity }];
          }

          const total = updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          );
          const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

          return { items: updatedItems, total, itemCount };
        });
      },

      removeItem: (productId: string) => {
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== productId);
          const total = updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          );
          const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

          return { items: updatedItems, total, itemCount };
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            // Remove item if quantity is 0
            return state.removeItem(productId) || state;
          }

          const updatedItems = state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item,
          );

          const total = updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          );
          const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

          return { items: updatedItems, total, itemCount };
        });
      },

      clearCart: () => {
        set({ ...initialState });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      resetCart: () => {
        set({ ...initialState });
      },
    }),
    { name: 'CartStore' },
  ),
);
