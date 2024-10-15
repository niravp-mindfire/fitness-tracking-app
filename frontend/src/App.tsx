import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { CircularProgress } from '@mui/material';
import store from './app/store';
import Private from './private';
import { path } from './utils/path';

// Lazy load components
const MyProfile = lazy(() => import('./pages/MyProfile'));
const Admin = lazy(() => import('./pages/admin'));
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
const routes = [
  { path: path.HOME, element: <Login /> },
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

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<CircularProgress />}>
          <Routes>
            {routes.map(({ path, element, isPrivate }, index) => {
              const routeElement = isPrivate ? (
                <Private>
                  <Admin>{element}</Admin>
                </Private>
              ) : (
                element
              );

              return <Route key={index} path={path} element={routeElement} />;
            })}
            {/* Redirect any other route to the login page */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  );
};

export default App;
