import { configureStore } from '@reduxjs/toolkit';
import nutritionMealReducer, {
  fetchNutritionMeals,
  fetchNutritionMealById,
  createNutritionMeal,
  updateNutritionMeal,
  deleteNutritionMeal,
  resetCurrentNutritionMeal,
  updateSearch,
} from '../../src/features/nutritionMeal/nutritionMealSlice';
import axiosInstance from '../../src/utils/axiosInstance';

jest.mock('../../src/utils/axiosInstance'); // Mock axiosInstance

const store = configureStore({
  reducer: { nutritionMeal: nutritionMealReducer },
});

describe('nutritionMealSlice', () => {
  beforeEach(() => {
    store.dispatch(resetCurrentNutritionMeal()); // Reset state before each test
  });

  it('should handle initial state', () => {
    const state = store.getState().nutritionMeal;
    expect(state).toEqual({
      nutritionMeals: [],
      loading: false,
      error: null,
      totalCount: 0,
      currentNutritionMeal: null,
      page: 0,
      limit: 0,
      sort: 'createdAt',
      order: 'desc',
      search: '',
    });
  });

  it('should handle fetchNutritionMeals thunk', async () => {
    const mockNutritionMeals = [{ id: '1', mealName: 'Meal 1' }];
    const mockTotalCount = 1;

    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: {
        data: { nutritionMeals: mockNutritionMeals, total: mockTotalCount },
      },
    });

    await store.dispatch(fetchNutritionMeals({ page: 1, limit: 10 }));
    const state = store.getState().nutritionMeal;

    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle errors in fetchNutritionMeals thunk', async () => {
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Fetch nutrition meals failed' } },
    });

    await store.dispatch(fetchNutritionMeals({ page: 1, limit: 10 }));
    const state = store.getState().nutritionMeal;

    expect(state.error).toBe('Fetch nutrition meals failed');
    expect(state.loading).toBe(false);
  });

  it('should handle fetchNutritionMealById thunk', async () => {
    const mockNutritionMeal = { id: '1', mealName: 'Meal 1' };

    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { data: mockNutritionMeal },
    });

    await store.dispatch(fetchNutritionMealById('1'));
    const state = store.getState().nutritionMeal;
  });

  it('should handle createNutritionMeal thunk', async () => {
    const mockNutritionMeal: any = { mealName: 'New Meal' };

    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: { data: { id: '1', mealName: 'New Meal' } },
    });

    await store.dispatch(createNutritionMeal(mockNutritionMeal));
    const state = store.getState().nutritionMeal;

    expect(state.nutritionMeals).toContainEqual({
      id: '1',
      mealName: 'New Meal',
    });
  });

  it('should handle errors in createNutritionMeal thunk', async () => {
    const mockNutritionMeal: any = { mealName: 'New Meal' };

    (axiosInstance.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Create nutrition meal failed' } },
    });

    await store.dispatch(createNutritionMeal(mockNutritionMeal));
    const state = store.getState().nutritionMeal;

    expect(state.error).toBe('Fetch nutrition meals failed');
  });

  it('should handle updateNutritionMeal thunk', async () => {
    const mockNutritionMeal: any = { id: '1', mealName: 'Updated Meal' };

    (axiosInstance.put as jest.Mock).mockResolvedValueOnce({
      data: { data: mockNutritionMeal },
    });

    await store.dispatch(
      updateNutritionMeal({ id: '1', nutritionMeal: mockNutritionMeal }),
    );
    const state = store.getState().nutritionMeal;

    expect(state.nutritionMeals).toContainEqual(mockNutritionMeal);
  });

  it('should handle errors in updateNutritionMeal thunk', async () => {
    const mockNutritionMeal: any = { id: '1', mealName: 'Updated Meal' };

    (axiosInstance.put as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Fetch nutrition meals failed' } },
    });

    await store.dispatch(
      updateNutritionMeal({ id: '1', nutritionMeal: mockNutritionMeal }),
    );
    const state = store.getState().nutritionMeal;

    expect(state.error).toBe('Fetch nutrition meals failed');
  });

  it('should handle deleteNutritionMeal thunk', async () => {
    const id = '1';

    (axiosInstance.delete as jest.Mock).mockResolvedValueOnce({
      data: { message: 'Nutrition meal deleted' },
    });

    await store.dispatch(deleteNutritionMeal(id));
    const state = store.getState().nutritionMeal;

    expect(state.nutritionMeals).not.toContainEqual({ id });
  });

  it('should handle errors in deleteNutritionMeal thunk', async () => {
    const id = '1';

    (axiosInstance.delete as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Fetch nutrition meals failed' } },
    });

    await store.dispatch(deleteNutritionMeal(id));
    const state = store.getState().nutritionMeal;

    expect(state.error).toBe('Fetch nutrition meals failed');
  });

  it('should handle updateSearch action', () => {
    store.dispatch(updateSearch('New Search'));
    const state = store.getState().nutritionMeal;

    expect(state.search).toBe('New Search');
  });

  it('should reset current nutrition meal', () => {
    store.dispatch(resetCurrentNutritionMeal());
    const state = store.getState().nutritionMeal;

    expect(state.currentNutritionMeal).toBeNull();
  });
});
