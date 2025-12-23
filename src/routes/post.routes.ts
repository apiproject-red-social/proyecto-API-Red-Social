import { Router } from 'express';
import * as postController from '../controllers/post.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createPostSchema, postIdParamSchema } from '../schemas/post.schema.js';

const router = Router();

router.post('/', authenticate, validate(createPostSchema), postController.createPost);
router.get('/', postController.getFeed);
router.get('/:id', validate(postIdParamSchema), postController.getPost);
router.patch('/:id', authenticate, validate(createPostSchema), postController.updatePost);
router.delete('/:id', authenticate, validate(postIdParamSchema), postController.deletePost);

export default router;
