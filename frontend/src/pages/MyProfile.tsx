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
          data-testid="profile-title"
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
                          data-testid="first-name-input"
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
                          data-testid="last-name-input"
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
                          data-testid="dob-input"
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
                          data-testid="age-input"
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
                            data-testid="gender-select"
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
                          data-testid="height-input"
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
                          data-testid="weight-input"
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
                                  data-testid={`goal-type-${index}`}
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
                                  data-testid={`target-value-${index}`}
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
                                  data-testid={`current-value-${index}`}
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
                                  data-testid={`target-date-${index}`}
                                />
                                <ErrorMessage
                                  name={`fitnessGoals.${index}.targetDate`}
                                  component={Typography}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={3}>
                                <Button
                                  onClick={() => remove(index)}
                                  variant="outlined"
                                  color="secondary"
                                  disabled={isSubmitting}
                                  data-testid={`remove-goal-${index}`}
                                >
                                  Remove Goal
                                </Button>
                              </Grid>
                            </Grid>
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
                          variant="outlined"
                          disabled={isSubmitting}
                          data-testid="add-goal"
                        >
                          Add Goal
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </CardContent>
              </Card>
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    data-testid="submit-button"
                  >
                    Save Changes
                  </Button>
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default MyProfile;
