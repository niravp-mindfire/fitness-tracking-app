import { Router } from 'express';
import {
  getAllChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  getChallengeById,
} from '../controllers/challengeController';
import { authenticateToken } from '../middleware/authMiddleware';
import { challengeValidation } from '../validation/challengeValidation';

const challengesRouter = Router();

challengesRouter.get('/', authenticateToken, getAllChallenges);
challengesRouter.get('/:id', authenticateToken, getChallengeById);
challengesRouter.post(
  '/',
  authenticateToken,
  challengeValidation,
  createChallenge
);
challengesRouter.put(
  '/:id',
  authenticateToken,
  challengeValidation,
  updateChallenge
);
challengesRouter.delete('/:id', authenticateToken, deleteChallenge);

export default challengesRouter;
