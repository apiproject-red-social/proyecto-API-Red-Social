import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    content: z.string().trim().min(1, 'Post content cannot be empty').max(280, 'Post too long'),
  }),
});

export const postIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid post id'),
  }),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
