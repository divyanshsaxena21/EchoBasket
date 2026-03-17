// src/components/layout/Header.tsx

'use client';

import React from 'react';
import { useCart } from '@/hooks/useCart';
import { useAppStore } from '@/store/appStore';
import { Button } from '@/components/common/Button';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { itemCount } = useCart();
  const { toggleDarkMode, darkMode } = useAppStore();

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎧</span>
              <div className="flex flex-col">
                <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EchoBasket
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Smart Shopping
                </span>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Cart Badge */}
            <div className="relative">
              <Button
                variant="ghost"
                size="md"
                className="relative"
              >
                🛒
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Dark Mode Toggle */}
            <Button
              onClick={toggleDarkMode}
              variant="ghost"
              size="md"
              className="text-lg"
            >
              {darkMode ? '☀️' : '🌙'}
            </Button>

            {/* Help Button */}
            <Button
              variant="secondary"
              size="sm"
              className="hidden sm:inline-flex"
            >
              Help
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
