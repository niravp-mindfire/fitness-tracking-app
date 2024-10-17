import { configureStore } from '@reduxjs/toolkit';
import progressTrackingReducer, {
  fetchProgressTrackings,
  fetchProgressTrackingById,
  createProgressTracking,
  updateProgressTracking,
  deleteProgressTracking,
  resetCurrentProgressTracking,
  updateSearch,
} from '../../src/features/progressTracking/progressTrackingSlice';
import axiosInstance from '../../src/utils/axiosInstance';
import { ProgressTracking } from '../../src/utils/types';

// Mock the axiosInstance
jest.mock('../../src/utils/axiosInstance');

const store = configureStore({
  reducer: { progressTracking: progressTrackingReducer },
});

describe('progressTrackingSlice', () => {
  const mockTracking: any = {
    _id: '1',
    createdAt: new Date().toISOString(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return the initial state', () => {
    expect(store.getState().progressTracking).toEqual({
      progressTrackings: [],
      loading: false,
      error: null,
      totalCount: 0,
      currentProgressTracking: null,
      page: 0,
      limit: 0,
      sort: 'createdAt',
      order: 'desc',
      search: '',
    });
  });

  test('should handle fetchProgressTrackings.pending', async () => {
    const fetchAction = fetchProgressTrackings({ page: 1, limit: 10 });
    await store.dispatch(fetchAction);

    const state = store.getState().progressTracking;
    expect(state.loading).toBe(false);
  });

  test('should handle fetchProgressTrackings.fulfilled', async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: {
        progressTracking: [mockTracking],
        total: 1,
      },
    });

    const fetchAction = fetchProgressTrackings({ page: 1, limit: 10 });
    await store.dispatch(fetchAction);

    const state = store.getState().progressTracking;
    expect(state.loading).toBe(false);
    expect(state.progressTrackings).toEqual([mockTracking]);
    expect(state.totalCount).toBe(1);
  });

  test('should handle fetchProgressTrackings.rejected', async () => {
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Failed to fetch' } },
    });

    const fetchAction = fetchProgressTrackings({ page: 1, limit: 10 });
    await store.dispatch(fetchAction);

    const state = store.getState().progressTracking;
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to fetch');
  });

  test('should handle fetchProgressTrackingById.fulfilled', async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: { data: mockTracking },
    });

    const fetchByIdAction = fetchProgressTrackingById('1');
    await store.dispatch(fetchByIdAction);

    const state = store.getState().progressTracking;
    expect(state.currentProgressTracking).toEqual(mockTracking);
  });

  test('should handle createProgressTracking.fulfilled', async () => {
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: { data: mockTracking },
    });

    const createAction = createProgressTracking(mockTracking);
    await store.dispatch(createAction);

    const state = store.getState().progressTracking;
    expect(state.progressTrackings).toContainEqual(mockTracking);
  });

  test('should handle updateProgressTracking.fulfilled', async () => {
    store.dispatch(createProgressTracking(mockTracking));

    const updatedTracking = {
      ...mockTracking,
      createdAt: new Date().toISOString(),
    };
    (axiosInstance.put as jest.Mock).mockResolvedValueOnce({
      data: { data: updatedTracking },
    });

    const updateAction = updateProgressTracking({
      id: '1',
      tracking: updatedTracking,
    });
    await store.dispatch(updateAction);

    const state = store.getState().progressTracking;
    expect(state.progressTrackings[0]).toEqual(updatedTracking);
  });

  test('should handle deleteProgressTracking.fulfilled', async () => {
    store.dispatch(createProgressTracking(mockTracking));

    (axiosInstance.delete as jest.Mock).mockResolvedValueOnce({});

    const deleteAction = deleteProgressTracking('1');
    await store.dispatch(deleteAction);

    const state = store.getState().progressTracking;
    expect(state.progressTrackings).toHaveLength(0);
  });

  test('should handle resetCurrentProgressTracking', () => {
    store.dispatch(fetchProgressTrackingById('1'));
    store.dispatch(resetCurrentProgressTracking());

    const state = store.getState().progressTracking;
    expect(state.currentProgressTracking).toBeNull();
  });

  test('should handle updateSearch', () => {
    const searchTerm = 'test';
    store.dispatch(updateSearch(searchTerm));

    const state = store.getState().progressTracking;
    expect(state.search).toBe(searchTerm);
  });
});
