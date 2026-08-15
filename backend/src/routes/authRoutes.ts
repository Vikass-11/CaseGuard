import express from 'express';
import { register, login } from '../controllers/AuthController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful. Client should remove token.' });
});

export default router;
