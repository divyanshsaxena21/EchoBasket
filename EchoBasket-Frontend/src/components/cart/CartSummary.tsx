// src/components/cart/CartSummary.tsx

'use client';

import React from 'react';
import { Button } from '@/components/common/Button';

interface CartSummaryProps {
  itemCount: number;
  subtotal: number;
  tax?: number;
  shipping?: number;
  onCheckout?: () => void;
  isLoading?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  itemCount,
  subtotal,
  tax = 0,
  shipping = 0,
  onCheckout,
  isLoading = false,
}) => {
  const total = subtotal + tax + shipping;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 space-y-4">
      {/* Items Summary */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600 dark:text-gray-400">Items ({itemCount})</span>
        <span className="font-medium text-gray-900 dark:text-white">
          ${subtotal.toFixed(2)}
        </span>
      </div>

      {/* Tax */}
      {tax > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Tax</span>
          <span className="font-medium text-gray-900 dark:text-white">
            ${tax.toFixed(2)}
          </span>
        </div>
      )}

      {/* Shipping */}
      {shipping > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Shipping</span>
          <span className="font-medium text-gray-900 dark:text-white">
            ${shipping.toFixed(2)}
          </span>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700" />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg text-gray-900 dark:text-white">Total</span>
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ${total.toFixed(2)}
        </span>
      </div>

      {/* Checkout Button */}
      <Button
        onClick={onCheckout}
        variant="primary"
        size="lg"
        className="w-full mt-6"
        isLoading={isLoading}
        disabled={itemCount === 0}
      >
        Proceed to Checkout
      </Button>

      {/* Info Text */}
      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
        Free shipping on orders over $50
      </p>
    </div>
  );
};
