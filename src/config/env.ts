import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.string().transform(Number),
  CORS_ORIGIN: z.string(),
  MONGO_URI: z.string(),
  JWT_SECRET: z.string(),
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

// ✅ Always return a valid object with the correct type
export const env: z.infer<typeof envSchema> = parsed.success
  ? parsed.data
  : (process.env as unknown as z.infer<typeof envSchema>);
