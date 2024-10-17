import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer, { initializeAuth } from '../features/auth/auth';
import profileReducer from '../features/profile/profileSlice';
import workoutReducer from '../features/workout/workoutSlice';
import exerciseSlice from '../features/exercise/exerciseSlice';
import workoutExerciseSlice from '../features/workoutExercise/workoutExerciseSlice';
import workoutPlanSlice from '../features/workoutPlan/workoutPlanSlice';
import challengeReducer from '../features/challenges/challenge';
import foodItemReducer from '../features/foodItem/foodItem';
import mealPlanSlice from '../features/mealPlan/mealPlanSlice';
import nutritionSlice from '../features/nutrition/nutritionSlice';
import nutritionMealReducer from '../features/nutritionMeal/nutritionMealSlice';
import progressTrackingReducer from '../features/progressTracking/progressTrackingSlice';

// Combine reducers into a root reducer
const rootReducer = {
  auth: authReducer,
  profile: profileReducer,
  workout: workoutReducer,
  exercise: exerciseSlice,
  workoutExercise: workoutExerciseSlice,
  workoutPlan: workoutPlanSlice,
  challenge: challengeReducer,
  foodItem: foodItemReducer,
  mealPlan: mealPlanSlice,
  nutrition: nutritionSlice,
  nutritionMeal: nutritionMealReducer,
  progressTracking: progressTrackingReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

// Define types for dispatch and selector
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Initialize auth state if the token exists
const token = localStorage.getItem('token');
if (token) {
  store.dispatch(initializeAuth({ token }));
}

export default store;

// Export the rootReducer
export { rootReducer };
