// src/types/index.ts

/**
 * Cart and Product Types
 */
export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

/**
 * API Request/Response Types
 */
export interface AddToCartRequest {
  product: Product;
  quantity: number;
}

export interface AddToCartResponse {
  success: boolean;
  cart: Cart;
  message?: string;
}

export interface RemoveFromCartRequest {
  productId: string;
}

export interface RemoveFromCartResponse {
  success: boolean;
  cart: Cart;
}

export interface CartResponse {
  success: boolean;
  data: Cart;
}

/**
 * Recommendations Types
 */
export interface Recommendation extends Product {
  relevance?: number;
  reason?: string;
}

export interface SuggestionsResponse {
  success: boolean;
  data: Recommendation[];
}

/**
 * Voice Input Types
 */
export interface VoiceInputResult {
  text: string;
  confidence?: number;
  isFinal: boolean;
}

/**
 * Toast/Notification Types
 */
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

/**
 * API Error Type
 */
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * Voice Recognition Event Types
 */
export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  isFinal: boolean;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}
