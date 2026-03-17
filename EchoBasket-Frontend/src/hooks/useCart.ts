// src/hooks/useCart.ts

import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/store/cartStore';
import { cartService } from '@/services/cartService';
import { QUERY_KEYS, STALE_TIME } from '@/lib/constants';
import { Product, CartItem } from '@/types';
import { useToast } from './useToast';

export const useCart = () => {
  const toast = useToast();
  const cartStore = useCartStore();

  // Fetch cart on mount
  const {
    data: cart,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.CART,
    queryFn: cartService.getCart,
    staleTime: STALE_TIME.CART,
    onSuccess: (data) => {
      cartStore.setItems(data.items);
    },
    onError: (err: any) => {
      cartStore.setError(err?.message || 'Failed to load cart');
      toast.error('Failed to load cart');
    },
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: ({ product, quantity }: { product: Product; quantity: number }) =>
      cartService.addItem(product, quantity),
    onMutate: ({ product, quantity }) => {
      // Optimistic update
      cartStore.addItem(product, quantity);
    },
    onSuccess: (data) => {
      cartStore.setItems(data.items);
      toast.success('Item added to cart');
    },
    onError: (err: any) => {
      cartStore.setError(err?.message || 'Failed to add item');
      toast.error(err?.message || 'Failed to add item');
      // Refetch to sync with server
      refetch();
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: (productId: string) => cartService.removeItem(productId),
    onMutate: (productId) => {
      // Optimistic update
      cartStore.removeItem(productId);
    },
    onSuccess: (data) => {
      cartStore.setItems(data.items);
      toast.success('Item removed from cart');
    },
    onError: (err: any) => {
      cartStore.setError(err?.message || 'Failed to remove item');
      toast.error(err?.message || 'Failed to remove item');
      // Refetch to sync with server
      refetch();
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: ({ product, quantity }: { product: CartItem; quantity: number }) =>
      cartService.updateQuantity(product, quantity),
    onMutate: ({ product, quantity }) => {
      // Optimistic update
      cartStore.updateQuantity(product.id, quantity);
    },
    onSuccess: (data) => {
      cartStore.setItems(data.items);
    },
    onError: (err: any) => {
      cartStore.setError(err?.message || 'Failed to update quantity');
      toast.error(err?.message || 'Failed to update quantity');
      // Refetch to sync with server
      refetch();
    },
  });

  // Helper functions
  const addToCart = useCallback(
    (product: Product, quantity: number = 1) => {
      if (quantity <= 0) {
        toast.error('Quantity must be greater than 0');
        return;
      }
      addToCartMutation.mutate({ product, quantity });
    },
    [addToCartMutation, toast],
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      removeFromCartMutation.mutate(productId);
    },
    [removeFromCartMutation],
  );

  const updateQuantity = useCallback(
    (product: CartItem, quantity: number) => {
      if (quantity < 0) {
        toast.error('Quantity cannot be negative');
        return;
      }
      if (quantity === 0) {
        removeFromCart(product.id);
        return;
      }
      updateQuantityMutation.mutate({ product, quantity });
    },
    [updateQuantityMutation, removeFromCart, toast],
  );

  const clearCart = useCallback(() => {
    cartStore.clearCart();
  }, [cartStore]);

  return {
    // State
    items: cartStore.items,
    total: cartStore.total,
    itemCount: cartStore.itemCount,
    isLoading,
    error,
    isAddingToCart: addToCartMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
    isUpdatingQuantity: updateQuantityMutation.isPending,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refetch,
  };
};
