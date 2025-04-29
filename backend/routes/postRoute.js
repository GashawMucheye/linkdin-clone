import { Router } from 'express';
import { protectRoute } from '../middleware/authMiddleWare.js';
import {
  getFeedPosts,
  createPost,
  deletePost,
  getPostById,
  createComment,
  likePost,
} from '../controllers/postController.js';
const router = Router();

router.get('/', protectRoute, getFeedPosts);
router.post('/create', protectRoute, createPost);
router.delete('/delete/:id', protectRoute, deletePost);
router.get('/:id', protectRoute, getPostById);
router.post('/:id/comment', protectRoute, createComment);
router.post('/:id/like', protectRoute, likePost);

export default router;
