// src/app/page.tsx

'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { VoiceInput } from '@/components/voice/VoiceInput';
import { CartPanel } from '@/components/cart/CartPanel';
import { SuggestionsPanel } from '@/components/suggestions/SuggestionsPanel';

export default function Home() {
  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Voice Input and Suggestions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Voice Input Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                🎤 Voice Shopping
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use voice input or type to add items to your cart
              </p>
            </div>
            <VoiceInput />
          </section>

          {/* Recommendations Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <SuggestionsPanel />
          </section>
        </div>

        {/* Right Column - Cart */}
        <div>
          <div className="sticky top-32 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Shopping Cart
              </h2>
            </div>
            <CartPanel
              onCheckout={() => {
                alert('Checkout functionality would be implemented here');
              }}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
