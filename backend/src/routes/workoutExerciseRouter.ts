import { Router } from 'express';
import {
    addExerciseToWorkout,
    updateWorkoutExercise,
    removeExerciseFromWorkout,
} from '../controllers/workOutController'; // Use workoutController for workout exercises
import { authenticateToken } from '../middleware/authMiddleware';
import { validateWorkoutExercise } from '../middleware/workoutExerciseValidation';

const workoutExerciseRouter = Router();

// Add exercise to workout
workoutExerciseRouter.post('/', authenticateToken, validateWorkoutExercise, addExerciseToWorkout);

// Update a workout exercise
workoutExerciseRouter.put('/:id', authenticateToken, validateWorkoutExercise, updateWorkoutExercise);

// Delete an exercise from a workout
workoutExerciseRouter.delete('/:id', authenticateToken, removeExerciseFromWorkout);

export default workoutExerciseRouter;