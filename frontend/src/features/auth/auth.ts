// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axiosInstance from '../../utils/axiosInstance';
import { AuthState } from '../../utils/types';
import { apiUrl } from '../../utils/apiUrl';

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  token: localStorage.getItem('token') ? localStorage.getItem('token') : null,
  role: localStorage.getItem('role') ? localStorage.getItem('role') : null,
};

// Async thunk for user registration
export const registerUser = createAsyncThunk<
  { token: string },
  { username: string; email: string; password: string; profile: any },
  { rejectValue: string }
>('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(apiUrl.REGISTER, userData);
    return response.data; // Return response data on success
  } catch (error: any) {
    return rejectWithValue(
      error.response.data.message || 'Registration failed',
    ); // Handle errors
  }
});

// Async thunk for user login
export const loginUser = createAsyncThunk<
  { token: string },
  { email: string; password: string },
  { rejectValue: string }
>('auth/loginUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(apiUrl.LOGIN, userData);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data.message || 'Login failed');
  }
});

export const forgetPassword = createAsyncThunk(
  'auth/forgetPassword',
  async (values: { email: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(apiUrl.FORGET_PASSWORD, values);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || 'Login failed');
    }
  },
);

// Slice for authentication
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
    // Action to set authenticated state based on token
    initializeAuth: (state, action: PayloadAction<{ token: string }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(
        registerUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || 'Registration failed';
        },
      )
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action?.payload?.token;
        localStorage.setItem('token', action?.payload?.token);
        localStorage.setItem('role', action?.payload?.role);
        state.error = null;
      })
      .addCase(
        loginUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || 'Login failed';
        },
      )
      .addCase(forgetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '';
      });
  },
});

// Export the actions and reducer
export const { logout, initializeAuth } = authSlice.actions;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthToken = (state: RootState) => state.auth.token;

export default authSlice.reducer;
