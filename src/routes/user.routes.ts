import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  registerUserSchema,
  userIdParamSchema,
  updateUserSchema,
  changePasswordSchema,
} from '../schemas/user.schema.js';
const router = Router();

router.get('/me', authenticate, userController.getOwnProfile);
router.patch('/me', authenticate, validate(updateUserSchema), userController.updateProfile);
router.patch(
  '/me/password',
  authenticate,
  validate(changePasswordSchema),
  userController.changePassword,
);
router.delete('/me', authenticate, userController.deleteAccount);

router.post('/', validate(registerUserSchema), userController.registerUser);

router.get('/:id', validate(userIdParamSchema), userController.getUserById);

export default router;
