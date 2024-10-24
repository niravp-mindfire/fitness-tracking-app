// src/routes.tsx

import React, { lazy } from 'react';
import { path } from './utils/path';
import Test from './pages/Test';

// Lazy load components
const MyProfile = lazy(() => import('./pages/MyProfile'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const WorkoutList = lazy(() => import('./pages/workout/WorkoutList'));
const ExerciseList = lazy(() => import('./pages/exercises/Exercises'));
const WorkoutExerciseList = lazy(
  () => import('./pages/workoutExercise/WorkoutExerciseList'),
);
const WorkoutPlanList = lazy(
  () => import('./pages/workoutPlan/WorkoutPlanList'),
);
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgetPassword = lazy(() => import('./pages/ForgetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ChallengeList = lazy(() => import('./pages/challenges/list'));
const FoodItemList = lazy(() => import('./pages/foodItem/list'));
const MealPlanList = lazy(() => import('./pages/mealPlan/list'));
const NutritionList = lazy(() => import('./pages/nutritions/NutritionList'));
const NutritionMealList = lazy(
  () => import('./pages/nutritionMeal/NutritionMealList'),
);
const ProgressTrackingList = lazy(
  () => import('./pages/progressTracking/ProgressTrackingList'),
);

// Route configuration
export const routes = [
  { path: '/test', element: <Test /> },
  { path: path.HOME, element: <LandingPage /> },
  { path: path.LOGIN, element: <Login /> },
  { path: path.REGISTER, element: <Register /> },
  { path: path.FORGET_PASSWORD, element: <ForgetPassword /> },
  // Admin routes
  { path: path.DASHBOARD, element: <Dashboard />, isPrivate: true },
  { path: path.MY_PROFILE, element: <MyProfile />, isPrivate: true },
  { path: path.WORKOUT, element: <WorkoutList />, isPrivate: true },
  { path: path.EXERCISE, element: <ExerciseList />, isPrivate: true },
  {
    path: path.WORKOUT_EXERCISE,
    element: <WorkoutExerciseList />,
    isPrivate: true,
  },
  { path: path.WORKOUT_PLAN, element: <WorkoutPlanList />, isPrivate: true },
  { path: path.CHALLENGE, element: <ChallengeList />, isPrivate: true },
  { path: path.FOOD_ITEM, element: <FoodItemList />, isPrivate: true },
  { path: path.MEAL_PLAN, element: <MealPlanList />, isPrivate: true },
  { path: path.NUTRITION, element: <NutritionList />, isPrivate: true },
  {
    path: path.NUTRITION_MEAL,
    element: <NutritionMealList />,
    isPrivate: true,
  },
  {
    path: path.PROGRESS_TRACKINGS,
    element: <ProgressTrackingList />,
    isPrivate: true,
  },
];
