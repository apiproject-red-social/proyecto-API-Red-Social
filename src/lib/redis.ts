import { Redis } from 'ioredis';

if (!process.env.REDIS_URL) {
  throw new Error(
    '❌ [Config Error]: Error: REDIS_URL is not set.' +
      'Please check your environment configuration.',
  );
}

export const redis = new Redis(process.env.REDIS_URL);
