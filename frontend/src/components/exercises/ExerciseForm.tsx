import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  createExercise,
  updateExercise,
  fetchExerciseById,
  resetCurrentExercise,
} from '../../features/exercise/exerciseSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ExerciseSchema } from '../../utils/validationSchema';
import { DialogProps } from '../../utils/types';

const ExerciseForm: React.FC<DialogProps> = ({
  open = false,
  onClose = () => {},
  id = '',
}) => {
  const dispatch = useAppDispatch();
  const existingExercise = useAppSelector(
    (state) => state.exercise.currentExercise,
  );
  const [loading, setLoading] = React.useState(false);

  // Fetch exercise by ID if we're in edit mode
  useEffect(() => {
    if (id && !existingExercise) {
      dispatch(fetchExerciseById(id));
    }
  }, [id, existingExercise, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetCurrentExercise());
    };
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: existingExercise?.name || '',
      type: existingExercise?.type || '',
      category: existingExercise?.category || '',
      description: existingExercise?.description || '',
    },
    validationSchema: ExerciseSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (id) {
          await dispatch(
            updateExercise({ id: id as string, exercise: values }),
          ).unwrap();
        } else {
          await dispatch(createExercise(values)).unwrap();
        }
        onClose(true);
      } catch (error) {
        console.error('Failed to save exercise:', error);
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
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {id ? 'Edit Exercise' : 'Add Exercise'}
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
            label="Name"
            disabled={formik.isSubmitting}
            {...formik.getFieldProps('name')}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={
              formik.touched.name && formik.errors.name
                ? String(formik.errors.name)
                : ''
            }
          />
          <TextField
            fullWidth
            label="Type"
            {...formik.getFieldProps('type')}
            disabled={formik.isSubmitting}
            error={formik.touched.type && Boolean(formik.errors.type)}
            helperText={
              formik.touched.type && formik.errors.type
                ? String(formik.errors.type)
                : ''
            }
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Category"
            {...formik.getFieldProps('category')}
            disabled={formik.isSubmitting}
            error={formik.touched.category && Boolean(formik.errors.category)}
            helperText={
              formik.touched.category && formik.errors.category
                ? String(formik.errors.category)
                : ''
            }
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            {...formik.getFieldProps('description')}
            disabled={formik.isSubmitting}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={
              formik.touched.description && formik.errors.description
                ? String(formik.errors.description)
                : ''
            }
            sx={{ mt: 2 }}
          />
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : id ? (
              'Update Exercise'
            ) : (
              'Add Exercise'
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseForm;
