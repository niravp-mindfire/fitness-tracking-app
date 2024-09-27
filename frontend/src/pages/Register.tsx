// src/pages/Register.tsx
import React, { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks'; 
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { registerUser, selectAuthError, selectAuthLoading } from '../features/auth/authSlice'; 
import { useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, TextField, Typography, Container, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { RegisterFormValues } from '../utils/types';
import { calculateAge } from '../utils/common';
import { registerSchema } from '../utils/validationSchema';
import { registerInitialValue } from '../utils/initialValues';

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const initialValues = useMemo(() => (registerInitialValue), []);

  const handleSubmit = useCallback(async (values: RegisterFormValues) => {
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
  }, [dispatch, navigate]);

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box sx={{ mt: 1 }}>
                {/* Profile Fields */}
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="profile.firstName"
                  label="First Name"
                  name="profile.firstName"
                  helperText={<ErrorMessage name="profile.firstName" />}
                />

                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="profile.lastName"
                  label="Last Name"
                  name="profile.lastName"
                  helperText={<ErrorMessage name="profile.lastName" />}
                />
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  helperText={<ErrorMessage name="username" />}
                />

                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  helperText={<ErrorMessage name="email" />}
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
                  helperText={<ErrorMessage name="password" />}
                />

                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="profile.dob"
                  label="Date of Birth"
                  name="profile.dob"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText={<ErrorMessage name="profile.dob" />}
                />

                {/* Gender Dropdown */}
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel id="profile.gender-label">Gender</InputLabel>
                  <Field
                    as={Select}
                    labelId="profile.gender-label"
                    id="profile.gender"
                    name="profile.gender"
                    label="Gender"
                    helperText={<ErrorMessage name="profile.gender" />}
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
                  label="Height (cm)"
                  name="profile.height"
                  type="number"
                  helperText={<ErrorMessage name="profile.height" />}
                />

                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="profile.weight"
                  label="Weight (kg)"
                  name="profile.weight"
                  type="number"
                  helperText={<ErrorMessage name="profile.weight" />}
                />

                {loading && <CircularProgress />}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || loading}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? 'Registering...' : 'Register'}
                </Button>
                {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

                {/* Already have an account? */}
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                  Already have an account? 
                  <Button
                    onClick={() => navigate('/login')}
                    color="primary"
                    sx={{ textDecoration: 'underline', ml: 1 }}
                  >
                    Login
                  </Button>
                </Typography>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Register;
