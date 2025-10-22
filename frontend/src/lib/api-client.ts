import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';

// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - just log, don't redirect (routes are public by default)
      console.warn('401 Unauthorized:', error.config?.url);
      localStorage.removeItem('auth_token');
      // Don't redirect automatically - let components handle it
    }

    if (error.response?.status === 403) {
      // Forbidden - show error message
      console.error('Access forbidden');
    }

    return Promise.reject(error);
  }
);

// API response wrapper types
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

// Error types
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
} 