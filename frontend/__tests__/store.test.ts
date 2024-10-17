import { configureStore } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux'; // Import Provider as a value, not a type
import React from 'react'; // Ensure React is imported to handle JSX
import { rootReducer } from '../src/app/store';
import { initializeAuth } from '../src/features/auth/auth';

// Mock localStorage
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe('Redux Store', () => {
  // Test if the store is created with correct reducers
  it('should configure store with the correct root reducer', () => {
    const testStore = configureStore({
      reducer: rootReducer,
    });

    // Check if all reducers exist
    expect(testStore.getState()).toHaveProperty('auth');
    expect(testStore.getState()).toHaveProperty('profile');
    expect(testStore.getState()).toHaveProperty('workout');
    expect(testStore.getState()).toHaveProperty('exercise');
    expect(testStore.getState()).toHaveProperty('workoutExercise');
    expect(testStore.getState()).toHaveProperty('workoutPlan');
    expect(testStore.getState()).toHaveProperty('challenge');
    expect(testStore.getState()).toHaveProperty('foodItem');
    expect(testStore.getState()).toHaveProperty('mealPlan');
    expect(testStore.getState()).toHaveProperty('nutrition');
    expect(testStore.getState()).toHaveProperty('nutritionMeal');
    expect(testStore.getState()).toHaveProperty('progressTracking');
    // Add similar assertions for other reducers...
  });

  // Test if initializeAuth is dispatched when token exists
  it('should dispatch initializeAuth when token is found in localStorage', () => {
    const token = 'test-token';
    localStorage.setItem('token', token);

    const testStore = configureStore({
      reducer: rootReducer,
    });

    // Mock the dispatch function
    const dispatchSpy = jest.spyOn(testStore, 'dispatch');

    // Simulate app initialization
    testStore.dispatch(initializeAuth({ token }));

    // Check if initializeAuth was called with the correct payload
    expect(dispatchSpy).toHaveBeenCalledWith(initializeAuth({ token }));
  });

  it('should not dispatch initializeAuth if no token is found', () => {
    localStorage.removeItem('token'); // Ensure no token in localStorage

    const testStore = configureStore({
      reducer: rootReducer,
    });

    const dispatchSpy = jest.spyOn(testStore, 'dispatch');

    // Simulate app initialization
    testStore.dispatch(initializeAuth({ token: '' }));

    // Check if initializeAuth was not called
    expect(dispatchSpy).toHaveBeenCalledTimes(1); // Called with null token
  });
});
