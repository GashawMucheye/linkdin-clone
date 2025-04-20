import { Router } from 'express';
import {
  getSuggestedConnections,
  getPublicProfile,
  updateProfile,
} from '../controllers/userController.js';
import { protectRoute } from '../middleware/authMiddleWare.js';

const router = Router();

router.get('/suggestions', protectRoute, getSuggestedConnections);
router.get('/:username', protectRoute, getPublicProfile);

router.put('/profile', protectRoute, updateProfile);

export default router;
