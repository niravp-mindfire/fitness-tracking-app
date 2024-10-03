import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { RootState } from '../../app/store';
import { WorkoutPlanState, WorkoutPlan } from '../../utils/types';
import { apiUrl } from '../../utils/apiUrl';

const initialState: WorkoutPlanState = {
  workoutPlans: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentWorkoutPlan: {
    _id: "",
    title: "",
    description: "",
    duration: 0,
    exercises: [], // Initialize as an empty array
  },
  page: 0,
  limit: 0,
  sort: 'createdAt',
  order: 'asc',
  search: ''
};

// Fetch Workout Plans
export const fetchWorkoutPlans = createAsyncThunk<{
  workoutPlans: WorkoutPlan[];
  totalCount: number;
}, {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}, { rejectValue: string }>(
  'workoutPlan/fetchWorkoutPlans',
  async ({ page, limit, search = '', sort = 'createdAt', order = 'asc' }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrl.WORKOUT_PLANS, {
        params: { page, limit, search, sort, order },
      });
      return {
        workoutPlans: response.data.data.workoutPlans,
        totalCount: response.data.data.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workout plans');
    }
  }
);

// Fetch Workout Plan by ID
export const fetchWorkoutPlanById = createAsyncThunk<WorkoutPlan, string, { rejectValue: string }>(
  'workoutPlan/fetchWorkoutPlanById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl.WORKOUT_PLANS}/${id}`);
      if (response.status === 200) {
        const workoutPlan = response.data.data;
        return {
          title: workoutPlan.title,
          description: workoutPlan.description,
          duration: workoutPlan.duration,
          exercises: workoutPlan.exercises.map((exercise: any) => ({
            exerciseId: exercise.exerciseId._id, // Set the ID of the exercise
            sets: exercise.sets,
            reps: exercise.reps,
          })),
        } as WorkoutPlan; // Type assertion here
      } else {
        return rejectWithValue('Failed to fetch workout plan - unexpected status code');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workout plan');
    }
  }
);

// Create Workout Plan
export const createWorkoutPlan = createAsyncThunk<WorkoutPlan, WorkoutPlan, { rejectValue: string }>(
  'workoutPlan/createWorkoutPlan',
  async (workoutPlan, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(apiUrl.WORKOUT_PLANS, workoutPlan);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create workout plan');
    }
  }
);

// Update Workout Plan
export const updateWorkoutPlan = createAsyncThunk<WorkoutPlan, { id: string; workoutPlan: WorkoutPlan }, { rejectValue: string }>(
  'workoutPlan/updateWorkoutPlan',
  async ({ id, workoutPlan }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${apiUrl.WORKOUT_PLANS}/${id}`, workoutPlan);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update workout plan');
    }
  }
);

// Delete Workout Plan
export const deleteWorkoutPlan = createAsyncThunk<string, string, { rejectValue: string }>(
  'workoutPlan/deleteWorkoutPlan',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${apiUrl.WORKOUT_PLANS}/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete workout plan');
    }
  }
);

// Slice
const workoutPlanSlice = createSlice({
  name: 'workoutPlan',
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
    resetCurrentWorkoutPlan(state) {
      state.currentWorkoutPlan = initialState.currentWorkoutPlan; // Reset to initial state
    },
    clearError(state) {
      state.error = null; // Action to clear error
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkoutPlans.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error on new request
      })
      .addCase(fetchWorkoutPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.workoutPlans = action.payload.workoutPlans;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchWorkoutPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchWorkoutPlanById.pending, (state) => {
        state.error = null; // Reset error on new request
      })
      .addCase(fetchWorkoutPlanById.fulfilled, (state, action) => {
        state.currentWorkoutPlan = action.payload;
      })
      .addCase(fetchWorkoutPlanById.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(createWorkoutPlan.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error on new request
      })
      .addCase(createWorkoutPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.workoutPlans.push(action.payload); // Add the newly created workout plan
      })
      .addCase(createWorkoutPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateWorkoutPlan.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error on new request
      })
      .addCase(updateWorkoutPlan.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.workoutPlans.findIndex(plan => plan._id === action.payload._id);
        if (index !== -1) {
          state.workoutPlans[index] = action.payload; // Update the specific workout plan
        }
      })
      .addCase(updateWorkoutPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Set error message
      })
      .addCase(deleteWorkoutPlan.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error on new request
      })
      .addCase(deleteWorkoutPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.workoutPlans = state.workoutPlans.filter(plan => plan._id !== action.payload); // Remove deleted workout plan
      })
      .addCase(deleteWorkoutPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Set error message
      });
  },
});

export const { updateSort, resetCurrentWorkoutPlan, clearError } = workoutPlanSlice.actions;
export const selectAllWorkoutPlans = (state: RootState) => state.workoutPlan.workoutPlans;
export const selectWorkoutPlanLoading = (state: RootState) => state.workoutPlan.loading;
export const selectTotalWorkoutPlans = (state: RootState) => state.workoutPlan.totalCount;
export const selectWorkoutPlanError = (state: RootState) => state.workoutPlan.error;

export default workoutPlanSlice.reducer;