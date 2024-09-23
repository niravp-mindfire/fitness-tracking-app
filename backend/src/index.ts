import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter';
import workOutRouter from './routes/workOutRouter';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', userRouter);
app.use('/api/workouts', workOutRouter);

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
