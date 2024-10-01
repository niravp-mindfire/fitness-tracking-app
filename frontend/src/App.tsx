import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import store from './app/store';
import MyProfile from './pages/MyProfile';
import AdminLayout from './pages/AdminLayout';
import WorkoutList from './pages/workout/WorkoutList';
import WorkoutForm from './pages/workout/WorkoutForm';
import { appPath } from './utils/appPath';
import ExerciseList from './pages/exercises/Exercises';
import ExerciseForm from './pages/exercises/ExerciseForm';
import WorkoutExerciseForm from './pages/workoutExercise/WorkoutExerciseForm';
import WorkoutExerciseList from './pages/workoutExercise/WorkoutExerciseList';
import WorkoutPlanList from './pages/workoutPlan/WorkoutPlanList';
import WorkoutPlanForm from './pages/workoutPlan/WorkoutPlanForm';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgetPassword from './pages/ForgetPassword';
import Dashboard from './pages/Dashboard';
import Private from './private';

// Route configuration
const routes = [
  { path: appPath.HOME, element: <Login /> },
  { path: appPath.REGISTER, element: <Register /> },
  { path: appPath.FORGET_PASSWORD, element: <ForgetPassword /> },
  // Admin routes
  { path: appPath.DASHBOARD, element: <Dashboard />, isPrivate: true },
  { path: appPath.MY_PROFILE, element: <MyProfile />, isPrivate: true },
  { path: appPath.WORKOUT, element: <WorkoutList />, isPrivate: true },
  { path: `${appPath.WORKOUT}/add`, element: <WorkoutForm />, isPrivate: true },
  { path: `${appPath.WORKOUT}/edit/:id`, element: <WorkoutForm />, isPrivate: true },
  { path: appPath.EXERCISE, element: <ExerciseList />, isPrivate: true },
  { path: `${appPath.EXERCISE}/add`, element: <ExerciseForm />, isPrivate: true },
  { path: `${appPath.EXERCISE}/edit/:id`, element: <ExerciseForm />, isPrivate: true },
  { path: appPath.WORKOUT_EXERCISE, element: <WorkoutExerciseList />, isPrivate: true },
  { path: `${appPath.WORKOUT_EXERCISE}/add`, element: <WorkoutExerciseForm />, isPrivate: true },
  { path: `${appPath.WORKOUT_EXERCISE}/edit/:id`, element: <WorkoutExerciseForm />, isPrivate: true },
  { path: appPath.WORKOUT_PLAN, element: <WorkoutPlanList />, isPrivate: true },
  { path: `${appPath.WORKOUT_PLAN}/add`, element: <WorkoutPlanForm />, isPrivate: true },
  { path: `${appPath.WORKOUT_PLAN}/edit/:id`, element: <WorkoutPlanForm />, isPrivate: true },
];


const app: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<CircularProgress />}>
          <Routes>
            {routes.map(({ path, element, isPrivate }, index) => {
              const routeElement = isPrivate ? (
                <Private>
                  <AdminLayout>{element}</AdminLayout>
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

export default app;
