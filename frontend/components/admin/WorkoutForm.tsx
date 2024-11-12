'use client';
import React, { useEffect, useState } from 'react';
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
  DialogProps,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import axiosInstance from '@/utils/axiosInstance';
import { apiUrl } from '@/utils/apiUrl';
import { toast } from 'react-toastify';

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
  const [existingWorkout, setExistingWorkout] = useState({
    date: '',
    duration: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  // Fetch workout by ID if we're in edit mode
  useEffect(() => {
    if (id) {
      fetchWorkoutById(id);
    }
  }, [id]);

  const fetchWorkoutById = async (id: string) => {
    try {
      const response = await axiosInstance.get(`${apiUrl.WORKOUTS}/${id}`);
      if (response.status === 200) {
        setExistingWorkout(response.data.data);
      } else {
        setExistingWorkout({
          date: '',
          duration: '',
          notes: '',
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch workout');
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      date: existingWorkout?.date
        ? new Date(existingWorkout.date).toISOString().split('T')[0]
        : '',
      duration: existingWorkout?.duration || '',
      notes: existingWorkout?.notes || '',
    },
    validationSchema,
    onSubmit: async (values: any) => {
      setLoading(true);
      if (id) {
        try {
          const response = await axiosInstance.put(
            `${apiUrl.WORKOUTS}/${id}`,
            values,
          );
        } catch (error: any) {
          toast.error(
            error.response?.data?.message || 'Failed to update workout',
          );
        }
      } else {
        try {
          const response = await axiosInstance.post(apiUrl.WORKOUTS, values);
          if (response?.status == 201) {
            console.log(response?.data?.message, '====res');
            toast.success(
              response?.data?.data?.message || 'Workout created successfully',
            );
          }
        } catch (error: any) {
          toast.error(
            error.response?.data?.message || 'Failed to create workout',
          );
        }
      }
      onClose(true);
      setExistingWorkout({
        date: '',
        duration: '',
        notes: '',
      });
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
      <DialogTitle
        className="relative"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
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
            style={{ marginTop: '10px', backgroundColor: '#0D47A1' }}
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
