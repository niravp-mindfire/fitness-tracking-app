import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { selectIsAuthenticated } from './features/auth/authSlice';
import store from './app/store';
import MyProfile from './pages/MyProfile';
import AdminLayout from './pages/AdminLayout';
import WorkoutList from './pages/workout/WorkoutList';
import WorkoutForm from './pages/workout/WorkoutForm';
import { appPath } from './utils/appPath';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ForgetPassword = lazy(() => import('./pages/ForgetPassword'));

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
  // { path: '/admin/settings', element: <Settings />, isPrivate: true },
];

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? children : <Navigate to="/" />;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<CircularProgress />}>
          <Routes>
            {routes.map(({ path, element, isPrivate }, index) => {
              const routeElement = isPrivate ? (
                <PrivateRoute>
                  <AdminLayout>{element}</AdminLayout>
                </PrivateRoute>
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
