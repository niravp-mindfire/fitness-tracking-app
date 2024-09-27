// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer, { initializeAuth } from '../features/auth/authSlice';
import profileReducer from "../features/profile/profileSlice"
import workoutReducer from '../features/workout/workoutSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    workout: workoutReducer
  },
});

// Define a type for the dispatch function
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks for easier use of dispatch and selector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Initialize the authentication state if the token exists
const token = localStorage.getItem('token');
if (token) {
  store.dispatch(initializeAuth({ token })); // Dispatch the action to initialize authentication state
}

export default store;
