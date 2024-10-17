import { configureStore } from '@reduxjs/toolkit';
import nutritionReducer, {
  fetchNutritionEntries,
  fetchNutritionById,
  createNutrition,
  updateNutrition,
  deleteNutrition,
  updateSort,
  resetCurrentNutrition,
} from '../../src/features/nutrition/nutritionSlice';
import axiosInstance from '../../src/utils/axiosInstance';

jest.mock('../../src/utils/axiosInstance'); // Mock the axiosInstance

const store = configureStore({ reducer: { nutrition: nutritionReducer } });

describe('nutritionSlice', () => {
  beforeEach(() => {
    store.dispatch(resetCurrentNutrition(null)); // Reset state before each test
  });

  it('should handle initial state', () => {
    const state = store.getState().nutrition;
    expect(state).toEqual({
      nutritionEntries: [],
      loading: false,
      error: null,
      totalCount: 0,
      currentNutrition: null,
      page: 0,
      limit: 0,
      sort: 'date',
      order: 'desc',
      search: '',
    });
  });

  it('should handle fetchNutritionEntries thunk', async () => {
    const mockNutritionEntries = [{ id: '1', name: 'Nutrition 1' }];
    const mockTotalCount = 1;

    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: {
        data: { nutritions: mockNutritionEntries, total: mockTotalCount },
      },
    });

    await store.dispatch(fetchNutritionEntries({ page: 1, limit: 10 }));
    const state = store.getState().nutrition;

    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle errors in fetchNutritionEntries thunk', async () => {
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Fetch nutrition entries failed' } },
    });

    await store.dispatch(fetchNutritionEntries({ page: 1, limit: 10 }));
    const state = store.getState().nutrition;

    expect(state.error).toBe('Fetch nutrition entries failed');
    expect(state.loading).toBe(false);
  });

  it('should handle fetchNutritionById thunk', async () => {
    const mockNutrition = { id: '1', name: 'Nutrition 1' };

    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { data: mockNutrition },
    });

    await store.dispatch(fetchNutritionById('1'));
    const state = store.getState().nutrition;
  });

  it('should handle createNutrition thunk', async () => {
    const mockNutrition: any = { name: 'New Nutrition' };

    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: { data: { id: '1', name: 'New Nutrition' } },
    });

    await store.dispatch(createNutrition(mockNutrition));
    const state = store.getState().nutrition;
  });

  it('should handle errors in createNutrition thunk', async () => {
    const mockNutrition: any = { name: 'New Nutrition' };

    (axiosInstance.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Create nutrition entry failed' } },
    });

    await store.dispatch(createNutrition(mockNutrition));
    const state = store.getState().nutrition;

    expect(state.error).toBe('Fetch nutrition entries failed');
  });

  it('should handle updateNutrition thunk', async () => {
    const mockNutrition: any = { id: '1', name: 'Updated Nutrition' };

    (axiosInstance.put as jest.Mock).mockResolvedValueOnce({
      data: { data: mockNutrition },
    });

    await store.dispatch(
      updateNutrition({ id: '1', nutritionEntry: mockNutrition }),
    );
    const state = store.getState().nutrition;
  });

  it('should handle errors in updateNutrition thunk', async () => {
    const mockNutrition: any = { id: '1', name: 'Updated Nutrition' };

    (axiosInstance.put as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Update nutrition entry failed' } },
    });

    await store.dispatch(
      updateNutrition({ id: '1', nutritionEntry: mockNutrition }),
    );
    const state = store.getState().nutrition;

    expect(state.error).toBe('Fetch nutrition entries failed');
  });

  it('should handle deleteNutrition thunk', async () => {
    const id = '1';

    (axiosInstance.delete as jest.Mock).mockResolvedValueOnce({
      data: { message: 'Nutrition entry deleted' },
    });

    await store.dispatch(deleteNutrition(id));
    const state = store.getState().nutrition;

    expect(state.nutritionEntries).not.toContainEqual({ id });
  });

  it('should handle errors in deleteNutrition thunk', async () => {
    const id = '1';

    (axiosInstance.delete as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Delete nutrition entry failed' } },
    });

    await store.dispatch(deleteNutrition(id));
    const state = store.getState().nutrition;

    expect(state.error).toBe('Fetch nutrition entries failed');
  });

  it('should handle updateSort action', () => {
    store.dispatch(updateSort('name'));
    const state = store.getState().nutrition;

    expect(state.sort).toBe('name');
    expect(state.order).toBe('asc');
  });

  it('should reset current nutrition', () => {
    store.dispatch(resetCurrentNutrition(null));
    const state = store.getState().nutrition;

    expect(state.currentNutrition).toBeNull();
  });
});
