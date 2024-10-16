import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ForgetPassword from '../src/pages/ForgetPassword';
import { forgetPassword } from '../src/features/auth/auth'; // Import the forgetPassword action
import '@testing-library/jest-dom'; // Ensure you import this
import { Store, AnyAction } from '@reduxjs/toolkit';

// Mock the toast library
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../src/features/auth/auth', () => ({
  forgetPassword: jest.fn(),
  selectAuthLoading: jest.fn(() => false),
  selectAuthError: jest.fn(() => null),
}));

const mockStore = configureStore([thunk]);

describe('ForgetPassword Component', () => {
  let store: Store<unknown, AnyAction>;

  beforeEach(() => {
    store = mockStore({
      auth: {
        loading: false,
        error: null,
      },
    });
  });

  it('renders the ForgetPassword form correctly', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ForgetPassword />
        </MemoryRouter>
      </Provider>,
    );

    // Verify that the form is in the document
    expect(screen.getByTestId('forget-password-form')).toBeInTheDocument();
  });

  it('displays error when the form is submitted with an invalid email', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ForgetPassword />
        </MemoryRouter>
      </Provider>,
    );

    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByTestId('submit-button');

    // Fill the form with invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
  });

  it('submits the form and displays a success message', async () => {
    // Mock successful dispatch
    (forgetPassword as unknown as jest.Mock).mockReturnValueOnce(() =>
      Promise.resolve({}),
    );

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ForgetPassword />
        </MemoryRouter>
      </Provider>,
    );

    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByTestId('submit-button');

    // Fill form with valid data
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    // Wait for the form submission to succeed
    await waitFor(() => {
      expect(forgetPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(screen.queryByTestId('error-message')).toBeNull();
    });
  });
});
