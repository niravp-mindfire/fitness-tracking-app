// src/pages/Login.tsx
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import {
  loginUser,
  selectAuthLoading,
  selectAuthError,
} from '../features/auth/auth';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Container,
  Grid,
} from '@mui/material';
import { AppDispatch } from '../app/store'; // Import the AppDispatch type
import { LoginFormValues } from '../utils/types';
import { loginSchema } from '../utils/validationSchema';
import { loginInitialValue } from '../utils/initialValues';
import { styled } from '@mui/material/styles';

// Define a styled version of Typography that allows for the `component` prop
const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
})) as typeof Typography;

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(to bottom, #4caf50, #2196f3)', // Match your landing page
  color: '#fff',
  padding: theme.spacing(4),
}));

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  width: '100%', // Make it full-width on smaller screens
  maxWidth: '400px', // Limit width on larger screens
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#4caf50',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#388e3c',
  },
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  height: 48,
}));

const Login = () => {
  const dispatch: AppDispatch = useDispatch(); // Use AppDispatch type here
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const initialValues = useMemo(() => loginInitialValue, []);

  const handleSubmit = useCallback(
    async (values: LoginFormValues) => {
      try {
        await dispatch(loginUser(values)).unwrap(); // Unwrap the result
        navigate('/dashboard'); // Redirect after successful login
      } catch (err) {
        // Handle login failure
        console.error('Login failed:', err); // Optionally log error
      }
    },
    [dispatch, navigate],
  );

  return (
    <StyledContainer maxWidth={false}>
      <StyledBox>
        <StyledTypography component="h1" variant="h5" color="textSecondary">
          Welcome Back
        </StyledTypography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
          Please log in to your account
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form>
              <Box sx={{ mt: 1 }}>
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  disabled={isSubmitting}
                  error={!!error || !!errors.email}
                  helperText={<ErrorMessage name="email" />}
                  InputProps={{
                    style: { height: '56px' }, // Consistent height for fields
                  }}
                  data-testid="email-field" // Added test ID
                />

                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  disabled={isSubmitting}
                  id="password"
                  autoComplete="current-password"
                  error={!!error || !!errors.password}
                  helperText={<ErrorMessage name="password" />}
                  InputProps={{
                    style: { height: '56px' }, // Consistent height
                  }}
                  data-testid="password-field" // Added test ID
                />

                <StyledButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting || loading}
                  data-testid="login-button" // Added test ID
                >
                  Sign In{' '}
                  {loading && <CircularProgress size={15} sx={{ ml: 1 }} />}
                </StyledButton>

                {error && (
                  <Typography
                    color="error"
                    sx={{ mb: 2 }}
                    data-testid="error-message"
                  >
                    {error}
                  </Typography>
                )}

                <Grid
                  container
                  justifyContent="space-between"
                  sx={{ flexWrap: 'nowrap' }}
                >
                  <Grid item>
                    <Button
                      onClick={() => navigate('/forgot-password')}
                      variant="text"
                      color="primary"
                      sx={{ textDecoration: 'underline' }}
                      data-testid="forgot-password-button" // Added test ID
                    >
                      Forgot Password?
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() => navigate('/register')}
                      variant="text"
                      color="primary"
                      sx={{ textDecoration: 'underline' }}
                      data-testid="register-button" // Added test ID
                    >
                      Create Account
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Form>
          )}
        </Formik>
      </StyledBox>
    </StyledContainer>
  );
};

export default React.memo(Login);
