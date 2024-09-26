import { Router } from 'express';
import {
    getAllChallenges,
    createChallenge,
    updateChallenge,
    deleteChallenge
} from '../controllers/challengeController';
import { authenticateToken } from '../middleware/authMiddleware';
import { challengeValidation } from '../middleware/challengeValidation';

const challengesRouter = Router();

challengesRouter.get('/', authenticateToken, getAllChallenges); // GET all challenges (with optional filters, pagination, sorting)
challengesRouter.post('/', authenticateToken, challengeValidation, createChallenge); // CREATE a challenge
challengesRouter.put('/:id', authenticateToken, challengeValidation, updateChallenge); // UPDATE a challenge by ID
challengesRouter.delete('/:id', authenticateToken, deleteChallenge); // DELETE a challenge by ID

export default challengesRouter;
