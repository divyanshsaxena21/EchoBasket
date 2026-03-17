// src/components/cart/CartItem.tsx

'use client';

import React from 'react';
import { CartItem as CartItemType } from '@/types';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { cn } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  isLoading?: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onQuantityChange,
  onRemove,
  isLoading = false,
}) => {
  const itemTotal = item.price * item.quantity;

  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md',
        isLoading && 'opacity-60 pointer-events-none',
      )}
    >
      {/* Product Image Placeholder */}
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-md"
        />
      ) : (
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-md flex items-center justify-center">
          <span className="text-2xl">📦</span>
        </div>
      )}

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
          {item.name}
        </h3>
        {item.category && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
        )}
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
          ${item.price.toFixed(2)} each
        </p>
      </div>

      {/* Quantity Control */}
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onQuantityChange(item.quantity - 1)}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={isLoading}
        >
          −
        </Button>
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value) && value > 0) {
              onQuantityChange(value);
            }
          }}
          className="w-12 text-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <Button
          onClick={() => onQuantityChange(item.quantity + 1)}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={isLoading}
        >
          +
        </Button>
      </div>

      {/* Total Price */}
      <div className="text-right min-w-fit">
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          ${itemTotal.toFixed(2)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {item.quantity} × ${item.price.toFixed(2)}
        </p>
      </div>

      {/* Remove Button */}
      <Button
        onClick={onRemove}
        variant="ghost"
        size="sm"
        className="ml-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        disabled={isLoading}
      >
        ✕
      </Button>
    </div>
  );
};
