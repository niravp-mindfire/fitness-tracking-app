import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { RootState } from '../../app/store';
import { WorkoutState, Workout } from '../../utils/types';
import { apiUrl } from '../../utils/apiUrl';

// Initial state
const initialState: WorkoutState = {
  workouts: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentWorkout: null,
  page: 0,
  limit: 0,
  sort: 'date',  // Default sort field
  order: 'desc', // Default order
  search: ''
};

// Async thunk for fetching workouts with sorting, pagination, and searching
export const fetchWorkouts = createAsyncThunk<{
  workouts: Workout[], totalCount: number;
}, { page: number; limit: number; search?: string; sort?: string; order?: 'asc' | 'desc' }, { rejectValue: string }>(
  'workout/fetchWorkouts',
  async ({ page, limit, search = '', sort = 'date', order = 'desc' }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrl.WORKOUTS, {
        params: { page, limit, search, sort, order },
      });
      return {
        workouts: response?.data?.data?.workouts,
        totalCount: response?.data?.data?.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workouts');
    }
  }
);

export const fetchWorkoutById = createAsyncThunk<Workout, string, { rejectValue: string }>(
  'workout/fetchWorkoutById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl.WORKOUTS}/${id}`);
      console.log(response);
      if(response.status === 200) {
        return response.data.data; 
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workout');
    }
  }
);

// Async thunk for creating a workout
export const createWorkout = createAsyncThunk<Workout, Workout, { rejectValue: string }>(
  'workout/createWorkout',
  async (workout, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(apiUrl.WORKOUTS, workout);
      return response.data.data; // Adjust according to your API response structure
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create workout');
    }
  }
);

// Async thunk for updating a workout
export const updateWorkout = createAsyncThunk<Workout, { id: string; workout: Workout }, { rejectValue: string }>(
  'workout/updateWorkout',
  async ({ id, workout }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${apiUrl.WORKOUTS}/${id}`, workout);
      return response.data.data; // Adjust according to your API response structure
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update workout');
    }
  }
);

// Async thunk for deleting a workout
export const deleteWorkout = createAsyncThunk<string, string, { rejectValue: string }>(
  'workout/deleteWorkout',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${apiUrl.WORKOUTS}/${id}`);
      return id; // Return the deleted id for further processing
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete workout');
    }
  }
);

// Slice definition
const workoutSlice = createSlice({
  name: 'workout',
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
    resetCurrentWorkout(state, action) {
      state.currentWorkout = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkouts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkouts.fulfilled, (state, action) => {
        state.loading = false;
        state.workouts = action.payload.workouts;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchWorkouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      }).addCase(fetchWorkoutById.fulfilled, (state, action) => {
        state.currentWorkout = action.payload;
      })
      .addCase(fetchWorkoutById.rejected, (state, action) => {
        state.error = action.payload as string;
      });;
  },
});

// Export actions and selectors
export const { updateSort, resetCurrentWorkout } = workoutSlice.actions;
export const selectAllWorkouts = (state: RootState) => state.workout.workouts;
export const selectWorkoutLoading = (state: RootState) => state.workout.loading;
export const selectTotalWorkouts = (state: RootState) => state.workout.totalCount;

// Export reducer
export default workoutSlice.reducer;

// Selector to get a workout by ID
export const selectWorkoutById = (state: RootState, workoutId: string) => {
  state.workout.workouts.find((workout: any) => workout._id === workoutId);
}