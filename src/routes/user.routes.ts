import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerUserSchema, userIdParamSchema } from '../schemas/user.schema.js';

const router = Router();

router.post('/', validate(registerUserSchema), userController.registerUser);
router.get('/me', authenticate, userController.getOwnProfile);
router.get('/:id', validate(userIdParamSchema), userController.getUserById);

export default router;
