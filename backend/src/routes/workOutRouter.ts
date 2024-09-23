import { Router } from 'express';
import { getAllWorkouts } from '../controllers/workOutController';

const workOutRouter = Router();

workOutRouter.get('/', getAllWorkouts);

export default workOutRouter;
