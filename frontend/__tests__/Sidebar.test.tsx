import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../src/pages/Sidebar'; // Adjust the path to your Sidebar component
import { ThemeProvider, createTheme } from '@mui/material';
import { path } from '../src/utils/path';

describe('Sidebar Component', () => {
  const mockHandleLogout = jest.fn();
  const theme = createTheme();

  const renderSidebar = () => {
    return render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <Sidebar isCollapsed={false} handleLogout={mockHandleLogout} />
        </MemoryRouter>
      </ThemeProvider>,
    );
  };

  test('renders the sidebar with correct items', () => {
    renderSidebar();

    // Verify that sidebar items are rendered
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Workout')).toBeInTheDocument();
    expect(screen.getByText('Exercise')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('sidebar toggle functionality', () => {
    renderSidebar();

    // Initially expanded sidebar
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();

    // Click toggle button to collapse sidebar
    const toggleButton = screen.getByTestId('sidebar-toggle-btn');
    fireEvent.click(toggleButton);

    // Check if the sidebar collapsed
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
  });

  test('clicking on a menu item navigates correctly', () => {
    renderSidebar();

    // Click on 'Workout' link
    const workoutLink = screen.getByText('Workout');
    fireEvent.click(workoutLink);

    // Ensure the path is correct for the clicked link
    expect(window.location.pathname).toBe(path.HOME);
  });

  test('clicking on logout triggers handleLogout', () => {
    renderSidebar();

    // Click on 'Logout'
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    // Ensure the logout handler is called
    expect(mockHandleLogout).toHaveBeenCalledTimes(1);
  });
});
