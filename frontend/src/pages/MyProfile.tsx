import React, { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { updateProfileSchema } from '../utils/validationSchema';
import { updateProfileInitialValues } from '../utils/initialValues';
import {
  updateUserProfile,
  getProfile,
} from '../features/profile/profileSlice';
import { toast } from 'react-toastify';
import { ProfileFormValues } from '../utils/types';
import { calculateAge, formatDateForInput } from '../utils/common';

const MyProfile = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.profile.loading);
  const userProfile = useAppSelector((state) => state.profile.data);
  const error = useAppSelector((state) => state.profile.error);

  const fetchProfile = async () => {
    await dispatch(getProfile()).unwrap();
  };

  useEffect(() => {
    fetchProfile();
  }, [dispatch]);

  const initialValues = useMemo(() => {
    return updateProfileInitialValues(userProfile);
  }, [userProfile]);

  const handleSubmit = useCallback(
    async (values: ProfileFormValues) => {
      const age = calculateAge(values.profile.dob);
      const dob = values.profile.dob
        ? new Date(values.profile.dob).toISOString().split('T')[0]
        : null;
      const userData: any = {
        firstName: values.profile.firstName,
        lastName: values.profile.lastName,
        dob,
        age,
        gender: values.profile.gender,
        height: values.profile.height,
        weight: values.profile.weight,
        fitnessGoals: values.fitnessGoals,
      };

      try {
        await dispatch(updateUserProfile(userData)).unwrap();
        toast.success('Profile updated successfully!');
        fetchProfile();
      } catch (error) {
        toast.error('Failed to update profile');
      }
    },
    [dispatch],
  );

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: { xs: 0, sm: 3 },
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          sx={{ mb: 3, textAlign: 'center' }}
        >
          My Profile
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={updateProfileSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, errors }) => (
            <Form>
              <Box sx={{ mb: 4 }}>
                <Card variant="outlined" sx={{ padding: { xs: 0, sm: 3 } }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          label="First Name"
                          disabled={isSubmitting}
                          name="profile.firstName"
                          helperText={<ErrorMessage name="profile.firstName" />}
                          error={!!error || !!errors?.profile?.firstName}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          label="Last Name"
                          name="profile.lastName"
                          disabled={isSubmitting}
                          helperText={<ErrorMessage name="profile.lastName" />}
                          error={!!error || !!errors?.profile?.lastName}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          label="Date of Birth"
                          name="profile.dob"
                          type="date"
                          disabled={isSubmitting}
                          value={formatDateForInput(userProfile?.profile?.dob)}
                          InputLabelProps={{ shrink: true }}
                          helperText={<ErrorMessage name="profile.dob" />}
                          error={!!error || !!errors?.profile?.dob}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          label="Age"
                          name="profile.age"
                          type="number"
                          disabled={isSubmitting}
                          value={calculateAge(values.profile.dob)}
                          InputProps={{ readOnly: true }}
                          helperText={<ErrorMessage name="profile.age" />}
                          error={!!error || !!errors?.profile?.age}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel id="gender-label">Gender</InputLabel>
                          <Field
                            as={Select}
                            labelId="gender-label"
                            name="profile.gender"
                            label="Gender"
                            disabled={isSubmitting}
                            error={!!error || !!errors?.profile?.gender}
                          >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                          </Field>
                          <ErrorMessage
                            name="profile.gender"
                            component={Typography}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          label="Height (cm)"
                          name="profile.height"
                          disabled={isSubmitting}
                          type="number"
                          helperText={<ErrorMessage name="profile.height" />}
                          error={!!error || !!errors?.profile?.height}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          label="Weight (kg)"
                          name="profile.weight"
                          disabled={isSubmitting}
                          type="number"
                          helperText={<ErrorMessage name="profile.weight" />}
                          error={!!error || !!errors?.profile?.weight}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>

              {/* Fitness Goals Section */}
              <Card variant="outlined" sx={{ padding: { xs: 0, sm: 3 } }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Fitness Goals
                  </Typography>
                  <FieldArray name="fitnessGoals">
                    {({ push, remove }) => (
                      <div>
                        {values.fitnessGoals.map((goal: any, index: number) => (
                          <Box key={index} sx={{ mb: 2 }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6} md={3}>
                                <Field
                                  as={TextField}
                                  variant="outlined"
                                  fullWidth
                                  disabled={isSubmitting}
                                  label="Goal Type"
                                  name={`fitnessGoals.${index}.goalType`}
                                />
                                <ErrorMessage
                                  name={`fitnessGoals.${index}.goalType`}
                                  component={Typography}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={3}>
                                <Field
                                  as={TextField}
                                  variant="outlined"
                                  fullWidth
                                  disabled={isSubmitting}
                                  label="Target Value"
                                  name={`fitnessGoals.${index}.targetValue`}
                                  type="number"
                                />
                                <ErrorMessage
                                  name={`fitnessGoals.${index}.targetValue`}
                                  component={Typography}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={3}>
                                <Field
                                  as={TextField}
                                  variant="outlined"
                                  fullWidth
                                  disabled={isSubmitting}
                                  label="Current Value"
                                  name={`fitnessGoals.${index}.currentValue`}
                                  type="number"
                                />
                                <ErrorMessage
                                  name={`fitnessGoals.${index}.currentValue`}
                                  component={Typography}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={3}>
                                <Field
                                  as={TextField}
                                  variant="outlined"
                                  fullWidth
                                  disabled={isSubmitting}
                                  label="Target Date"
                                  name={`fitnessGoals.${index}.targetDate`}
                                  type="date"
                                  InputLabelProps={{ shrink: true }}
                                  value={formatDateForInput(
                                    values.fitnessGoals[index].targetDate,
                                  )}
                                />
                                <ErrorMessage
                                  name={`fitnessGoals.${index}.targetDate`}
                                  component={Typography}
                                />
                              </Grid>
                            </Grid>
                            <Button
                              onClick={() => remove(index)}
                              variant="contained"
                              color="secondary"
                              sx={{ mt: 2 }}
                              disabled={isSubmitting}
                            >
                              Remove Goal
                            </Button>
                          </Box>
                        ))}
                        <Button
                          onClick={() =>
                            push({
                              goalType: '',
                              targetValue: '',
                              currentValue: '',
                              targetDate: '',
                            })
                          }
                          variant="contained"
                          color="primary"
                          disabled={isSubmitting}
                        >
                          Add Goal
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                >
                  Update Profile
                </Button>
              </Box>

              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default MyProfile;
