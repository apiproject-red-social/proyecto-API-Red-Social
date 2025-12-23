import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    content: z.string().min(1).max(280),
  }),
});

export const postIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid post id'),
  }),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
