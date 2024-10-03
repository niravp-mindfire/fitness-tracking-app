import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import {
  TextField,
  Button,
  Box,
  CardContent,
  Card,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  createWorkoutExercise,
  updateWorkoutExercise,
  fetchWorkoutExerciseById,
} from "../../features/workoutExercise/workoutExerciseSlice";
import { fetchWorkouts } from "../../features/workout/workoutSlice";
import { fetchExercises } from "../../features/exercise/exerciseSlice";
import { RootState, useAppDispatch } from "../../app/store";
import { path } from "../../utils/path";
import BreadcrumbsComponent from "../../component/BreadcrumbsComponent";
import { defaultPagination } from "../../utils/common";

const WorkoutExerciseForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const loading = useSelector((state: RootState) => state.workoutExercise.loading);
  const workoutExercise = useSelector((state: RootState) => state.workoutExercise.currentWorkoutExercise);
  const workouts = useSelector((state: RootState) => state.workout.workouts);
  const exercises = useSelector((state: RootState) => state.exercise.exercises);

  useEffect(() => {
    dispatch(fetchWorkouts(defaultPagination));
    dispatch(fetchExercises(defaultPagination)); // Adjust as needed

    // Fetch workout exercise data by ID if id is present
    if (id) {
      dispatch(fetchWorkoutExerciseById(id)); // Fetching workout exercise data
    }
  }, [dispatch, id]);

  const formik = useFormik({
    initialValues: {
      workoutId: "",
      exerciseId: "",
      sets: "",
      reps: "",
      weight: "",
    },
    onSubmit: async (values: any) => {
      if (id) {
        await dispatch(updateWorkoutExercise({ id, workoutExercise: values }));
      } else {
        await dispatch(createWorkoutExercise(values));
      }
      navigate(path.WORKOUT_EXERCISE);
    },
  });

  useEffect(() => {
    if (workoutExercise) {
      formik.setValues({
        workoutId: workoutExercise?.workoutId,
        exerciseId: workoutExercise?.exerciseId,
        sets: workoutExercise?.sets?.toString(),
        reps: workoutExercise?.reps?.toString(),
        weight: workoutExercise?.weight?.toString(),
      });
    }
  }, [workoutExercise, formik]);

  return (
    <>
      {/* Header with Breadcrumbs */}
      <AppBar position="static" sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
        <Toolbar>
          <BreadcrumbsComponent
            items={[
              { label: "Workouts", path: path.WORKOUT_EXERCISE },
              { label: id ? "Edit Workout" : "Add Workout Exercise" },
            ]}
          />
        </Toolbar>
      </AppBar>

      {/* Main Form */}
      <Card sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            {id ? "Edit Workout Exercise" : "Add Workout Exercise"}
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
              label="Workout"
              select
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
              name="workoutId"
              value={formik.values.workoutId}
              onChange={formik.handleChange}
              fullWidth
            >
              <option value="" disabled>
                Select Workout
              </option>
              {workouts?.map((workout: any) => (
                <option key={workout?._id} value={workout?._id}>
                  Duration: {workout?.duration} - Date: {new Date(workout?.date).toDateString()}
                </option>
              ))}
            </TextField>

            <TextField
              label="Exercise"
              select
              InputLabelProps={{ shrink: true }}
              SelectProps={{ native: true }}
              name="exerciseId"
              value={formik.values.exerciseId}
              onChange={formik.handleChange}
              fullWidth
              sx={{ mt: 2 }}
            >
              <option value="" disabled>
                Select Exercise
              </option>
              {exercises?.map((exercise: any) => (
                <option key={exercise?._id} value={exercise?._id}>
                  {exercise?.name}
                </option>
              ))}
            </TextField>

            <TextField
              label="Sets"
              name="sets"
              InputLabelProps={{ shrink: true }}
              value={formik.values.sets}
              onChange={formik.handleChange}
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              label="Reps"
              name="reps"
              InputLabelProps={{ shrink: true }}
              value={formik.values.reps}
              onChange={formik.handleChange}
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              label="Weight (kg)"
              name="weight"
              InputLabelProps={{ shrink: true }}
              value={formik.values.weight}
              onChange={formik.handleChange}
              fullWidth
              sx={{ mt: 2 }}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              {id ? "Update Workout Exercise" : "Add Workout Exercise"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default WorkoutExerciseForm;
