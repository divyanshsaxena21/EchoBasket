// src/hooks/useToast.ts

import { useCallback } from 'react';

interface ToastOptions {
  duration?: number;
}

export const useToast = () => {
  const show = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', options?: ToastOptions) => {
    // This is a placeholder for integration with a toast library like react-hot-toast
    // In production, replace with:
    // toast[type](message, { duration: options?.duration || 3000 });

    console.log(`[${type.toUpperCase()}] ${message}`);

    // For now, we'll emit custom events for testing
    const event = new CustomEvent('app:toast', {
      detail: { message, type, duration: options?.duration || 3000 },
    });
    window.dispatchEvent(event);
  }, []);

  const success = useCallback((message: string, options?: ToastOptions) => {
    show(message, 'success', options);
  }, [show]);

  const error = useCallback((message: string, options?: ToastOptions) => {
    show(message, 'error', options);
  }, [show]);

  const info = useCallback((message: string, options?: ToastOptions) => {
    show(message, 'info', options);
  }, [show]);

  const warning = useCallback((message: string, options?: ToastOptions) => {
    show(message, 'warning', options);
  }, [show]);

  return { show, success, error, info, warning };
};
