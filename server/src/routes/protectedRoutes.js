import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { getProfile } from '../controllers/protectedController.js';

const router = Router();

router.use(authenticate);
router.get('/profile', getProfile);

export default router;
