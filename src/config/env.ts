// src/config/env.ts
import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Determine the current environment
const NODE_ENV = process.env.NODE_ENV || 'development';

// Load the corresponding .env file based on the environment
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${NODE_ENV}`),
});

// Zod validation schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z
    .string()
    .default('3000')
    .transform((val) => Number(val)),
  CORS_ORIGIN: z.string().refine(
    (val) => {
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'CORS_ORIGIN must be a valid URL' },
  ),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  REDIS_URL: z.string().optional(),
});

// Validate the loaded variables
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  parsed.error.issues.forEach((issue) => {
    console.error(`- ${issue.path.join('.')}: ${issue.message}`);
  });

  if (process.env.NODE_ENV !== 'test' && process.env.CI !== 'true') {
    process.exit(1);
  } else {
    console.warn('⚠️ Skipping env validation error in test/CI mode');
  }
}

// ✅ Validated environment variables
export const env = parsed.data;

// ✅ Automatically generated TypeScript type
export type Env = typeof env;
