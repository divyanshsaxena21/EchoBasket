// src/components/cart/CartPanel.tsx

'use client';

import React from 'react';
import { useCart } from '@/hooks/useCart';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { Button } from '@/components/common/Button';

interface CartPanelProps {
  onCheckout?: () => void;
}

export const CartPanel: React.FC<CartPanelProps> = ({ onCheckout }) => {
  const {
    items,
    total,
    itemCount,
    isLoading,
    isUpdatingQuantity,
    isRemovingFromCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonLoader count={3} height="h-20" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🛒</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Your cart is empty
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Start adding items using voice input or search
        </p>
        <Button variant="primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Back to Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cart Items */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Cart Items ({itemCount})
        </h2>
        <div className="space-y-3">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onQuantityChange={(quantity) => updateQuantity(item, quantity)}
              onRemove={() => removeFromCart(item.id)}
              isLoading={isUpdatingQuantity || isRemovingFromCart}
            />
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      <CartSummary
        itemCount={itemCount}
        subtotal={total}
        onCheckout={onCheckout}
      />

      {/* Clear Cart Button */}
      <Button
        onClick={clearCart}
        variant="ghost"
        className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        Clear Cart
      </Button>
    </div>
  );
};
