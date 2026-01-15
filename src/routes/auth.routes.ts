import { Router } from 'express';
import { login, refresh, logout, register } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js'; // Ajusta la ruta si es necesario
import { registerUserSchema } from '../schemas/user.schema.js';

const router = Router();

router.post('/register', validate(registerUserSchema), register);

router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
