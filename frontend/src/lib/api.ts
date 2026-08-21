import axios from 'axios';
import type { PredictionResponse, User, ScanHistoryItem, AuthTokens } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token to requests if present in localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('deepsentry_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to extract clean user-friendly error messages
export const getErrorMessage = (error: unknown, fallback: string = 'An unexpected error occurred.'): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.detail) {
      if (typeof data.detail === 'string') return data.detail;
      if (Array.isArray(data.detail) && data.detail[0]?.msg) return data.detail[0].msg;
    }
    if (error.response?.status === 401) return 'Invalid email or password. Please try again.';
    if (error.response?.status === 409) return 'An account with this email or username already exists.';
    if (error.response?.status === 422) return 'Please check your input fields and try again.';
    if (error.response?.status === 500) return 'Server is currently experiencing high load. Please try again.';
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
};

export const api = {
  // Deepfake Scan
  analyzeImage: async (file: File): Promise<PredictionResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<PredictionResponse>('/api/v1/predict/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Auth
  register: async (data: { email: string; username: string; password: string }): Promise<AuthTokens> => {
    const response = await apiClient.post<AuthTokens>('/api/v1/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }): Promise<AuthTokens> => {
    const response = await apiClient.post<AuthTokens>('/api/v1/auth/login', data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/v1/auth/me');
    return response.data;
  },

  // Scan History
  getHistory: async (): Promise<ScanHistoryItem[]> => {
    const response = await apiClient.get<ScanHistoryItem[]>('/api/v1/history/');
    return response.data;
  },

  deleteScan: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/api/v1/history/${id}`);
    return response.data;
  },

  // Health
  checkHealth: async (): Promise<{ status: string }> => {
    const response = await apiClient.get('/health');
    return response.data;
  }
};
