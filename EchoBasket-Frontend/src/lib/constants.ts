// src/lib/constants.ts

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    REMOVE: '/cart/remove',
  },
  RECOMMENDATIONS: '/recommendations',
} as const;

export const QUERY_KEYS = {
  CART: ['cart'] as const,
  RECOMMENDATIONS: ['recommendations'] as const,
  CART_ITEMS: ['cart', 'items'] as const,
} as const;

export const TOAST_DURATION = 3000;

export const VOICE_LANGUAGE = 'en-US';

export const DEBOUNCE_DELAY = 300;

export const CACHE_TIME = {
  RECOMMENDATIONS: 5 * 60 * 1000, // 5 minutes
  CART: 1 * 60 * 1000, // 1 minute
} as const;

export const STALE_TIME = {
  RECOMMENDATIONS: 2 * 60 * 1000, // 2 minutes
  CART: 30 * 1000, // 30 seconds
} as const;

export const UI = {
  DEBOUNCE_MS: 300,
  ANIMATION_DURATION: 300,
} as const;
