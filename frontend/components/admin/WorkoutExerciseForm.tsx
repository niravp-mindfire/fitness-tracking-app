import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import axiosInstance from '@/utils/axiosInstance';
import { apiUrl } from '@/utils/apiUrl';

interface WorkoutExerciseFormProps {
  open: boolean;
  onClose: (refresh: boolean) => void;
  id?: string;
}

const WorkoutExerciseForm: React.FC<WorkoutExerciseFormProps> = ({
  open,
  onClose,
  id,
}) => {
  const [workoutExercise, setWorkoutExercise] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWorkouts();
    fetchExercises();
    if (id) fetchWorkoutExercise(id);
  }, [id]);

  const fetchWorkouts = async () => {
    try {
      const response = await axiosInstance.get(apiUrl.WORKOUTS);
      setWorkouts(response.data.data.workouts);
    } catch {
      // handle error
    }
  };

  const fetchExercises = async () => {
    try {
      const response = await axiosInstance.get(apiUrl.EXERCISES);
      setExercises(response.data.data.exercises);
    } catch {
      // handle error
    }
  };

  const fetchWorkoutExercise = async (id: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${apiUrl.WORKOUT_EXERCISES}/${id}`,
      );
      setWorkoutExercise(response.data);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      workoutId: '',
      exerciseId: '',
      sets: '',
      reps: '',
      weight: '',
    },
    onSubmit: async (values) => {
      if (id) {
        await axiosInstance.put(`${apiUrl.WORKOUT_EXERCISES}/${id}`, values);
      } else {
        await axiosInstance.post(apiUrl.WORKOUT_EXERCISES, values);
      }
      onClose(true);
    },
  });

  return (
    <Dialog open={open} onClose={() => onClose(false)} fullWidth>
      <DialogTitle>
        {id ? 'Edit Workout Exercise' : 'Add Workout Exercise'}
        <IconButton
          onClick={() => onClose(false)}
          style={{ position: 'absolute', right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <TextField
              label="Workout"
              select
              value={formik.values.workoutId}
              onChange={formik.handleChange}
              name="workoutId"
              fullWidth
              margin="normal"
            >
              <MenuItem value="" disabled>
                Select Workout
              </MenuItem>
              {workouts.map((workout: any) => (
                <MenuItem key={workout._id} value={workout._id}>
                  Duration: {workout.duration} - Date:{' '}
                  {new Date(workout.date).toLocaleDateString()}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Exercise"
              select
              value={formik.values.exerciseId}
              onChange={formik.handleChange}
              name="exerciseId"
              fullWidth
              margin="normal"
            >
              <MenuItem value="" disabled>
                Select Exercise
              </MenuItem>
              {exercises.map((exercise: any) => (
                <MenuItem key={exercise._id} value={exercise._id}>
                  {exercise.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Sets"
              value={formik.values.sets}
              onChange={formik.handleChange}
              name="sets"
              fullWidth
              margin="normal"
            />

            <TextField
              label="Reps"
              value={formik.values.reps}
              onChange={formik.handleChange}
              name="reps"
              fullWidth
              margin="normal"
            />

            <TextField
              label="Weight (kg)"
              value={formik.values.weight}
              onChange={formik.handleChange}
              name="weight"
              fullWidth
              margin="normal"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ backgroundColor: '#0D47A1' }}
            >
              {id ? 'Update' : 'Add'} Workout Exercise
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutExerciseForm;
