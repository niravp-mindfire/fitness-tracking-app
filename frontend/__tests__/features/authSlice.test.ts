import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
  registerUser,
  loginUser,
  forgetPassword,
  logout,
  initializeAuth,
} from '../../src/features/auth/auth';
import axiosInstance from '../../src/utils/axiosInstance';

jest.mock('../../src/utils/axiosInstance'); // Mock the axiosInstance

const store = configureStore({ reducer: { auth: authReducer } });

describe('authSlice', () => {
  beforeEach(() => {
    // Reset state before each test
    store.dispatch(logout());
  });

  it('should handle initial state', () => {
    const state = store.getState().auth;
    expect(state).toEqual({
      isAuthenticated: false,
      loading: false,
      error: null,
      token: null,
      role: null,
    });
  });

  it('should handle logout action', () => {
    const user = {
      email: 'test@example.com',
      username: 'test',
      token: 'dummy-token',
    };
    store.dispatch(initializeAuth(user)); // Set user to test logout
    store.dispatch(logout());
    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(state.error).toBeNull();
  });

  it('should handle initializeAuth action', () => {
    const user = {
      email: 'test@example.com',
      username: 'test',
      token: 'dummy-token',
    };
    store.dispatch(initializeAuth(user));
    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toEqual(user.token);
  });

  it('should handle registerUser thunk', async () => {
    const user: any = {
      username: 'test',
      email: 'test@example.com',
      password: '123456',
    };
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: { token: 'dummy-token', user },
    });

    await store.dispatch(registerUser(user));
    const state = store.getState().auth;

    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toEqual(null);
    expect(state.error).toBeNull();
  });

  it('should handle loginUser thunk', async () => {
    const user = {
      email: 'test@example.com',
      password: '123456',
    };
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: { token: 'dummy-token', user },
    });

    await store.dispatch(loginUser(user));
    const state = store.getState().auth;

    expect(state.isAuthenticated).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle forgetPassword thunk', async () => {
    const email = { email: 'test@example.com' };
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: { message: 'Password reset email sent' },
    });

    await store.dispatch(forgetPassword(email));
    const state = store.getState().auth;

    expect(state.error).toBeNull();
  });

  it('should handle errors in registerUser thunk', async () => {
    const user: any = {
      username: 'test',
      email: 'test@example.com',
      password: '123456',
    };
    (axiosInstance.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Registration failed' } },
    });

    await store.dispatch(registerUser(user));
    const state = store.getState().auth;

    expect(state.error).toBe('Registration failed');
  });

  it('should handle errors in loginUser thunk', async () => {
    const user: any = {
      email: 'test@example.com',
      password: '123456',
    };
    (axiosInstance.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Login failed' } },
    });

    await store.dispatch(loginUser(user));
    const state = store.getState().auth;

    expect(state.error).toBe('Login failed');
  });

  it('should handle errors in forgetPassword thunk', async () => {
    const email = { email: 'test@example.com' };
    (axiosInstance.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Password reset failed' } },
    });

    await store.dispatch(forgetPassword(email));
    const state = store.getState().auth;

    expect(state.error).toBe('Rejected');
  });
});
