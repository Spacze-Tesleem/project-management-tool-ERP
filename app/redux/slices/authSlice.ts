// app/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  role: "admin" | "staff";
  name?: string;
  avatar?: string;
  createdAt?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    login: (
      state,
      action: PayloadAction<{
        email: string;
        role: "admin" | "staff";
        user: User;
      }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.loading = false;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.loading = false;
      state.error = null;
      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    updateToken: (
      state,
      action: PayloadAction<{ token: string; refreshToken?: string }>
    ) => {
      state.token = action.payload.token;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    initializeAuth: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
  },
});

export const {
  loginStart,
  login,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  updateToken,
  updateUser,
  initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;
