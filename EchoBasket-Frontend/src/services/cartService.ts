// src/services/cartService.ts

import { apiClient } from './api';
import { API_ENDPOINTS } from '@/lib/constants';
import {
  Cart,
  CartItem,
  AddToCartRequest,
  AddToCartResponse,
  RemoveFromCartRequest,
  RemoveFromCartResponse,
  CartResponse,
  Product,
} from '@/types';

export const cartService = {
  /**
   * Get current cart from server
   */
  async getCart(): Promise<Cart> {
    const response = await apiClient.get<CartResponse>(API_ENDPOINTS.CART.GET);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch cart');
  },

  /**
   * Add item to cart
   */
  async addItem(product: Product, quantity: number = 1): Promise<Cart> {
    const payload: AddToCartRequest = { product, quantity };
    const response = await apiClient.post<AddToCartResponse>(
      API_ENDPOINTS.CART.ADD,
      payload,
    );

    if (response.data.success) {
      return response.data.cart;
    }
    throw new Error(response.data.message || 'Failed to add item');
  },

  /**
   * Remove item from cart
   */
  async removeItem(productId: string): Promise<Cart> {
    const payload: RemoveFromCartRequest = { productId };
    const response = await apiClient.delete<RemoveFromCartResponse>(
      API_ENDPOINTS.CART.REMOVE,
      { data: payload },
    );

    if (response.data.success) {
      return response.data.cart;
    }
    throw new Error('Failed to remove item');
  },

  /**
   * Update item quantity (uses add endpoint with new quantity)
   * Note: Adjust based on actual backend implementation
   */
  async updateQuantity(product: CartItem, newQuantity: number): Promise<Cart> {
    if (newQuantity <= 0) {
      return this.removeItem(product.id);
    }

    // Calculate difference and add
    const quantityDiff = newQuantity - product.quantity;
    return this.addItem(product, quantityDiff);
  },

  /**
   * Sync cart with server state
   */
  async syncCart(localCart: CartItem[]): Promise<Cart> {
    // This endpoint might not exist, adjust based on your API
    try {
      return await this.getCart();
    } catch (error) {
      console.error('Failed to sync cart:', error);
      throw error;
    }
  },
};
