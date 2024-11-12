import React, { useEffect, useState } from 'react';
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
  DialogProps,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { ExerciseSchema } from '@/utils/validationSchema';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axiosInstance';
import { apiUrl } from '@/utils/apiUrl';

const ExerciseForm: React.FC<DialogProps> = ({
  open = false,
  onClose = () => {},
  id = '',
}) => {
  const [existingExercise, setExistingExercise] = useState({
    name: '',
    type: '',
    category: '',
    description: '',
  });
  const [loading, setLoading] = React.useState(false);

  // Fetch exercise by ID if we're in edit mode
  useEffect(() => {
    if (id) {
      fetchExerciseById(id);
    }
  }, [id]);

  const fetchExerciseById = async (id: string) => {
    try {
      const response = await axiosInstance.get(`${apiUrl.EXERCISES}/${id}`);
      if (response?.status === 200) {
        console.log(response.data.data);
        setExistingExercise(response?.data?.data);
      } else {
        setExistingExercise({
          name: '',
          type: '',
          category: '',
          description: '',
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch exercise');
    }
  };

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
      if (id) {
        try {
          const response = await axiosInstance.put(
            `${apiUrl.EXERCISES}/${id}`,
            values,
          );
          if (response?.status == 200) {
            toast.success(
              response?.data?.data?.message || 'Workout updated successfully',
            );
          }
        } catch (error: any) {
          toast.error(
            error.response?.data?.message || 'Failed to update exercise',
          );
        }
      } else {
        try {
          const response = await axiosInstance.post(apiUrl.EXERCISES, values);
          if (response?.status == 201) {
            toast.success(
              response?.data?.data?.message || 'Workout created successfully',
            );
          }
        } catch (error: any) {
          toast.error(
            error.response?.data?.message || 'Failed to create exercise',
          );
        }
      }
      onClose(true);
      setLoading(false);
      setExistingExercise({
        name: '',
        type: '',
        category: '',
        description: '',
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
            sx={{ mt: 2, backgroundColor: '#0D47A1' }}
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
