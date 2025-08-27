import type { AxiosInstance } from 'axios';
import axios from 'axios';

// This will be replaced by generated types from OpenAPI
export interface ApiClient {
  // Placeholder - will be generated from Swagger
}

// Base API client configuration
export const createApiClient = (baseURL: string = 'http://localhost:3001'): AxiosInstance => {
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });
};

// Default API client instance
export const apiClient = createApiClient();

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 