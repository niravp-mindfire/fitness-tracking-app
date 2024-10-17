// src/pages/ForgetPassword.tsx
import React, { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import {
  forgetPassword as forgetPasswordAction,
  selectAuthError,
  selectAuthLoading,
} from '../features/auth/auth';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Container,
} from '@mui/material';
import { ForgetPasswordFormValues } from '../utils/types';
import { forgetPasswordSchema } from '../utils/validationSchema';
import { forgetPasswordInitialValue } from '../utils/initialValues';
import { toast } from 'react-toastify';

const ForgetPassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const initialValues = useMemo(() => forgetPasswordInitialValue, []);

  const handleSubmit = useCallback(
    async (values: ForgetPasswordFormValues) => {
      try {
        await dispatch(forgetPasswordAction(values)).unwrap();
        toast.success(
          'If an account with that email address exists, you will receive an email with a link to reset your password.',
        );
      } catch (error) {
        toast.error('Failed to send password reset link.');
        console.error('Forget password request failed:', error);
      }
    },
    [dispatch],
  );

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        data-testid="forget-password-form"
      >
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mb: 4, textAlign: 'center' }}
        >
          Enter your email address and we'll send you a link to reset your
          password.
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={forgetPasswordSchema}
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
                  disabled={isSubmitting || loading}
                  error={!!error || errors.email}
                  helperText={<ErrorMessage name="email" />}
                  InputProps={{
                    style: { height: '56px' }, // Consistent height
                  }}
                  inputProps={{ 'data-testid': 'email-input' }} // Added here
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || loading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    height: '48px', // Consistent button height
                  }}
                  data-testid="submit-button" // Added here
                >
                  Send Reset Link{' '}
                  {loading && <CircularProgress size={15} sx={{ ml: 1 }} />}
                </Button>
                {error && (
                  <Typography
                    color="error"
                    sx={{ mb: 2, textAlign: 'center' }}
                    data-testid="error-message"
                  >
                    {error}
                  </Typography>
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default React.memo(ForgetPassword);
