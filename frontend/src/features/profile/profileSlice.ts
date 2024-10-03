import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { ProfileFormValues } from '../../utils/types';
import { apiUrl } from '../../utils/apiUrl';

// Define the initial state type
interface ProfileState {
  data: ProfileFormValues | null;
  loading: boolean;
  error: string | null;
  users: Array<any>
}

// Async thunk to update user profile
export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (profileData: ProfileFormValues, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(apiUrl.UPDATE_PROFILE, profileData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  'profile/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrl.ALL_USERS);
      return response.data.data;
    } catch(error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrl.MY_PROFILE);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    loading: false,
    error: null,
    users: []
  } as ProfileState, // Use the defined state type
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data; // Store fetched profile data
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload as any
      });

  },
});

export default profileSlice.reducer;
