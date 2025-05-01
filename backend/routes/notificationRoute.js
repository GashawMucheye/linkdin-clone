import { Router } from 'express';
import {
  deleteNotification,
  getUserNotifications,
  markNotificationAsRead,
} from '../controllers/notificationController.js';
import { protectRoute } from '../middleware/authMiddleWare.js';

const router = Router();

router.get('/', protectRoute, getUserNotifications);

router.put('/:id/read', protectRoute, markNotificationAsRead);
router.delete('/:id', protectRoute, deleteNotification);

export default router;
