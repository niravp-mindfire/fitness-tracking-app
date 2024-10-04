import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { RootState } from '../../app/store';
import { MealPlanState, MealPlan } from '../../utils/types';
import { apiUrl } from '../../utils/apiUrl';

// Initial state
const initialState: MealPlanState = {
  mealPlans: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentMealPlan: null,
  page: 0,
  limit: 0,
  sort: 'date',  // Default sort field
  order: 'desc', // Default order
  search: ''
};

// Async thunk for fetching meal plans with sorting, pagination, and searching
export const fetchMealPlans = createAsyncThunk<{
  mealPlans: MealPlan[], totalCount: number;
}, { page: number; limit: number; search?: string; sort?: string; order?: 'asc' | 'desc' }, { rejectValue: string }>(
  'mealPlan/fetchMealPlans',
  async ({ page, limit, search = '', sort = 'date', order = 'desc' }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrl.MEAL_PLANS, {
        params: { page, limit, search, sort, order },
      });
      return {
        mealPlans: response?.data?.data?.mealPlans,
        totalCount: response?.data?.data?.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch meal plans');
    }
  }
);

// Async thunk for fetching a meal plan by ID
export const fetchMealPlanById = createAsyncThunk<MealPlan, string, { rejectValue: string }>(
  'mealPlan/fetchMealPlanById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl.MEAL_PLANS}/${id}`);
      if (response.status === 200) {
        return response.data.data; 
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch meal plan');
    }
  }
);

// Async thunk for creating a meal plan
export const createMealPlan = createAsyncThunk<MealPlan, MealPlan, { rejectValue: string }>(
  'mealPlan/createMealPlan',
  async (mealPlan, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(apiUrl.MEAL_PLANS, mealPlan);
      return response.data.data; // Adjust according to your API response structure
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create meal plan');
    }
  }
);

// Async thunk for updating a meal plan
export const updateMealPlan = createAsyncThunk<MealPlan, { id: string; mealPlan: MealPlan }, { rejectValue: string }>(
  'mealPlan/updateMealPlan',
  async ({ id, mealPlan }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${apiUrl.MEAL_PLANS}/${id}`, mealPlan);
      return response.data.data; // Adjust according to your API response structure
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update meal plan');
    }
  }
);

// Async thunk for deleting a meal plan
export const deleteMealPlan = createAsyncThunk<string, string, { rejectValue: string }>(
  'mealPlan/deleteMealPlan',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${apiUrl.MEAL_PLANS}/${id}`);
      return id; // Return the deleted id for further processing
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete meal plan');
    }
  }
);

// Slice definition
const mealPlanSlice = createSlice({
  name: 'mealPlan',
  initialState,
  reducers: {
    updateSort(state, action: PayloadAction<string>) {
      // Toggle the order if the same field is clicked
      if (state.sort === action.payload) {
        state.order = state.order === 'asc' ? 'desc' : 'asc';
      } else {
        state.sort = action.payload;
        state.order = 'asc'; // Reset to asc for new field
      }
    },
    resetCurrentMealPlan(state, action) {
      state.currentMealPlan = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMealPlans.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMealPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.mealPlans = action.payload.mealPlans;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchMealPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMealPlanById.fulfilled, (state, action) => {
        state.currentMealPlan = action.payload;
      })
      .addCase(fetchMealPlanById.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// Export actions and selectors
export const { updateSort, resetCurrentMealPlan } = mealPlanSlice.actions;
export const selectAllMealPlans = (state: RootState) => state.mealPlan.mealPlans;
export const selectMealPlanLoading = (state: RootState) => state.mealPlan.loading;
export const selectTotalMealPlans = (state: RootState) => state.mealPlan.totalCount;
export const selectMealPlanError = (state: RootState) => state.mealPlan.error; 
// Export reducer
export default mealPlanSlice.reducer;

// Selector to get a meal plan by ID
export const selectMealPlanById = (state: RootState, mealPlanId: string) => {
  return state.mealPlan.mealPlans.find((mealPlan: any) => mealPlan._id === mealPlanId);
};
