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
import { calculateAge, formatDateForInput } from '../utils/common'; // Assuming you have this function

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
      // Calculate age from DOB
      const age = calculateAge(values.profile.dob);
      const dob = values.profile.dob
        ? new Date(values.profile.dob).toISOString().split('T')[0]
        : null;
      const userData: any = {
        firstName: values.profile.firstName, // Keeping the original structure
        lastName: values.profile.lastName,
        dob, // Assign the formatted date of birth
        age, // Assign the calculated age
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
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
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
                <Card variant="outlined">
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          label="First Name"
                          disabled={isSubmitting}
                          name="profile.firstName"
                          helperText={<ErrorMessage name="profile.firstName" />}
                          error={!!error || errors?.profile?.firstName}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          label="Last Name"
                          name="profile.lastName"
                          disabled={isSubmitting}
                          helperText={<ErrorMessage name="profile.lastName" />}
                          error={!!error || errors?.profile?.lastName}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
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
                          error={!!error || errors?.profile?.dob}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          label="Age"
                          name="profile.age"
                          type="number"
                          disabled={isSubmitting}
                          value={calculateAge(values.profile.dob)} // Calculate age based on DOB
                          InputProps={{ readOnly: true }} // Make age read-only
                          helperText={<ErrorMessage name="profile.age" />}
                          error={!!error || errors?.profile?.age}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel id="gender-label">Gender</InputLabel>
                          <Field
                            as={Select}
                            labelId="gender-label"
                            name="profile.gender"
                            label="Gender"
                            disabled={isSubmitting}
                            error={!!error || errors?.profile?.gender}
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
                      <Grid item xs={12} md={6}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          label="Height (cm)"
                          name="profile.height"
                          disabled={isSubmitting}
                          type="number"
                          helperText={<ErrorMessage name="profile.height" />}
                          error={!!error || errors?.profile?.height}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          label="Weight (kg)"
                          name="profile.weight"
                          disabled={isSubmitting}
                          type="number"
                          helperText={<ErrorMessage name="profile.weight" />}
                          error={!!error || errors?.profile?.weight}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>

              {/* Fitness Goals Section */}
              <Card variant="outlined">
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
                              <Grid item xs={12} md={3}>
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
                              <Grid item xs={12} md={3}>
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
                              <Grid item xs={12} md={3}>
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
                              <Grid item xs={12} md={3}>
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
                              targetValue: 0,
                              currentValue: 0,
                              targetDate: '',
                            })
                          }
                          variant="contained"
                          color="primary"
                          sx={{ mt: 2 }}
                          disabled={isSubmitting}
                        >
                          Add Goal
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </CardContent>
              </Card>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ mt: 3, mb: 2 }}
              >
                Update Profile{' '}
                {loading && <CircularProgress size={15} sx={{ ml: 1 }} />}
              </Button>

              {error && <Typography color="error">{error}</Typography>}
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default MyProfile;
