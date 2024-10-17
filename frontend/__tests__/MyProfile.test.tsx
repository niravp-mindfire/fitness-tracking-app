import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MyProfile from '../src/pages/MyProfile';
import '@testing-library/jest-dom';
import { ToastContainer } from 'react-toastify';

const mockStore = configureStore([thunk]);

describe('MyProfile Component', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      profile: {
        loading: false,
        data: {
          profile: {
            firstName: 'John',
            lastName: 'Doe',
            dob: '1990-01-01',
            gender: 'Male',
            height: 180,
            weight: 75,
          },
          fitnessGoals: [],
        },
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <ToastContainer />
        <MyProfile />
      </Provider>,
    );
  });

  it('render the profile text', () => {
    expect(screen.getByTestId('profile-title')).toBeInTheDocument();
  });

  it('renders the profile form with fields', async () => {
    expect(screen.getByTestId('first-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('last-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('dob-input')).toBeInTheDocument();
    expect(screen.getByTestId('height-input')).toBeInTheDocument();
    expect(screen.getByTestId('weight-input')).toBeInTheDocument();
  });

  it('submit form directly', () => {
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('submit-button'));
  });
});
