// src/App.tsx
import React, { Suspense } from 'react';
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
import { routes } from './routes'; // Import routes
import Admin from './pages/admin';
import { SidebarProvider } from './component/SidebarContext';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <SidebarProvider>
        {' '}
        {/* Wrap with SidebarProvider */}
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
      </SidebarProvider>
    </Provider>
  );
};

export default App;
