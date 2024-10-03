import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { TextField, Button, Box, Typography, Card, CardContent, CircularProgress, AppBar, Toolbar } from '@mui/material';
import { createChallenge, updateChallenge, fetchChallengeById, resetCurrentChallenge } from '../../features/challenges/challenge';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import BreadcrumbsComponent from '../../component/BreadcrumbsComponent';
import { path } from '../../utils/path';
import { ChallengeSchema } from '../../utils/validationSchema';

const ChallengeForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const existingChallenge = useAppSelector(state => state.challenge.currentChallenge);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && !existingChallenge) {
      dispatch(fetchChallengeById(id));
    }
  }, [id, existingChallenge, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetCurrentChallenge());
    };
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: existingChallenge?.title || '',
      description: existingChallenge?.description || '',
      startDate: existingChallenge?.startDate || '',
      endDate: existingChallenge?.endDate || '',
    },
    validationSchema: ChallengeSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (id) {
          await dispatch(updateChallenge({ id: id as string, challengeData: values })).unwrap(); // Fix: use 'challengeData'
        } else {
          await dispatch(createChallenge(values)).unwrap();
        }
        navigate(path.CHALLENGE);
      } catch (error) {
        console.error('Failed to save challenge:', error);
      } finally {
        setLoading(false);
      }
    },    
  });

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
        <Toolbar>
          <BreadcrumbsComponent
            items={[
              { label: 'Challenges', path: path.CHALLENGE },
              { label: id ? 'Edit Challenge' : 'Add Challenge' },
            ]}
          />
        </Toolbar>
      </AppBar>

      <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            {id ? 'Edit Challenge' : 'Add Challenge'}
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              {...formik.getFieldProps('title')}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title ? String(formik.errors.title) : ''}
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
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...formik.getFieldProps('startDate')}
              error={formik.touched.startDate && Boolean(formik.errors.startDate)}
              helperText={formik.touched.startDate && formik.errors.startDate ? String(formik.errors.startDate) : ''}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...formik.getFieldProps('endDate')}
              error={formik.touched.endDate && Boolean(formik.errors.endDate)}
              helperText={formik.touched.endDate && formik.errors.endDate ? String(formik.errors.endDate) : ''}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : id ? 'Update Challenge' : 'Add Challenge'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default ChallengeForm;
