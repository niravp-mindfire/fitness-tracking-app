import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgressTrackingChart from '../../src/component/ProgressTrackingChart';

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

// Mock ResponsiveContainer to prevent rendering issues in tests
jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

describe('ProgressTrackingChart', () => {
  const mockData = [
    { date: '2024-01-01', weight: 70, bodyFatPercentage: 20 },
    { date: '2024-02-01', weight: 68, bodyFatPercentage: 19 },
  ];

  it('renders without crashing', () => {
    render(<ProgressTrackingChart data={mockData} />);
    const chartContainer = screen.getByTestId('progress-tracking-chart');
    expect(chartContainer).toBeInTheDocument();
  });
});
