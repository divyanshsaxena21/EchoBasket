// src/components/suggestions/SuggestionCard.tsx

'use client';

import React from 'react';
import { Recommendation } from '@/types';
import { Button } from '@/components/common/Button';

interface SuggestionCardProps {
  suggestion: Recommendation;
  onAddToCart: (quantity: number) => void;
  isLoading?: boolean;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  onAddToCart,
  isLoading = false,
}) => {
  const [quantity, setQuantity] = React.useState(1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Product Image */}
      {suggestion.image ? (
        <img
          src={suggestion.image}
          alt={suggestion.name}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
          <span className="text-5xl">✨</span>
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title and Category */}
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
          {suggestion.name}
        </h3>
        {suggestion.category && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {suggestion.category}
          </p>
        )}

        {/* Description */}
        {suggestion.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {suggestion.description}
          </p>
        )}

        {/* Reason Tag */}
        {suggestion.reason && (
          <div className="inline-flex items-center gap-1 mb-3 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs w-fit">
            <span>💡</span>
            <span className="line-clamp-1">{suggestion.reason}</span>
          </div>
        )}

        {/* Price and Relevance */}
        <div className="flex items-baseline gap-2 mb-4 mt-auto">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ${suggestion.price.toFixed(2)}
          </span>
          {suggestion.relevance && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <span className="w-1 h-1 bg-blue-500 rounded-full" />
              {Math.round(suggestion.relevance * 100)}% match
            </div>
          )}
        </div>

        {/* Quantity Selector and Add Button */}
        <div className="flex gap-2">
          <select
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {[1, 2, 3, 4, 5].map((q) => (
              <option key={q} value={q}>
                {q}x
              </option>
            ))}
          </select>
          <Button
            onClick={() => onAddToCart(quantity)}
            variant="primary"
            size="sm"
            className="flex-1"
            isLoading={isLoading}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};
