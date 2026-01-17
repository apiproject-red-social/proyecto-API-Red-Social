import { z } from 'zod';

export const registerUserSchema = z.object({
  body: z.object({
    username: z
      .string()
      .trim()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username too long'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'), // Más seguro que 6
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user id'),
  }),
});

export const updateUserSchema = z.object({
  body: z
    .object({
      username: z.string().trim().min(3).max(20).optional(),
      email: z.string().email().optional(),
    })
    .refine((data) => data.username || data.email, {
      message: 'At least one field (username or email) must be provided',
    }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  }),
});
