import { Router } from 'express';
import { login, refresh, logout, register } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
