import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  TextField,
  Button,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import {
  createWorkoutExercise,
  updateWorkoutExercise,
  fetchWorkoutExerciseById,
} from '../../features/workoutExercise/workoutExerciseSlice';
import { fetchWorkouts } from '../../features/workout/workoutSlice';
import { fetchExercises } from '../../features/exercise/exerciseSlice';
import { RootState, useAppDispatch } from '../../app/store';
import { defaultPagination } from '../../utils/common';
import { DialogProps } from '../../utils/types';

const WorkoutExerciseForm: React.FC<DialogProps> = ({
  open = false,
  onClose = () => {},
  id = '',
}) => {
  const dispatch = useAppDispatch();
  const loading = useSelector(
    (state: RootState) => state.workoutExercise.loading,
  );
  const workoutExercise = useSelector(
    (state: RootState) => state.workoutExercise.currentWorkoutExercise,
  );
  const workouts = useSelector((state: RootState) => state.workout.workouts);
  const exercises = useSelector((state: RootState) => state.exercise.exercises);

  useEffect(() => {
    dispatch(fetchWorkouts(defaultPagination));
    dispatch(fetchExercises(defaultPagination)); // Adjust as needed

    // Fetch workout exercise data by ID if id is present
    if (id) {
      dispatch(fetchWorkoutExerciseById(id)); // Fetching workout exercise data
    }
  }, [dispatch, id]);

  const formik = useFormik({
    initialValues: {
      workoutId: '',
      exerciseId: '',
      sets: '',
      reps: '',
      weight: '',
    },
    onSubmit: async (values: any) => {
      if (id) {
        await dispatch(updateWorkoutExercise({ id, workoutExercise: values }));
      } else {
        await dispatch(createWorkoutExercise(values));
      }
      onClose(true);
    },
  });

  useEffect(() => {
    if (workoutExercise) {
      formik.setValues({
        workoutId: workoutExercise?.workoutId,
        exerciseId: workoutExercise?.exerciseId,
        sets: workoutExercise?.sets?.toString(),
        reps: workoutExercise?.reps?.toString(),
        weight: workoutExercise?.weight?.toString(),
      });
    }
  }, [workoutExercise, formik]);

  return (
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
        {id ? 'Edit Workout Exercise' : 'Add Workout Exercise'}
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
        <Box component="form" onSubmit={formik.handleSubmit}>
          <TextField
            label="Workout"
            select
            SelectProps={{ native: true }}
            InputLabelProps={{ shrink: true }}
            name="workoutId"
            disabled={formik.isSubmitting}
            value={formik.values.workoutId}
            onChange={formik.handleChange}
            fullWidth
          >
            <option value="" disabled>
              Select Workout
            </option>
            {workouts?.map((workout: any) => (
              <option key={workout?._id} value={workout?._id}>
                Duration: {workout?.duration} - Date:{' '}
                {new Date(workout?.date).toDateString()}
              </option>
            ))}
          </TextField>

          <TextField
            label="Exercise"
            select
            InputLabelProps={{ shrink: true }}
            SelectProps={{ native: true }}
            name="exerciseId"
            disabled={formik.isSubmitting}
            value={formik.values.exerciseId}
            onChange={formik.handleChange}
            fullWidth
            sx={{ mt: 2 }}
          >
            <option value="" disabled>
              Select Exercise
            </option>
            {exercises?.map((exercise: any) => (
              <option key={exercise?._id} value={exercise?._id}>
                {exercise?.name}
              </option>
            ))}
          </TextField>

          <TextField
            label="Sets"
            name="sets"
            InputLabelProps={{ shrink: true }}
            value={formik.values.sets}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Reps"
            name="reps"
            InputLabelProps={{ shrink: true }}
            value={formik.values.reps}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Weight (kg)"
            name="weight"
            InputLabelProps={{ shrink: true }}
            value={formik.values.weight}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {id ? 'Update Workout Exercise' : 'Add Workout Exercise'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutExerciseForm;
