import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Import ThemeProvider
import Admin from '../src/pages/admin';
import { logout } from '../src/features/auth/auth';

const mockStore = configureStore([]);
const mockLogout = jest.fn();

jest.mock('../src/features/auth/auth', () => ({
  logout: jest.fn(),
}));

jest.mock('../src/pages/Sidebar', () => ({
  __esModule: true,
  default: jest.fn(({ handleLogout }) => (
    <div data-testid="mock-sidebar">
      <button onClick={handleLogout} data-testid="mock-logout">
        Logout
      </button>
    </div>
  )),
}));

describe('Admin Component', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({});
  });

  test('renders Admin component with children', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={createTheme()}>
          {' '}
          {/* Wrap with ThemeProvider */}
          <BrowserRouter>
            <Admin>
              <div data-testid="child-content">Child Content</div>
            </Admin>
          </BrowserRouter>
        </ThemeProvider>
      </Provider>,
    );

    // Check if Admin container is rendered
    expect(screen.getByTestId('admin-container')).toBeInTheDocument();

    // Check if Sidebar is rendered
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();

    // Check if main content is rendered
    expect(screen.getByTestId('admin-main')).toBeInTheDocument();

    // Check if child content is rendered inside main
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });
});
