import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import store from './app/store';
import MyProfile from './pages/MyProfile';
import Admin from './pages/admin';
import WorkoutList from './pages/workout/WorkoutList';
import WorkoutForm from './pages/workout/WorkoutForm';
import { path } from './utils/path';
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
import ChallengeList from './pages/challenges/list';
import ChallengeForm from './pages/challenges/form';

// Route configuration
const routes = [
  { path: path.HOME, element: <Login /> },
  { path: path.REGISTER, element: <Register /> },
  { path: path.FORGET_PASSWORD, element: <ForgetPassword /> },
  // Admin routes
  { path: path.DASHBOARD, element: <Dashboard />, isPrivate: true },
  { path: path.MY_PROFILE, element: <MyProfile />, isPrivate: true },
  { path: path.WORKOUT, element: <WorkoutList />, isPrivate: true },
  { path: `${path.WORKOUT}/add`, element: <WorkoutForm />, isPrivate: true },
  { path: `${path.WORKOUT}/edit/:id`, element: <WorkoutForm />, isPrivate: true },
  { path: path.EXERCISE, element: <ExerciseList />, isPrivate: true },
  { path: `${path.EXERCISE}/add`, element: <ExerciseForm />, isPrivate: true },
  { path: `${path.EXERCISE}/edit/:id`, element: <ExerciseForm />, isPrivate: true },
  { path: path.WORKOUT_EXERCISE, element: <WorkoutExerciseList />, isPrivate: true },
  { path: `${path.WORKOUT_EXERCISE}/add`, element: <WorkoutExerciseForm />, isPrivate: true },
  { path: `${path.WORKOUT_EXERCISE}/edit/:id`, element: <WorkoutExerciseForm />, isPrivate: true },
  { path: path.WORKOUT_PLAN, element: <WorkoutPlanList />, isPrivate: true },
  { path: `${path.WORKOUT_PLAN}/add`, element: <WorkoutPlanForm />, isPrivate: true },
  { path: `${path.WORKOUT_PLAN}/edit/:id`, element: <WorkoutPlanForm />, isPrivate: true },
  { path: path.CHALLENGE, element: <ChallengeList />, isPrivate: true },
  { path: `${path.CHALLENGE}/add`, element: <ChallengeForm />, isPrivate: true },
  { path: `${path.CHALLENGE}/edit/:id`, element: <ChallengeForm />, isPrivate: true },
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

export default app;
