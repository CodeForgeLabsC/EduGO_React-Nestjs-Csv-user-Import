import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type {
  CreateUserRequest,
  User,
  CsvImportResult,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const usersApi = {
  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  async importCsv(file: File): Promise<CsvImportResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<CsvImportResult>(
      '/users/import-csv',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },

  async exportUsersCsv(): Promise<void> {
    const response = await api.get('/users/export-csv', {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },

  getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      if (message) return message;

      if (error.response?.status === 409) {
        return 'Email already exists';
      }

      if (error.response?.status === 400) {
        return 'Invalid input data';
      }

      if (error.response?.status === 500) {
        return 'Server error. Please try again later.';
      }

      return error.message || 'An error occurred';
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unexpected error occurred';
  },
};

export default api;
