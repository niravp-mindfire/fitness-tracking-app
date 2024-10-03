import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { TextField, Button, Box, Typography, Card, CardContent, CircularProgress, AppBar, Toolbar } from '@mui/material';
import { createExercise, updateExercise, fetchExerciseById, resetCurrentExercise } from '../../features/exercise/exerciseSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import BreadcrumbsComponent from '../../component/BreadcrumbsComponent';
import { path } from '../../utils/path';
import { ExerciseSchema } from '../../utils/validationSchema';

const ExerciseForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const existingExercise = useAppSelector(state => state.exercise.currentExercise);
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
          await dispatch(updateExercise({ id: id as string, exercise: values })).unwrap();
        } else {
          await dispatch(createExercise(values)).unwrap();
        }
        navigate(path.EXERCISE);
      } catch (error) {
        console.error('Failed to save exercise:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      {/* Header with Breadcrumbs */}
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
        <Toolbar>
          <BreadcrumbsComponent
            items={[
              { label: 'Exercises', path: path.EXERCISE },
              { label: id ? 'Edit Exercise' : 'Add Exercise' },
            ]}
          />
        </Toolbar>
      </AppBar>

      {/* Main Form */}
      <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            {id ? 'Edit Exercise' : 'Add Exercise'}
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              {...formik.getFieldProps('name')}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name ? String(formik.errors.name) : ''}
            />
            <TextField
              fullWidth
              label="Type"
              {...formik.getFieldProps('type')}
              error={formik.touched.type && Boolean(formik.errors.type)}
              helperText={formik.touched.type && formik.errors.type ? String(formik.errors.type) : ''}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Category"
              {...formik.getFieldProps('category')}
              error={formik.touched.category && Boolean(formik.errors.category)}
              helperText={formik.touched.category && formik.errors.category ? String(formik.errors.category) : ''}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              {...formik.getFieldProps('description')}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description ? String(formik.errors.description) : ''}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : id ? 'Update Exercise' : 'Add Exercise'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default ExerciseForm;
