import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { RootState } from '../../app/store';
import { WorkoutExerciseState, WorkoutExercise } from '../../utils/types';
import { apiUrl } from '../../utils/apiUrl';

const initialState: WorkoutExerciseState = {
    workoutExercises: [],
    loading: false,
    error: null,
    totalCount: 0,
    currentWorkoutExercise: null,
    page: 0,
    limit: 0,
    sort: 'createdAt',
    order: 'asc',
    search: ''
};

// Async thunk for fetching workout exercises
export const fetchWorkoutExercises = createAsyncThunk<{
    workoutExercises: WorkoutExercise[];
    totalCount: number;
}, {
    page: number;
    limit: number;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
}, { rejectValue: string }>(
    'workoutExercise/fetchWorkoutExercises',
    async ({ page, limit, search = '', sort = 'createdAt', order = 'asc' }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(apiUrl.WORKOUT_EXERCISES, {
                params: { page, limit, search, sort, order },
            });
            return {
                workoutExercises: response.data.data.workoutExercises,
                totalCount: response.data.data.total,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch workout exercises');
        }
    }
);


// Async thunk for fetching workout exercise by ID
export const fetchWorkoutExerciseById = createAsyncThunk<WorkoutExercise, string, { rejectValue: string }>(
    'workoutExercise/fetchWorkoutExerciseById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${apiUrl.WORKOUT_EXERCISES}/${id}`);
            console.log(response.data);
            
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch workout exercise');
        }
    }
);

// Async thunk for creating a workout exercise
export const createWorkoutExercise = createAsyncThunk<WorkoutExercise, WorkoutExercise, { rejectValue: string }>(
    'workoutExercise/createWorkoutExercise',
    async (workoutExercise, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(apiUrl.WORKOUT_EXERCISES, workoutExercise);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create workout exercise');
        }
    }
);

// Async thunk for updating a workout exercise
export const updateWorkoutExercise = createAsyncThunk<WorkoutExercise, { id: string; workoutExercise: WorkoutExercise }, { rejectValue: string }>(
    'workoutExercise/updateWorkoutExercise',
    async ({ id, workoutExercise }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`${apiUrl.WORKOUT_EXERCISES}/${id}`, workoutExercise);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update workout exercise');
        }
    }
);

// Async thunk for deleting a workout exercise
export const deleteWorkoutExercise = createAsyncThunk<string, string, { rejectValue: string }>(
    'workoutExercise/deleteWorkoutExercise',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`${apiUrl.WORKOUT_EXERCISES}/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete workout exercise');
        }
    }
);

// Slice definition
const workoutExerciseSlice = createSlice({
    name: 'workoutExercise',
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
        resetCurrentWorkoutExercise(state) {
            state.currentWorkoutExercise = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkoutExercises.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWorkoutExercises.fulfilled, (state, action) => {
                state.loading = false;
                state.workoutExercises = action.payload.workoutExercises;
                state.totalCount = action.payload.totalCount;
            })
            .addCase(fetchWorkoutExercises.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchWorkoutExerciseById.fulfilled, (state, action) => {
                state.currentWorkoutExercise = action.payload;
            })
            .addCase(fetchWorkoutExerciseById.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { updateSort, resetCurrentWorkoutExercise } = workoutExerciseSlice.actions;

export const selectAllWorkoutExercises = (state: RootState) => state.workoutExercise.workoutExercises;
export const selectWorkoutExerciseLoading = (state: RootState) => state.workoutExercise.loading;
export const selectTotalWorkoutExercises = (state: RootState) => state.workoutExercise.totalCount;

export default workoutExerciseSlice.reducer;
