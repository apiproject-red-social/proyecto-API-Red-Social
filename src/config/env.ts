import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.coerce.number().default(3000),
  CORS_ORIGIN: z.string(),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  REDIS_URL: z.string().default('redis://127.0.0.1:6379'),
});

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

export const env: z.infer<typeof envSchema> = parsed.success
  ? parsed.data
  : ({
      ...process.env,
      NODE_ENV: (process.env.NODE_ENV as any) || 'test',
      JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'test_secret_fallback',
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'test_refresh_fallback',
      DATABASE_URL: process.env.DATABASE_URL || '',
      CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    } as any);
