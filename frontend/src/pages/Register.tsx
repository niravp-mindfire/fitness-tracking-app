import React, { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import {
  registerUser,
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  useMediaQuery,
  useTheme,
  styled,
} from '@mui/material';
import { RegisterFormValues } from '../utils/types';
import { calculateAge } from '../utils/common';
import { registerSchema } from '../utils/validationSchema';
import { registerInitialValue } from '../utils/initialValues';

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
  maxWidth: '500px', // Limit width on larger screens
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

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const initialValues = useMemo(() => registerInitialValue, []);

  const handleSubmit = useCallback(
    async (values: RegisterFormValues) => {
      const age = calculateAge(values.profile.dob);
      const userData = {
        ...values,
        profile: {
          ...values.profile,
          age,
        },
      };

      try {
        await dispatch(registerUser(userData)).unwrap();
        navigate('/login');
      } catch (error) {
        console.error('Registration failed:', error);
      }
    },
    [dispatch, navigate],
  );

  return (
    <StyledContainer maxWidth={false}>
      <StyledBox
        data-testid="register-form"
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <StyledTypography
          component="h1"
          variant={isMobile ? 'h6' : 'h5'}
          color="textSecondary"
          data-testid="register-title"
        >
          Register
        </StyledTypography>
        <Formik
          initialValues={initialValues}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form>
              <Box sx={{ mt: 1 }}>
                {/* Profile Fields */}
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="profile.firstName"
                  disabled={isSubmitting}
                  label="First Name"
                  name="profile.firstName"
                  helperText={<ErrorMessage name="profile.firstName" />}
                  error={!!error || !!errors?.profile?.firstName}
                  data-testid="firstName-input"
                />
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="profile.lastName"
                  disabled={isSubmitting}
                  label="Last Name"
                  name="profile.lastName"
                  helperText={<ErrorMessage name="profile.lastName" />}
                  error={!!error || !!errors?.profile?.lastName}
                  data-testid="lastName-input"
                />
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="username"
                  disabled={isSubmitting}
                  label="Username"
                  name="username"
                  helperText={<ErrorMessage name="username" />}
                  error={!!error || !!errors?.username}
                  data-testid="username-input"
                />
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  disabled={isSubmitting}
                  label="Email Address"
                  name="email"
                  helperText={<ErrorMessage name="email" />}
                  error={!!error || !!errors?.email}
                  data-testid="email-input"
                />
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  disabled={isSubmitting}
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  helperText={<ErrorMessage name="password" />}
                  error={!!error || !!errors?.password}
                  data-testid="password-input"
                />
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="profile.dob"
                  label="Date of Birth"
                  disabled={isSubmitting}
                  name="profile.dob"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText={<ErrorMessage name="profile.dob" />}
                  error={!!error || !!errors?.profile?.dob}
                  data-testid="dob-input"
                />
                {/* Gender Dropdown */}
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel id="profile.gender-label">Gender</InputLabel>
                  <Field
                    as={Select}
                    labelId="profile.gender-label"
                    id="profile.gender"
                    name="profile.gender"
                    disabled={isSubmitting}
                    label="Gender"
                    error={!!error || !!errors?.profile?.gender}
                    data-testid="gender-select"
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Field>
                </FormControl>
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="profile.height"
                  disabled={isSubmitting}
                  label="Height (cm)"
                  name="profile.height"
                  type="number"
                  helperText={<ErrorMessage name="profile.height" />}
                  error={!!error || !!errors?.profile?.height}
                  data-testid="height-input"
                  inputProps={{ min: 0, max: 300 }}
                />
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="profile.weight"
                  disabled={isSubmitting}
                  label="Weight (kg)"
                  name="profile.weight"
                  type="number"
                  helperText={<ErrorMessage name="profile.weight" />}
                  error={!!error || !!errors?.profile?.weight}
                  data-testid="weight-input"
                  inputProps={{ min: 0, max: 500 }}
                />
                <StyledButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  sx={{ mt: 3, mb: 2 }}
                  data-testid="register-button"
                >
                  Register{' '}
                  {loading && <CircularProgress size={15} sx={{ ml: 1 }} />}
                </StyledButton>
                {error && (
                  <StyledTypography
                    color="error"
                    sx={{ mb: 2 }}
                    data-testid="error-message"
                  >
                    {error}
                  </StyledTypography>
                )}
                {/* Already have an account? */}
                <StyledTypography
                  color="textSecondary"
                  variant="body2"
                  align="center"
                  sx={{ mt: 2 }}
                >
                  Already have an account?
                  <StyledButton
                    onClick={() => navigate('/login')}
                    color="primary"
                    sx={{ textDecoration: 'underline', ml: 1 }}
                  >
                    Login
                  </StyledButton>
                </StyledTypography>
              </Box>
            </Form>
          )}
        </Formik>
      </StyledBox>
    </StyledContainer>
  );
};

export default Register;
