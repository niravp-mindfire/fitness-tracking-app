// index.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import App from '../src/App';
import { ToastContainer } from 'react-toastify';
import '@testing-library/jest-dom'; // Adds extended matchers like toBeInTheDocument

jest.mock('../src/App', () => () => <div>Mocked App Component</div>);

describe('index.tsx', () => {
  it('renders the app with ThemeProvider and ToastContainer', () => {
    const theme = createTheme({
      palette: {
        mode: 'light',
      },
    });

    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </ThemeProvider>,
    );

    // Check if the mocked App component is rendered
    expect(getByText('Mocked App Component')).toBeInTheDocument();
  });
});
