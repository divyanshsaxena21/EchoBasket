// src/components/layout/Sidebar.tsx

'use client';

import React from 'react';
import { useAppStore } from '@/store/appStore';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/common/Button';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { setSidebarOpen } = useAppStore();
  const { itemCount, total } = useCart();

  const handleNavClick = (section: string) => {
    console.log(`Navigating to ${section}`);
    onClose?.();
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto flex flex-col p-6">
          {/* Close Button (Mobile) */}
          <button
            onClick={onClose}
            className="lg:hidden self-end mb-4 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            ✕
          </button>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            <button
              onClick={() => handleNavClick('home')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              🏠 Dashboard
            </button>
            <button
              onClick={() => handleNavClick('cart')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              🛒 Cart ({itemCount})
            </button>
            <button
              onClick={() => handleNavClick('history')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              📜 History
            </button>
            <button
              onClick={() => handleNavClick('settings')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              ⚙️ Settings
            </button>
          </nav>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

          {/* Cart Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Cart Total</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ${total.toFixed(2)}
            </p>
          </div>

          {/* Help */}
          <div className="text-center space-y-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Need help? Try saying "add apples to my cart"
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
            >
              View Guide
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
