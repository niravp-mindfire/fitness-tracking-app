import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { RootState } from '../../app/store';
import { NutritionMealState, NutritionMeal } from '../../utils/types';
import { apiUrl } from '../../utils/apiUrl';

// Initial state
const initialState: NutritionMealState = {
    nutritionMeals: [],
    loading: false,
    error: null,
    totalCount: 0,
    currentNutritionMeal: null,
    page: 0,
    limit: 0,
    sort: 'createdAt',
    order: 'desc',
    search: ''
  };

// Async thunk for fetching nutrition meals with sorting, pagination, and searching
export const fetchNutritionMeals = createAsyncThunk<{
  nutritionMeals: NutritionMeal[];
  totalCount: number;
}, { page: number; limit: number; search?: string; sort?: string; order?: 'asc' | 'desc' }, { rejectValue: string }>(
  'nutritionMeals/fetchNutritionMeals',
  async ({ page, limit, search = '', sort = 'mealName', order = 'asc' }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrl.NUTRITION_MEALS, {
        params: { page, limit, search, sort, order },
      });
      if (response.status === 200) {
        return {
          nutritionMeals: response.data.data.nutritionMeals,
          totalCount: response.data.data.total,
        };
      } else {
        return {
          nutritionMeals: [],
          totalCount: 0
        }
      }
      return { nutritionMeals: [], totalCount: 0 };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch nutrition meals');
    }
  }
);

// Async thunk for fetching a single nutrition meal by ID
export const fetchNutritionMealById = createAsyncThunk<NutritionMeal, string, { rejectValue: string }>(
  'nutritionMeals/fetchNutritionMealById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl.NUTRITION_MEALS}/${id}`);
      if (response.status === 200) {
        return response.data.data;
      }
      throw new Error('Failed to fetch nutrition meal');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch nutrition meal');
    }
  }
);

// Async thunk for creating a nutrition meal
export const createNutritionMeal = createAsyncThunk<NutritionMeal, NutritionMeal, { rejectValue: string }>(
  'nutritionMeals/createNutritionMeal',
  async (nutritionMeal, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(apiUrl.NUTRITION_MEALS, nutritionMeal);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create nutrition meal');
    }
  }
);

// Async thunk for updating a nutrition meal
export const updateNutritionMeal = createAsyncThunk<NutritionMeal, { id: string; nutritionMeal: NutritionMeal }, { rejectValue: string }>(
  'nutritionMeals/updateNutritionMeal',
  async ({ id, nutritionMeal }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${apiUrl.NUTRITION_MEALS}/${id}`, nutritionMeal);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update nutrition meal');
    }
  }
);

// Async thunk for deleting a nutrition meal
export const deleteNutritionMeal = createAsyncThunk<string, string, { rejectValue: string }>(
  'nutritionMeals/deleteNutritionMeal',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${apiUrl.NUTRITION_MEALS}/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete nutrition meal');
    }
  }
);

// Slice definition
const nutritionMealSlice = createSlice({
  name: 'nutritionMeal',
  initialState,
  reducers: {
    resetCurrentNutritionMeal(state) {
      state.currentNutritionMeal = null;
    },
    updateSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNutritionMeals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNutritionMeals.fulfilled, (state, action) => {
        state.loading = false;
        state.nutritionMeals = action.payload.nutritionMeals;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchNutritionMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchNutritionMealById.fulfilled, (state, action) => {
        state.currentNutritionMeal = action.payload;
      })
      .addCase(createNutritionMeal.fulfilled, (state, action) => {
        state.nutritionMeals.push(action.payload);
      })
      .addCase(updateNutritionMeal.fulfilled, (state, action) => {
        const index = state.nutritionMeals.findIndex((meal: any) => meal._id === action.payload._id);
        if (index !== -1) {
          state.nutritionMeals[index] = action.payload;
        }
      })
      .addCase(deleteNutritionMeal.fulfilled, (state, action) => {
        state.nutritionMeals = state.nutritionMeals.filter((meal: any) => meal._id !== action.payload);
      });
  },
});

// Export actions and selectors
export const { resetCurrentNutritionMeal, updateSearch } = nutritionMealSlice.actions;

export const selectAllNutritionMeals = (state: RootState) => state.nutritionMeal.nutritionMeals;
export const selectNutritionMealLoading = (state: RootState) => state.nutritionMeal.loading;
export const selectTotalNutritionMeals = (state: RootState) => state.nutritionMeal.totalCount;
export const selectCurrentNutritionMeal = (state: RootState) => state.nutritionMeal.currentNutritionMeal;
export const selectNutritionMealError = (state: RootState) => state.nutritionMeal.error

// Export reducer
export default nutritionMealSlice.reducer;
