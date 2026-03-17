// src/lib/mockApiIntegration.ts

import { AxiosInstance } from 'axios';
import { mockCartHandlers, mockSuggestionsHandlers } from '@/mocks/mockHandlers';
import { API_ENDPOINTS } from './constants';

/**
 * Integrate mock handlers with axios
 * Call this in development when backend is not available
 */
export const enableMockApi = (axiosInstance: AxiosInstance) => {
  // Mock cart endpoints
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config;

      // Intercept cart endpoints
      if (config.url?.includes('/cart')) {
        // GET /cart
        if (config.method === 'get' && config.url === API_ENDPOINTS.CART.GET) {
          return {
            data: mockCartHandlers.getCart(),
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          };
        }

        // POST /cart/add
        if (config.method === 'post' && config.url === API_ENDPOINTS.CART.ADD) {
          const { product, quantity } = config.data;
          return {
            data: mockCartHandlers.addToCart(product, quantity),
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          };
        }

        // DELETE /cart/remove
        if (config.method === 'delete' && config.url === API_ENDPOINTS.CART.REMOVE) {
          const { productId } = config.data;
          return {
            data: mockCartHandlers.removeFromCart(productId),
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          };
        }
      }

      // Intercept recommendations endpoint
      if (config.url?.includes('/recommendations')) {
        if (config.method === 'get') {
          const itemIds = config.params?.items?.split(',') || [];
          return {
            data: mockSuggestionsHandlers.getRecommendations([]),
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          };
        }
      }

      return Promise.reject(error);
    },
  );
};

/**
 * Check if backend is available
 */
export const checkBackendAvailability = async (
  baseUrl: string,
): Promise<boolean> => {
  try {
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      mode: 'cors',
    });
    return response.ok;
  } catch {
    return false;
  }
};
