import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { RootState } from '../../app/store';
import { NutritionState, Nutrition } from '../../utils/types';
import { apiUrl } from '../../utils/apiUrl';

// Initial state
const initialState: NutritionState = {
  nutritionEntries: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentNutrition: null,
  page: 0,
  limit: 0,
  sort: 'date',  // Default sort field
  order: 'desc', // Default order
  search: ''
};

// Async thunk for fetching nutrition entries with sorting, pagination, and searching
export const fetchNutritionEntries = createAsyncThunk<{
  nutritionEntries: Nutrition[], totalCount: number;
}, { page: number; limit: number; search?: string; sort?: string; order?: 'asc' | 'desc' }, { rejectValue: string }>(
  'nutrition/fetchNutritionEntries',
  async ({ page, limit, search = '', sort = 'date', order = 'desc' }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrl.NUTRITION, {
        params: { page, limit, search, sort, order },
      });
      if(response?.status === 200) {
        return {
            nutritionEntries: response?.data?.data?.nutritions,
            totalCount: response?.data?.data?.total,
        };
      } else {
        return {
            nutritionEntries: [],
            totalCount: 0,
        };
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch nutrition entries');
    }
  }
);

export const fetchNutritionById = createAsyncThunk<Nutrition, string, { rejectValue: string }>(
  'nutrition/fetchNutritionById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl.NUTRITION}/${id}`);
      if (response.status === 200) {
        return response.data.data;
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch nutrition entry');
    }
  }
);

// Async thunk for creating a nutrition entry
export const createNutrition = createAsyncThunk<Nutrition, Nutrition, { rejectValue: string }>(
  'nutrition/createNutrition',
  async (nutritionEntry, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(apiUrl.NUTRITION, nutritionEntry);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create nutrition entry');
    }
  }
);

// Async thunk for updating a nutrition entry
export const updateNutrition = createAsyncThunk<Nutrition, { id: string; nutritionEntry: Nutrition }, { rejectValue: string }>(
  'nutrition/updateNutrition',
  async ({ id, nutritionEntry }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${apiUrl.NUTRITION}/${id}`, nutritionEntry);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update nutrition entry');
    }
  }
);

// Async thunk for deleting a nutrition entry
export const deleteNutrition = createAsyncThunk<string, string, { rejectValue: string }>(
  'nutrition/deleteNutrition',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${apiUrl.NUTRITION}/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete nutrition entry');
    }
  }
);

// Slice definition
const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {
    updateSort(state, action: PayloadAction<string>) {
      if (state.sort === action.payload) {
        state.order = state.order === 'asc' ? 'desc' : 'asc';
      } else {
        state.sort = action.payload;
        state.order = 'asc';
      }
    },
    resetCurrentNutrition(state, action) {
      state.currentNutrition = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNutritionEntries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNutritionEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.nutritionEntries = action.payload.nutritionEntries;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchNutritionEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchNutritionById.fulfilled, (state, action) => {
        state.currentNutrition = action.payload;
      })
      .addCase(fetchNutritionById.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// Export actions and selectors
export const { updateSort, resetCurrentNutrition } = nutritionSlice.actions;
export const selectAllNutritionEntries = (state: RootState) => state.nutrition.nutritionEntries;
export const selectNutritionLoading = (state: RootState) => state.nutrition.loading;
export const selectTotalNutritionEntries = (state: RootState) => state.nutrition.totalCount;
export const selectNutritionById = (state: RootState) => {
  return state.nutrition.currentNutrition
};

// Export reducer
export default nutritionSlice.reducer;

// Selector to get a nutrition entry by ID
