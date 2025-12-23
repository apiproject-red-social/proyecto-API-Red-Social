import { Router } from 'express';
import * as commentController from '../controllers/comment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createCommentSchema } from '../schemas/comment.schema.js';

const router = Router({ mergeParams: true }); // IMPORTANTE: mergeParams para leer postId

router.post('/', authenticate, validate(createCommentSchema), commentController.addComment);
router.get('/', commentController.getPostComments);

export default router;
