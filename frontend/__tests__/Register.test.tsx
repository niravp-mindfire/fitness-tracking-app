import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Register from '../src/pages/Register'; // Adjust the import path as needed
import '@testing-library/jest-dom';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Register Component', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: { isLoggedIn: false, error: null }, // Initial state
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </Provider>,
    );
  });

  test('renders the Register component', () => {
    expect(screen.getByTestId('register-title')).toBeInTheDocument();
  });

  test('allows users to input their registration details', () => {
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const dobInput = screen.getByLabelText(/date of birth/i);
    const genderSelect = screen.getByLabelText(/gender/i);
    const heightInput = screen.getByLabelText(/height/i);
    const weightInput = screen.getByLabelText(/weight/i);

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(usernameInput, { target: { value: 'johndoe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(dobInput, { target: { value: '2000-01-01' } });
    fireEvent.change(heightInput, { target: { value: '180' } });
    fireEvent.change(weightInput, { target: { value: '75' } });

    expect(firstNameInput).toHaveValue('John');
    expect(lastNameInput).toHaveValue('Doe');
    expect(usernameInput).toHaveValue('johndoe');
    expect(emailInput).toHaveValue('john.doe@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(dobInput).toHaveValue('2000-01-01');
    expect(heightInput).toHaveValue(180);
    expect(weightInput).toHaveValue(75);
  });

  test('displays error message on invalid registration', async () => {
    // Mock the registerUser dispatch function
    store.dispatch = jest.fn().mockImplementation(() => {
      return Promise.reject(new Error('Registration failed!'));
    });

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const dobInput = screen.getByLabelText(/date of birth/i);
    const genderSelect = screen.getByLabelText(/gender/i);
    const heightInput = screen.getByLabelText(/height/i);
    const weightInput = screen.getByLabelText(/weight/i);

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(usernameInput, { target: { value: 'johndoe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(dobInput, { target: { value: '2000-01-01' } });
    fireEvent.change(heightInput, { target: { value: '180' } });
    fireEvent.change(weightInput, { target: { value: '75' } });

    const registerButton = screen.getByTestId('register-button');
    fireEvent.click(registerButton);
  });

  test('shows loading state on form submission', async () => {
    // Mock the registerUser dispatch function
    store.dispatch = jest.fn().mockImplementation(() => {
      return new Promise(() => {}); // Simulate a pending promise
    });

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const dobInput = screen.getByLabelText(/date of birth/i);
    const genderSelect = screen.getByLabelText(/gender/i);
    const heightInput = screen.getByLabelText(/height/i);
    const weightInput = screen.getByLabelText(/weight/i);

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(usernameInput, { target: { value: 'johndoe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(dobInput, { target: { value: '2000-01-01' } });
    fireEvent.change(heightInput, { target: { value: '180' } });
    fireEvent.change(weightInput, { target: { value: '75' } });

    const registerButton = screen.getByTestId('register-button');
    fireEvent.click(registerButton);

    // Check if the button is disabled during loading state
    expect(registerButton).toBeDisabled();
  });
});
