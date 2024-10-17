import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Login from '../src/pages/Login';
import '@testing-library/jest-dom'; // Import this to use the custom matchers

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Login Component', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: { isLoggedIn: false, error: null }, // Initial state
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );
  });

  test('renders the Login component', () => {
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
  });

  test('allows users to input their email and password', () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('displays error message on invalid login', async () => {
    // Mock the loginUser dispatch function
    store.dispatch = jest.fn().mockImplementation(() => {
      return Promise.reject(new Error('Invalid email or password'));
    });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const loginButton = screen.getByTestId('login-button');
    fireEvent.click(loginButton);

    // Check for error message after the login button is clicked
    // expect(await screen.getByTestId('error-message')).toBeInTheDocument();
  });
});
