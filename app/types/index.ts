// app/types/index.ts

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'staff';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  lastLogin?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: 'admin' | 'staff';
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
  refreshToken: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string;
  endDate?: string;
  assignedTo: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  progress: number;
  budget?: number;
  tags?: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}