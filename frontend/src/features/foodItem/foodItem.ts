import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { apiUrl } from '../../utils/apiUrl';

interface FoodItem {
  _id: string;
  name: string;
  calories: number;
  macronutrients: {
    proteins: number;
    carbohydrates: number;
    fats: number;
  }
}

interface FoodItemState {
  foodItems: FoodItem[];
  currentFoodItem: FoodItem | null;
  loading: boolean;
  error: string | null;
  totalCount: number; 
}

const initialState: FoodItemState = {
  foodItems: [],
  currentFoodItem: null,
  loading: false,
  error: null,
  totalCount: 0,
};

// Thunks for fetching, adding, updating, and deleting food items
export const fetchFoodItems = createAsyncThunk(
  'foodItems/fetchFoodItems',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl.FOOD_ITEMS}`, { params });
      return {
        foodItems: response.data.data.foodItems,
        totalCount: response.data.data.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchFoodItemById = createAsyncThunk(
  'foodItems/fetchFoodItemById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl.FOOD_ITEMS}/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createFoodItem = createAsyncThunk(
  'foodItems/createFoodItem',
  async (foodItemData: FoodItem, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${apiUrl.FOOD_ITEMS}`, foodItemData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateFoodItem = createAsyncThunk(
  'foodItems/updateFoodItem',
  async ({ id, foodItemData }: { id: string; foodItemData: FoodItem }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${apiUrl.FOOD_ITEMS}/${id}`, foodItemData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteFoodItem = createAsyncThunk(
  'foodItems/deleteFoodItem',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${apiUrl.FOOD_ITEMS}/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const foodItemSlice = createSlice({
  name: 'foodItem',
  initialState,
  reducers: {
    resetCurrentFoodItem: (state) => {
      state.currentFoodItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFoodItems.pending, (state) => {
        state.loading = true;
        state.error = null;  // Reset error on new fetch
      })
      .addCase(fetchFoodItems.fulfilled, (state, action) => {
        state.loading = false;
        state.foodItems = action.payload.foodItems;
        state.totalCount = action.payload.totalCount;  // Update totalCount
      })
      .addCase(fetchFoodItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;  // Set error message
      })
      .addCase(fetchFoodItemById.fulfilled, (state, action) => {
        state.currentFoodItem = action.payload;
      });
  },
});

export const { resetCurrentFoodItem } = foodItemSlice.actions;

export default foodItemSlice.reducer;
