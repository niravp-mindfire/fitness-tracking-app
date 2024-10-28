import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Grid,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  createWorkout,
  updateWorkout,
  fetchWorkoutById,
  resetCurrentWorkout,
} from '../../features/workout/workoutSlice';
import { RootState, useAppDispatch } from '../../app/store';
import { DialogProps } from '../../utils/types';

// Validation schema
const validationSchema = Yup.object({
  date: Yup.date().required('Date is required'),
  duration: Yup.number()
    .required('Duration is required')
    .min(1, 'Duration must be at least 1 minute'),
  notes: Yup.string().optional(),
});

const WorkoutForm: React.FC<DialogProps> = ({
  open = false,
  onClose = () => {},
  id = '',
}) => {
  const dispatch = useAppDispatch();
  const existingWorkout = useSelector((state: RootState) =>
    id ? state.workout.currentWorkout : null,
  );
  const [loading, setLoading] = useState(false);

  // Fetch workout by ID if we're in edit mode
  useEffect(() => {
    if (id && !existingWorkout) {
      dispatch(fetchWorkoutById(id));
    }
  }, [id, existingWorkout, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetCurrentWorkout(null));
    };
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      date: existingWorkout
        ? new Date(existingWorkout.date).toISOString().split('T')[0]
        : '',
      duration: existingWorkout?.duration || '',
      notes: existingWorkout?.notes || '',
    },
    validationSchema,
    onSubmit: async (values: any) => {
      setLoading(true);
      try {
        if (id) {
          await dispatch(
            updateWorkout({ id: id as string, workout: values }),
          ).unwrap();
        } else {
          await dispatch(createWorkout(values)).unwrap();
        }
        onClose(true);
      } catch (error) {
        console.error('Failed to save workout:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose(false);
        formik.resetForm();
      }}
      maxWidth="sm" // Set maxWidth as 'sm' for small screens
      fullWidth
      className="custom-modal p-6"
    >
      <DialogTitle className="relative">
        <Typography variant="h5" className="font-bold text-primary">
          {id ? 'Edit Workout' : 'Add Workout'}
        </Typography>
        <IconButton
          onClick={() => {
            onClose(false);
            formik.resetForm();
          }}
          style={{ marginTop: '-10px' }}
          className="absolute top-2 right-2"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                InputLabelProps={{
                  shrink: true,
                  sx: { marginTop: '5px' },
                }}
                disabled={formik.isSubmitting}
                {...formik.getFieldProps('date')}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={
                  formik.touched.date && formik.errors.date
                    ? String(formik.errors.date)
                    : ''
                }
                inputProps={{
                  min: new Date().toISOString().split('T')[0],
                }}
                className="w-full"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                disabled={formik.isSubmitting}
                {...formik.getFieldProps('duration')}
                error={
                  formik.touched.duration && Boolean(formik.errors.duration)
                }
                helperText={
                  formik.touched.duration && formik.errors.duration
                    ? String(formik.errors.duration)
                    : ''
                }
                inputProps={{ min: 0, max: 300 }}
                className="w-full"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={4}
                disabled={formik.isSubmitting}
                {...formik.getFieldProps('notes')}
                error={formik.touched.notes && Boolean(formik.errors.notes)}
                helperText={
                  formik.touched.notes && formik.errors.notes
                    ? String(formik.errors.notes)
                    : ''
                }
                className="w-full"
              />
            </Grid>
          </Grid>

          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            className="mt-4 bg-primary hover:bg-primary-dark text-white py-2"
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : id ? (
              'Update Workout'
            ) : (
              'Add Workout'
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutForm;
