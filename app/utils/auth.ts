
import { store } from '../redux/store';
import { logout, initializeAuth } from '../redux/slices/authSlice';

// API base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Token management
export const getStoredToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const getStoredRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
};

export const setStoredTokens = (token: string, refreshToken: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }
};

export const clearStoredTokens = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
};

// API request helper with token handling
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getStoredToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle token expiration
    if (response.status === 401) {
      const refreshToken = getStoredRefreshToken();
      if (refreshToken) {
        const newTokens = await refreshTokens(refreshToken);
        if (newTokens) {
          // Retry original request with new token
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${newTokens.token}`,
          };
          return fetch(`${API_BASE_URL}${endpoint}`, config);
        }
      }
      // If refresh fails, logout user
      store.dispatch(logout());
      clearStoredTokens();
    }
    
    return response;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Refresh tokens
export const refreshTokens = async (refreshToken: string): Promise<{
  token: string;
  refreshToken: string;
} | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      setStoredTokens(data.token, data.refreshToken);
      return {
        token: data.token,
        refreshToken: data.refreshToken,
      };
    }
    return null;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
};

// Initialize auth from stored tokens
export const initializeAuthFromStorage = async (): Promise<void> => {
  const token = getStoredToken();
  const refreshToken = getStoredRefreshToken();

  if (token && refreshToken) {
    try {
      // Verify token by fetching user data
      const response = await apiRequest('/api/auth/me');
      
      if (response.ok) {
        const data = await response.json();
        store.dispatch(initializeAuth({
          user: data.user,
          token,
          refreshToken,
        }));
      } else {
        // Token invalid, clear storage
        clearStoredTokens();
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      clearStoredTokens();
    }
  }
};

// Logout function
export const performLogout = async (): Promise<void> => {
  const refreshToken = getStoredRefreshToken();
  
  try {
    if (refreshToken) {
      await apiRequest('/api/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    store.dispatch(logout());
    clearStoredTokens();
  }
};

// Check if user has specific role
export const hasRole = (requiredRole: string): boolean => {
  const state = store.getState();
  return state.auth.user?.role === requiredRole;
};

// Check if user is admin
export const isAdmin = (): boolean => {
  return hasRole('admin');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const state = store.getState();
  return state.auth.isAuthenticated;
};