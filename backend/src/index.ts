import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

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
import swaggerDocs from './utils/swaggerOptions';

dotenv.config();

const app = express();
export const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.get('/test', (req, res) => {
  res.json('Hello world');
});

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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

let server: ReturnType<typeof app.listen>;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

export const closeServer = () => {
  server?.close(); // Close the server if it exists
};

module.exports = swaggerDocs;
export default app;
