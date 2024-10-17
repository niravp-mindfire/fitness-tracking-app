import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import for the matchers
import SnackAlert from '../../src/component/SnackAlert'; // Adjust import path as necessary

describe('SnackAlert', () => {
  const mockSetSnackbarOpen = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders Snackbar with the correct message and severity', () => {
    render(
      <SnackAlert
        snackbarOpen={true}
        setSnackbarOpen={mockSetSnackbarOpen}
        type="success"
        message="Test message"
      />,
    );

    // Check if Snackbar is rendered and open
    const snackbar = screen.getByRole('alert');
    expect(snackbar).toBeInTheDocument(); // Use `toBeInTheDocument` matcher

    // Check if Alert message is rendered with the correct text
    const alertMessage = screen.getByText('Test message');
    expect(alertMessage).toBeInTheDocument();

    // Check if Alert has the correct severity
    const alert = screen.getByText('Test message').closest('.MuiAlert-root');
    expect(alert).toHaveClass('MuiAlert-standardSuccess'); // Ensure it's a success alert
  });

  it('calls setSnackbarOpen when Snackbar is closed', () => {
    render(
      <SnackAlert
        snackbarOpen={true}
        setSnackbarOpen={mockSetSnackbarOpen}
        type="success"
        message="Test message"
      />,
    );

    // Simulate close event
    const closeButton = screen.getByRole('alert').querySelector('button');
    if (closeButton) fireEvent.click(closeButton);

    expect(mockSetSnackbarOpen).toHaveBeenCalledWith(false);
  });

  it('automatically closes Snackbar after autoHideDuration', () => {
    jest.useFakeTimers(); // Use fake timers to simulate autoHideDuration

    render(
      <SnackAlert
        snackbarOpen={true}
        setSnackbarOpen={mockSetSnackbarOpen}
        type="info"
        message="Auto close message"
      />,
    );

    // Fast-forward until all timers have been executed
    jest.advanceTimersByTime(5000); // autoHideDuration is 5000ms

    expect(mockSetSnackbarOpen).toHaveBeenCalledWith(false);
    jest.useRealTimers(); // Restore real timers
  });
});
