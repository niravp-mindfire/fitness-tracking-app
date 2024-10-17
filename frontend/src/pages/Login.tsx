// src/components/Login.tsx
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
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: { xs: 2, sm: 4 }, // Add responsive padding
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: 3, // Add box shadow for a card-like appearance
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Welcome Back
        </Typography>
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

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || loading}
                  sx={{ mt: 3, mb: 2, height: 48 }}
                  data-testid="login-button" // Added test ID
                >
                  Sign In{' '}
                  {loading && <CircularProgress size={15} sx={{ ml: 1 }} />}
                </Button>

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
      </Box>
    </Container>
  );
};

export default React.memo(Login);
