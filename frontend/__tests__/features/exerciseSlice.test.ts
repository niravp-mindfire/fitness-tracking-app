// __tests__/features/exerciseSlice.test.ts
import { configureStore } from '@reduxjs/toolkit';
import exerciseReducer, {
  fetchExercises,
  fetchExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  updateSort,
  resetCurrentExercise,
} from '../../src/features/exercise/exerciseSlice';
import axiosInstance from '../../src/utils/axiosInstance';
import { Exercise } from '../../src/utils/types';

// Mock the axiosInstance
jest.mock('../../src/utils/axiosInstance');

const store = configureStore({ reducer: { exercise: exerciseReducer } });

describe('exerciseSlice', () => {
  beforeEach(() => {
    // Reset state before each test
    store.dispatch(resetCurrentExercise());
  });

  it('should handle initial state', () => {
    const state = store.getState().exercise;
    expect(state).toEqual({
      exercises: [],
      loading: false,
      error: null,
      totalCount: 0,
      currentExercise: null,
      page: 0,
      limit: 0,
      sort: 'name',
      order: 'asc',
      search: '',
    });
  });

  it('should handle fetchExercises pending action', () => {
    store.dispatch(fetchExercises({ page: 1, limit: 10 }));
    const state = store.getState().exercise;
    expect(state.loading).toBe(true);
  });

  it('should handle fetchExercises fulfilled action', async () => {
    const mockExercises: Exercise[] = [
      {
        _id: '1',
        name: 'Push-up',
        type: 'strength',
        description: 'Push-up exercise',
        category: 'upper body',
      },
    ];
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: {
        data: {
          exercises: mockExercises,
          total: 1,
        },
      },
    });

    await store.dispatch(fetchExercises({ page: 1, limit: 10 }));

    const state = store.getState().exercise;
    expect(state.loading).toBe(false);
    expect(state.exercises).toEqual(mockExercises);
    expect(state.totalCount).toBe(1);
  });

  it('should handle fetchExercises rejected action', async () => {
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Failed to fetch exercises' } },
    });

    await store.dispatch(fetchExercises({ page: 1, limit: 10 }));

    const state = store.getState().exercise;
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to fetch exercises');
  });

  it('should handle fetchExerciseById fulfilled action', async () => {
    const mockExercise: Exercise = {
      _id: '1',
      name: 'Push-up',
      type: 'strength',
      description: 'Push-up exercise',
      category: 'upper body',
    };
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: {
        data: mockExercise,
      },
    });

    await store.dispatch(fetchExerciseById('1'));

    const state = store.getState().exercise;
    expect(state.currentExercise).toEqual(mockExercise);
  });

  it('should handle fetchExerciseById rejected action', async () => {
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Failed to fetch exercise' } },
    });

    await store.dispatch(fetchExerciseById('1'));

    const state = store.getState().exercise;
    expect(state.error).toBe('Failed to fetch exercise');
  });

  it('should handle createExercise fulfilled action', async () => {
    const newExercise: Exercise = {
      _id: '2',
      name: 'Squat',
      type: 'strength',
      description: 'Squat exercise',
      category: 'lower body',
    };
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: {
        data: newExercise,
      },
    });

    await store.dispatch(createExercise(newExercise));

    const state = store.getState().exercise;
  });

  it('should handle createExercise rejected action', async () => {
    const newExercise: Exercise = {
      _id: '2',
      name: 'Squat',
      type: 'strength',
      description: 'Squat exercise',
      category: 'lower body',
    };
    (axiosInstance.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Failed to create exercise' } },
    });

    await store.dispatch(createExercise(newExercise));

    const state = store.getState().exercise;
    expect(state.error).toBe('Failed to fetch exercise');
  });

  it('should handle updateExercise fulfilled action', async () => {
    const initialExercise: Exercise = {
      _id: '1',
      name: 'Push-up',
      type: 'strength',
      description: 'Push-up exercise',
      category: 'upper body',
    };
    store.dispatch(createExercise(initialExercise)); // Initially create the exercise to be updated

    const updatedExercise: Exercise = {
      _id: '1',
      name: 'Push-up Updated',
      type: 'strength',
      description: 'Updated push-up exercise',
      category: 'upper body',
    };
    (axiosInstance.put as jest.Mock).mockResolvedValueOnce({
      data: {
        data: updatedExercise,
      },
    });

    await store.dispatch(
      updateExercise({ id: '1', exercise: updatedExercise }),
    );

    const state = store.getState().exercise;
  });

  it('should handle updateExercise rejected action', async () => {
    const updatedExercise: Exercise = {
      _id: '1',
      name: 'Push-up Updated',
      type: 'strength',
      description: 'Updated push-up exercise',
      category: 'upper body',
    };
    (axiosInstance.put as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Failed to update exercise' } },
    });

    await store.dispatch(
      updateExercise({ id: '1', exercise: updatedExercise }),
    );

    const state = store.getState().exercise;
    expect(state.error).toBe('Failed to fetch exercise');
  });

  it('should handle deleteExercise fulfilled action', async () => {
    const initialExercise: any = {
      _id: '1',
      name: 'Push-up',
      type: 'strength',
      description: 'Push-up exercise',
      category: 'upper body',
    };
    store.dispatch(createExercise(initialExercise)); // Create the exercise to be deleted

    (axiosInstance.delete as jest.Mock).mockResolvedValueOnce({});

    await store.dispatch(deleteExercise(initialExercise._id));

    const state = store.getState().exercise;
  });

  it('should handle deleteExercise rejected action', async () => {
    const exerciseId = '1';
    (axiosInstance.delete as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Failed to delete exercise' } },
    });

    await store.dispatch(deleteExercise(exerciseId));

    const state = store.getState().exercise;
    expect(state.error).toBe('Failed to fetch exercise');
  });

  it('should handle updateSort action', () => {
    store.dispatch(updateSort('name'));
    const state = store.getState().exercise;
    expect(state.sort).toBe('name');
    expect(state.order).toBe('desc'); // Check if order toggles to desc
  });

  it('should handle resetCurrentExercise action', () => {
    store.dispatch(resetCurrentExercise());
    const state = store.getState().exercise;
    expect(state.currentExercise).toBeNull();
  });
});
