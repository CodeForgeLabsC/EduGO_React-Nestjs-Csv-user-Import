export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
}

export interface CsvRowError {
  rowNumber: number;
  error: string;
  data?: Record<string, string>;
}

export interface CsvImportResult {
  totalRows: number;
  successCount: number;
  failureCount: number;
  createdUsers: User[];
  errors: CsvRowError[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
