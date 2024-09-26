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
  token: null,
};

// Async thunk for user registration
export const registerUser = createAsyncThunk<
  { token: string }, // The type of the return value on success
  { username: string; email: string; password: string; profile: any }, // The type of the argument to the thunk
  { rejectValue: string } // The type of the value returned if the thunk is rejected
>(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(apiUrl.REGISTER, userData);
      return response.data; // Return response data on success
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || 'Registration failed'); // Handle errors
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk<
  { token: string }, // The type of the return value on success
  { email: string; password: string }, // The type of the argument to the thunk
  { rejectValue: string } // The type of the value returned if the thunk is rejected
>(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(apiUrl.LOGIN, userData);
      return response.data.data; // Adjust based on your API response structure
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || 'Login failed'); // Handle errors
    }
  }
);

export const forgetPassword = createAsyncThunk(
  'auth/forgetPassword',
  async (values: { email: string }, { rejectWithValue }) => {
    try {
    const response = await axiosInstance.post(apiUrl.FORGET_PASSWORD, values);
    return response.data.data; // Adjust based on your API response structure
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || 'Login failed'); // Handle errors
    }
  }
);

// Slice for authentication
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null; // Clear token on logout
      localStorage.removeItem('token'); // Remove token from local storage
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
        state.loading = true; // Set loading state when the request is initiated
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false; // Reset loading on success
        state.error = null; // Clear any existing errors
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false; // Reset loading on failure
        state.error = action.payload || 'Registration failed'; // Set error state
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true; // Set loading state when the request is initiated
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ token: string }>) => {
        state.loading = false; // Reset loading on success
        state.isAuthenticated = true; // Set authenticated state
        state.token = action.payload.token; // Store the token
        localStorage.setItem('token', action.payload.token); // Store token in local storage
        state.error = null; // Clear any existing errors
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false; // Reset loading on failure
        state.error = action.payload || 'Login failed'; // Set error state
      }).addCase(forgetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.loading = false;
        // Handle success, e.g. store user info
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || ""; // Capture error message
      });;
  },
});

// Export the actions and reducer
export const { logout, initializeAuth } = authSlice.actions; // Export both actions
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthToken = (state: RootState) => state.auth.token; // Selector for token

export default authSlice.reducer; // Default export of the reducer

