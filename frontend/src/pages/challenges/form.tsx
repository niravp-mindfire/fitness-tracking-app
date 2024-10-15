import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import {
  createChallenge,
  updateChallenge,
  fetchChallengeById,
  resetCurrentChallenge,
} from '../../features/challenges/challenge';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ChallengeSchema } from '../../utils/validationSchema';
import { getAllUsers } from '../../features/profile/profileSlice';
import { DialogProps } from '../../utils/types';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

const ChallengeForm: React.FC<DialogProps> = ({
  open = false,
  onClose = () => {},
  id = '',
}) => {
  const dispatch = useAppDispatch();
  const existingChallenge = useAppSelector(
    (state) => state.challenge.currentChallenge,
  );
  const allUsers = useAppSelector((state) => state.profile.users);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && !existingChallenge) {
      dispatch(fetchChallengeById(id));
    }
  }, [id, existingChallenge, dispatch]);

  useEffect(() => {
    dispatch(getAllUsers());
    return () => {
      dispatch(resetCurrentChallenge());
    };
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: existingChallenge?.title || '',
      description: existingChallenge?.description || '',
      startDate: existingChallenge?.startDate?.split('T')[0] || '',
      endDate: existingChallenge?.endDate?.split('T')[0] || '',
      participants:
        existingChallenge?.participants.map((p: any) => p._id) || [],
    },
    validationSchema: ChallengeSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (id) {
          await dispatch(
            updateChallenge({ id: id as string, challengeData: values }),
          ).unwrap();
        } else {
          await dispatch(createChallenge(values)).unwrap();
        }
        onClose(true);
      } catch (error) {
        console.error('Failed to save challenge:', error);
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
        {id ? 'Edit Challenge' : 'Add Challenge'}
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
            label="Title"
            {...formik.getFieldProps('title')}
            disabled={formik.isSubmitting}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={
              formik.touched.title && formik.errors.title
                ? String(formik.errors.title)
                : ''
            }
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            disabled={formik.isSubmitting}
            {...formik.getFieldProps('description')}
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
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            disabled={formik.isSubmitting}
            {...formik.getFieldProps('startDate')}
            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
            helperText={
              formik.touched.startDate && formik.errors.startDate
                ? String(formik.errors.startDate)
                : ''
            }
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            disabled={formik.isSubmitting}
            {...formik.getFieldProps('endDate')}
            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
            helperText={
              formik.touched.endDate && formik.errors.endDate
                ? String(formik.errors.endDate)
                : ''
            }
            sx={{ mt: 2 }}
          />

          {/* Multi-select Dropdown for Users */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="users-select-label">Select Users</InputLabel>
            <Select
              labelId="users-select-label"
              id="participants-select"
              multiple
              value={formik.values.participants}
              disabled={formik.isSubmitting}
              onChange={(event) =>
                formik.setFieldValue('participants', event.target.value)
              }
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((userId: any) => {
                    const user = allUsers.find((user) => user._id === userId);
                    return (
                      <Chip
                        key={userId}
                        label={
                          user?.profile.firstName + ' ' + user?.profile.lastName
                        }
                      />
                    );
                  })}
                </Box>
              )}
            >
              {allUsers.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.profile.firstName} {user.profile.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{ mt: 2 }}
            disabled={formik.isSubmitting}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : id ? (
              'Update Challenge'
            ) : (
              'Add Challenge'
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ChallengeForm;
