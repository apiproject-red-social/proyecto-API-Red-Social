import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().trim().min(1, 'Comment cannot be empty').max(500, 'Comment too long'),
  }),
  params: z.object({
    postId: z.string().uuid('Invalid post id'),
  }),
});
