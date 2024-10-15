import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  IconButton,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/store';
import {
  fetchWorkoutPlanById,
  createWorkoutPlan,
  updateWorkoutPlan,
  resetCurrentWorkoutPlan,
  selectWorkoutPlanError,
} from '../../features/workoutPlan/workoutPlanSlice';
import { fetchExercises } from '../../features/exercise/exerciseSlice';
import { defaultPagination } from '../../utils/common';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SnackAlert from '../../component/SnackAlert';
import { DialogProps } from '../../utils/types';

interface ExerciseEntry {
  exerciseId: string;
  sets: number;
  reps: number;
}

interface FormValues {
  title: string;
  description: string;
  duration: number;
  exercises: ExerciseEntry[];
}

const WorkoutPlanForm: React.FC<DialogProps> = ({
  open = false,
  onClose = () => {},
  id = '',
}) => {
  const dispatch = useAppDispatch();
  const currentWorkoutPlan = useAppSelector(
    (state) => state.workoutPlan.currentWorkoutPlan,
  );

  const exercises = useAppSelector((state) => state.exercise.exercises);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Local error state
  const error = useAppSelector(selectWorkoutPlanError);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [isSave, setIsSave] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (id) {
          await dispatch(fetchWorkoutPlanById(id));
        } else {
          dispatch(resetCurrentWorkoutPlan());
        }
        await dispatch(fetchExercises(defaultPagination));
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setErrorMessage('Failed to fetch workout plan data.'); // Update error state
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch]);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    duration: Yup.number()
      .required('Duration is required')
      .positive('Duration must be a positive number'),
    exercises: Yup.array()
      .of(
        Yup.object({
          exerciseId: Yup.string().required('Exercise is required'),
          sets: Yup.number()
            .required('Sets are required')
            .min(1, 'Sets must be at least 1'),
          reps: Yup.number()
            .required('Reps are required')
            .min(1, 'Reps must be at least 1'),
        }),
      )
      .min(1, 'At least one exercise must be added'),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      title: currentWorkoutPlan?.title || '',
      description: currentWorkoutPlan?.description || '',
      duration: currentWorkoutPlan?.duration || 0,
      exercises: currentWorkoutPlan?.exercises || [
        { exerciseId: '', sets: 0, reps: 0 },
      ],
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (id) {
          await dispatch(
            updateWorkoutPlan({ id, workoutPlan: values }),
          ).unwrap();
        } else {
          await dispatch(createWorkoutPlan(values)).unwrap();
        }
        setIsSave(true);
        onClose(true);
      } catch (error) {
        setSnackbarOpen(true); // Open snackbar on error
      }
    },
  });

  const handleAddExercise = () => {
    formik.setFieldValue('exercises', [
      ...formik.values.exercises,
      { exerciseId: '', sets: 0, reps: 0 },
    ]);
  };

  const handleRemoveExercise = (index: number) => {
    const updatedExercises = formik.values.exercises.filter(
      (_, i) => i !== index,
    );
    formik.setFieldValue('exercises', updatedExercises);
  };

  const handleExerciseChange = (
    index: number,
    field: keyof ExerciseEntry,
    value: string | number,
  ) => {
    const updatedExercises = [...formik.values.exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    formik.setFieldValue('exercises', updatedExercises);
  };

  useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
    }
  }, [error, dispatch]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          onClose(false);
          formik.resetForm();
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {id ? 'Edit Workout Plan' : 'Add Workout Plan'}
          <IconButton
            onClick={() => {
              onClose(false);
              formik.resetForm();
            }}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              disabled={formik.isSubmitting}
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Duration (Weeks)"
              name="duration"
              type="number"
              disabled={formik.isSubmitting}
              value={formik.values.duration}
              onChange={formik.handleChange}
              error={formik.touched.duration && Boolean(formik.errors.duration)}
              helperText={formik.touched.duration && formik.errors.duration}
              margin="normal"
            />

            <Typography variant="h6" sx={{ mt: 3 }}>
              Exercises
            </Typography>

            {formik.values.exercises.map((exercise, index) => (
              <Grid
                container
                spacing={2}
                alignItems="center"
                key={index}
                sx={{ mt: 1 }}
              >
                <Grid item xs={6}>
                  <TextField
                    select
                    label="Exercise"
                    value={exercise.exerciseId}
                    disabled={formik.isSubmitting}
                    onChange={(e) =>
                      handleExerciseChange(index, 'exerciseId', e.target.value)
                    }
                    fullWidth
                    error={
                      formik.touched.exercises &&
                      formik.touched.exercises[index] &&
                      Boolean(
                        formik.errors.exercises &&
                          formik.errors.exercises[index] &&
                          typeof formik.errors.exercises !== 'string',
                      )
                    }
                    helperText={
                      formik.touched.exercises &&
                      formik.touched.exercises[index] &&
                      formik.errors.exercises &&
                      typeof formik.errors.exercises !== 'string'
                    }
                  >
                    {exercises.map((ex) => (
                      <MenuItem key={ex._id} value={ex._id}>
                        {ex.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={2}>
                  <TextField
                    label="Sets"
                    name={`sets-${index}`}
                    type="number"
                    value={exercise.sets}
                    disabled={formik.isSubmitting}
                    onChange={(e) =>
                      handleExerciseChange(
                        index,
                        'sets',
                        parseInt(e.target.value),
                      )
                    }
                    fullWidth
                    error={
                      formik.touched.exercises &&
                      formik.touched.exercises[index] &&
                      Boolean(
                        formik.errors.exercises &&
                          formik.errors.exercises[index] &&
                          typeof formik.errors.exercises !== 'string',
                      )
                    }
                    helperText={
                      formik.touched.exercises &&
                      formik.touched.exercises[index] &&
                      formik.errors.exercises &&
                      typeof formik.errors.exercises !== 'string'
                    }
                  />
                </Grid>

                <Grid item xs={2}>
                  <TextField
                    label="Reps"
                    name={`reps-${index}`}
                    type="number"
                    value={exercise.reps}
                    disabled={formik.isSubmitting}
                    onChange={(e) =>
                      handleExerciseChange(
                        index,
                        'reps',
                        parseInt(e.target.value),
                      )
                    }
                    fullWidth
                    error={
                      formik.touched.exercises &&
                      formik.touched.exercises[index] &&
                      Boolean(
                        formik.errors.exercises &&
                          formik.errors.exercises[index] &&
                          typeof formik.errors.exercises !== 'string',
                      )
                    }
                    helperText={
                      formik.touched.exercises &&
                      formik.touched.exercises[index] &&
                      formik.errors.exercises &&
                      typeof formik.errors.exercises !== 'string'
                    }
                  />
                </Grid>

                <Grid item xs={2}>
                  <IconButton
                    onClick={() => handleRemoveExercise(index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            <Button
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleAddExercise}
              variant="outlined"
              sx={{ mt: 2 }}
            >
              Add Exercise
            </Button>

            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Save'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <SnackAlert
        snackbarOpen={isSave}
        setSnackbarOpen={setIsSave}
        type={`success`}
        message={`Record saved successfully`}
      />
      <SnackAlert
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        type={`error`}
        message={error || 'An error occurred!'}
      />
    </>
  );
};

export default WorkoutPlanForm;
