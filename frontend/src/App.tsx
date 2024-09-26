// src/App.tsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { selectIsAuthenticated } from './features/auth/authSlice';
import store from './app/store';
import MyProfile from './components/MyProfile';
import AdminLayout from './components/AdminLayout'; // Import your AdminLayout

// Lazy-loaded components
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const ForgetPassword = lazy(() => import('./components/ForgetPassword'));
// const Users = lazy(() => import('./components/Users')); // Example admin component
// const Settings = lazy(() => import('./components/Settings')); // Example admin component

// Route configuration
const routes = [
  { path: '/', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ForgetPassword /> },
  { path: '/dashboard', element: <Dashboard />, isPrivate: true },
  { path: '/my-profile', element: <MyProfile />, isPrivate: true },
  // Admin routes
  { path: '/admin/dashboard', element: <Dashboard />, isPrivate: true }, // Replace with actual admin dashboard component
  // { path: '/admin/users', element: <Users />, isPrivate: true },
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
