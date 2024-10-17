// workoutSlice.test.ts
import { configureStore } from '@reduxjs/toolkit';
import workoutReducer, {
  fetchWorkouts,
  fetchWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  resetCurrentWorkout,
  selectAllWorkouts,
  selectWorkoutLoading,
  selectTotalWorkouts,
  selectWorkoutById,
} from '../../src/features/workout/workoutSlice';
import axiosInstance from '../../src/utils/axiosInstance';

// Mock the axiosInstance
jest.mock('../../src/utils/axiosInstance');

const mockWorkout: any = {
  _id: '1',
  name: 'Test Workout',
  description: 'Description',
};

describe('workoutSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({ reducer: { workout: workoutReducer } });
    jest.clearAllMocks(); // Clear any previous mock calls
  });

  it('should return the initial state', () => {
    const state: any = store.getState().workout;
    expect(state).toEqual({
      workouts: [],
      loading: false,
      error: null,
      totalCount: 0,
      currentWorkout: null,
      page: 0,
      limit: 0,
      sort: 'date',
      order: 'desc',
      search: '',
    });
  });

  it('should handle fetchWorkouts.pending', () => {
    store.dispatch(fetchWorkouts.pending('', { page: 1, limit: 10 }));
    const state = store.getState().workout;
    expect(state.loading).toBe(true);
  });

  it('should handle fetchWorkouts.fulfilled', async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { data: { workouts: [mockWorkout], total: 1 } },
      status: 200,
    });

    await store.dispatch(fetchWorkouts({ page: 1, limit: 10 }));

    const state = store.getState().workout;
    expect(state.loading).toBe(false);
    expect(state.workouts).toEqual([mockWorkout]);
    expect(state.totalCount).toBe(1);
  });

  it('should handle fetchWorkouts.rejected', async () => {
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Failed to fetch workouts' } },
    });

    await store.dispatch(fetchWorkouts({ page: 1, limit: 10 }));

    const state = store.getState().workout;
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to fetch workouts');
  });

  it('should handle fetchWorkoutById.fulfilled', async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { data: mockWorkout },
      status: 200,
    });

    await store.dispatch(fetchWorkoutById('1'));

    const state = store.getState().workout;
    expect(state.currentWorkout).toEqual(mockWorkout);
  });

  it('should handle createWorkout.fulfilled', async () => {
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: { data: mockWorkout },
    });

    await store.dispatch(createWorkout(mockWorkout));

    const state = store.getState().workout;
  });

  it('should handle updateWorkout.fulfilled', async () => {
    store.dispatch(
      fetchWorkouts.fulfilled({ workouts: [mockWorkout], totalCount: 1 }, '', {
        page: 1,
        limit: 10,
      }),
    );

    const updatedWorkout = { ...mockWorkout, name: 'Updated Workout' };
    (axiosInstance.put as jest.Mock).mockResolvedValueOnce({
      data: { data: updatedWorkout },
    });

    await store.dispatch(updateWorkout({ id: '1', workout: updatedWorkout }));

    const state = store.getState().workout;
  });

  it('should handle deleteWorkout.fulfilled', async () => {
    store.dispatch(
      fetchWorkouts.fulfilled({ workouts: [mockWorkout], totalCount: 1 }, '', {
        page: 1,
        limit: 10,
      }),
    );

    (axiosInstance.delete as jest.Mock).mockResolvedValueOnce({});

    await store.dispatch(deleteWorkout('1'));

    const state = store.getState().workout;
    expect(state.workouts).toHaveLength(1);
  });

  it('should reset the current workout', () => {
    store.dispatch(resetCurrentWorkout(mockWorkout));
    const state = store.getState().workout;
    expect(state.currentWorkout).toEqual(mockWorkout);
  });

  it('should select all workouts', () => {
    store.dispatch(
      fetchWorkouts.fulfilled({ workouts: [mockWorkout], totalCount: 1 }, '', {
        page: 1,
        limit: 10,
      }),
    );

    const workouts = selectAllWorkouts(store.getState());
    expect(workouts).toEqual([mockWorkout]);
  });

  it('should select workout loading state', () => {
    store.dispatch(fetchWorkouts.pending('', { page: 1, limit: 10 }));

    const loading = selectWorkoutLoading(store.getState());
    expect(loading).toBe(true);
  });

  it('should select total workouts', () => {
    store.dispatch(
      fetchWorkouts.fulfilled({ workouts: [mockWorkout], totalCount: 1 }, '', {
        page: 1,
        limit: 10,
      }),
    );

    const totalCount = selectTotalWorkouts(store.getState());
    expect(totalCount).toBe(1);
  });

  it('should select workout by ID', () => {
    store.dispatch(
      fetchWorkouts.fulfilled({ workouts: [mockWorkout], totalCount: 1 }, '', {
        page: 1,
        limit: 10,
      }),
    );

    const workout = selectWorkoutById(store.getState(), '1');
  });
});
