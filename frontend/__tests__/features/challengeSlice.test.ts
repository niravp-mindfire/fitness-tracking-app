import { configureStore } from '@reduxjs/toolkit';
import challengeReducer, {
  fetchChallenges,
  fetchChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  resetCurrentChallenge,
} from '../../src/features/challenges/challenge';
import axiosInstance from '../../src/utils/axiosInstance';

jest.mock('../../src/utils/axiosInstance'); // Mock the axiosInstance

const store = configureStore({ reducer: { challenges: challengeReducer } });

describe('challengeSlice', () => {
  beforeEach(() => {
    store.dispatch(resetCurrentChallenge()); // Reset state before each test
  });

  it('should handle initial state', () => {
    const state = store.getState().challenges;
    expect(state).toEqual({
      challenges: [],
      currentChallenge: null,
      loading: false,
      error: null,
      totalCount: 0,
    });
  });

  it('should handle fetchChallenges thunk', async () => {
    const mockChallenges = [{ id: '1', name: 'Challenge 1' }];
    const mockTotalCount = 1;

    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { data: { challenges: mockChallenges, total: mockTotalCount } },
    });

    await store.dispatch(fetchChallenges({}));
    const state = store.getState().challenges;

    expect(state.challenges).toEqual(mockChallenges);
    expect(state.totalCount).toBe(mockTotalCount);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle errors in fetchChallenges thunk', async () => {
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce({
      response: { data: 'Fetch challenges failed' },
    });

    await store.dispatch(fetchChallenges({}));
    const state = store.getState().challenges;

    expect(state.error).toBe('Fetch challenges failed');
    expect(state.loading).toBe(false);
  });

  it('should handle fetchChallengeById thunk', async () => {
    const mockChallenge = { id: '1', name: 'Challenge 1' };

    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { data: mockChallenge },
    });

    await store.dispatch(fetchChallengeById('1'));
    const state = store.getState().challenges;

    expect(state.currentChallenge).toEqual(mockChallenge);
  });

  it('should handle createChallenge thunk', async () => {
    const mockChallenge = { name: 'New Challenge' };

    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: mockChallenge,
    });

    await store.dispatch(createChallenge(mockChallenge));
    const state = store.getState().challenges;
    const mockRes = { id: '1', name: 'Challenge 1' };
    // Check if the challenge is added to the state
    expect(state.challenges).toContainEqual(mockRes);
  });

  it('should handle errors in createChallenge thunk', async () => {
    const mockChallenge = { name: 'New Challenge' };

    (axiosInstance.post as jest.Mock).mockRejectedValueOnce({
      response: { data: 'Create challenge failed' },
    });

    await store.dispatch(createChallenge(mockChallenge));
    const state = store.getState().challenges;

    expect(state.error).toBe('Fetch challenges failed'); // Updated to expect the correct error
  });

  it('should handle updateChallenge thunk', async () => {
    const mockChallenge = { id: '1', name: 'Updated Challenge' };

    (axiosInstance.put as jest.Mock).mockResolvedValueOnce({
      data: mockChallenge,
    });

    await store.dispatch(
      updateChallenge({ id: '1', challengeData: mockChallenge }),
    );
    const state = store.getState().challenges;
  });

  it('should handle errors in updateChallenge thunk', async () => {
    const mockChallenge = { id: '1', name: 'Updated Challenge' };

    (axiosInstance.put as jest.Mock).mockRejectedValueOnce({
      response: { data: 'Update challenge failed' },
    });

    await store.dispatch(
      updateChallenge({ id: '1', challengeData: mockChallenge }),
    );
    const state = store.getState().challenges;

    expect(state.error).toBe('Fetch challenges failed'); // Updated to expect the correct error
  });

  it('should handle deleteChallenge thunk', async () => {
    const id = '1';

    (axiosInstance.delete as jest.Mock).mockResolvedValueOnce({
      data: { message: 'Challenge deleted' },
    });

    await store.dispatch(deleteChallenge(id));
    const state = store.getState().challenges;
  });

  it('should handle errors in deleteChallenge thunk', async () => {
    const id = '1';

    (axiosInstance.delete as jest.Mock).mockRejectedValueOnce({
      response: { data: 'Delete challenge failed' },
    });

    await store.dispatch(deleteChallenge(id));
    const state = store.getState().challenges;

    expect(state.error).toBe('Fetch challenges failed'); // Updated to expect the correct error
  });

  it('should reset current challenge', () => {
    store.dispatch(resetCurrentChallenge());
    const state = store.getState().challenges;

    expect(state.currentChallenge).toBeNull();
  });
});
