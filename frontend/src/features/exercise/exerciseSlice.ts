import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { RootState } from '../../app/store';
import { ExerciseState, Exercise } from '../../utils/types';
import { apiUrl } from '../../utils/apiUrl';

// Initial state
const initialState: ExerciseState = {
  exercises: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentExercise: null,
  page: 0,
  limit: 0,
  sort: 'name',  // Default sort field
  order: 'asc', // Default order
  search: ''
};

// Async thunk for fetching exercises
export const fetchExercises = createAsyncThunk<{
  exercises: Exercise[], totalCount: number;
}, { page: number; limit: number; search?: string; sort?: string; order?: 'asc' | 'desc', startDate?: string, endDate?: string }, { rejectValue: string }>(
  'exercise/fetchExercises',
  async ({ page, limit, search = '', sort = 'name', order = 'asc', startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrl.EXERCISES, {
        params: { page, limit, search, sort, order, startDate, endDate },
      });
      return {
        exercises: response?.data?.data?.exercises,
        totalCount: response?.data?.data?.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch exercises');
    }
  }
);

// Async thunk for fetching exercise by ID
export const fetchExerciseById = createAsyncThunk<Exercise, string, { rejectValue: string }>(
  'exercise/fetchExerciseById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl.EXERCISES}/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch exercise');
    }
  }
);

// Async thunk for creating an exercise
export const createExercise = createAsyncThunk<Exercise, Exercise, { rejectValue: string }>(
  'exercise/createExercise',
  async (exercise, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(apiUrl.EXERCISES, exercise);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create exercise');
    }
  }
);

// Async thunk for updating an exercise
export const updateExercise = createAsyncThunk<Exercise, { id: string; exercise: Exercise }, { rejectValue: string }>(
  'exercise/updateExercise',
  async ({ id, exercise }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${apiUrl.EXERCISES}/${id}`, exercise);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update exercise');
    }
  }
);

// Async thunk for deleting an exercise
export const deleteExercise = createAsyncThunk<string, string, { rejectValue: string }>(
  'exercise/deleteExercise',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${apiUrl.EXERCISES}/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete exercise');
    }
  }
);

// Slice definition
const exerciseSlice = createSlice({
  name: 'exercise',
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
    resetCurrentExercise(state) {
      state.currentExercise = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExercises.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExercises.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises = action.payload.exercises;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchExerciseById.fulfilled, (state, action) => {
        state.currentExercise = action.payload;
      })
      .addCase(fetchExerciseById.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { updateSort, resetCurrentExercise } = exerciseSlice.actions;
export const selectAllExercises = (state: RootState) => state.exercise.exercises;
export const selectExerciseLoading = (state: RootState) => state.exercise.loading;
export const selectTotalExercises = (state: RootState) => state.exercise.totalCount;

export default exerciseSlice.reducer;
