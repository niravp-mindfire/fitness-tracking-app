// src/components/Login.tsx
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { loginUser, selectAuthLoading, selectAuthError } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, TextField, Typography, Container, Grid } from '@mui/material';
import { AppDispatch } from '../app/store'; // Import the AppDispatch type
import { LoginFormValues } from '../utils/types';
import { loginSchema } from '../utils/validationSchema';
import { loginInitialValue } from '../utils/initialValues';

const Login = () => {
  const dispatch: AppDispatch = useDispatch(); // Use AppDispatch type here
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const initialValues = useMemo(() => (loginInitialValue), []);

  const handleSubmit = useCallback(async (values: LoginFormValues) => {
    try {
      await dispatch(loginUser(values)).unwrap(); // Unwrap the result
      navigate('/dashboard'); // Redirect after successful login
    } catch (err) {
      // Handle login failure
      console.error('Login failed:', err); // Optionally log error
    }
  }, [dispatch, navigate]);

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
          {({ isSubmitting }) => (
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
                  error={!!error} // Show error styling if there's an error
                  helperText={<ErrorMessage name="email" />}
                  InputProps={{
                    style: { height: '56px' }, // Consistent height
                  }}
                />

                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  error={!!error} // Show error styling if there's an error
                  helperText={<ErrorMessage name="password" />}
                  InputProps={{
                    style: { height: '56px' }, // Consistent height
                  }}
                />

                {loading && <CircularProgress sx={{ mt: 1 }} />}
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || loading}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? 'Logging in...' : 'Sign In'}
                </Button>

                {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

                <Grid container>
                  <Grid item xs>
                    <Button onClick={() => navigate('/forgot-password')} variant="text" color="primary">
                      Forgot Password?
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button onClick={() => navigate('/register')} variant="text" color="primary">
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
