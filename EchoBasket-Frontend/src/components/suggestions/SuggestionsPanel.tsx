// src/components/suggestions/SuggestionsPanel.tsx

'use client';

import React from 'react';
import { useCart } from '@/hooks/useCart';
import { useSuggestions } from '@/hooks/useSuggestions';
import { SuggestionCard } from './SuggestionCard';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { ErrorState } from '@/components/common/ErrorState';

export const SuggestionsPanel: React.FC = () => {
  const { items } = useCart();
  const { suggestions, isLoading, error, refetch } = useSuggestions(items);

  if (!items.length) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">💼</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          No Recommendations Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Add items to your cart to get AI-powered suggestions
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recommended for You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonLoader count={4} height="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recommended for You
        </h2>
        <ErrorState
          title="Failed to Load Recommendations"
          message="Unable to fetch AI-powered suggestions at this time"
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!suggestions.length) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">🎯</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          No Suggestions Available
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adding different items to see recommendations
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recommended for You
        </h2>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          {suggestions.length} suggestions
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onAddToCart={(quantity) => {
              // This would be called from useCart hook in a real implementation
              console.log(`Adding ${quantity}x ${suggestion.name} to cart`);
            }}
          />
        ))}
      </div>
    </div>
  );
};
