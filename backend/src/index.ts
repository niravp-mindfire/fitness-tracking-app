import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter';
import workOutRouter from './routes/workOutRouter';
import workoutExerciseRouter from './routes/workoutExerciseRouter';
import workoutPlanRouter from './routes/workoutPlanRouter';
import exerciseRouter from './routes/exerciseRouter';
import foodItemRoutes from './routes/foodItemRoutes';
import mealPlanRouter from './routes/mealPlanRoutes';
import nutritionRouter from './routes/nutritionRoutes';
import nutritionMealsRouter from './routes/nutritionMealRoutes';
import challengesRouter from './routes/challengeRoutes';
import progressTrackingRouter from './routes/progressTrackingRouter';
import notificationsRouter from './routes/notificationRouter';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.get('/test', (req, res) => {
  res.json("Hello world")
})
app.use('/api', userRouter);
app.use('/api/workouts', workOutRouter);
app.use('/api/workout-exercise', workoutExerciseRouter);
app.use('/api/workout-plan', workoutPlanRouter);
app.use('/api/exercises', exerciseRouter);
app.use('/api/food-items', foodItemRoutes);
app.use('/api/meal-plans', mealPlanRouter);
app.use('/api/nutritious', nutritionRouter);
app.use('/api/nutrition-meals', nutritionMealsRouter);
app.use('/api/challenges', challengesRouter);
app.use('/api/progress-tracking', progressTrackingRouter); 
app.use('/api/notifications', notificationsRouter); 

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
