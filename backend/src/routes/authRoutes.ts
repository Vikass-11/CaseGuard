import { Router } from 'express';
import {
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Authenticated user endpoints
router.put('/change-password', protect, changePassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
