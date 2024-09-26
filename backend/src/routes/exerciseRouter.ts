import { Router } from 'express';
import {
    getAllExercises,
    createExercise,
    updateExercise,
    deleteExercise
} from '../controllers/exerciseController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateCreateExercise, validateUpdateExercise } from '../middleware/exerciseValidation';

const exerciseRouter = Router();

// GET all exercises (requires token authentication)
exerciseRouter.get('/', authenticateToken, getAllExercises);

// POST a new exercise (requires token authentication & validation)
exerciseRouter.post('/', authenticateToken, validateCreateExercise, createExercise);

// PUT (update) an existing exercise by ID (requires token authentication & validation)
exerciseRouter.put('/:id', authenticateToken, validateUpdateExercise, updateExercise);

// DELETE an exercise by ID (requires token authentication)
exerciseRouter.delete('/:id', authenticateToken, deleteExercise);

export default exerciseRouter;
