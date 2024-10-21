import { Router } from 'express';

// Import individual route modules
import userRouter from './userRouter';
import workOutRouter from './workOutRouter';
import workoutExerciseRouter from './workoutExerciseRouter';
import workoutPlanRouter from './workoutPlanRouter';
import exerciseRouter from './exerciseRouter';
import foodItemRoutes from './foodItemRoutes';
import mealPlanRouter from './mealPlanRoutes';
import nutritionRouter from './nutritionRoutes';
import nutritionMealsRouter from './nutritionMealRoutes';
import challengesRouter from './challengeRoutes';
import progressTrackingRouter from './progressTrackingRouter';

// Create a new router instance
const router = Router();

router.get('/health-check', (req, res) => {
  res.status(200).json({ message: 'Example resource' });
});
// Map routes to their respective paths
router.use('/api', userRouter);
router.use('/api/workouts', workOutRouter);
router.use('/api/workout-exercise', workoutExerciseRouter);
router.use('/api/workout-plan', workoutPlanRouter);
router.use('/api/exercises', exerciseRouter);
router.use('/api/food-items', foodItemRoutes);
router.use('/api/meal-plans', mealPlanRouter);
router.use('/api/nutritious', nutritionRouter);
router.use('/api/nutrition-meals', nutritionMealsRouter);
router.use('/api/challenges', challengesRouter);
router.use('/api/progress-tracking', progressTrackingRouter);

// Export the router
export default router;
