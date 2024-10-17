import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../src/pages/Dashboard';
import axiosInstance from '../src/utils/axiosInstance';
import { apiUrl } from '../src/utils/apiUrl';

describe('Dashboard', () => {
  beforeEach(() => {
    // Reset the mock before each test
    jest.clearAllMocks();
  });

  it('renders the dashboard', async () => {
    render(<Dashboard />);
    expect(screen.getByTestId('dashboard-title')).toBeInTheDocument();
  });

  it('renders the progress chart', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByTestId('progress-tracking-chart')).toBeInTheDocument();
    });
  });

  it('renders the dashboard and fetches chart data', async () => {
    const mockChartData = [
      { date: '2024-01-01', weight: 70, bodyFatPercentage: 15 },
      { date: '2024-01-02', weight: 69, bodyFatPercentage: 14 },
    ];

    // Mock the axiosInstance.get response before rendering
    axiosInstance.get = jest.fn().mockResolvedValue({
      status: 200,
      data: { data: mockChartData },
    });

    // Render the component
    render(<Dashboard />);

    // Assert that the dashboard title is rendered
    expect(screen.getByTestId('dashboard-title')).toBeInTheDocument();

    // Wait for the chart data to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('progress-tracking-chart')).toBeInTheDocument();
    });

    // Check if the axios instance was called with the correct URL
    expect(axiosInstance.get).toHaveBeenCalledWith(
      `${apiUrl.PROGRESS_TRACKINGS}/track/progress`,
    );
  });

  it('handles error when fetching chart data', async () => {
    // Mock the axiosInstance.get to throw an error
    axiosInstance.get = jest
      .fn()
      .mockRejectedValue(new Error('Error fetching chart data'));

    // Render the Dashboard component
    render(<Dashboard />);

    // Optionally, you could assert error handling behavior if there is any UI feedback
    await waitFor(() => {
      // Check for an error message or the absence of chart data
      expect(screen.queryByTestId('progress-chart')).not.toBeInTheDocument();
    });
  });
});
