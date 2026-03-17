// src/services/api.ts

import axios, { AxiosError, AxiosInstance } from 'axios';
import { API_BASE_URL } from '@/lib/constants';
import { ApiError } from '@/types';

export const createApiClient = (baseURL: string = API_BASE_URL): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Add any auth tokens here if needed
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const apiError: ApiError = {
        message: error.message,
        status: error.response?.status,
        code: error.code,
      };

      if (error.response?.data && typeof error.response.data === 'object') {
        const data = error.response.data as any;
        apiError.message = data.message || error.message;
      }

      return Promise.reject(apiError);
    },
  );

  return client;
};

export const apiClient = createApiClient();
