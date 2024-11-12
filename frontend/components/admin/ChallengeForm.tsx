import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Close as CloseIcon } from '@mui/icons-material';
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
import { DialogProps } from '@/interfaces/interfaces';
import axiosInstance from '@/utils/axiosInstance';
import { apiUrl } from '@/utils/apiUrl';
import { toast } from 'react-toastify';
import { ChallengeSchema } from '@/utils/validationSchema';

const ChallengeForm: React.FC<DialogProps> = ({
  open = false,
  onClose = () => {},
  id = '',
}) => {
  const [existingChallenge, setExistingChallenge] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    participants: [],
  });
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchData = async (id: any) => {
        try {
          const response = await axiosInstance.get(
            `${apiUrl.CHALLENGES}/${id}`,
          );
          if (response.status == 200) {
            setExistingChallenge(response.data.data);
          }
        } catch (error: any) {
          toast.error(error.response.data);
        }
      };
      fetchData(id);
    }
  }, [id]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await axiosInstance.get(apiUrl.ALL_USERS);
        if (response.status == 200) {
          setAllUsers(response.data.data);
        }
      } catch (error: any) {
        toast.error(error.response.data);
      }
    };
    getAllUsers();
  }, []);

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
          await axiosInstance.put(`${apiUrl.CHALLENGES}/${id}`, values);
        } else {
          await axiosInstance.post(`${apiUrl.CHALLENGES}`, values);
        }
        onClose(true);
      } catch (error: any) {
        toast.error(error.response.data || 'Failed to save challenge');
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
                    const user: any = allUsers.find(
                      (user: any) => user._id === userId,
                    );
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
              {allUsers.map((user: any) => (
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
            className="bg-blue-700"
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
