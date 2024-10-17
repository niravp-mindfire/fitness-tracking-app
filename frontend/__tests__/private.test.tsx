import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Private from '../src/private';

// Mock dependencies
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  Navigate: jest.fn(() => null),
}));

describe('Private Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should render child component when authenticated', () => {
    // Mock the selector to return authenticated status
    (useSelector as jest.Mock).mockReturnValue(true);

    // Create a dummy child component
    const ChildComponent = () => <div>Child Content</div>;

    // Render the Private component
    const { getByText } = render(
      <Private>
        <ChildComponent />
      </Private>,
    );
  });

  it('should navigate to the login page when not authenticated', () => {
    // Mock the selector to return not authenticated
    (useSelector as jest.Mock).mockReturnValue(false);

    // Create a dummy child component
    const ChildComponent = () => <div>Child Content</div>;

    // Render the Private component
    render(
      <Private>
        <ChildComponent />
      </Private>,
    );

    // Expect the Navigate component to be called with the correct path
    expect(Navigate).toHaveBeenCalledWith({ to: '/' }, {});
  });
});
