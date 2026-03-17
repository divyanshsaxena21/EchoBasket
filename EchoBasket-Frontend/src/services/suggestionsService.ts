// src/services/suggestionsService.ts

import { apiClient } from './api';
import { API_ENDPOINTS } from '@/lib/constants';
import { Recommendation, SuggestionsResponse, CartItem } from '@/types';

export const suggestionsService = {
  /**
   * Get AI-powered product recommendations based on cart contents
   */
  async getRecommendations(cartItems: CartItem[]): Promise<Recommendation[]> {
    try {
      // If cart is empty, return empty recommendations
      if (cartItems.length === 0) {
        return [];
      }

      const response = await apiClient.get<SuggestionsResponse>(
        API_ENDPOINTS.RECOMMENDATIONS,
        {
          params: {
            // Pass cart items as query parameters or in request body
            items: cartItems.map((item) => item.id).join(','),
          },
        },
      );

      if (response.data.success) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      throw error;
    }
  },

  /**
   * Get recommendations with POST request (alternative implementation)
   */
  async getRecommendationsPost(cartItems: CartItem[]): Promise<Recommendation[]> {
    try {
      if (cartItems.length === 0) {
        return [];
      }

      const response = await apiClient.post<SuggestionsResponse>(
        API_ENDPOINTS.RECOMMENDATIONS,
        {
          cartItems,
        },
      );

      if (response.data.success) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      throw error;
    }
  },
};
