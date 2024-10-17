import { configureStore } from '@reduxjs/toolkit';
import profileReducer, {
  updateUserProfile,
  getProfile,
  getAllUsers,
} from '../../src/features/profile/profileSlice';
import axiosInstance from '../../src/utils/axiosInstance';

jest.mock('../../src/utils/axiosInstance'); // Mock axiosInstance

const store = configureStore({ reducer: { profile: profileReducer } });

describe('profileSlice', () => {
  beforeEach(() => {
    store.dispatch({ type: 'profile/reset' }); // Reset state before each test
  });

  it('should handle initial state', () => {
    const state = store.getState().profile;
    expect(state).toEqual({
      data: null,
      loading: false,
      error: null,
      users: [],
    });
  });

  it('should handle updateUserProfile thunk', async () => {
    const mockProfileData = {
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
        gender: 'Male',
        height: 180,
        weight: 75,
        dob: '1993-01-01',
      },
      fitnessGoals: {},
    };

    (axiosInstance.put as jest.Mock).mockResolvedValueOnce({
      data: { message: 'Profile updated', profile: mockProfileData },
    });

    await store.dispatch(updateUserProfile(mockProfileData));
    const state = store.getState().profile;

    expect(state.loading).toBe(false);
    expect(state.data).toEqual({
      message: 'Profile updated',
      profile: mockProfileData,
    });
    expect(state.error).toBeNull();
  });

  it('should handle errors in updateUserProfile thunk', async () => {
    const mockProfileData = {
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
        gender: 'Male',
        height: 180,
        weight: 75,
        dob: '1993-01-01',
      },
      fitnessGoals: {},
    };

    (axiosInstance.put as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Profile update failed' } },
    });

    await store.dispatch(updateUserProfile(mockProfileData));
    const state = store.getState().profile;

    expect(state.loading).toBe(false);
    expect(state.error).toStrictEqual({ message: 'Profile update failed' });
  });

  it('should handle getProfile thunk', async () => {
    const mockProfile = {
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      gender: 'Male',
      height: 180,
      weight: 75,
      dob: '1993-01-01',
    };

    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { data: mockProfile },
    });

    await store.dispatch(getProfile());
    const state = store.getState().profile;

    expect(state.loading).toBe(false);
    expect(state.data).toEqual(mockProfile);
    expect(state.error).toBeNull();
  });

  it('should handle errors in getProfile thunk', async () => {
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Fetch profile failed' } },
    });

    await store.dispatch(getProfile());
    const state = store.getState().profile;

    expect(state.loading).toBe(false);
    expect(state.error).toStrictEqual({ message: 'Fetch profile failed' });
  });

  it('should handle getAllUsers thunk', async () => {
    const mockUsers = [
      { id: '1', firstName: 'John' },
      { id: '2', firstName: 'Jane' },
    ];

    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { data: mockUsers },
    });

    await store.dispatch(getAllUsers());
    const state = store.getState().profile;

    expect(state.users).toEqual(mockUsers);
    expect(state.error).toStrictEqual({ message: 'Fetch profile failed' });
  });

  it('should handle errors in getAllUsers thunk', async () => {
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Fetch users failed' } },
    });

    await store.dispatch(getAllUsers());
    const state = store.getState().profile;

    expect(state.error).toStrictEqual({ message: 'Fetch profile failed' });
  });
});
