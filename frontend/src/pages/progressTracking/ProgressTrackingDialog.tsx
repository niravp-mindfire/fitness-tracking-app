import React, { useEffect, useState } from 'react';
import { FormikErrors, useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/store';
import {
  createProgressTracking,
  updateProgressTracking,
  selectProgressTrackingError,
  fetchProgressTrackingById,
} from '../../features/progressTracking/progressTrackingSlice';

interface ProgressTrackingDialogProps {
  open: boolean;
  onClose: (fetch: boolean) => void;
  id?: string;
}

interface ProgressTrackingFormValues {
  weight: number;
  date: string;
  bodyFatPercentage?: number;
  muscleMass?: number;
  notes: string;
}

const ProgressTrackingDialog: React.FC<ProgressTrackingDialogProps> = ({
  open,
  onClose,
  id = '',
}) => {
  const dispatch = useAppDispatch();
  const currentProgressTracking: any = useAppSelector(
    (state) => state.progressTracking.currentProgressTracking,
  );

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const error = useAppSelector(selectProgressTrackingError);

  const [initialValues, setInitialValues] =
    useState<ProgressTrackingFormValues>({
      weight: 0,
      date: '',
      bodyFatPercentage: undefined,
      muscleMass: undefined,
      notes: '',
    });

  useEffect(() => {
    if (open) {
      if (id) {
        dispatch(fetchProgressTrackingById(id));
      } else {
        setInitialValues({
          weight: 0,
          date: '',
          bodyFatPercentage: undefined,
          muscleMass: undefined,
          notes: '',
        });
      }
    }
  }, [open, id]);

  useEffect(() => {
    if (currentProgressTracking && id) {
      setInitialValues({
        weight: currentProgressTracking.weight,
        date: currentProgressTracking.date.split('T')[0],
        bodyFatPercentage: currentProgressTracking.bodyFatPercentage,
        muscleMass: currentProgressTracking.muscleMass,
        notes: currentProgressTracking.notes,
      });
    }
  }, [currentProgressTracking, id]);

  const validationSchema = Yup.object({
    weight: Yup.number().required('Weight is required').positive().integer(),
    date: Yup.date().required('Date is required'),
    bodyFatPercentage: Yup.number().positive().integer().nullable(),
    muscleMass: Yup.number().positive().integer().nullable(),
  });

  const formik = useFormik<ProgressTrackingFormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values: any) => {
      // Mark all fields as touched to trigger validation messages
      formik.setTouched({
        weight: true,
        date: true,
        bodyFatPercentage: true,
        muscleMass: true,
        notes: true,
      });

      if (formik.isValid) {
        try {
          if (id) {
            await dispatch(
              updateProgressTracking({ id, tracking: values }),
            ).unwrap();
          } else {
            await dispatch(createProgressTracking(values)).unwrap();
          }
          onClose(true);
          formik.resetForm();
        } catch (error) {
          setSnackbarOpen(true);
        }
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
    }
  }, [error]);

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
        {id ? 'Edit Progress Tracking' : 'Add Progress Tracking'}
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
            fullWidth
            label="Date"
            name="date"
            type="date"
            value={formik.values.date}
            disabled={formik.isSubmitting}
            InputLabelProps={{ shrink: true }}
            onChange={formik.handleChange}
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date ? formik.errors.date : ''}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Weight (kg)"
            name="weight"
            type="number"
            value={formik.values.weight}
            disabled={formik.isSubmitting}
            InputLabelProps={{ shrink: true }}
            onChange={formik.handleChange}
            error={formik.touched.weight && Boolean(formik.errors.weight)}
            helperText={formik.touched.weight ? formik.errors.weight : ''}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Body Fat Percentage"
            name="bodyFatPercentage"
            type="number"
            disabled={formik.isSubmitting}
            value={formik.values.bodyFatPercentage || ''}
            InputLabelProps={{ shrink: true }}
            onChange={formik.handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Muscle Mass"
            name="muscleMass"
            type="number"
            disabled={formik.isSubmitting}
            value={formik.values.muscleMass || ''}
            InputLabelProps={{ shrink: true }}
            onChange={formik.handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Notes"
            name="notes"
            value={formik.values.notes}
            disabled={formik.isSubmitting}
            onChange={formik.handleChange}
            InputLabelProps={{ shrink: true }}
            error={formik.touched.notes && Boolean(formik.errors.notes)}
            helperText={formik.touched.notes ? formik.errors.notes : ''}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            {id ? 'Update' : 'Add'}
          </Button>
        </Box>
      </DialogContent>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error ? error : 'An error occurred. Please try again.'}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default ProgressTrackingDialog;
