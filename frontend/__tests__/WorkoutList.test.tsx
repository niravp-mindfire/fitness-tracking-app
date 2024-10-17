import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import WorkoutList from '../src/pages/workout/WorkoutList';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

const mockStore = configureStore([thunk]);

describe('Workout List', () => {
  let store: any;
  beforeEach(() => {
    store = mockStore({
      workout: {
        workouts: [
          {
            id: '1',
            title: 'Morning Run',
            duration: 30,
            createdAt: '2023-10-15',
          },
          {
            id: '2',
            title: 'Evening Yoga',
            duration: 45,
            createdAt: '2023-10-16',
          },
        ],
        loading: false,
        error: null,
        totalCount: 2,
        currentWorkout: null,
        page: 1,
        limit: 10,
        sort: 'date',
        order: 'asc',
        search: '',
      },
    });

    render(
      <Provider store={store}>
        <ToastContainer />
        <WorkoutList />
      </Provider>,
    );
  });

  it('renders workout list', () => {
    expect(screen.getByText('Workout List')).toBeInTheDocument();
  });

  it('handles search input', async () => {
    const searchInput = screen.getByRole('textbox', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'Morning' } });

    expect(searchInput).toHaveValue('Morning');
  });

  it('handles delete workout', async () => {
    expect(screen.getByText('Add Workout')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Duration')).toBeInTheDocument();
  });
});
