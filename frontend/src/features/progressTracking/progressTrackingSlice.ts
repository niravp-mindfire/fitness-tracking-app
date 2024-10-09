import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { RootState } from '../../app/store';
import { ProgressTracking, ProgressTrackingState } from '../../utils/types';
import { apiUrl } from '../../utils/apiUrl';

// Initial state
const initialState: ProgressTrackingState = {
  progressTrackings: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentProgressTracking: null,
  page: 0,
  limit: 0,
  sort: 'createdAt',
  order: 'desc',
  search: ''
};

// Async thunk for fetching progress trackings with sorting, pagination, and searching
export const fetchProgressTrackings = createAsyncThunk<{
  progressTrackings: ProgressTracking[];
  totalCount: number;
}, { page: number; limit: number; search?: string; sort?: string; order?: 'asc' | 'desc' }, { rejectValue: string }>(
  'progressTrackings/fetchProgressTrackings',
  async ({ page, limit, search = '', sort = 'createdAt', order = 'asc' }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrl.PROGRESS_TRACKINGS, {
        params: { page, limit, search, sort, order },
      });
      if (response.status === 200) {
        console.log(response.data);
        
        return {
          progressTrackings: response.data.progressTracking,
          totalCount: response.data.total,
        };
      } else {
        return {
          progressTrackings: [],
          totalCount: 0,
        };
      }
    } catch (error: any) {
      console.log(error);
      
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch progress trackings');
    }
  }
);

// Async thunk for fetching a single progress tracking by ID
export const fetchProgressTrackingById = createAsyncThunk<ProgressTracking, string, { rejectValue: string }>(
  'progressTrackings/fetchProgressTrackingById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl.PROGRESS_TRACKINGS}/${id}`);
      if (response.status === 200) {
        return response.data.data;
      }
      throw new Error('Failed to fetch progress tracking');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch progress tracking');
    }
  }
);

// Async thunk for creating a progress tracking
export const createProgressTracking = createAsyncThunk<ProgressTracking, Omit<ProgressTracking, '_id' | 'createdAt'>, { rejectValue: string }>(
  'progressTrackings/createProgressTracking',
  async (tracking, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(apiUrl.PROGRESS_TRACKINGS, tracking);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create progress tracking');
    }
  }
);

// Async thunk for updating a progress tracking
export const updateProgressTracking = createAsyncThunk<ProgressTracking, { id: string; tracking: Omit<ProgressTracking, '_id' | 'createdAt'> }, { rejectValue: string }>(
  'progressTrackings/updateProgressTracking',
  async ({ id, tracking }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${apiUrl.PROGRESS_TRACKINGS}/${id}`, tracking);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update progress tracking');
    }
  }
);

// Async thunk for deleting a progress tracking
export const deleteProgressTracking = createAsyncThunk<string, string, { rejectValue: string }>(
  'progressTrackings/deleteProgressTracking',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${apiUrl.PROGRESS_TRACKINGS}/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete progress tracking');
    }
  }
);

// Slice definition
const progressTrackingSlice = createSlice({
  name: 'progressTracking',
  initialState,
  reducers: {
    resetCurrentProgressTracking(state) {
      state.currentProgressTracking = null;
    },
    updateSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgressTrackings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProgressTrackings.fulfilled, (state, action) => {
        state.loading = false;
        state.progressTrackings = action.payload.progressTrackings;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchProgressTrackings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProgressTrackingById.fulfilled, (state, action) => {
        state.currentProgressTracking = action.payload;
      })
      .addCase(createProgressTracking.fulfilled, (state, action) => {
        state.progressTrackings.push(action.payload);
      })
      .addCase(updateProgressTracking.fulfilled, (state, action) => {
        const index = state.progressTrackings.findIndex((tracking) => tracking._id === action.payload._id);
        if (index !== -1) {
          state.progressTrackings[index] = action.payload;
        }
      })
      .addCase(deleteProgressTracking.fulfilled, (state, action) => {
        state.progressTrackings = state.progressTrackings.filter((tracking) => tracking._id !== action.payload);
      });
  },
});

// Export actions and selectors
export const { resetCurrentProgressTracking, updateSearch } = progressTrackingSlice.actions;

export const selectAllProgressTrackings = (state: RootState) => state.progressTracking.progressTrackings;
export const selectProgressTrackingLoading = (state: RootState) => state.progressTracking.loading;
export const selectTotalProgressTrackings = (state: RootState) => state.progressTracking.totalCount;
export const selectCurrentProgressTracking = (state: RootState) => state.progressTracking.currentProgressTracking;
export const selectProgressTrackingError = (state: RootState) => state.progressTracking.error;

// Export reducer
export default progressTrackingSlice.reducer;
