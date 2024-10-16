import { configureStore } from '@reduxjs/toolkit';
import mealPlanReducer, {
  fetchMealPlans,
  fetchMealPlanById,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
  updateSort,
  resetCurrentMealPlan,
  selectAllMealPlans,
  selectMealPlanLoading,
  selectTotalMealPlans,
  selectMealPlanError,
  selectMealPlanById,
} from '../../src/features/mealPlan/mealPlanSlice';
import axiosInstance from '../../src/utils/axiosInstance';
import { MealPlan } from '../../src/utils/types';

// Mock axiosInstance
jest.mock('../../src/utils/axiosInstance');

describe('mealPlanSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        mealPlan: mealPlanReducer,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return the initial state', () => {
    const state = store.getState().mealPlan;
    expect(state).toEqual({
      mealPlans: [],
      loading: false,
      error: null,
      totalCount: 0,
      currentMealPlan: null,
      page: 0,
      limit: 0,
      sort: 'date',
      order: 'desc',
      search: '',
    });
  });

  test('should handle fetchMealPlans.pending', () => {
    store.dispatch({ type: fetchMealPlans.pending.type });
    const state = store.getState().mealPlan;
    expect(state.loading).toBe(true);
  });

  test('should handle fetchMealPlans.fulfilled', () => {
    const mealPlans = [{ _id: '1', name: 'Meal 1' }];
    store.dispatch({
      type: fetchMealPlans.fulfilled.type,
      payload: { mealPlans, totalCount: 1 },
    });
    const state = store.getState().mealPlan;
    expect(state.loading).toBe(false);
    expect(state.mealPlans).toEqual(mealPlans);
    expect(state.totalCount).toBe(1);
  });

  test('should handle fetchMealPlans.rejected', () => {
    const errorMessage = 'Failed to fetch meal plans';
    store.dispatch({
      type: fetchMealPlans.rejected.type,
      payload: errorMessage,
    });
    const state = store.getState().mealPlan;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('should handle fetchMealPlanById.fulfilled', () => {
    const mealPlan = { _id: '1', name: 'Meal 1' };
    store.dispatch({
      type: fetchMealPlanById.fulfilled.type,
      payload: mealPlan,
    });
    const state = store.getState().mealPlan;
    expect(state.currentMealPlan).toEqual(mealPlan);
  });

  test('should handle fetchMealPlanById.rejected', () => {
    const errorMessage = 'Failed to fetch meal plan';
    store.dispatch({
      type: fetchMealPlanById.rejected.type,
      payload: errorMessage,
    });
    const state = store.getState().mealPlan;
    expect(state.error).toBe(errorMessage);
  });

  test('should handle createMealPlan.fulfilled', () => {
    const newMealPlan = { _id: '2', name: 'New Meal' };
    store.dispatch({
      type: createMealPlan.fulfilled.type,
      payload: newMealPlan,
    });
    const state = store.getState().mealPlan;
  });

  test('should handle updateSort', () => {
    store.dispatch(updateSort('name'));
    const state = store.getState().mealPlan;
    expect(state.sort).toBe('name');
    expect(state.order).toBe('asc');
  });

  test('should handle resetCurrentMealPlan', () => {
    const mealPlan = { _id: '3', name: 'Meal Plan 3' };
    store.dispatch(resetCurrentMealPlan(mealPlan));
    const state = store.getState().mealPlan;
    expect(state.currentMealPlan).toEqual(mealPlan);
  });

  test('should select meal plans', () => {
    const state = {
      mealPlan: {
        mealPlans: [{ _id: '1', name: 'Meal 1' }],
      },
    };
    expect(selectAllMealPlans(state as any)).toEqual([
      { _id: '1', name: 'Meal 1' },
    ]);
  });

  test('should select meal plan by ID', () => {
    const state = {
      mealPlan: {
        mealPlans: [{ _id: '1', name: 'Meal 1' }],
      },
    };
    expect(selectMealPlanById(state as any, '1')).toEqual({
      _id: '1',
      name: 'Meal 1',
    });
  });

  test('should select loading state', () => {
    const state = { mealPlan: { loading: true } };
    expect(selectMealPlanLoading(state as any)).toBe(true);
  });

  test('should select error state', () => {
    const state = { mealPlan: { error: 'An error occurred' } };
    expect(selectMealPlanError(state as any)).toBe('An error occurred');
  });

  test('should select total meal plans count', () => {
    const state = { mealPlan: { totalCount: 5 } };
    expect(selectTotalMealPlans(state as any)).toBe(5);
  });
});
